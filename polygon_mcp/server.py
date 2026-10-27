"""Codeforces Polygon MCP Server implementation."""

import argparse
import asyncio
import json
import os
from pathlib import Path
from typing import Any

from mcp.server.mcpserver import MCPServer

from polygon_mcp.core.client import PolygonClient
from polygon_mcp.models.schemas import SolutionSpec, StatementSpec, TestSpec
from polygon_mcp.services.audit_service import ProblemAuditService
from polygon_mcp.services.package_service import PackageService
from polygon_mcp.services.problem_service import ProblemService
from polygon_mcp.services.solution_service import SolutionService
from polygon_mcp.services.statement_service import StatementService
from polygon_mcp.services.test_service import TestService

# Initialize MCP server
mcp = MCPServer(
    name="Codeforces Polygon MCP Server",
    instructions="Comprehensive MCP server for Codeforces Polygon problem development, testing, auditing, and packaging.",
)

RESOURCES_DIR = Path(__file__).resolve().parent / "resources"


def _get_client(api_key: str | None = None, api_secret: str | None = None) -> PolygonClient:
    """Helper to instantiate PolygonClient with fallback to environment credentials."""
    return PolygonClient(api_key=api_key, api_secret=api_secret)


# ==============================================================================
# TIER 1: HIGH-LEVEL COMPOSITE WORKFLOW TOOLS
# ==============================================================================


@mcp.tool()
async def polygon_create_problem_bundle(
    name: str,
    time_limit_ms: int = 1000,
    memory_limit_mb: int = 256,
    legend: str = "",
    input_format: str = "",
    output_format: str = "",
    notes: str = "",
    tutorial: str = "",
    validator_code: str | None = None,
    checker_name: str = "std::ncmp.cpp",
    main_solution_name: str = "solution.cpp",
    main_solution_code: str = "",
    other_solutions: list[dict[str, str]] | None = None,
    sample_tests: list[str] | None = None,
    manual_tests: list[str] | None = None,
    generator_name: str | None = None,
    generator_code: str | None = None,
    script_content: str | None = None,
    image_filename: str | None = None,
    image_path: str | None = None,
    build_package: bool = True,
    api_key: str | None = None,
    api_secret: str | None = None,
) -> dict[str, Any]:
    """Create a complete Codeforces Polygon problem bundle in a single turn.

    Sets up problem, limits, statement, validator, checker, solutions, tests,
    and optionally commits and builds the verified package.
    """
    client = _get_client(api_key, api_secret)
    report: dict[str, Any] = {"problem_name": name, "steps": []}

    # 1. Create problem
    prob = await ProblemService.create_problem(client, name)
    problem_id = prob.id
    report["problem_id"] = problem_id
    report["steps"].append(f"Created problem '{name}' (ID: {problem_id})")

    # 2. Update limits
    await ProblemService.update_limits(client, problem_id, time_limit=time_limit_ms, memory_limit=memory_limit_mb)
    report["steps"].append(f"Set limits: {time_limit_ms}ms, {memory_limit_mb}MB")

    # 3. Upload statement image asset if provided
    if image_filename and image_path:
        await StatementService.save_statement_resource(client, problem_id, image_filename, image_path)
        report["steps"].append(f"Uploaded statement resource: {image_filename}")

    # 4. Save statement
    stmt = StatementSpec(
        name=name,
        legend=legend,
        input=input_format,
        output=output_format,
        notes=notes,
        tutorial=tutorial,
    )
    stmt_res = await StatementService.save_statement(client, problem_id, stmt)
    report["steps"].append("Saved statement sections")
    if stmt_res.get("warnings"):
        report["statement_warnings"] = stmt_res["warnings"]

    # 5. Checker
    await TestService.set_checker(client, problem_id, checker_name=checker_name)
    report["steps"].append(f"Set checker: {checker_name}")

    # 6. Validator
    if validator_code:
        val_res = await TestService.set_validator(
            client=client,
            problem_id=problem_id,
            validator_code=validator_code,
            validator_name="validator.cpp",
        )
        report["steps"].append(f"Compiled & configured validator: {val_res.get('validator')}")

    # 7. Main solution
    if main_solution_code:
        await SolutionService.save_solution(
            client=client,
            problem_id=problem_id,
            name=main_solution_name,
            code=main_solution_code,
            tag="MA",
        )
        report["steps"].append(f"Saved Main Accepted solution: {main_solution_name}")

    # 8. Additional solutions
    if other_solutions:
        for sol in other_solutions:
            sol_name = sol.get("name", "extra.cpp")
            sol_code = sol.get("code", "")
            sol_tag = sol.get("tag", "OK")
            await SolutionService.save_solution(
                client=client,
                problem_id=problem_id,
                name=sol_name,
                code=sol_code,
                tag=sol_tag,  # type: ignore
            )
            report["steps"].append(f"Saved solution {sol_name} (tag={sol_tag})")

    # 9. Tests
    test_idx = 1
    if sample_tests:
        for s in sample_tests:
            await TestService.save_test(
                client=client,
                problem_id=problem_id,
                test_index=test_idx,
                input_data=s,
                use_in_statements=True,
            )
            test_idx += 1
        report["steps"].append(f"Configured {len(sample_tests)} sample test(s)")

    if manual_tests:
        for m_t in manual_tests:
            await TestService.save_test(
                client=client,
                problem_id=problem_id,
                test_index=test_idx,
                input_data=m_t,
                use_in_statements=False,
            )
            test_idx += 1
        report["steps"].append(f"Configured {len(manual_tests)} manual test(s)")

    # 10. Generator and script
    if generator_code:
        gen_file = generator_name or "gen.cpp"
        await TestService.save_generator(
            client=client,
            problem_id=problem_id,
            gen_name=gen_file,
            gen_code=generator_code,
        )
        report["steps"].append(f"Compiled & uploaded generator: {gen_file}")

    if script_content:
        await TestService.save_script(client, problem_id, script_content)
        report["steps"].append("Saved test generator script")

    # 11. Package build
    if build_package:
        report["steps"].append("Initiating verified package build...")
        pkg_res = await PackageService.build_and_wait(
            client=client,
            problem_id=problem_id,
            commit_message="Initial automated creation via Polygon MCP",
        )
        report["package_id"] = pkg_res.package_id
        report["package_state"] = pkg_res.state
        report["package_warnings"] = pkg_res.warnings

    report["status"] = "SUCCESS"
    report["polygon_url"] = f"https://polygon.codeforces.com/p/{problem_id}"
    return report


@mcp.tool()
async def polygon_sync_from_directory(
    directory_path: str,
    problem_name: str | None = None,
    problem_id: int | None = None,
    build_package: bool = True,
    api_key: str | None = None,
    api_secret: str | None = None,
) -> dict[str, Any]:
    """Synchronize a local directory of competitive programming files to Polygon.

    Automatically detects statement files, validator.cpp, gen.cpp, solution.cpp,
    solution_*.cpp, script.txt, and image assets.
    """
    client = _get_client(api_key, api_secret)
    p = Path(directory_path)
    if not p.is_dir():
        return {"status": "ERROR", "message": f"Directory not found: {directory_path}"}

    resolved_name = problem_name or p.name

    # Check or create problem
    if problem_id is None:
        prob = await ProblemService.create_problem(client, resolved_name)
        problem_id = prob.id

    report: dict[str, Any] = {
        "problem_id": problem_id,
        "problem_name": resolved_name,
        "synced_items": [],
    }

    # Upload validator if present
    validator_path = p / "validator.cpp"
    if validator_path.exists():
        await TestService.set_validator(
            client=client,
            problem_id=problem_id,
            validator_name="validator.cpp",
            validator_code=validator_path.read_text(encoding="utf-8"),
        )
        report["synced_items"].append("validator.cpp")

    # Upload generator if present
    for gen_name in ("gen.cpp", "generator.cpp"):
        gen_path = p / gen_name
        if gen_path.exists():
            await TestService.save_generator(
                client=client,
                problem_id=problem_id,
                gen_name="gen.cpp",
                gen_code=gen_path.read_text(encoding="utf-8"),
            )
            report["synced_items"].append(gen_name)
            break

    # Upload script if present
    script_path = p / "script.txt"
    if script_path.exists():
        await TestService.save_script(client, problem_id, script_path.read_text(encoding="utf-8"))
        report["synced_items"].append("script.txt")

    # Upload solutions
    for f in p.glob("*.cpp"):
        if f.name in ("validator.cpp", "gen.cpp", "generator.cpp", "checker.cpp"):
            continue
        tag = "MA" if f.stem in ("solution", "main", "sol") else "OK"
        await SolutionService.save_solution(
            client=client,
            problem_id=problem_id,
            name=f.name,
            code=f.read_text(encoding="utf-8"),
            tag=tag,  # type: ignore
        )
        report["synced_items"].append(f"{f.name} (tag={tag})")

    for f in p.glob("*.py"):
        tag = "OK"
        await SolutionService.save_solution(
            client=client,
            problem_id=problem_id,
            name=f.name,
            code=f.read_text(encoding="utf-8"),
            tag=tag,
        )
        report["synced_items"].append(f"{f.name} (tag={tag})")

    # Upload images
    for img in list(p.glob("*.png")) + list(p.glob("*.jpg")):
        await StatementService.save_statement_resource(client, problem_id, img.name, img)
        report["synced_items"].append(f"Image resource: {img.name}")

    # Set checker
    await TestService.set_checker(client, problem_id, checker_name="std::ncmp.cpp")

    if build_package:
        pkg_res = await PackageService.build_and_wait(
            client=client,
            problem_id=problem_id,
            commit_message=f"Sync from directory {p.name}",
        )
        report["package_id"] = pkg_res.package_id
        report["package_state"] = pkg_res.state
        report["package_warnings"] = pkg_res.warnings

    report["status"] = "SUCCESS"
    return report


@mcp.tool()
async def polygon_build_and_verify(
    problem_id: int,
    commit_message: str = "Verified build from Polygon MCP",
    full: bool = True,
    verify: bool = True,
    timeout_seconds: int = 240,
    api_key: str | None = None,
    api_secret: str | None = None,
) -> dict[str, Any]:
    """Commit working copy and initiate verified package build, polling until complete.

    Reports final build state (READY or FAILED), package ID, and compiler/verification warnings.
    """
    client = _get_client(api_key, api_secret)
    pkg = await PackageService.build_and_wait(
        client=client,
        problem_id=problem_id,
        commit_message=commit_message,
        full=full,
        verify=verify,
        timeout_seconds=timeout_seconds,
    )
    return {
        "problem_id": problem_id,
        "package_id": pkg.package_id,
        "state": pkg.state,
        "warnings": pkg.warnings,
        "verification_log": pkg.verification_log,
    }


# ==============================================================================
# TIER 2: TARGETED INCREMENTAL PRIMITIVES (FOR UPDATING EXISTING PROBLEMS)
# ==============================================================================


@mcp.tool()
async def polygon_list_problems(
    name_filter: str | None = None,
    api_key: str | None = None,
    api_secret: str | None = None,
) -> list[dict[str, Any]]:
    """List accessible problems on the user's Codeforces Polygon account."""
    client = _get_client(api_key, api_secret)
    problems = await ProblemService.list_problems(client, name_filter=name_filter)
    return [p.model_dump() for p in problems]


@mcp.tool()
async def polygon_get_problem(
    problem_id: int,
    api_key: str | None = None,
    api_secret: str | None = None,
) -> dict[str, Any]:
    """Retrieve complete overview of an existing problem: info, limits, statements, solutions, and packages."""
    client = _get_client(api_key, api_secret)
    info = await ProblemService.get_problem_info(client, problem_id)
    statements = await StatementService.get_statements(client, problem_id)
    solutions = await SolutionService.list_solutions(client, problem_id)
    tests = await TestService.list_tests(client, problem_id)
    packages = await PackageService.list_packages(client, problem_id)

    return {
        "problem_id": problem_id,
        "info": info.model_dump(),
        "statements": statements,
        "solutions": solutions,
        "test_count": len(tests),
        "packages": packages[:3] if packages else [],
    }


@mcp.tool()
async def polygon_update_statement(
    problem_id: int,
    legend: str | None = None,
    input_format: str | None = None,
    output_format: str | None = None,
    notes: str | None = None,
    tutorial: str | None = None,
    problem_name: str | None = None,
    image_filename: str | None = None,
    image_path: str | None = None,
    api_key: str | None = None,
    api_secret: str | None = None,
) -> dict[str, Any]:
    """Update statement sections or attach graphics for an existing problem.

    Preserves unmodified statement sections.
    """
    client = _get_client(api_key, api_secret)

    # Fetch current statement
    stmts = await StatementService.get_statements(client, problem_id)
    cur = stmts.get("english", {})

    stmt = StatementSpec(
        name=problem_name or cur.get("name", f"Problem {problem_id}"),
        legend=legend if legend is not None else cur.get("legend", ""),
        input=input_format if input_format is not None else cur.get("input", ""),
        output=output_format if output_format is not None else cur.get("output", ""),
        notes=notes if notes is not None else cur.get("notes", ""),
        tutorial=tutorial if tutorial is not None else cur.get("tutorial", ""),
    )

    save_res = await StatementService.save_statement(client, problem_id, stmt)

    image_uploaded = False
    if image_filename and image_path:
        await StatementService.save_statement_resource(client, problem_id, image_filename, image_path)
        image_uploaded = True

    return {
        "status": "UPDATED",
        "problem_id": problem_id,
        "image_uploaded": image_uploaded,
        "warnings": save_res.get("warnings", []),
    }


@mcp.tool()
async def polygon_upload_solution(
    problem_id: int,
    name: str,
    code: str,
    tag: str = "OK",
    api_key: str | None = None,
    api_secret: str | None = None,
) -> dict[str, Any]:
    """Upload or update a solution file (MA = Main Accepted, OK = Accepted, TL = Time Limit, WA = Wrong Answer)."""
    client = _get_client(api_key, api_secret)
    return await SolutionService.save_solution(
        client=client,
        problem_id=problem_id,
        name=name,
        code=code,
        tag=tag,  # type: ignore
    )


@mcp.tool()
async def polygon_update_validator(
    problem_id: int,
    validator_code: str,
    validator_name: str = "validator.cpp",
    sample_valid_inputs: list[str] | None = None,
    sample_invalid_inputs: list[str] | None = None,
    api_key: str | None = None,
    api_secret: str | None = None,
) -> dict[str, Any]:
    """Compile validator locally with testlib.h, verify against sample inputs, and activate on Polygon."""
    client = _get_client(api_key, api_secret)
    return await TestService.set_validator(
        client=client,
        problem_id=problem_id,
        validator_name=validator_name,
        validator_code=validator_code,
        sample_valid_inputs=sample_valid_inputs,
        sample_invalid_inputs=sample_invalid_inputs,
        run_preflight=True,
    )


@mcp.tool()
async def polygon_update_tests(
    problem_id: int,
    test_index: int | None = None,
    input_data: str | None = None,
    description: str | None = None,
    use_in_statements: bool = False,
    script_content: str | None = None,
    api_key: str | None = None,
    api_secret: str | None = None,
) -> dict[str, Any]:
    """Add/modify an individual testcase or update the test generator script."""
    client = _get_client(api_key, api_secret)
    res: dict[str, Any] = {"problem_id": problem_id, "actions": []}

    if test_index is not None and input_data is not None:
        await TestService.save_test(
            client=client,
            problem_id=problem_id,
            test_index=test_index,
            input_data=input_data,
            description=description,
            use_in_statements=use_in_statements,
        )
        res["actions"].append(f"Updated test #{test_index}")

    if script_content is not None:
        await TestService.save_script(client, problem_id, script_content)
        res["actions"].append("Updated test generator script")

    return res


@mcp.tool()
async def polygon_check_audit(
    problem_id: int,
    api_key: str | None = None,
    api_secret: str | None = None,
) -> dict[str, Any]:
    """Audit an existing problem against official Codeforces Round preparation checklists."""
    client = _get_client(api_key, api_secret)
    report = await ProblemAuditService.audit_problem(client, problem_id)
    return report.model_dump()


# ==============================================================================
# RESOURCES & PROMPTS
# ==============================================================================


@mcp.resource("polygon://rules/codeforces")
def codeforces_rules_resource() -> str:
    """Official Codeforces round rules and preparation checklists."""
    rules_path = RESOURCES_DIR / "polygon_rules_codeforces.md"
    checklist_path = RESOURCES_DIR / "codeforces_checklists.md"
    content = ""
    if rules_path.exists():
        content += f"# Polygon Rules\n{rules_path.read_text(encoding='utf-8')}\n\n"
    if checklist_path.exists():
        content += f"# Codeforces Checklists\n{checklist_path.read_text(encoding='utf-8')}\n"
    return content or "Checklists not found."


@mcp.resource("polygon://problems")
async def polygon_problems_resource() -> str:
    """Dynamic list of accessible problems on Polygon."""
    client = _get_client()
    problems = await ProblemService.list_problems(client)
    return json.dumps([p.model_dump() for p in problems], indent=2)


@mcp.prompt("polygon_problem_checklist")
def prompt_problem_checklist() -> str:
    """Prompt template for preparing a contest-ready Codeforces problem."""
    return (
        "Please follow this Codeforces preparation workflow:\n"
        "1. Set clear constraints and formal I/O format without ASCII shortcuts.\n"
        "2. Provide an illustration or diagram if mechanics are non-trivial (< 50 kB).\n"
        "3. Write a strict C++ validator using testlib.h with inf.readEoln() and inf.readEof().\n"
        "4. Include Main Accepted (MA), slow (TL), and corner-case failing (WA) solutions.\n"
        "5. Include edge testcases (min N, max N, cyclic cases, overflow checks).\n"
        "6. Provide full notes explaining sample testcases.\n"
        "7. Include complete tutorial / editorial.\n"
        "8. Run polygon_build_and_verify to ensure READY status."
    )


# ==============================================================================
# SERVER RUNNER (Stdio / Streamable HTTP)
# ==============================================================================


def main() -> None:
    """Command-line entrypoint for Polygon MCP server."""
    parser = argparse.ArgumentParser(description="Codeforces Polygon MCP Server")
    parser.add_argument(
        "--transport",
        choices=["stdio", "streamable-http", "sse"],
        default="stdio",
        help="Transport type (default: stdio)",
    )
    parser.add_argument("--host", default="0.0.0.0", help="HTTP host (default: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=8000, help="HTTP port (default: 8000)")
    args = parser.parse_args()

    if args.transport == "stdio":
        mcp.run(transport="stdio")
    elif args.transport == "streamable-http":
        mcp.run(transport="streamable-http", host=args.host, port=args.port)
    elif args.transport == "sse":
        mcp.run(transport="sse", host=args.host, port=args.port)


if __name__ == "__main__":
    main()
