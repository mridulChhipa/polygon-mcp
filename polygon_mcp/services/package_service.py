"""Package building, polling, and verification service."""

import asyncio
import logging
from typing import Any

from polygon_mcp.core.client import PolygonClient
from polygon_mcp.core.exceptions import PolygonAPIError, PolygonTimeoutError
from polygon_mcp.models.schemas import PackageBuildResult

logger = logging.getLogger("polygon_mcp.package_service")


class PackageService:
    """Operations for committing, building, and polling package verification."""

    @classmethod
    async def commit_changes(
        cls,
        client: PolygonClient,
        problem_id: int,
        message: str = "Updated via Polygon MCP",
    ) -> dict[str, Any]:
        """Commit working copy changes with a message."""
        try:
            return await client.call(
                "problem.commitChanges",
                {"problemId": problem_id, "message": message},
            )
        except PolygonAPIError as e:
            if "Working copy has no changes" in e.comment or "no changes" in e.comment.lower():
                return {"status": "NO_CHANGES", "comment": e.comment}
            raise

    @classmethod
    async def list_packages(cls, client: PolygonClient, problem_id: int) -> list[dict[str, Any]]:
        """List all packages for a problem."""
        return await client.call("problem.packages", {"problemId": problem_id})

    @classmethod
    async def trigger_build(
        cls,
        client: PolygonClient,
        problem_id: int,
        full: bool = True,
        verify: bool = True,
    ) -> None:
        """Trigger package build."""
        await client.call(
            "problem.buildPackage",
            {"problemId": problem_id, "full": full, "verify": verify},
        )

    @classmethod
    async def build_and_wait(
        cls,
        client: PolygonClient,
        problem_id: int,
        commit_message: str = "Sync from MCP",
        full: bool = True,
        verify: bool = True,
        timeout_seconds: int = 240,
        poll_interval: float = 4.0,
    ) -> PackageBuildResult:
        """Commit changes, initiate verified build, and poll asynchronously until complete."""
        # 1. Commit working copy
        await cls.commit_changes(client, problem_id, commit_message)

        # 2. Trigger build
        await cls.trigger_build(client, problem_id, full=full, verify=verify)

        # 3. Poll packages list
        start_time = asyncio.get_event_loop().time()
        target_package_id: int | None = None

        while (asyncio.get_event_loop().time() - start_time) < timeout_seconds:
            packages = await cls.list_packages(client, problem_id)
            if packages:
                # Packages are returned sorted with latest at the top or by id
                latest = max(packages, key=lambda p: p.get("id", 0))
                target_package_id = latest.get("id")
                state = latest.get("state")

                if state == "READY":
                    return PackageBuildResult(
                        package_id=target_package_id,
                        state="READY",
                        warnings=latest.get("warnings", []),
                    )
                if state == "FAILED":
                    return PackageBuildResult(
                        package_id=target_package_id,
                        state="FAILED",
                        warnings=latest.get("warnings", []),
                        verification_log=latest.get("comment"),
                    )

            await asyncio.sleep(poll_interval)

        raise PolygonTimeoutError(
            f"Package build for problem {problem_id} timed out after {timeout_seconds} seconds (Package ID: {target_package_id})"
        )
