"""Data models and schemas for Polygon entities."""

from typing import Literal
from pydantic import BaseModel, Field


class ProblemInfo(BaseModel):
    """Polygon problem summary info."""

    id: int
    name: str
    owner: str | None = None
    accessType: str | None = None
    modified: bool | None = False
    latestPackage: int | None = None
    timeLimit: int | None = None
    memoryLimit: int | None = None


class TestSpec(BaseModel):
    """Specification for a manual testcase."""

    test_index: int = Field(description="1-based test index")
    input_data: str = Field(description="Raw input data for the test")
    description: str | None = Field(default=None, description="Optional description of the test")
    use_in_statements: bool = Field(default=False, description="Whether to include in statement samples")


SolutionTag = Literal["MA", "OK", "TL", "WA", "ML", "RE", "RJ", "DO_NOT_RUN"]


class SolutionSpec(BaseModel):
    """Specification for a problem solution."""

    name: str = Field(description="Filename of solution, e.g. sol_fast.cpp or sol_py.py")
    content: str = Field(description="Full source code text")
    tag: SolutionTag = Field(default="OK", description="Polygon solution verdict tag")


class StatementSpec(BaseModel):
    """Polygon problem statement specification."""

    lang: str = Field(default="english", description="Language code")
    name: str = Field(description="Problem title / name")
    legend: str = Field(description="Problem statement text (LaTeX supported)")
    input: str = Field(description="Input format specification")
    output: str = Field(description="Output format specification")
    notes: str = Field(default="", description="Optional explanation / note section")
    tutorial: str = Field(default="", description="Optional editorial / tutorial text")


class PackageBuildResult(BaseModel):
    """Result of package creation and verification."""

    package_id: int | None = None
    state: str = Field(description="State: PENDING, RUNNING, READY, or FAILED")
    warnings: list[str] = Field(default_factory=list)
    verification_log: str | None = None


class ProblemAuditReport(BaseModel):
    """Codeforces round readiness audit report."""

    problem_id: int
    problem_name: str
    passed_checks: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)
    is_ready_for_contest: bool = False
