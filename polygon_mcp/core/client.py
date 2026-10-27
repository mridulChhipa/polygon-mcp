"""Asynchronous HTTP client for Codeforces Polygon API."""

import asyncio
import logging
from typing import Any
import httpx

from polygon_mcp.config import settings
from polygon_mcp.core.auth import PolygonAuth
from polygon_mcp.core.exceptions import PolygonAPIError, PolygonAuthError

logger = logging.getLogger("polygon_mcp.client")


class PolygonClient:
    """Async client with signature authentication, auto-retries, and response normalization."""

    def __init__(
        self,
        api_key: str | None = None,
        api_secret: str | None = None,
        base_url: str | None = None,
    ):
        self.api_key = settings.get_api_key(api_key)
        self.api_secret = settings.get_api_secret(api_secret)
        self.base_url = (base_url or settings.get_base_url()).rstrip("/") + "/"

    async def call(
        self,
        method: str,
        params: dict[str, Any] | None = None,
        max_retries: int = 4,
        timeout: float = 60.0,
    ) -> Any:
        """Execute signed API call to Polygon with retry handling."""
        params = params or {}
        url = f"{self.base_url}{method}"

        last_error: Exception | None = None
        for attempt in range(1, max_retries + 1):
            # Regenerate nonce and current timestamp on each retry attempt
            signed_data = PolygonAuth.prepare_and_sign(
                method=method,
                params=params,
                api_key=self.api_key,
                api_secret=self.api_secret,
            )

            try:
                async with httpx.AsyncClient(timeout=timeout) as client:
                    resp = await client.post(url, data=signed_data)

                # Transient server error handling (502, 503, 504, 429)
                if resp.status_code in (429, 502, 503, 504):
                    logger.warning(
                        "Polygon returned HTTP %d on %s (attempt %d/%d). Retrying...",
                        resp.status_code,
                        method,
                        attempt,
                        max_retries,
                    )
                    await asyncio.sleep(1.5 * attempt)
                    continue

                try:
                    data = resp.json()
                except Exception as json_err:
                    if resp.status_code != 200:
                        raise PolygonAPIError(
                            method=method,
                            comment=f"HTTP {resp.status_code}: {resp.text[:300]}",
                            http_code=resp.status_code,
                        ) from json_err
                    raise PolygonAPIError(
                        method=method,
                        comment=f"Non-JSON response from Polygon: {resp.text[:300]}",
                    ) from json_err

                status = data.get("status")
                if status == "OK":
                    return data.get("result")

                comment = data.get("comment", "Unknown API failure")
                if "apiKey: Incorrect signature" in comment or "Invalid apiKey" in comment:
                    raise PolygonAuthError(f"Polygon auth failure on '{method}': {comment}")

                raise PolygonAPIError(method=method, comment=comment, http_code=resp.status_code)

            except (httpx.ConnectError, httpx.ReadTimeout, httpx.WriteTimeout) as net_err:
                last_error = net_err
                logger.warning(
                    "Network error calling %s (attempt %d/%d): %s",
                    method,
                    attempt,
                    max_retries,
                    str(net_err),
                )
                if attempt < max_retries:
                    await asyncio.sleep(1.5 * attempt)
                else:
                    raise PolygonAPIError(
                        method=method,
                        comment=f"Network connection failed after {max_retries} attempts: {net_err}",
                    ) from net_err

        if last_error:
            raise last_error
        raise PolygonAPIError(method=method, comment="Max retries exhausted")
