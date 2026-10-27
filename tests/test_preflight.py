"""Unit tests for Pre-flight compiler and statement linter."""

import unittest
from polygon_mcp.core.exceptions import PolygonPreflightError
from polygon_mcp.preflight.cpp_compiler import CppPreflightCompiler
from polygon_mcp.preflight.statement_linter import StatementPreflightLinter


class TestPreflight(unittest.TestCase):
    """Test statement linter and C++ compiler pre-flight checks."""

    def test_statement_linter_unmatched_math(self):
        warnings = StatementPreflightLinter.lint_text("There are $n elements and $m queries.")
        self.assertEqual(len(warnings), 0)

        bad_text = "Here is an unclosed dollar: $n + 1 and another."
        bad_warnings = StatementPreflightLinter.lint_text(bad_text)
        self.assertTrue(any("Unmatched '$'" in w for w in bad_warnings))

    def test_statement_linter_ascii_inequality(self):
        text = "Condition: $1 <= x <= n$."
        warnings = StatementPreflightLinter.lint_text(text)
        self.assertTrue(any("'<='" in w for w in warnings))

    def test_image_size_rejection(self):
        # 60 kB in-memory bytes
        big_data = b"X" * (60 * 1024)
        with self.assertRaises(PolygonPreflightError):
            StatementPreflightLinter.validate_image_asset(big_data)

        # 30 kB in-memory bytes (valid)
        small_data = b"X" * (30 * 1024)
        res = StatementPreflightLinter.validate_image_asset(small_data)
        self.assertEqual(res["status"], "OK")

    def test_cpp_compilation(self):
        validator_code = r"""#include "testlib.h"
int main(int argc, char* argv[]) {
    registerValidation(argc, argv);
    int n = inf.readInt(1, 100, "n");
    inf.readEoln();
    inf.readEof();
    return 0;
}
"""
        report = CppPreflightCompiler.verify_validator(
            validator_code=validator_code,
            sample_valid_inputs=["42\n", "1\n", "100\n"],
            sample_invalid_inputs=["0\n", "101\n", "abc\n"],
        )
        self.assertEqual(report["compilation"], "OK")
        self.assertEqual(report["tested_valid"], 3)
        self.assertEqual(report["tested_invalid"], 3)


if __name__ == "__main__":
    unittest.main()
