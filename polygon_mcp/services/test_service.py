"""Tests, validator, checker, and generator management service."""

from typing import Any
from polygon_mcp.core.client import PolygonClient
from polygon_mcp.models.schemas import TestSpec
from polygon_mcp.preflight.cpp_compiler import CppPreflightCompiler


class TestService:
    """Operations for setting up tests, validators, checkers, and generators."""

    @classmethod
    async def list_tests(
        cls, client: PolygonClient, problem_id: int, testset: str = "tests"
    ) -> list[dict[str, Any]]:
        """List all test cases in the problem testset."""
        return await client.call("problem.tests", {"problemId": problem_id, "testset": testset})

    @classmethod
    async def get_test_input(
        cls, client: PolygonClient, problem_id: int, test_index: int, testset: str = "tests"
    ) -> str:
        """Fetch raw input for a test case."""
        return await client.call(
            "problem.testInput",
            {"problemId": problem_id, "testset": testset, "testIndex": test_index},
        )

    @classmethod
    async def save_test(
        cls,
        client: PolygonClient,
        problem_id: int,
        test_index: int,
        input_data: str,
        testset: str = "tests",
        description: str | None = None,
        use_in_statements: bool = False,
        check_existing: bool = False,
    ) -> dict[str, Any]:
        """Save or update a manual testcase."""
        params: dict[str, Any] = {
            "problemId": problem_id,
            "testset": testset,
            "testIndex": test_index,
            "testInput": input_data,
            "checkExisting": check_existing,
            "useInStatements": use_in_statements,
        }
        if description:
            params["testDescription"] = description

        return await client.call("problem.saveTest", params)

    @classmethod
    async def save_tests_batch(
        cls,
        client: PolygonClient,
        problem_id: int,
        tests: list[TestSpec],
        testset: str = "tests",
    ) -> list[dict[str, Any]]:
        """Save a batch of testcases sequentially."""
        results = []
        for t in tests:
            res = await cls.save_test(
                client=client,
                problem_id=problem_id,
                test_index=t.test_index,
                input_data=t.input_data,
                testset=testset,
                description=t.description,
                use_in_statements=t.use_in_statements,
            )
            results.append({"test_index": t.test_index, "status": "SAVED", "result": res})
        return results

    @classmethod
    async def set_checker(
        cls,
        client: PolygonClient,
        problem_id: int,
        checker_name: str = "std::ncmp.cpp",
    ) -> dict[str, Any]:
        """Set active checker for problem (e.g. std::ncmp.cpp, std::wcmp.cpp)."""
        return await client.call("problem.setChecker", {"problemId": problem_id, "checker": checker_name})

    @classmethod
    async def save_file(
        cls,
        client: PolygonClient,
        problem_id: int,
        filename: str,
        content: str,
        file_type: str = "source",
        check_existing: bool = False,
    ) -> dict[str, Any]:
        """Save a source file or resource file on Polygon."""
        params: dict[str, Any] = {
            "problemId": problem_id,
            "type": file_type,
            "name": filename,
            "file": content,
            "checkExisting": check_existing,
        }
        return await client.call("problem.saveFile", params)

    @classmethod
    async def set_validator(
        cls,
        client: PolygonClient,
        problem_id: int,
        validator_name: str = "validator.cpp",
        validator_code: str | None = None,
        sample_valid_inputs: list[str] | None = None,
        sample_invalid_inputs: list[str] | None = None,
        run_preflight: bool = True,
    ) -> dict[str, Any]:
        """Optionally verify locally, upload validator source, and activate it."""
        preflight_info = {}
        if validator_code:
            if run_preflight:
                preflight_info = CppPreflightCompiler.verify_validator(
                    validator_code=validator_code,
                    sample_valid_inputs=sample_valid_inputs,
                    sample_invalid_inputs=sample_invalid_inputs,
                )
            await cls.save_file(
                client=client,
                problem_id=problem_id,
                filename=validator_name,
                content=validator_code,
                file_type="source",
            )

        res = await client.call("problem.setValidator", {"problemId": problem_id, "validator": validator_name})
        return {
            "status": "VALIDATOR_SET",
            "validator": validator_name,
            "preflight": preflight_info,
            "result": res,
        }

    @classmethod
    async def save_generator(
        cls,
        client: PolygonClient,
        problem_id: int,
        gen_name: str = "gen.cpp",
        gen_code: str = "",
        run_preflight: bool = True,
    ) -> dict[str, Any]:
        """Optionally compile generator locally and upload to Polygon."""
        preflight_info = {}
        if run_preflight and gen_code:
            ok, out, _ = CppPreflightCompiler.compile_cpp(gen_code, filename=gen_name)
            if not ok:
                from polygon_mcp.core.exceptions import PolygonPreflightError

                raise PolygonPreflightError(f"Generator {gen_name} compilation failed:\n{out}")
            preflight_info = {"compilation": "OK"}

        res = await cls.save_file(
            client=client,
            problem_id=problem_id,
            filename=gen_name,
            content=gen_code,
            file_type="source",
        )
        return {
            "status": "GENERATOR_SAVED",
            "name": gen_name,
            "preflight": preflight_info,
            "result": res,
        }

    @classmethod
    async def save_script(
        cls,
        client: PolygonClient,
        problem_id: int,
        script_content: str,
    ) -> dict[str, Any]:
        """Save generator script (e.g. 'gen 10 20 > $')."""
        return await client.call("problem.saveScript", {"problemId": problem_id, "testset": "tests", "source": script_content})

    @classmethod
    async def save_validator_test(
        cls,
        client: PolygonClient,
        problem_id: int,
        test_index: int,
        input_data: str,
        description: str = "",
    ) -> dict[str, Any]:
        """Save a test case for validator rejection testing."""
        return await client.call(
            "problem.saveValidatorTest",
            {
                "problemId": problem_id,
                "testIndex": test_index,
                "testInput": input_data,
                "testDescription": description,
            },
        )
