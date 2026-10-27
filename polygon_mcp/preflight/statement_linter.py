"""Statement and asset preflight validator adhering to Codeforces rules."""

import os
import re
from pathlib import Path
from typing import Any

from polygon_mcp.core.exceptions import PolygonPreflightError


class StatementPreflightLinter:
    """Audits statement TeX formatting and embedded image assets."""

    MAX_IMAGE_SIZE_BYTES = 50 * 1024  # 50 kB maximum per Codeforces Polygon rule

    @classmethod
    def lint_text(cls, text: str, field_name: str = "statement") -> list[str]:
        """Check for unescaped characters, unbalanced dollars, or ASCII inequalities."""
        warnings: list[str] = []

        # 1. Unmatched single dollars (ignoring escaped \$)
        # Strip $$...$$ display math first
        clean_display = re.sub(r"\$\$.*?\$\$", "", text, flags=re.DOTALL)
        # Find single $ that are not preceded by a backslash
        single_dollars = re.findall(r"(?<!\\)\$", clean_display)
        if len(single_dollars) % 2 != 0:
            warnings.append(
                f"[{field_name}] Unmatched '$' math delimiter found ({len(single_dollars)} occurrences)."
            )

        # 2. Check for ASCII '<=' or '>=' inside math formulas
        formula_matches = re.findall(r"(?<!\\)\$(.*?)(?<!\\)\$", text)
        for f in formula_matches:
            if "<=" in f:
                warnings.append(
                    f"[{field_name}] Found '<=' in formula '${f}$'. Use '\\le' or '\\le' instead."
                )
            if ">=" in f:
                warnings.append(
                    f"[{field_name}] Found '>=' in formula '${f}$'. Use '\\ge' or '\\ge' instead."
                )
            if "..." in f:
                warnings.append(
                    f"[{field_name}] Found raw '...' in formula '${f}$'. Use '\\dots' or '\\ldots'."
                )

        # 3. Check for curly brace mismatch
        open_braces = text.count("{")
        close_braces = text.count("}")
        if open_braces != close_braces:
            warnings.append(
                f"[{field_name}] Curly brace mismatch: {open_braces} '{{' vs {close_braces} '}}'."
            )

        return warnings

    @classmethod
    def validate_image_asset(cls, file_bytes_or_path: bytes | str | Path) -> dict[str, Any]:
        """Verify image asset size is strictly below 50 kB per Polygon rule."""
        if isinstance(file_bytes_or_path, (str, Path)):
            p = Path(file_bytes_or_path)
            if not p.exists():
                raise PolygonPreflightError(f"Image asset file does not exist: {p}")
            size = p.stat().st_size
            name = p.name
        else:
            size = len(file_bytes_or_path)
            name = "in_memory_image"

        if size > cls.MAX_IMAGE_SIZE_BYTES:
            raise PolygonPreflightError(
                f"Image asset '{name}' is {size / 1024:.1f} kB, exceeding the 50 kB Codeforces Polygon limit."
            )

        return {"filename": name, "size_bytes": size, "status": "OK"}
