"""Problem solution management service."""

from typing import Any
from polygon_mcp.core.client import PolygonClient
from polygon_mcp.models.schemas import SolutionSpec, SolutionTag


class SolutionService:
    """Operations for listing, inspecting, and saving solutions."""

    @classmethod
    async def list_solutions(
        cls,
        client: PolygonClient,
        problem_id: int,
    ) -> list[dict[str, Any]]:
        """List all solutions registered for this problem."""
        return await client.call("problem.solutions", {"problemId": problem_id})

    @classmethod
    async def view_solution(
        cls,
        client: PolygonClient,
        problem_id: int,
        name: str,
    ) -> str:
        """View source code of an existing solution."""
        return await client.call("problem.viewSolution", {"problemId": problem_id, "name": name})

    @classmethod
    async def save_solution(
        cls,
        client: PolygonClient,
        problem_id: int,
        name: str,
        code: str,
        tag: SolutionTag = "OK",
        check_existing: bool = False,
    ) -> dict[str, Any]:
        """Upload or update a solution with specified tag (MA, OK, TL, WA, etc.)."""
        # Note: In Polygon, filenames must be unique regardless of extension to prevent collisions
        existing = await cls.list_solutions(client, problem_id)
        existing_names = {s.get("name") for s in existing}

        params: dict[str, Any] = {
            "problemId": problem_id,
            "name": name,
            "file": code,
            "tag": tag,
            "checkExisting": check_existing,
        }

        res = await client.call("problem.saveSolution", params)
        return {
            "status": "SAVED",
            "name": name,
            "tag": tag,
            "is_overwrite": name in existing_names,
            "result": res,
        }

    @classmethod
    async def save_solution_spec(
        cls,
        client: PolygonClient,
        problem_id: int,
        solution: SolutionSpec,
    ) -> dict[str, Any]:
        """Convenience method accepting SolutionSpec."""
        return await cls.save_solution(
            client=client,
            problem_id=problem_id,
            name=solution.name,
            code=solution.content,
            tag=solution.tag,
        )
