"""Polygon API authentication and signature generator."""

import hashlib
import random
import string
import time
from typing import Any


class PolygonAuth:
    """Handles cryptographic signature generation and parameter formatting for Polygon."""

    @staticmethod
    def generate_nonce(length: int = 6) -> str:
        """Generate a random alphanumeric nonce of specified length."""
        chars = string.ascii_lowercase + string.digits
        return "".join(random.choices(chars, k=length))

    @classmethod
    def prepare_and_sign(
        cls,
        method: str,
        params: dict[str, Any],
        api_key: str,
        api_secret: str,
        nonce: str | None = None,
        req_time: int | None = None,
    ) -> dict[str, Any]:
        """Inject apiKey, time, and apiSig into params dict and return signed payload."""
        req_params = dict(params)
        req_params["apiKey"] = api_key
        req_params["time"] = req_time if req_time is not None else int(time.time())

        # Sort parameters lexicographically by key, then value
        # Ensure all values are converted to appropriate string representations
        items: list[tuple[str, str]] = []
        for k, v in req_params.items():
            if v is None:
                continue
            if isinstance(v, bool):
                str_v = "true" if v else "false"
            elif isinstance(v, (int, float)):
                str_v = str(v)
            elif isinstance(v, bytes):
                str_v = v.decode("utf-8", errors="replace")
            else:
                str_v = str(v)
            items.append((str(k), str_v))

        # Sort lexicographically by key, then by value
        sorted_items = sorted(items, key=lambda pair: (pair[0], pair[1]))
        param_str = "&".join(f"{k}={v}" for k, v in sorted_items)

        # Generate 6-char nonce
        rand_prefix = nonce or cls.generate_nonce(6)

        # Signature format: <rand>/<methodName>?<sortedParams>#<secret>
        sig_base = f"{rand_prefix}/{method}?{param_str}#{api_secret}"
        sha512_hash = hashlib.sha512(sig_base.encode("utf-8")).hexdigest()
        api_sig = f"{rand_prefix}{sha512_hash}"

        # Return dict with string values suitable for POST data
        final_payload = {k: v for k, v in items}
        final_payload["apiSig"] = api_sig
        return final_payload
