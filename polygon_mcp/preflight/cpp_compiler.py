"""Local C++ testlib.h compilation and validator tester."""

import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Any

from polygon_mcp.core.exceptions import PolygonPreflightError

RESOURCES_DIR = Path(__file__).resolve().parent.parent / "resources"
DEFAULT_TESTLIB_PATH = RESOURCES_DIR / "testlib.h"


class CppPreflightCompiler:
    """Compiles C++ files against testlib.h locally to fail fast before Polygon uploads."""

    @classmethod
    def find_gpp(cls) -> str | None:
        """Find g++ executable on system PATH."""
        return shutil.which("g++")

    @classmethod
    def compile_cpp(
        cls,
        code: str,
        filename: str = "source.cpp",
        extra_flags: list[str] | None = None,
    ) -> tuple[bool, str, Path | None]:
        """Compile C++ code with testlib.h included. Returns (success, output_log, binary_path)."""
        gpp = cls.find_gpp()
        if not gpp:
            return (
                False,
                "g++ compiler not found on PATH. Skipping local C++ pre-flight compilation.",
                None,
            )

        temp_dir = Path(tempfile.mkdtemp(prefix="polygon_cpp_"))
        src_path = temp_dir / filename
        bin_path = temp_dir / (src_path.stem + (".exe" if shutil.which("cmd.exe") else ""))

        src_path.write_text(code, encoding="utf-8")

        # Copy testlib.h to temp dir if present in resources
        if DEFAULT_TESTLIB_PATH.exists():
            shutil.copy(DEFAULT_TESTLIB_PATH, temp_dir / "testlib.h")

        cmd = [
            gpp,
            "-O2",
            "-std=c++17",
            f"-I{temp_dir}",
            str(src_path),
            "-o",
            str(bin_path),
        ]
        if extra_flags:
            cmd.extend(extra_flags)

        try:
            res = subprocess.run(
                cmd,
                cwd=temp_dir,
                capture_output=True,
                text=True,
                timeout=20,
            )
            if res.returncode != 0:
                return False, res.stderr, None
            return True, res.stdout, bin_path
        except subprocess.TimeoutExpired:
            return False, "C++ compilation timed out after 20 seconds", None
        except Exception as e:
            return False, f"C++ compilation failed with exception: {e}", None

    @classmethod
    def verify_validator(
        cls,
        validator_code: str,
        sample_valid_inputs: list[str] | None = None,
        sample_invalid_inputs: list[str] | None = None,
    ) -> dict[str, Any]:
        """Compile validator locally and run it against valid and invalid inputs."""
        success, log, bin_path = cls.compile_cpp(validator_code, filename="validator.cpp")
        if not success:
            raise PolygonPreflightError(f"Validator compilation failed:\n{log}")

        report: dict[str, Any] = {
            "compilation": "OK",
            "tested_valid": 0,
            "tested_invalid": 0,
            "errors": [],
        }

        if not bin_path or not bin_path.exists():
            return report

        try:
            # Test valid inputs (must exit 0)
            if sample_valid_inputs:
                for idx, inp in enumerate(sample_valid_inputs, start=1):
                    res = subprocess.run(
                        [str(bin_path)],
                        input=inp,
                        capture_output=True,
                        text=True,
                        timeout=5,
                    )
                    if res.returncode != 0:
                        report["errors"].append(
                            f"Validator REJECTED valid sample #{idx} (exit code {res.returncode}): {res.stderr}"
                        )
                    else:
                        report["tested_valid"] += 1

            # Test invalid inputs (must exit non-zero)
            if sample_invalid_inputs:
                for idx, inp in enumerate(sample_invalid_inputs, start=1):
                    res = subprocess.run(
                        [str(bin_path)],
                        input=inp,
                        capture_output=True,
                        text=True,
                        timeout=5,
                    )
                    if res.returncode == 0:
                        report["errors"].append(
                            f"Validator ACCEPTED invalid sample #{idx} (expected failure): {inp.strip()}"
                        )
                    else:
                        report["tested_invalid"] += 1

            if report["errors"]:
                raise PolygonPreflightError(
                    "Validator failed local testlib checks:\n" + "\n".join(report["errors"])
                )

            return report
        finally:
            # Clean up temp folder
            try:
                shutil.rmtree(bin_path.parent, ignore_errors=True)
            except Exception:
                pass
