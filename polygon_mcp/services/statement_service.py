"""Problem statement and resource management service."""

from pathlib import Path
from typing import Any

from polygon_mcp.core.client import PolygonClient
from polygon_mcp.models.schemas import StatementSpec
from polygon_mcp.preflight.statement_linter import StatementPreflightLinter


class StatementService:
    """Operations for fetching and saving problem statements, assets, and notes."""

    @classmethod
    async def get_statements(
        cls,
        client: PolygonClient,
        problem_id: int,
    ) -> dict[str, Any]:
        """Fetch all statements for problem."""
        return await client.call("problem.statements", {"problemId": problem_id})

    @classmethod
    async def save_statement(
        cls,
        client: PolygonClient,
        problem_id: int,
        statement: StatementSpec,
        run_linter: bool = True,
    ) -> dict[str, Any]:
        """Save problem statement (legend, input, output, notes, tutorial)."""
        warnings: list[str] = []
        if run_linter:
            warnings.extend(StatementPreflightLinter.lint_text(statement.legend, "legend"))
            warnings.extend(StatementPreflightLinter.lint_text(statement.input, "input"))
            warnings.extend(StatementPreflightLinter.lint_text(statement.output, "output"))
            if statement.notes:
                warnings.extend(StatementPreflightLinter.lint_text(statement.notes, "notes"))
            if statement.tutorial:
                warnings.extend(StatementPreflightLinter.lint_text(statement.tutorial, "tutorial"))

        params: dict[str, Any] = {
            "problemId": problem_id,
            "lang": statement.lang,
            "name": statement.name,
            "legend": statement.legend,
            "input": statement.input,
            "output": statement.output,
            "notes": statement.notes or "",
            "tutorial": statement.tutorial or "",
        }

        res = await client.call("problem.saveStatement", params)
        return {
            "result": res,
            "warnings": warnings,
        }

    @classmethod
    async def list_resources(
        cls,
        client: PolygonClient,
        problem_id: int,
    ) -> list[dict[str, Any]]:
        """List all statement resource files for a problem."""
        return await client.call("problem.statementResources", {"problemId": problem_id})

    @classmethod
    async def save_statement_resource(
        cls,
        client: PolygonClient,
        problem_id: int,
        filename: str,
        file_path_or_bytes: str | Path | bytes,
        check_existing: bool = False,
    ) -> dict[str, Any]:
        """Upload an image or asset resource for inclusion in problem statement."""
        if isinstance(file_path_or_bytes, (str, Path)):
            p = Path(file_path_or_bytes)
            StatementPreflightLinter.validate_image_asset(p)
            file_data = p.read_bytes()
        else:
            StatementPreflightLinter.validate_image_asset(file_path_or_bytes)
            file_data = file_path_or_bytes

        params: dict[str, Any] = {
            "problemId": problem_id,
            "name": filename,
            "file": file_data,
            "checkExisting": check_existing,
        }

        return await client.call("problem.saveStatementResource", params)
