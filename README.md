# Codeforces Polygon MCP Server

An enterprise-grade **Model Context Protocol (MCP)** server providing AI coding agents with full-lifecycle problem preparation, testing, auditing, and packaging on **Codeforces Polygon**.

Designed for seamless integration into **Claude Code**, **Cursor**, **Google Antigravity**, **Claude Desktop**, and **Codex / Windsurf**.

---

## Key Capabilities

- **Two-Tier Architecture**:
  - **Tier 1 Composite Workflows**: One-turn full problem bundle creation (`polygon_create_problem_bundle`), bidirectional workspace synchronization (`polygon_sync_from_directory`), and asynchronous verified package build (`polygon_build_and_verify`).
  - **Tier 2 Incremental Primitives**: Granular tools for updating statements, adding solutions with automatic collision deduplication, modifying tests, generator scripts, and active validators.
- **Fail-Fast Local Pre-Flight Engine**:
  - Automatically compiles C++ validators and test generators locally with `g++` and bundled official `testlib.h` before sending bytes to Polygon.
  - Statement linting and asset size checks (< 50 kB PNG/JPEG limit per Codeforces Polygon specification).
- **Zero-Friction Authentication**:
  - Automatically resolves credentials from environment variables (`POLYGON_API_KEY`, `POLYGON_API_SECRET`) or local `.env` file.
  - Supports dynamic per-call credentials for multi-user and multi-agent setups.
- **Protocol Quirks Encapsulated**:
  - Strict SHA-512 cryptographic signing with canonical parameter sorting and 6-character random nonces.
  - Proper payload normalization for file uploads (Polygon expects UTF-8 text and binary data directly in POST params for signature computation, avoiding standard multipart signature mismatches).
  - Rate limiting, clock skew mitigation, and exponential backoff retry on transient 502/504 errors.

---

## Team Installation Options (GitHub)

Choose the installation method that fits your workflow:

### Option A: Run via `uvx` from GitHub (Zero Install — Recommended)
If you have [Astral's `uv`](https://docs.astral.sh/uv/) installed, teammates don't need to manually clone or manage virtual environments:
```bash
uvx --from git+https://github.com/mridulChhipa/polygon-mcp.git polygon-mcp
```

### Option B: Install via Pip from GitHub
```bash
pip install git+https://github.com/mridulChhipa/polygon-mcp.git
```

### Option C: Local Clone & Editable Mode
For local development or customization:
```bash
git clone https://github.com/mridulChhipa/polygon-mcp.git
cd polygon-mcp
pip install -e .
```

---

## Obtaining Polygon Credentials

1. Log into your account on [Codeforces Polygon](https://codeforces.com/polygon).
2. Go to **Settings** (top right) -> **API Keys**.
3. Generate a new Key pair and note your **Key** and **Secret**.
4. Configure them in your client config or create a `.env` file in your workspace:
   ```env
   POLYGON_API_KEY=your_polygon_api_key_here
   POLYGON_API_SECRET=your_polygon_api_secret_here
   ```

> **Team Best Practice**: Each teammate should use their own Polygon API key pair so problem revisions and package builds are accurately attributed to their own Codeforces handle.

---

## Client Integration Guide

### 1. Claude Code (CLI)
Run a single command in your terminal:
```bash
claude mcp add codeforces-polygon \
  -e POLYGON_API_KEY="your_api_key" \
  -e POLYGON_API_SECRET="your_api_secret" \
  -- uvx --from git+https://github.com/mridulChhipa/polygon-mcp.git polygon-mcp
```

*(Alternatively, if installed locally in your Python environment via `pip install git+...` or `pip install -e .`, use `-- python -m polygon_mcp.server`)*.

---

### 2. Cursor IDE
1. Open **Cursor Settings** (`Ctrl + ,` or `Cmd + ,`) -> **Features** -> **MCP**.
2. Click **+ Add New MCP Server**.
3. Fill in:
   - **Name**: `codeforces-polygon`
   - **Type**: `command`
   - **Command**: `uvx --from git+https://github.com/mridulChhipa/polygon-mcp.git polygon-mcp`
   - **Environment Variables**:
     - `POLYGON_API_KEY`: `your_api_key`
     - `POLYGON_API_SECRET`: `your_api_secret`

---

### 3. Google Antigravity
Add to your global `~/.gemini/config/mcp_config.json`:
```json
{
  "mcpServers": {
    "codeforces-polygon": {
      "command": "uvx",
      "args": [
        "--from",
        "git+https://github.com/mridulChhipa/polygon-mcp.git",
        "polygon-mcp"
      ],
      "env": {
        "PYTHONIOENCODING": "utf-8",
        "POLYGON_API_KEY": "your_api_key",
        "POLYGON_API_SECRET": "your_api_secret"
      }
    }
  }
}
```
*(Or point `"command"` to `"python"` with `"args": ["-m", "polygon_mcp.server"]` if running from a local clone).*

---

### 4. Claude Desktop
Add to `claude_desktop_config.json` (`%APPDATA%\Claude\` on Windows, `~/Library/Application Support/Claude/` on macOS):
```json
{
  "mcpServers": {
    "codeforces-polygon": {
      "command": "uvx",
      "args": [
        "--from",
        "git+https://github.com/mridulChhipa/polygon-mcp.git",
        "polygon-mcp"
      ],
      "env": {
        "POLYGON_API_KEY": "your_api_key",
        "POLYGON_API_SECRET": "your_api_secret"
      }
    }
  }
}
```

---

### 5. Codex / Windsurf (Codeium)
Add to `~/.codeium/windsurf/mcp_config.json`:
```json
{
  "mcpServers": {
    "codeforces-polygon": {
      "command": "uvx",
      "args": [
        "--from",
        "git+https://github.com/mridulChhipa/polygon-mcp.git",
        "polygon-mcp"
      ],
      "env": {
        "POLYGON_API_KEY": "your_api_key",
        "POLYGON_API_SECRET": "your_api_secret"
      }
    }
  }
}
```

---

## Server Transport Modes

### Stdio Transport (Default)
Used for local agents (Antigravity, Cursor, Claude):
```bash
python -m polygon_mcp.server --transport stdio
```

### Streamable HTTP Transport (Remote Team Server)
Host a central server on a team VM or container (no local Python/g++ needed for teammates):
```bash
python -m polygon_mcp.server --transport streamable-http --host 0.0.0.0 --port 8000
```
Teammates can then point their clients directly to `https://mcp.yourteam.internal/mcp`.

---

## Available MCP Tools

### Tier 1: Composite Workflows
| Tool | Purpose |
|---|---|
| `polygon_create_problem_bundle` | Creates problem, limits, statement, validator, solutions, tests, generator, and package build in a single turn. |
| `polygon_sync_from_directory` | Automatically scans a local folder (`statement.md`, `validator.cpp`, `solution.cpp`, `gen.cpp`, `script.txt`) and mirrors everything to Polygon. |
| `polygon_build_and_verify` | Commits changes and polls verified build asynchronously until `READY` or `FAILED`. |

### Tier 2: Targeted Primitives
| Tool | Purpose |
|---|---|
| `polygon_list_problems` | Lists accessible problems on the user's account. |
| `polygon_get_problem` | Fetches complete overview: limits, statements, solutions, test count, and package statuses. |
| `polygon_update_statement` | Non-destructive update of statement sections or embedded graphic assets. |
| `polygon_upload_solution` | Adds or updates solutions with verdict tags (`MA`, `OK`, `TL`, `WA`, `ML`, `RE`). |
| `polygon_update_validator` | Compiles locally with `testlib.h`, tests against sample inputs, and updates active validator. |
| `polygon_update_tests` | Updates individual testcases or generator script. |
| `polygon_check_audit` | Runs automated 11-point audit verifying compliance with official Codeforces Round guidelines. |

### Resources & Prompts
- **Resource `polygon://rules/codeforces`**: Official Codeforces round rules and preparation checklists.
- **Resource `polygon://problems`**: Live list of accessible problems on Polygon.
- **Prompt `polygon_problem_checklist`**: Guided prompt template for contest authors.

---

## License

MIT License. Designed for competitive programming authors and contest coordinators.
