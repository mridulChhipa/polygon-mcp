"""Configuration management for Polygon MCP server."""

import os
from pathlib import Path
from dotenv import find_dotenv, load_dotenv

# Search upwards for .env
dotenv_path = find_dotenv(usecwd=True)
if dotenv_path:
    load_dotenv(dotenv_path)


class Settings:
    """Polygon server settings and environment credential resolution."""

    @staticmethod
    def get_api_key(explicit_key: str | None = None) -> str:
        """Resolve API key from explicit arg, env var POLYGON_API_KEY, or POLYGON_KEY."""
        key = explicit_key or os.getenv("POLYGON_API_KEY") or os.getenv("POLYGON_KEY")
        if not key:
            raise ValueError(
                "Polygon API key is required. Provide 'api_key' argument or set POLYGON_API_KEY / POLYGON_KEY in environment."
            )
        return key.strip()

    @staticmethod
    def get_api_secret(explicit_secret: str | None = None) -> str:
        """Resolve API secret from explicit arg, env var POLYGON_API_SECRET, or POLYGON_SECRET."""
        secret = (
            explicit_secret
            or os.getenv("POLYGON_API_SECRET")
            or os.getenv("POLYGON_SECRET")
        )
        if not secret:
            raise ValueError(
                "Polygon API secret is required. Provide 'api_secret' argument or set POLYGON_API_SECRET / POLYGON_SECRET in environment."
            )
        return secret.strip()

    @staticmethod
    def get_base_url() -> str:
        """Base URL for Polygon API."""
        return os.getenv("POLYGON_BASE_URL", "https://polygon.codeforces.com/api/").rstrip("/") + "/"


settings = Settings()
