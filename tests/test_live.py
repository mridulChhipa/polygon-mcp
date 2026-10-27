"""Live API integration test for Polygon MCP server against real Polygon account."""

import asyncio
import unittest
from polygon_mcp.server import (
    polygon_check_audit,
    polygon_get_problem,
    polygon_list_problems,
)


class TestLivePolygon(unittest.IsolatedAsyncioTestCase):
    """Live verification against Polygon API using configured credentials."""

    async def test_list_problems(self):
        problems = await polygon_list_problems()
        self.assertIsInstance(problems, list)
        self.assertGreater(len(problems), 0)
        prob_names = [p["name"] for p in problems]
        self.assertIn("retro-keypad-phone", prob_names)

    async def test_get_existing_problem_details(self):
        # Problem 612894 was created for Retro Keypad Phone
        res = await polygon_get_problem(problem_id=612894)
        self.assertEqual(res["problem_id"], 612894)
        self.assertEqual(res["info"]["name"], "retro-keypad-phone")
        self.assertIn("english", res["statements"])
        self.assertGreaterEqual(res["test_count"], 16)
        sol_names = [s["name"] for s in res["solutions"]]
        self.assertIn("solution.cpp", sol_names)

    async def test_audit_problem(self):
        audit = await polygon_check_audit(problem_id=612894)
        self.assertEqual(audit["problem_id"], 612894)
        self.assertEqual(audit["problem_name"], "retro-keypad-phone")
        self.assertTrue(audit["is_ready_for_contest"])
        self.assertGreaterEqual(len(audit["passed_checks"]), 4)


if __name__ == "__main__":
    unittest.main()
