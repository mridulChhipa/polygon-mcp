"""Codeforces round guidelines problem auditor."""

from polygon_mcp.core.client import PolygonClient
from polygon_mcp.models.schemas import ProblemAuditReport
from polygon_mcp.services.package_service import PackageService
from polygon_mcp.services.problem_service import ProblemService
from polygon_mcp.services.solution_service import SolutionService
from polygon_mcp.services.statement_service import StatementService
from polygon_mcp.services.test_service import TestService


class ProblemAuditService:
    """Audits problem configuration against Codeforces Polygon standards."""

    @classmethod
    async def audit_problem(
        cls,
        client: PolygonClient,
        problem_id: int,
    ) -> ProblemAuditReport:
        """Run comprehensive audit checklist on a problem."""
        passed: list[str] = []
        warnings: list[str] = []
        errors: list[str] = []

        # 1. Info & limits
        info = await ProblemService.get_problem_info(client, problem_id)
        if info.timeLimit and info.timeLimit > 0:
            passed.append(f"Time limit configured ({info.timeLimit} ms)")
        else:
            errors.append("Time limit not set or invalid")

        if info.memoryLimit and info.memoryLimit >= 64:
            passed.append(f"Memory limit configured ({info.memoryLimit} MB)")
        else:
            errors.append("Memory limit not set or too low (< 64 MB)")

        # 2. Statements
        try:
            stmts = await StatementService.get_statements(client, problem_id)
            if "english" in stmts:
                eng = stmts["english"]
                if eng.get("legend"):
                    passed.append("English legend present")
                else:
                    errors.append("English legend is empty")

                if eng.get("input") and eng.get("output"):
                    passed.append("Input and Output format sections present")
                else:
                    errors.append("Missing input or output format specification")

                if eng.get("notes"):
                    passed.append("Statement notes / explanation present")
                else:
                    warnings.append("Statement notes are empty (samples should have explanations)")

                if eng.get("tutorial"):
                    passed.append("Editorial tutorial present")
                else:
                    warnings.append("Tutorial / editorial is missing in statement")
            else:
                errors.append("No english statement found")
        except Exception as e:
            errors.append(f"Could not check statements: {e}")

        # 3. Solutions
        try:
            sols = await SolutionService.list_solutions(client, problem_id)
            tags = {s.get("tag") for s in sols}
            if "MA" in tags:
                passed.append("Main Accepted (MA) solution present")
            else:
                errors.append("Missing Main Accepted (MA) solution")

            if "TL" in tags or "WA" in tags:
                passed.append("Boundary/incorrect solution (TL or WA) present for test calibration")
            else:
                warnings.append("No incorrect/slow solution (TL or WA) found. Recommended for validating test strength.")

            if len(sols) < 2:
                warnings.append(f"Only {len(sols)} solution registered; official rounds recommend at least 2-3 solutions.")
        except Exception as e:
            errors.append(f"Could not check solutions: {e}")

        # 4. Tests
        try:
            tests = await TestService.list_tests(client, problem_id)
            sample_tests = [t for t in tests if t.get("useInStatements")]
            if len(sample_tests) >= 1:
                passed.append(f"Found {len(sample_tests)} sample test(s) used in statement")
            else:
                errors.append("No sample tests configured with useInStatements=true")

            if len(tests) >= 10:
                passed.append(f"Adequate test coverage ({len(tests)} tests)")
            else:
                warnings.append(f"Low test count ({len(tests)} tests). Most CP problems need 15+ comprehensive tests.")
        except Exception as e:
            errors.append(f"Could not check tests: {e}")

        # 5. Latest package status
        try:
            packages = await PackageService.list_packages(client, problem_id)
            if packages:
                latest = max(packages, key=lambda p: p.get("id", 0))
                if latest.get("state") == "READY":
                    passed.append(f"Latest package #{latest.get('id')} built successfully (state=READY)")
                else:
                    errors.append(f"Latest package #{latest.get('id')} state is '{latest.get('state')}' (not READY)")
            else:
                errors.append("No package has been built yet")
        except Exception as e:
            warnings.append(f"Could not check package status: {e}")

        is_ready = len(errors) == 0
        return ProblemAuditReport(
            problem_id=problem_id,
            problem_name=info.name,
            passed_checks=passed,
            warnings=warnings,
            errors=errors,
            is_ready_for_contest=is_ready,
        )
