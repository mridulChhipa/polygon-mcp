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

## Documentation Website

The repository includes a complete, interactive **Neubrutalism-designed documentation website** with 26 comprehensive pages covering quickstarts, architecture deep-dives, protocol signing specs, tutorial walkthroughs, and full parameter references for all 10 MCP tools.

You can access and run the documentation using whichever method fits your workflow:

---

### Method 1: Instant Offline Viewing (Zero `npm` / Zero Node.js Required)

You do **not** need Node.js, `npm`, or any front-end setup installed. The entire static documentation site is already pre-built and committed into `polygon-docs/dist/index.html`.

Launch the documentation instantly using Python's built-in HTTP server:
```bash
# From the repository root:
python -m http.server 3000 -d polygon-docs/dist
```
Then open **[http://localhost:3000](http://localhost:3000)** in any browser.

> **Why a Python server?** Modern web browsers enforce CORS security policies on local `file:///` URLs when loading JavaScript modules. Since competitive programming authors already have Python installed, `python -m http.server` provides an instant, zero-dependency local viewing experience without installing Node.js.

---

### Method 2: Running with Node.js & `npm`

If you have Node.js installed and prefer running the Next.js development server or building from source:

#### A. Live Development Server (Hot Reload)
```bash
cd polygon-docs
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** to explore or edit the docs live.

#### B. Building & Serving the Production Static Export
```bash
cd polygon-docs
npm run build
npm run start
```
`npm run build` compiles and exports the static site into `polygon-docs/dist/`, and `npm run start` serves `dist` locally on port 3000. You can also preview `dist` with Python:
```bash
python -m http.server 3000 -d dist
```

---

### Method 3: Public Hosted Documentation (GitHub Pages)

The documentation can also be hosted publicly on GitHub Pages at:
👉 **`https://mridulchhipa.github.io/polygon-mcp/`**

A pre-configured GitHub Actions workflow (`.github/workflows/deploy-docs.yml`) is included in the repository. Once enabled under repository **Settings &rarr; Pages &rarr; Source (GitHub Actions)**, any push to `main` will build and publish the docs automatically.

---

### What's Covered in the Docs?

| Section | Key Content Covered |
|---|---|
| **🚀 Getting Started** | 5-Minute Quickstart, GitHub installation options, API key resolution hierarchy, and step-by-step setup for **both CLI and IDE** across Claude Code, Cursor, Antigravity, Windsurf, and Codex. |
| **📐 Core Architecture** | Two-Tier MCP tool pattern, SHA-512 cryptographic signing, fail-fast local C++ `testlib.h` preflight engine, working copy & package lifecycle. |
| **🛠️ MCP Tools Reference** | Tier 1 Workflows (`polygon_create_problem_bundle`, `polygon_sync_from_directory`, `polygon_build_and_verify`), Tier 2 Primitives, Resources, and Prompts. |
| **📖 Guides & Tutorials** | End-to-end problem walkthrough from scratch, local folder synchronization, `testlib.h` generator best practices, and the official 11-point Codeforces Audit Checklist. |
| **🌐 Transports & Deployment** | Stdio transport for local agents, Streamable HTTP for team servers, and Dockerized deployment. |
| **❓ Troubleshooting** | Protocol quirks, clock skew handling, Windows UTF-8 fixes, and Codeforces package verification errors. |

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

Choose your agent environment below. Every agent includes setup instructions for **both CLI and IDE**.

---

### 1. Anthropic Claude (CLI & IDE)

#### A. Claude Code (CLI)
Run a single command in your terminal:
```bash
claude mcp add codeforces-polygon \
  -e POLYGON_API_KEY="your_api_key" \
  -e POLYGON_API_SECRET="your_api_secret" \
  -- uvx --from git+https://github.com/mridulChhipa/polygon-mcp.git polygon-mcp
```
*(Or if installed locally in your Python environment via `pip install git+...` or `pip install -e .`, use `-- python -m polygon_mcp.server`)*.

#### B. Claude Desktop & Claude Extension (IDE)
Add to your `claude_desktop_config.json`:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

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

### 2. Cursor (CLI & IDE)

#### A. Cursor CLI & Project Terminal
Create a `.cursor/mcp.json` file in the root directory of your workspace or problem repository:
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
When teammates run `cursor .` or invoke Cursor CLI/terminal agents, the MCP server is discovered and activated automatically.

#### B. Cursor IDE Settings (GUI)
1. Open **Cursor Settings** (`Ctrl + ,` on Windows/Linux, `Cmd + ,` on macOS) -> **Features** -> **MCP**.
2. Click **+ Add New MCP Server**.
3. Fill in:
   - **Name**: `codeforces-polygon`
   - **Type**: `command`
   - **Command**: `uvx --from git+https://github.com/mridulChhipa/polygon-mcp.git polygon-mcp`
   - **Environment Variables**:
     - `POLYGON_API_KEY`: `your_api_key`
     - `POLYGON_API_SECRET`: `your_api_secret`

---

### 3. Google Antigravity (CLI & IDE)

#### A. Antigravity CLI (`agy`)
Register the server via terminal command:
```bash
agy mcp add codeforces-polygon \
  --command "uvx" \
  --args "--from git+https://github.com/mridulChhipa/polygon-mcp.git polygon-mcp" \
  --env POLYGON_API_KEY="your_api_key" \
  --env POLYGON_API_SECRET="your_api_secret"
```

#### B. Antigravity IDE
Add the server entry to your global `~/.gemini/config/mcp_config.json` or project-level `.gemini/mcp.json`:
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

### 4. Windsurf / Codeium Cascade (CLI & IDE)

#### A. Windsurf CLI & Repository Configuration
Create `.windsurf/mcp.json` or `.codeium/mcp.json` in your repository root:
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

#### B. Windsurf IDE UI & Global Configuration
1. Open **Windsurf Settings** (`Ctrl + ,` / `Cmd + ,`) -> **Cascade** -> **MCP Servers**.
2. Or edit `~/.codeium/windsurf/mcp_config.json`:
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

### 5. VS Code & OpenAI Codex / Copilot (CLI & IDE)

#### A. Codex / Terminal Agent / Aider (CLI)
Export Polygon credentials in your terminal session and attach the MCP server to your CLI agent:
```bash
export POLYGON_API_KEY="your_api_key"
export POLYGON_API_SECRET="your_api_secret"

# Example: Run Aider or custom Codex agent with MCP tool pipe
aider --mcp "uvx --from git+https://github.com/mridulChhipa/polygon-mcp.git polygon-mcp"
```

#### B. VS Code / GitHub Copilot Agent Mode / Cline / Roo Code (IDE)
Add to your project's `.vscode/mcp.json` or Cline settings (`cline_mcp_settings.json`):
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
