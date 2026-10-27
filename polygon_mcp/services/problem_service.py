"""Problem lifecycle management service."""

from typing import Any
from polygon_mcp.core.client import PolygonClient
from polygon_mcp.models.schemas import ProblemInfo


class ProblemService:
    """Operations for listing, creating, inspecting, and modifying problems."""

    @classmethod
    async def list_problems(
        cls,
        client: PolygonClient,
        name_filter: str | None = None,
    ) -> list[ProblemInfo]:
        """Fetch all accessible problems, optionally filtering by name."""
        params: dict[str, Any] = {}
        if name_filter:
            params["name"] = name_filter

        raw_list = await client.call("problems.list", params)
        results: list[ProblemInfo] = []
        for item in raw_list:
            results.append(
                ProblemInfo(
                    id=item.get("id"),
                    name=item.get("name"),
                    owner=item.get("owner"),
                    accessType=item.get("accessType"),
                    modified=item.get("modified", False),
                    latestPackage=item.get("latestPackage"),
                )
            )
        return results

    @classmethod
    async def get_problem_info(cls, client: PolygonClient, problem_id: int) -> ProblemInfo:
        """Fetch general info, name, and limits for a specific problem."""
        res = await client.call("problem.info", {"problemId": problem_id})

        name = f"problem-{problem_id}"
        owner = None
        latest_pkg = None
        try:
            plist = await client.call("problems.list", {})
            for item in plist:
                if item.get("id") == problem_id:
                    name = item.get("name", name)
                    owner = item.get("owner")
                    latest_pkg = item.get("latestPackage")
                    break
        except Exception:
            pass

        return ProblemInfo(
            id=problem_id,
            name=name,
            owner=owner,
            accessType=res.get("accessType"),
            modified=res.get("modified", False),
            latestPackage=latest_pkg,
            timeLimit=res.get("timeLimit"),
            memoryLimit=res.get("memoryLimit"),
        )

    @classmethod
    async def create_problem(cls, client: PolygonClient, name: str) -> ProblemInfo:
        """Create a new problem with given name on Polygon."""
        res = await client.call("problems.create", {"name": name})
        return ProblemInfo(
            id=res.get("id"),
            name=res.get("name", name),
            owner=res.get("owner"),
        )

    @classmethod
    async def update_limits(
        cls,
        client: PolygonClient,
        problem_id: int,
        time_limit: int | None = None,
        memory_limit: int | None = None,
        interactive: bool | None = None,
    ) -> dict[str, Any]:
        """Update problem time limit (ms) and memory limit (MB)."""
        params: dict[str, Any] = {"problemId": problem_id}
        if time_limit is not None:
            params["timeLimit"] = time_limit
        if memory_limit is not None:
            params["memoryLimit"] = memory_limit
        if interactive is not None:
            params["interactive"] = interactive

        return await client.call("problem.updateInfo", params)

    @classmethod
    async def discard_working_copy(cls, client: PolygonClient, problem_id: int) -> None:
        """Discard uncommitted working copy changes."""
        await client.call("problem.discardWorkingCopy", {"problemId": problem_id})
