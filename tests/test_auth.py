"""Unit tests for Polygon signature generation and authentication."""

import hashlib
import unittest
from polygon_mcp.core.auth import PolygonAuth


class TestPolygonAuth(unittest.TestCase):
    """Test Polygon SHA-512 signature mechanics."""

    def test_nonce_generation(self):
        nonce = PolygonAuth.generate_nonce(6)
        self.assertEqual(len(nonce), 6)
        self.assertTrue(nonce.isalnum())

    def test_parameter_sorting_and_hashing(self):
        # Known vector
        params = {
            "name": "problem-test",
            "timeLimit": 2000,
            "checkExisting": True,
        }
        api_key = "test_key_123"
        api_secret = "test_secret_abc"
        fixed_nonce = "abcdef"
        fixed_time = 1700000000

        signed = PolygonAuth.prepare_and_sign(
            method="problems.create",
            params=params,
            api_key=api_key,
            api_secret=api_secret,
            nonce=fixed_nonce,
            req_time=fixed_time,
        )

        self.assertEqual(signed["apiKey"], api_key)
        self.assertEqual(signed["time"], "1700000000")
        self.assertEqual(signed["checkExisting"], "true")
        self.assertEqual(signed["name"], "problem-test")
        self.assertEqual(signed["timeLimit"], "2000")

        # Sorted parameters should be:
        # apiKey=test_key_123&checkExisting=true&name=problem-test&time=1700000000&timeLimit=2000
        expected_sorted = "apiKey=test_key_123&checkExisting=true&name=problem-test&time=1700000000&timeLimit=2000"
        expected_str = f"{fixed_nonce}/problems.create?{expected_sorted}#{api_secret}"
        expected_hash = hashlib.sha512(expected_str.encode("utf-8")).hexdigest()
        expected_sig = f"{fixed_nonce}{expected_hash}"

        self.assertEqual(signed["apiSig"], expected_sig)


if __name__ == "__main__":
    unittest.main()
