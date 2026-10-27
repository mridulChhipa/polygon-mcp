"""Custom exceptions for Polygon MCP server."""


class PolygonError(Exception):
    """Base class for all Polygon MCP exceptions."""


class PolygonAuthError(PolygonError):
    """Raised when authentication credentials or signatures are invalid."""


class PolygonAPIError(PolygonError):
    """Raised when Polygon returns status: FAILED."""

    def __init__(self, method: str, comment: str, http_code: int | None = None):
        self.method = method
        self.comment = comment
        self.http_code = http_code
        super().__init__(f"Polygon API '{method}' failed: {comment}")


class PolygonPreflightError(PolygonError):
    """Raised when pre-flight compilation, syntax, or asset checks fail."""


class PolygonTimeoutError(PolygonError):
    """Raised when asynchronous package builds or polls exceed max wait duration."""
