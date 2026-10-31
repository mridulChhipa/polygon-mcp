export interface DocContentRecord {
  title: string;
  category: string;
  description: string;
  lastUpdated: string;
  toc: { id: string; title: string; level: number }[];
  prevPage?: { title: string; href: string };
  nextPage?: { title: string; href: string };
  sections: {
    id: string;
    title: string;
    level: 2 | 3;
    content: string; // Markdown or rich HTML-like formatted text
  }[];
}

export const docsContentMap: Record<string, DocContentRecord> = {
  'getting-started/overview': {
    title: 'Overview',
    category: 'Getting Started',
    description: 'Introduction to the Codeforces Polygon MCP Server: Architecture, capabilities, and why AI coding agents need it.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'what-is-polygon-mcp', title: 'What is Polygon MCP Server?', level: 2 },
      { id: 'the-problem', title: 'The Problem with Manual Polygon API', level: 2 },
      { id: 'key-features', title: 'Key Features & Capabilities', level: 2 },
      { id: 'architecture-glance', title: 'Architecture at a Glance', level: 2 },
      { id: 'next-steps', title: 'Next Steps', level: 2 },
    ],
    nextPage: { title: 'Quickstart', href: '/docs/getting-started/quickstart' },
    sections: [
      {
        id: 'what-is-polygon-mcp',
        title: 'What is Polygon MCP Server?',
        level: 2,
        content: `
The **Codeforces Polygon Model Context Protocol (MCP) Server** connects AI coding assistants (such as Antigravity, Claude Desktop, Cursor, and Windsurf) directly to [Codeforces Polygon](https://codeforces.com/polygon) — the world's premier platform for preparing competitive programming contests.

By implementing the open Model Context Protocol standard, this server allows any AI coding agent to autonomously **create, test, audit, synchronize, and package** contest problems on Codeforces Polygon with zero human intervention in the repetitive web interface.
        `,
      },
      {
        id: 'the-problem',
        title: 'The Problem with Manual Polygon API',
        level: 2,
        content: `
Historically, automating Codeforces Polygon via its raw REST API has been notoriously error-prone and frustrating for developers and agents:

- **Strict Cryptographic Signatures**: Every request requires SHA-512 signing of all parameters sorted strictly lexicographically by key then value, with nonces and timestamps.
- **Form Data vs. Multipart Quirks**: Passing files requires raw form encoding embedded directly in signature calculations rather than standard HTTP multipart formats.
- **Granular Round Trips**: Preparing a single problem manually requires 60–80 separate API calls (saving limits, statements, validators, solutions, tests, generator scripts, and build triggers). A single failure aborts the pipeline.
- **Silent Verification Failures**: Package building takes 30–90 seconds asynchronously on Polygon's cluster. Without smart polling, agents either timeout or enter infinite polling loops.
        `,
      },
      {
        id: 'key-features',
        title: 'Key Features & Capabilities',
        level: 2,
        content: `
The Polygon MCP Server solves these problems from the ground up:

- **Two-Tier Architecture**:
  - **Tier 1 Composite Workflows**: One-turn actions like \`polygon_create_problem_bundle\` and \`polygon_sync_from_directory\` that bundle 80 discrete API calls into a single reliable execution.
  - **Tier 2 Incremental Primitives**: Fine-grained surgical tools (\`polygon_update_statement\`, \`polygon_upload_solution\`, \`polygon_update_tests\`) to modify existing contest problems.
- **Fail-Fast Local Pre-Flight Engine**:
  - Automatically test-compiles \`validator.cpp\` and \`gen.cpp\` locally using \`g++\` and official \`testlib.h\` before sending network bytes.
  - Lints LaTeX math formulas for missing delimiters and enforces Codeforces image asset constraints (< 50 kB).
- **Zero-Friction Authentication**:
  - Supports automatic discovery of \`POLYGON_API_KEY\` and \`POLYGON_API_SECRET\` from environment or \`.env\`.
  - Supports dynamic per-call credentials for multi-user and multi-agent setups.
        `,
      },
      {
        id: 'architecture-glance',
        title: 'Architecture at a Glance',
        level: 2,
        content: `
\`\`\`
[ AI Agent: Antigravity / Claude / Cursor ]
              │ (JSON-RPC over Stdio / Streamable HTTP)
              ▼
    ┌──────────────────────────────────────────────┐
    │          Polygon MCP Server Layer            │
    ├──────────────────────┬───────────────────────┤
    │  Tier 1 Workflows    │  Tier 2 Primitives    │
    ├──────────────────────┴───────────────────────┤
    │         Local Pre-Flight Engine              │
    │  - g++ testlib.h compiler                    │
    │  - LaTeX linter & <50kB asset validator      │
    ├──────────────────────────────────────────────┤
    │         Domain Services Orchestrator         │
    │  - Problem, Statement, Test, Package, Audit  │
    ├──────────────────────────────────────────────┤
    │          Low-Level Core Client               │
    │  - SHA-512 cryptographic signing             │
    │  - Rate-limit retry & exponential backoff    │
    └──────────────────────┬───────────────────────┘
                           │ (Signed HTTPS POST)
                           ▼
             [ Codeforces Polygon API ]
\`\`\`
        `,
      },
      {
        id: 'next-steps',
        title: 'Next Steps',
        level: 2,
        content: `
Ready to get started? Jump straight to the [5-Minute Quickstart](/docs/getting-started/quickstart) or review the [Installation Guide](/docs/getting-started/installation).
        `,
      },
    ],
  },

  'getting-started/quickstart': {
    title: 'Quickstart (5 Minutes)',
    category: 'Getting Started',
    description: 'Get your Polygon MCP server running and audit an existing problem in under 5 minutes.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'step-1-install', title: 'Step 1: Install the Package', level: 2 },
      { id: 'step-2-keys', title: 'Step 2: Obtain Polygon API Credentials', level: 2 },
      { id: 'step-3-register', title: 'Step 3: Register in MCP Config', level: 2 },
      { id: 'step-4-test', title: 'Step 4: Verify with an Agent', level: 2 },
    ],
    prevPage: { title: 'Overview', href: '/docs/getting-started/overview' },
    nextPage: { title: 'Installation', href: '/docs/getting-started/installation' },
    sections: [
      {
        id: 'step-1-install',
        title: 'Step 1: Install the Package',
        level: 2,
        content: `
Clone the repository and install the server in editable mode inside your Python 3.10+ virtual environment:

\`\`\`bash
git clone https://github.com/mridulChhipa/polygon-mcp.git
cd polygon-mcp
pip install -e .
\`\`\`

Verify that the CLI command works:
\`\`\`bash
python -m polygon_mcp.server --help
\`\`\`
        `,
      },
      {
        id: 'step-2-keys',
        title: 'Step 2: Obtain Polygon API Credentials',
        level: 2,
        content: `
1. Log in to [Codeforces Polygon](https://codeforces.com/polygon).
2. Click **Settings** in the top navigation bar.
3. Scroll down to **API Keys** and generate a new key pair.
4. Note your **Key** (e.g. \`abc123...\`) and **Secret** (e.g. \`def456...\`).

Create a \`.env\` file in your workspace:
\`\`\`env
POLYGON_API_KEY=your_polygon_api_key_here
POLYGON_API_SECRET=your_polygon_api_secret_here
\`\`\`
        `,
      },
      {
        id: 'step-3-register',
        title: 'Step 3: Register in MCP Config',
        level: 2,
        content: `
Add the server entry to your client's \`mcp_config.json\` (e.g. \`~/.gemini/config/mcp_config.json\` or Claude Desktop \`claude_desktop_config.json\`):

\`\`\`json
{
  "mcpServers": {
    "codeforces-polygon": {
      "command": "python",
      "args": ["-m", "polygon_mcp.server", "--transport", "stdio"],
      "env": {
        "PYTHONIOENCODING": "utf-8",
        "POLYGON_API_KEY": "your_api_key_here",
        "POLYGON_API_SECRET": "your_api_secret_here"
      }
    }
  }
}
\`\`\`
        `,
      },
      {
        id: 'step-4-test',
        title: 'Step 4: Verify with an Agent',
        level: 2,
        content: `
Open your AI coding assistant and ask:

> *"Please audit my Polygon problem 612894 and check if it is contest-ready."*

The agent will invoke \`polygon_check_audit(612894)\` and return an instant 11-point report:

\`\`\`json
{
  "problem_id": 612894,
  "problem_name": "retro-keypad-phone",
  "passed_checks": [
    "Time limit configured (1000 ms)",
    "English legend present",
    "Main Accepted (MA) solution present",
    "Found 3 sample test(s)",
    "Latest package #1529830 built successfully (READY)"
  ],
  "is_ready_for_contest": true
}
\`\`\`
        `,
      },
    ],
  },

  'getting-started/installation': {
    title: 'Installation & Distribution',
    category: 'Getting Started',
    description: 'Detailed instructions for installing Polygon MCP server via GitHub repository (uvx, pip, or local clone).',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'system-prerequisites', title: 'System Prerequisites', level: 2 },
      { id: 'installation-options', title: 'Installation & Run Options', level: 2 },
      { id: 'gpp-testlib', title: 'Setting up g++ and testlib.h', level: 2 },
      { id: 'verification', title: 'Verifying the Installation', level: 2 },
    ],
    prevPage: { title: 'Quickstart', href: '/docs/getting-started/quickstart' },
    nextPage: { title: 'Configuration & Auth', href: '/docs/getting-started/configuration' },
    sections: [
      {
        id: 'system-prerequisites',
        title: 'System Prerequisites',
        level: 2,
        content: `
Before running the Polygon MCP server, ensure your host system satisfies these requirements:

- **Python**: Version 3.10 or higher.
- **C++ Compiler**: \`g++\` (GCC 11+ or Clang 14+) accessible on the system \`PATH\`.
- **uv** (Recommended): Provides \`uvx\` for zero-install, on-demand execution.
        `,
      },
      {
        id: 'installation-options',
        title: 'Installation & Run Options',
        level: 2,
        content: `
Choose the method that best matches your setup:

### Option 1: Zero-Install with uvx (Recommended)
With Astral's \`uv\` installed, your AI agents can run the server directly from GitHub without managing virtual environments:

\`\`\`bash
uvx --from git+https://github.com/mridulChhipa/polygon-mcp.git polygon-mcp
\`\`\`

### Option 2: Pip Install directly from GitHub
\`\`\`bash
pip install git+https://github.com/mridulChhipa/polygon-mcp.git
\`\`\`

### Option 3: Local Clone & Editable Mode
For developing, debugging, or modifying the server locally:
\`\`\`bash
git clone https://github.com/mridulChhipa/polygon-mcp.git
cd polygon-mcp
pip install -e .
\`\`\`
        `,
      },
      {
        id: 'gpp-testlib',
        title: 'Setting up g++ and testlib.h',
        level: 2,
        content: `
The server includes the official \`testlib.h\` inside \`polygon_mcp/resources/testlib.h\`. When you upload or modify C++ validators or test generators, the server automatically compiles them locally with:

\`\`\`bash
g++ -O2 -std=c++17 -I<resources_path> validator.cpp -o validator.exe
\`\`\`

Verify your local \`g++\` installation:
\`\`\`bash
g++ --version
\`\`\`
If \`g++\` is missing on Windows, install MSYS2 or MinGW-w64. On Ubuntu/Debian:
\`\`\`bash
sudo apt-get update && sudo apt-get install -y build-essential
\`\`\`
        `,
      },
      {
        id: 'verification',
        title: 'Verifying the Installation',
        level: 2,
        content: `
Run the included test suite to verify cryptographic signing and pre-flight compilation:

\`\`\`bash
python -m unittest discover -s tests -v
\`\`\`

All tests should pass with \`OK\`.
        `,
      },
    ],
  },

  'getting-started/configuration': {
    title: 'Configuration & Authentication',
    category: 'Getting Started',
    description: 'Configuring API keys, environment variables, and per-call credentials for multi-tenant setups.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'credential-resolution', title: 'Credential Resolution Hierarchy', level: 2 },
      { id: 'env-variables', title: 'Environment Variables', level: 2 },
      { id: 'mcp-config-json', title: 'mcp_config.json Schema', level: 2 },
      { id: 'dynamic-auth', title: 'Dynamic Per-Call Authentication', level: 2 },
    ],
    prevPage: { title: 'Installation', href: '/docs/getting-started/installation' },
    nextPage: { title: 'Client Integration', href: '/docs/getting-started/client-setup' },
    sections: [
      {
        id: 'credential-resolution',
        title: 'Credential Resolution Hierarchy',
        level: 2,
        content: `
Polygon MCP uses a 3-tier hierarchy to resolve authentication credentials:

1. **Explicit Tool Arguments**: If the agent passes \`api_key\` and \`api_secret\` to a tool, those take highest precedence.
2. **Process Environment**: Environment variables set on the MCP server process (\`POLYGON_API_KEY\`, \`POLYGON_API_SECRET\`).
3. **\`.env\` File Auto-Discovery**: The server automatically searches the current working directory and parent directories for a \`.env\` file.
        `,
      },
      {
        id: 'env-variables',
        title: 'Environment Variables',
        level: 2,
        content: `
| Variable | Description | Default |
|---|---|---|
| \`POLYGON_API_KEY\` | Codeforces Polygon API Key (or \`POLYGON_KEY\`) | *Required* |
| \`POLYGON_API_SECRET\` | Codeforces Polygon API Secret (or \`POLYGON_SECRET\`) | *Required* |
| \`POLYGON_BASE_URL\` | Polygon API Endpoint | \`https://polygon.codeforces.com/api/\` |
| \`PYTHONIOENCODING\` | Set to \`utf-8\` to prevent Windows encoding bugs | \`utf-8\` |
        `,
      },
      {
        id: 'mcp-config-json',
        title: 'mcp_config.json Schema',
        level: 2,
        content: `
\`\`\`json
{
  "mcpServers": {
    "codeforces-polygon": {
      "command": "/path/to/python",
      "args": ["-m", "polygon_mcp.server", "--transport", "stdio"],
      "env": {
        "PYTHONIOENCODING": "utf-8",
        "POLYGON_API_KEY": "\${POLYGON_API_KEY}",
        "POLYGON_API_SECRET": "\${POLYGON_API_SECRET}"
      }
    }
  }
}
\`\`\`
        `,
      },
      {
        id: 'dynamic-auth',
        title: 'Dynamic Per-Call Authentication',
        level: 2,
        content: `
In multi-tenant environments (e.g. contest preparation teams where problem setters use distinct Polygon accounts), you do not need to restart the MCP server.

Agents can pass \`api_key\` and \`api_secret\` directly to any tool:

\`\`\`python
await polygon_list_problems(
    api_key="author_alice_key",
    api_secret="author_alice_secret"
)
\`\`\`
        `,
      },
    ],
  },

  'getting-started/client-setup': {
    title: 'Client Integration',
    category: 'Getting Started',
    description: 'Step-by-step instructions for connecting Anthropic Claude, Cursor, Google Antigravity, Windsurf, and VS Code / OpenAI Codex across both CLI and IDE interfaces.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'claude-setup', title: 'Anthropic Claude (CLI & IDE)', level: 2 },
      { id: 'cursor-setup', title: 'Cursor (CLI & IDE)', level: 2 },
      { id: 'antigravity-setup', title: 'Google Antigravity (CLI & IDE)', level: 2 },
      { id: 'windsurf-setup', title: 'Windsurf / Codeium Cascade (CLI & IDE)', level: 2 },
      { id: 'copilot-codex-setup', title: 'VS Code & OpenAI Codex (CLI & IDE)', level: 2 },
    ],
    prevPage: { title: 'Configuration & Auth', href: '/docs/getting-started/configuration' },
    nextPage: { title: 'Two-Tier Tool Design', href: '/docs/architecture/two-tier-design' },
    sections: [
      {
        id: 'claude-setup',
        title: 'Anthropic Claude (CLI & IDE)',
        level: 2,
        content: `
### Option A: Claude Code (CLI)
Run a single command in your terminal to register the server:

\`\`\`bash
claude mcp add codeforces-polygon \\
  -e POLYGON_API_KEY="your_api_key" \\
  -e POLYGON_API_SECRET="your_api_secret" \\
  -- uvx --from git+https://github.com/mridulChhipa/polygon-mcp.git polygon-mcp
\`\`\`

*(Or if installed locally in your Python environment via \`pip install -e .\`, use \`-- python -m polygon_mcp.server\`)*.

### Option B: Claude Desktop & Claude Extension (IDE)
Add to your \`claude_desktop_config.json\`:
- **macOS**: \`~/Library/Application Support/Claude/claude_desktop_config.json\`
- **Windows**: \`%APPDATA%\\Claude\\claude_desktop_config.json\`
- **Linux**: \`~/.config/Claude/claude_desktop_config.json\`

\`\`\`json
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
\`\`\`
        `,
      },
      {
        id: 'cursor-setup',
        title: 'Cursor (CLI & IDE)',
        level: 2,
        content: `
### Option A: Cursor CLI & Project Terminal
Create a \`.cursor/mcp.json\` file in the root directory of your workspace or problem repository:

\`\`\`json
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
\`\`\`

When teammates launch \`cursor .\` or run Cursor terminal agents, the Polygon MCP server is automatically loaded for the entire workspace.

### Option B: Cursor Settings UI (IDE)
1. Open **Cursor Settings** (\`Ctrl + ,\` on Windows/Linux, \`Cmd + ,\` on macOS) -> **Features** -> **MCP**.
2. Click **+ Add New MCP Server**.
3. Fill in:
   - **Name**: \`codeforces-polygon\`
   - **Type**: \`command\`
   - **Command**: \`uvx --from git+https://github.com/mridulChhipa/polygon-mcp.git polygon-mcp\`
   - **Environment Variables**:
     - \`POLYGON_API_KEY\`: \`your_key\`
     - \`POLYGON_API_SECRET\`: \`your_secret\`
        `,
      },
      {
        id: 'antigravity-setup',
        title: 'Google Antigravity (CLI & IDE)',
        level: 2,
        content: `
### Option A: Antigravity CLI (\`agy\`)
Register the server directly via command line:

\`\`\`bash
agy mcp add codeforces-polygon \\
  --command "uvx" \\
  --args "--from git+https://github.com/mridulChhipa/polygon-mcp.git polygon-mcp" \\
  --env POLYGON_API_KEY="your_api_key" \\
  --env POLYGON_API_SECRET="your_api_secret"
\`\`\`

### Option B: Antigravity IDE
Add the server entry to your global \`~/.gemini/config/mcp_config.json\` or project-level \`.gemini/mcp.json\`:

\`\`\`json
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
\`\`\`
*(Or point \`"command"\` to \`"python"\` with \`"args": ["-m", "polygon_mcp.server"]\` if running from a local clone)*.
        `,
      },
      {
        id: 'windsurf-setup',
        title: 'Windsurf / Codeium Cascade (CLI & IDE)',
        level: 2,
        content: `
### Option A: Windsurf CLI & Repository Configuration
Create \`.windsurf/mcp.json\` or \`.codeium/mcp.json\` in your repository root:

\`\`\`json
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
\`\`\`

### Option B: Windsurf IDE UI & Global Configuration
1. Open **Windsurf Settings** (\`Ctrl + ,\` or \`Cmd + ,\`) -> **Cascade** -> **MCP Servers** -> **Add New Server**.
2. Or edit global config \`~/.codeium/windsurf/mcp_config.json\`:

\`\`\`json
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
\`\`\`
        `,
      },
      {
        id: 'copilot-codex-setup',
        title: 'VS Code & OpenAI Codex (CLI & IDE)',
        level: 2,
        content: `
### Option A: Codex / Terminal Agents / Aider (CLI)
Export Polygon credentials in your terminal session and attach the MCP server to your CLI agent:

\`\`\`bash
export POLYGON_API_KEY="your_api_key"
export POLYGON_API_SECRET="your_api_secret"

# Run Aider or custom Codex agent with MCP tool pipe
aider --mcp "uvx --from git+https://github.com/mridulChhipa/polygon-mcp.git polygon-mcp"
\`\`\`

### Option B: VS Code / GitHub Copilot Agent Mode / Cline (IDE)
Add to your project's \`.vscode/mcp.json\` or Cline / Roo Code settings (\`cline_mcp_settings.json\`):

\`\`\`json
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
\`\`\`
        `,
      },
    ],
  },

  'architecture/two-tier-design': {
    title: 'Two-Tier Tool Architecture',
    category: 'Core Architecture',
    description: 'How composite workflows and granular primitives drastically reduce agent turn counts and eliminate context bloat.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'why-two-tiers', title: 'Why a Two-Tier Architecture?', level: 2 },
      { id: 'tier-1-workflows', title: 'Tier 1: Composite Workflows', level: 2 },
      { id: 'tier-2-primitives', title: 'Tier 2: Targeted Primitives', level: 2 },
      { id: 'comparison-table', title: 'Turn Count Benchmark', level: 2 },
    ],
    prevPage: { title: 'Client Integration', href: '/docs/getting-started/client-setup' },
    nextPage: { title: 'Protocol & Signing', href: '/docs/architecture/protocol-and-auth' },
    sections: [
      {
        id: 'why-two-tiers',
        title: 'Why a Two-Tier Architecture?',
        level: 2,
        content: `
Standard REST APIs mirror low-level database operations. If an AI agent has to create a problem from scratch using raw primitives, it must navigate:
1. \`problems.create\`
2. \`problem.updateInfo\`
3. \`problem.saveStatement\`
4. \`problem.saveStatementResource\`
5. \`problem.saveFile\` (validator)
6. \`problem.setValidator\`
7. \`problem.setChecker\`
8. \`problem.saveSolution\` (MA)
9. \`problem.saveSolution\` (TL)
10. \`problem.saveTest\` (samples)
11. \`problem.saveTest\` (manual)
12. \`problem.saveFile\` (gen)
13. \`problem.saveScript\`
14. \`problem.commitChanges\`
15. \`problem.buildPackage\`
16. Polling loop (10-20 turns)

This takes **40 to 80 agent turns**, consumes ~150,000 tokens, and risks network timeouts at each step.
        `,
      },
      {
        id: 'tier-1-workflows',
        title: 'Tier 1: Composite Workflows',
        level: 2,
        content: `
Tier 1 tools condense entire workflows into **a single prompt-and-response turn**:

- \`polygon_create_problem_bundle\`: Accepts statement, solutions, generator, validator, and tests in one call. The server sequences the Polygon API calls atomically.
- \`polygon_sync_from_directory\`: Inspects a local folder and synchronizes all files to Polygon.
- \`polygon_build_and_verify\`: Commits changes and polls Polygon's build queue until the package reaches \`READY\` or \`FAILED\`.
        `,
      },
      {
        id: 'tier-2-primitives',
        title: 'Tier 2: Targeted Primitives',
        level: 2,
        content: `
Once a problem exists, authors need to fix typos, tweak bounds, or add corner-case tests. Tier 2 provides surgical, non-destructive tools:

- \`polygon_update_statement\`: Updates legend, input, notes, or adds graphics without overwriting other sections.
- \`polygon_upload_solution\`: Adds or updates a solution with tags (\`MA\`, \`OK\`, \`TL\`, \`WA\`).
- \`polygon_update_validator\`: Updates \`validator.cpp\` with local compilation verification.
- \`polygon_check_audit\`: Runs 11 Codeforces checklist verifications.
        `,
      },
      {
        id: 'comparison-table',
        title: 'Turn Count Benchmark',
        level: 2,
        content: `
| Metric | Raw REST API | Polygon MCP Server |
|---|---|---|
| Creation Turns | 40 – 80 turns | **1 turn** |
| Directory Sync | 20 – 30 turns | **1 turn** |
| Package Build | 10 – 15 polling turns | **1 turn (async wait)** |
| Token Overhead | ~150,000 tokens | **~8,000 tokens** |
| Chance of Signature Failure | High | **Zero (Encapsulated)** |
        `,
      },
    ],
  },

  'architecture/protocol-and-auth': {
    title: 'Protocol & Signing Mechanics',
    category: 'Core Architecture',
    description: 'Cryptographic SHA-512 signing, lexicographical sorting rules, and form-data payload normalization.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'signature-formula', title: 'Polygon Signature Formula', level: 2 },
      { id: 'sorting-rules', title: 'Lexicographical Sorting Rules', level: 2 },
      { id: 'form-payload-quirk', title: 'The Form Payload Quirk', level: 2 },
      { id: 'retry-strategy', title: 'Resilience & Retry Strategy', level: 2 },
    ],
    prevPage: { title: 'Two-Tier Tool Design', href: '/docs/architecture/two-tier-design' },
    nextPage: { title: 'Preflight Engine', href: '/docs/architecture/preflight-engine' },
    sections: [
      {
        id: 'signature-formula',
        title: 'Polygon Signature Formula',
        level: 2,
        content: `
Every authenticated Polygon request requires:
1. \`apiKey\`: Your Polygon API key.
2. \`time\`: Current Unix timestamp in seconds.
3. \`apiSig\`: A 6-character random alphanumeric nonce (\`rand\`) followed by the SHA-512 hex digest:

\`\`\`
apiSig = rand + sha512(rand + "/" + methodName + "?" + sortedParams + "#" + apiSecret)
\`\`\`

Note: \`apiKey\` and \`time\` are included inside \`sortedParams\`, while \`apiSig\` itself is excluded from the hash string.
        `,
      },
      {
        id: 'sorting-rules',
        title: 'Lexicographical Sorting Rules',
        level: 2,
        content: `
Parameters must be sorted strictly:
1. By parameter name in ascending ASCII order.
2. If parameter names match, by parameter value in ascending ASCII order.
3. Booleans must be serialized as lowercase strings (\`"true"\` or \`"false"\`).
        `,
      },
      {
        id: 'form-payload-quirk',
        title: 'The Form Payload Quirk',
        level: 2,
        content: `
In standard REST APIs, file uploads use HTTP \`multipart/form-data\`. However, in Codeforces Polygon:

> Passing files via \`multipart/form-data\` fails with \`apiKey: Incorrect signature\`.

Polygon's backend expects file contents (source code, image bytes, scripts) to be passed as standard form-encoded parameters in \`data\` and included directly in the SHA-512 signature computation.

Our \`PolygonAuth\` engine normalizes text and byte payloads directly into POST dictionaries, completely eliminating signature mismatch bugs.
        `,
      },
      {
        id: 'retry-strategy',
        title: 'Resilience & Retry Strategy',
        level: 2,
        content: `
Polygon's web servers intermittently return HTTP 502/504 Bad Gateway or 429 Rate Limit during heavy contest preparation windows.

The MCP client includes automated exponential backoff:
- Catches 502, 503, 504, 429, and connection timeouts.
- Backs off with jitter: \`1.5 * attempt\` seconds.
- Automatically generates fresh timestamps and nonces on every retry.
        `,
      },
    ],
  },

  'architecture/preflight-engine': {
    title: 'Preflight Verification Engine',
    category: 'Core Architecture',
    description: 'Local g++ testlib.h compilation, LaTeX syntax auditing, and asset size boundary enforcement.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'why-preflight', title: 'Why Preflight Checks?', level: 2 },
      { id: 'cpp-compiler', title: 'C++ & testlib.h Compiler', level: 2 },
      { id: 'statement-linter', title: 'LaTeX & Asset Linter', level: 2 },
    ],
    prevPage: { title: 'Protocol & Signing', href: '/docs/architecture/protocol-and-auth' },
    nextPage: { title: 'Working Copy & Package Lifecycle', href: '/docs/architecture/working-copy-lifecycle' },
    sections: [
      {
        id: 'why-preflight',
        title: 'Why Preflight Checks?',
        level: 2,
        content: `
When an author uploads broken code to Polygon:
1. Network roundtrips take 1–3 seconds.
2. Polygon queues the file for compilation on its background workers.
3. The build fails 60 seconds later with vague compiler error comments.

The **Preflight Engine** compiles and tests files locally on your machine in **150 milliseconds**. If there is an error, it fails immediately before making any network calls.
        `,
      },
      {
        id: 'cpp-compiler',
        title: 'C++ & testlib.h Compiler',
        level: 2,
        content: `
The \`CppPreflightCompiler\` class:
- Locates \`g++\` on the system PATH.
- Mounts bundled official \`testlib.h\` into the include search path (\`-I\`).
- Compiles with \`-O2 -std=c++17 -Wall -Wextra\`.
- **Runs Validation Tests**: When testing a validator, it feeds valid inputs (expecting return code 0) and invalid inputs (expecting non-zero exit code).
        `,
      },
      {
        id: 'statement-linter',
        title: 'LaTeX & Asset Linter',
        level: 2,
        content: `
The \`StatementPreflightLinter\` checks:
- **Dollar Delimiter Balance**: Catches unclosed \`$\` formulas before LaTeX compilation fails.
- **ASCII Shortcuts**: Warns if raw \`<=\`, \`>=\`, or \`...\` are used inside math formulas instead of \`\\le\`, \`\\ge\`, and \`\\dots\`.
- **Image Size Limit**: Enforces the hard Codeforces limit: images must not exceed **50 kB**.
        `,
      },
    ],
  },

  'architecture/working-copy-lifecycle': {
    title: 'Working Copy & Package Lifecycle',
    category: 'Core Architecture',
    description: 'Understanding Polygon working copies, revision commits, and asynchronous verification package builds.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'working-copy-concept', title: 'The Working Copy Concept', level: 2 },
      { id: 'committing-changes', title: 'Committing Revisions', level: 2 },
      { id: 'async-package-builds', title: 'Verified Package Builds & Polling', level: 2 },
    ],
    prevPage: { title: 'Preflight Engine', href: '/docs/architecture/preflight-engine' },
    nextPage: { title: 'Workflow Tools (Tier 1)', href: '/docs/tools/workflows' },
    sections: [
      {
        id: 'working-copy-concept',
        title: 'The Working Copy Concept',
        level: 2,
        content: `
On Polygon, every problem has:
- **Committed Revisions**: Frozen, immutable snapshots of the problem at a given revision number.
- **Working Copy**: An active staging area containing uncommitted edits (statements, tests, solutions).

When you make changes via the API, Polygon marks the problem as \`modified: true\`.
        `,
      },
      {
        id: 'committing-changes',
        title: 'Committing Revisions',
        level: 2,
        content: `
To freeze changes and generate a new revision:
\`\`\`python
await PackageService.commit_changes(client, problem_id, "Updated constraints")
\`\`\`
If there are no pending changes, the server catches Polygon's \`Working copy has no changes\` response gracefully without raising an exception.
        `,
      },
      {
        id: 'async-package-builds',
        title: 'Verified Package Builds & Polling',
        level: 2,
        content: `
A **Full Verified Package Build** runs:
1. Validator against all testcases.
2. Generator scripts to produce test files.
3. Main Accepted solution against all tests.
4. Time limit (TL) and Wrong Answer (WA) solutions to confirm expected failures.
5. Checker against all outputs.

The \`polygon_build_and_verify\` tool encapsulates the wait loop:
- Polls \`problem.packages\` every 4 seconds.
- Returns when state is \`READY\` or \`FAILED\`.
- Displays any validator or compiler warnings directly in the report.
        `,
      },
    ],
  },

  'tools/workflows': {
    title: 'Workflow Tools (Tier 1)',
    category: 'MCP Tools Reference',
    description: 'High-level composite tools that execute entire multi-step problem preparation pipelines in one turn.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'create-problem-bundle', title: 'polygon_create_problem_bundle', level: 2 },
      { id: 'sync-from-directory', title: 'polygon_sync_from_directory', level: 2 },
      { id: 'build-and-verify', title: 'polygon_build_and_verify', level: 2 },
    ],
    prevPage: { title: 'Working Copy Lifecycle', href: '/docs/architecture/working-copy-lifecycle' },
    nextPage: { title: 'Primitive Tools (Tier 2)', href: '/docs/tools/primitives' },
    sections: [
      {
        id: 'create-problem-bundle',
        title: 'polygon_create_problem_bundle',
        level: 2,
        content: `
Creates an entire contest problem on Polygon in a single turn.

### Parameters
- \`name\` (string, required): Problem short name (e.g. \`retro-keypad-phone\`).
- \`time_limit_ms\` (int, default: 1000): Time limit in milliseconds.
- \`memory_limit_mb\` (int, default: 256): Memory limit in megabytes.
- \`legend\` (string): Problem statement text (supports LaTeX).
- \`input_format\` (string): Input format section.
- \`output_format\` (string): Output format section.
- \`notes\` (string): Explanation notes for sample testcases.
- \`tutorial\` (string): Editorial / tutorial text.
- \`validator_code\` (string): C++ validator source code.
- \`checker_name\` (string, default: \`std::ncmp.cpp\`): Standard or custom checker.
- \`main_solution_name\` (string, default: \`solution.cpp\`): Name of MA solution.
- \`main_solution_code\` (string): Source code of Main Accepted solution.
- \`other_solutions\` (list of dicts): Secondary solutions with tags (\`OK\`, \`TL\`, \`WA\`).
- \`sample_tests\` (list of strings): Sample test inputs (marked \`useInStatements=true\`).
- \`manual_tests\` (list of strings): Additional manual test inputs.
- \`generator_name\` (string): Generator source filename (e.g. \`gen.cpp\`).
- \`generator_code\` (string): C++ generator source code.
- \`script_content\` (string): Test generator script (e.g. \`gen 10 20 > $\`).
- \`image_filename\` (string): Name of statement resource image (e.g. \`diagram.png\`).
- \`image_path\` (string): Local path to image (< 50 kB).
- \`build_package\` (bool, default: true): Whether to commit and build verified package.

### Return Shape
\`\`\`json
{
  "status": "SUCCESS",
  "problem_id": 612894,
  "problem_name": "retro-keypad-phone",
  "polygon_url": "https://polygon.codeforces.com/p/612894",
  "package_id": 1529830,
  "package_state": "READY",
  "steps": [...]
}
\`\`\`
        `,
      },
      {
        id: 'sync-from-directory',
        title: 'polygon_sync_from_directory',
        level: 2,
        content: `
Scans a local directory containing problem files and mirrors everything to Polygon.

### Parameters
- \`directory_path\` (string, required): Path to problem folder.
- \`problem_name\` (string, optional): Overrides directory name.
- \`problem_id\` (int, optional): Syncs into existing problem ID if specified.
- \`build_package\` (bool, default: true): Builds verified package after sync.

### Recognized Files in Directory
- \`validator.cpp\` -> Uploaded & activated as active validator.
- \`gen.cpp\` or \`generator.cpp\` -> Uploaded as source file.
- \`script.txt\` -> Set as test generator script.
- \`solution.cpp\` -> Main Accepted (\`MA\`) solution.
- \`sol_*.cpp\` or \`*.py\` -> Uploaded with appropriate tags.
- \`*.png\` / \`*.jpg\` -> Statement resource images (< 50 kB).
        `,
      },
      {
        id: 'build-and-verify',
        title: 'polygon_build_and_verify',
        level: 2,
        content: `
Commits changes and initiates a full verified package build, polling until complete.

### Parameters
- \`problem_id\` (int, required): Problem ID.
- \`commit_message\` (string, default: \`"Verified build from MCP"\`): Revision message.
- \`timeout_seconds\` (int, default: 240): Maximum wait time.
        `,
      },
    ],
  },

  'tools/primitives': {
    title: 'Primitive Tools (Tier 2)',
    category: 'MCP Tools Reference',
    description: 'Targeted tools for granular inspection, statement updates, solution uploads, and contest audits.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'polygon-list-problems', title: 'polygon_list_problems', level: 2 },
      { id: 'polygon-get-problem', title: 'polygon_get_problem', level: 2 },
      { id: 'polygon-update-statement', title: 'polygon_update_statement', level: 2 },
      { id: 'polygon-upload-solution', title: 'polygon_upload_solution', level: 2 },
      { id: 'polygon-update-validator', title: 'polygon_update_validator', level: 2 },
      { id: 'polygon-update-tests', title: 'polygon_update_tests', level: 2 },
      { id: 'polygon-check-audit', title: 'polygon_check_audit', level: 2 },
    ],
    prevPage: { title: 'Workflow Tools (Tier 1)', href: '/docs/tools/workflows' },
    nextPage: { title: 'Resources & Prompts', href: '/docs/tools/resources-and-prompts' },
    sections: [
      {
        id: 'polygon-list-problems',
        title: 'polygon_list_problems',
        level: 2,
        content: `
Lists all accessible problems on the user's Polygon account.
- **Parameters**: \`name_filter\` (string, optional).
- **Returns**: Array of problem info objects (\`id\`, \`name\`, \`owner\`, \`accessType\`, \`modified\`, \`latestPackage\`).
        `,
      },
      {
        id: 'polygon-get-problem',
        title: 'polygon_get_problem',
        level: 2,
        content: `
Fetches comprehensive overview of an existing problem.
- **Parameters**: \`problem_id\` (int, required).
- **Returns**: Limits, full statement text, list of solutions with tags, test count, and recent package statuses.
        `,
      },
      {
        id: 'polygon-update-statement',
        title: 'polygon_update_statement',
        level: 2,
        content: `
Non-destructive update of statement sections or embedded graphics. Any section left \`None\` retains its existing text.
- **Parameters**: \`problem_id\`, \`legend\`, \`input_format\`, \`output_format\`, \`notes\`, \`tutorial\`, \`image_filename\`, \`image_path\`.
        `,
      },
      {
        id: 'polygon-upload-solution',
        title: 'polygon_upload_solution',
        level: 2,
        content: `
Uploads or updates a solution file with a specific verdict tag.
- **Tags**: \`MA\` (Main Accepted), \`OK\` (Accepted), \`TL\` (Time Limit), \`WA\` (Wrong Answer), \`ML\` (Memory Limit), \`RE\` (Runtime Error).
        `,
      },
      {
        id: 'polygon-update-validator',
        title: 'polygon_update_validator',
        level: 2,
        content: `
Compiles validator locally with \`testlib.h\`, tests against sample inputs, uploads, and sets it as the active validator.
        `,
      },
      {
        id: 'polygon-update-tests',
        title: 'polygon_update_tests',
        level: 2,
        content: `
Modifies an individual testcase or updates the generator script.
- **Parameters**: \`problem_id\`, \`test_index\`, \`input_data\`, \`description\`, \`use_in_statements\`, \`script_content\`.
        `,
      },
      {
        id: 'polygon-check-audit',
        title: 'polygon_check_audit',
        level: 2,
        content: `
Audits an existing problem against official Codeforces Round guidelines:
- Checks limits (TL ≥ 1000 ms, ML ≥ 64 MB).
- Validates statement sections (legend, I/O format, sample notes, tutorial).
- Checks solution coverage (\`MA\` present, plus boundary \`TL\` or \`WA\` solutions).
- Checks sample test count and total test volume (≥ 10).
- Validates that the latest package is built and in \`READY\` status.
        `,
      },
    ],
  },

  'tools/resources-and-prompts': {
    title: 'MCP Resources & Prompts',
    category: 'MCP Tools Reference',
    description: 'Read-only context providers and prompt templates exposed by the server.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'rules-resource', title: 'polygon://rules/codeforces', level: 2 },
      { id: 'problems-resource', title: 'polygon://problems', level: 2 },
      { id: 'prompts', title: 'MCP Prompts', level: 2 },
    ],
    prevPage: { title: 'Primitive Tools (Tier 2)', href: '/docs/tools/primitives' },
    nextPage: { title: 'End-to-End Walkthrough', href: '/docs/guides/full-walkthrough' },
    sections: [
      {
        id: 'rules-resource',
        title: 'polygon://rules/codeforces',
        level: 2,
        content: `
Exposes the complete Codeforces Round preparation rules and quality checklist directly as context to the AI model. Contains guidelines on constraints, LaTeX math syntax, testlib methods, and tutorial quality.
        `,
      },
      {
        id: 'problems-resource',
        title: 'polygon://problems',
        level: 2,
        content: `
Dynamic JSON resource providing a real-time list of all problems accessible on the user's account.
        `,
      },
      {
        id: 'prompts',
        title: 'MCP Prompts',
        level: 2,
        content: `
- **\`polygon_problem_checklist\`**: Generates a standard prompt template ensuring the agent strictly follows Codeforces conventions when implementing a new problem.
        `,
      },
    ],
  },

  'guides/full-walkthrough': {
    title: 'End-to-End Problem Preparation Walkthrough',
    category: 'Guides & Tutorials',
    description: 'A comprehensive real-world walkthrough preparing "Retro Keypad Phone" from scratch to a verified package.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'problem-spec', title: '1. Problem Specification', level: 2 },
      { id: 'writing-validator', title: '2. Writing the testlib Validator', level: 2 },
      { id: 'writing-solutions', title: '3. Main Solution & Stress-Testing', level: 2 },
      { id: 'generating-tests', title: '4. Generator Script & Edge Cases', level: 2 },
      { id: 'executing-bundle', title: '5. Executing polygon_create_problem_bundle', level: 2 },
      { id: 'verifying-package', title: '6. Verified Package Confirmation', level: 2 },
    ],
    prevPage: { title: 'Resources & Prompts', href: '/docs/tools/resources-and-prompts' },
    nextPage: { title: 'Directory Sync Guide', href: '/docs/guides/directory-sync' },
    sections: [
      {
        id: 'problem-spec',
        title: '1. Problem Specification',
        level: 2,
        content: `
In this walkthrough, we prepare the contest problem **"Retro Keypad Phone"** (Problem ID: 612894):
- Given N buttons with assigned distinct letters and a target string T of length M.
- Each button cycle costs 1 press, and switching buttons costs 1 press.
- Find the minimum button presses to type T, or output \`-1\` if impossible.
- Constraints: 1 ≤ N ≤ 100, 1 ≤ M ≤ 5000.
        `,
      },
      {
        id: 'writing-validator',
        title: '2. Writing the testlib Validator',
        level: 2,
        content: `
The validator ensures every testcase strictly adheres to bounds using \`testlib.h\`:

\`\`\`cpp
#include "testlib.h"
#include <vector>
#include <string>

int main(int argc, char* argv[]) {
    registerValidation(argc, argv);
    int n = inf.readInt(1, 100, "N");
    inf.readSpace();
    int m = inf.readInt(1, 5000, "M");
    inf.readEoln();

    for (int i = 0; i < n; i++) {
        std::string s = inf.readToken("[a-z]+", "button_letters");
        inf.readEoln();
    }

    std::string t = inf.readToken("[a-z]+", "target_string");
    ensuref((int)t.length() == m, "Target string length must be M");
    inf.readEoln();
    inf.readEof();
    return 0;
}
\`\`\`
        `,
      },
      {
        id: 'writing-solutions',
        title: '3. Main Solution & Stress-Testing',
        level: 2,
        content: `
We prepare three solutions:
1. **\`solution.cpp\` (Main Accepted, \`MA\`)**: O(M · N) Dynamic Programming with min1/min2 optimization.
2. **\`sol_python.py\` (Accepted, \`OK\`)**: Python 3 implementation.
3. **\`bruteforce.cpp\` (Time Limit Exceeded, \`TL\`)**: BFS state search that times out on M > 100.
        `,
      },
      {
        id: 'generating-tests',
        title: '4. Generator Script & Edge Cases',
        level: 2,
        content: `
We prepare \`gen.cpp\` supporting multiple modes:
- Samples 1, 2, 3 as manual tests with \`useInStatements=true\`.
- Edge tests: N = 1, M = 1, cyclic wrap, impossible characters.
- Generator script tests:
\`\`\`
gen phone 100 > $
gen disjoint 5000 > $
gen overlap 5000 > $
gen random 100 5000 > $
\`\`\`
        `,
      },
      {
        id: 'executing-bundle',
        title: '5. Executing polygon_create_problem_bundle',
        level: 2,
        content: `
We pass the components into \`polygon_create_problem_bundle\`. In less than 90 seconds:
- Problem created on Polygon.
- Statement uploaded with \`phone.png\` (< 50 kB).
- Validator compiled locally and uploaded.
- All 3 solutions uploaded with their tags.
- 16 tests populated.
- Full verification triggered.
        `,
      },
      {
        id: 'verifying-package',
        title: '6. Verified Package Confirmation',
        level: 2,
        content: `
The MCP server waits until the build completes:
\`\`\`json
{
  "status": "SUCCESS",
  "problem_id": 612894,
  "package_id": 1529830,
  "package_state": "READY"
}
\`\`\`
Package is verified, green, and ready for contest submission!
        `,
      },
    ],
  },

  'guides/directory-sync': {
    title: 'Directory Sync Guide',
    category: 'Guides & Tutorials',
    description: 'How to structure your local problem folders for instant one-turn synchronization with Polygon.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'directory-layout', title: 'Recommended Folder Layout', level: 2 },
      { id: 'running-sync', title: 'Running Directory Sync', level: 2 },
      { id: 'sync-rules', title: 'Naming Rules & Tag Inferences', level: 2 },
    ],
    prevPage: { title: 'End-to-End Walkthrough', href: '/docs/guides/full-walkthrough' },
    nextPage: { title: 'testlib.h Best Practices', href: '/docs/guides/testlib-best-practices' },
    sections: [
      {
        id: 'directory-layout',
        title: 'Recommended Folder Layout',
        level: 2,
        content: `
Structure your problem repository like this:

\`\`\`
my-problem/
├── statement.md        # Problem legend, input, output
├── validator.cpp       # testlib.h validator
├── gen.cpp             # testlib.h generator
├── script.txt          # Generator script lines
├── solution.cpp        # Main Accepted (MA) solution
├── sol_slow.cpp        # Time Limit (TL) solution
├── sol_python.py       # Python reference solution
├── diagram.png         # Image resource (< 50 kB)
└── tests/              # Manual sample tests
    ├── 01.in
    └── 02.in
\`\`\`
        `,
      },
      {
        id: 'running-sync',
        title: 'Running Directory Sync',
        level: 2,
        content: `
In your AI assistant prompt:
> *"Sync my directory ./my-problem to Polygon."*

The agent calls:
\`\`\`json
{
  "directory_path": "D:/projects/my-problem",
  "build_package": true
}
\`\`\`
        `,
      },
      {
        id: 'sync-rules',
        title: 'Naming Rules & Tag Inferences',
        level: 2,
        content: `
- Files named \`solution.cpp\`, \`main.cpp\`, or \`sol.cpp\` are automatically tagged as **Main Accepted (\`MA\`)**.
- Files prefixed with \`tl_\` or containing \`slow\` are tagged as **Time Limit Exceeded (\`TL\`)**.
- Files prefixed with \`wa_\` are tagged as **Wrong Answer (\`WA\`)**.
- Other \`.cpp\` and \`.py\` files are tagged as **Accepted (\`OK\`)**.
        `,
      },
    ],
  },

  'guides/testlib-best-practices': {
    title: 'testlib.h Best Practices',
    category: 'Guides & Tutorials',
    description: 'Writing strict validators and robust generators according to official Codeforces standards.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'strict-validation', title: 'Strict Validation Rules', level: 2 },
      { id: 'line-endings', title: 'inf.readEoln() and inf.readEof()', level: 2 },
      { id: 'generators', title: 'Generators with testlib.h', level: 2 },
    ],
    prevPage: { title: 'Directory Sync Guide', href: '/docs/guides/directory-sync' },
    nextPage: { title: 'Codeforces Audit Checklist', href: '/docs/guides/codeforces-checklist' },
    sections: [
      {
        id: 'strict-validation',
        title: 'Strict Validation Rules',
        level: 2,
        content: `
Codeforces requires validators to be **strictly conforming**:
- Always use \`registerValidation(argc, argv);\`.
- Never use \`cin\` or \`scanf\`. Always use \`inf.readInt\`, \`inf.readLong\`, \`inf.readToken\`.
- Check all constraints explicitly (e.g. \`inf.readInt(1, 100, "N")\`).
        `,
      },
      {
        id: 'line-endings',
        title: 'inf.readEoln() and inf.readEof()',
        level: 2,
        content: `
- Every line of input **must** end with \`inf.readEoln()\`.
- The final line **must** be followed by \`inf.readEof()\`.
- No trailing spaces allowed before newlines.
- Never hack \`readEoln()\` to read space.
        `,
      },
      {
        id: 'generators',
        title: 'Generators with testlib.h',
        level: 2,
        content: `
Always initialize generators with:
\`\`\`cpp
#include "testlib.h"
int main(int argc, char* argv[]) {
    registerGen(argc, argv, 1);
    int n = opt<int>(1);
    ...
}
\`\`\`
The third parameter \`1\` enables reproducible random seeds across different operating systems.
        `,
      },
    ],
  },

  'guides/codeforces-checklist': {
    title: 'Codeforces Round Audit Checklist',
    category: 'Guides & Tutorials',
    description: 'The 11-point criteria required before submitting problems to Codeforces contest coordinators.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'the-11-checks', title: 'The 11 Quality Standards', level: 2 },
      { id: 'running-audit', title: 'Automated Audit with polygon_check_audit', level: 2 },
    ],
    prevPage: { title: 'testlib.h Best Practices', href: '/docs/guides/testlib-best-practices' },
    nextPage: { title: 'Stdio Transport (Local)', href: '/docs/deployment/stdio-transport' },
    sections: [
      {
        id: 'the-11-checks',
        title: 'The 11 Quality Standards',
        level: 2,
        content: `
Before any problem is approved for an official round:
1. **Time Limit**: Configured (TL ≥ 1000 ms, at least 2× the MA runtime).
2. **Memory Limit**: At least 64 MB (typically 256 MB or 512 MB).
3. **English Legend**: Grammatically clean, fully formatted in LaTeX.
4. **Input / Output Format**: Formally specified with variable types and constraints.
5. **Sample Notes**: Explanations for all sample testcases.
6. **Tutorial / Editorial**: Complete solution explanation with complexity analysis.
7. **Main Accepted Solution**: Tagged as \`MA\`.
8. **Boundary Solutions**: Slower solution tagged \`TL\` and corner-case failing solution tagged \`WA\` to ensure tests are strong.
9. **Sample Tests**: At least 1-3 sample tests marked \`useInStatements=true\`.
10. **Test Volume**: At least 15-20 comprehensive tests covering min/max bounds and edge cases.
11. **Package Verification**: Latest package built and in \`READY\` status.
        `,
      },
      {
        id: 'running-audit',
        title: 'Automated Audit with polygon_check_audit',
        level: 2,
        content: `
Run \`polygon_check_audit(problem_id)\` to verify all 11 points automatically. The report highlights any missing components in red before coordinators review it.
        `,
      },
    ],
  },

  'deployment/stdio-transport': {
    title: 'Stdio Transport (Local)',
    category: 'Transports & Deployment',
    description: 'Running the Polygon MCP server as a local stdio process for AI desktop assistants.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'stdio-overview', title: 'How Stdio Transport Works', level: 2 },
      { id: 'running-stdio', title: 'Running from Terminal', level: 2 },
    ],
    prevPage: { title: 'Codeforces Audit Checklist', href: '/docs/guides/codeforces-checklist' },
    nextPage: { title: 'Streamable HTTP (Remote)', href: '/docs/deployment/http-transport' },
    sections: [
      {
        id: 'stdio-overview',
        title: 'How Stdio Transport Works',
        level: 2,
        content: `
The **Stdio transport** is the standard, zero-overhead mechanism for local AI tools (Antigravity, Claude Desktop, Cursor). The host application spawns the Python process and exchanges JSON-RPC messages over standard input and standard output.
        `,
      },
      {
        id: 'running-stdio',
        title: 'Running from Terminal',
        level: 2,
        content: `
\`\`\`bash
python -m polygon_mcp.server --transport stdio
\`\`\`
The process will await JSON-RPC messages on stdin.
        `,
      },
    ],
  },

  'deployment/http-transport': {
    title: 'Streamable HTTP Transport (Remote)',
    category: 'Transports & Deployment',
    description: 'Deploying Polygon MCP server over Streamable HTTP for remote teams and cloud agents.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'http-overview', title: 'Streamable HTTP Overview', level: 2 },
      { id: 'launching-http', title: 'Launching the HTTP Server', level: 2 },
    ],
    prevPage: { title: 'Stdio Transport (Local)', href: '/docs/deployment/stdio-transport' },
    nextPage: { title: 'Docker Deployment', href: '/docs/deployment/docker' },
    sections: [
      {
        id: 'http-overview',
        title: 'Streamable HTTP Overview',
        level: 2,
        content: `
For teams hosting a shared MCP server in the cloud or within an internal network, the **Streamable HTTP transport** exposes an HTTP endpoint (using FastAPI and Starlette under the hood) supporting persistent streaming connections.
        `,
      },
      {
        id: 'launching-http',
        title: 'Launching the HTTP Server',
        level: 2,
        content: `
\`\`\`bash
python -m polygon_mcp.server --transport streamable-http --host 0.0.0.0 --port 8000
\`\`\`

Connect in \`mcp_config.json\`:
\`\`\`json
{
  "mcpServers": {
    "polygon-remote": {
      "url": "https://mcp.yourcompany.internal/mcp"
    }
  }
}
\`\`\`
        `,
      },
    ],
  },

  'deployment/docker': {
    title: 'Docker Deployment',
    category: 'Transports & Deployment',
    description: 'Containerizing the Polygon MCP server with gcc, testlib, and Python.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'dockerfile', title: 'Dockerfile Example', level: 2 },
      { id: 'docker-compose', title: 'Running with Docker', level: 2 },
    ],
    prevPage: { title: 'Streamable HTTP (Remote)', href: '/docs/deployment/http-transport' },
    nextPage: { title: 'Common Errors & Fixes', href: '/docs/troubleshooting/common-errors' },
    sections: [
      {
        id: 'dockerfile',
        title: 'Dockerfile Example',
        level: 2,
        content: `
\`\`\`dockerfile
FROM python:3.12-slim

RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -e .

EXPOSE 8000
CMD ["python", "-m", "polygon_mcp.server", "--transport", "streamable-http", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`
        `,
      },
      {
        id: 'docker-compose',
        title: 'Running with Docker',
        level: 2,
        content: `
\`\`\`bash
docker build -t polygon-mcp .
docker run -d -p 8000:8000 --env-file .env polygon-mcp
\`\`\`
        `,
      },
    ],
  },

  'troubleshooting/common-errors': {
    title: 'Common Errors & Troubleshooting',
    category: 'Troubleshooting & FAQ',
    description: 'Exhaustive catalog of Polygon API failure codes, causes, and automated fixes.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'error-signature', title: 'apiKey: Incorrect signature', level: 2 },
      { id: 'error-testset', title: 'testset: Field should not be empty', level: 2 },
      { id: 'error-image-size', title: 'Image exceeds 50 kB', level: 2 },
      { id: 'error-bad-gateway', title: 'HTTP 502 / 504 Bad Gateway', level: 2 },
      { id: 'error-name-collision', title: 'Solution Base Name Collision', level: 2 },
    ],
    prevPage: { title: 'Docker Deployment', href: '/docs/deployment/docker' },
    nextPage: { title: 'FAQ', href: '/docs/troubleshooting/faq' },
    sections: [
      {
        id: 'error-signature',
        title: 'apiKey: Incorrect signature',
        level: 2,
        content: `
**Cause**: Parameters were not sorted lexicographically, a timestamp drift exceeded 5 minutes, or a file was passed as \`multipart/form-data\` instead of form parameters.

**Fix**: The Polygon MCP server calculates the SHA-512 digest automatically on every request. Ensure your \`POLYGON_API_KEY\` and \`POLYGON_API_SECRET\` have no leading or trailing whitespace.
        `,
      },
      {
        id: 'error-testset',
        title: 'testset: Field should not be empty',
        level: 2,
        content: `
**Cause**: Polygon's \`problem.tests\`, \`problem.saveTest\`, and \`problem.testInput\` require the \`testset\` parameter (typically \`"tests"\`).

**Fix**: Built directly into \`TestService\`: \`testset="tests"\` is provided as default.
        `,
      },
      {
        id: 'error-image-size',
        title: 'Image exceeds 50 kB',
        level: 2,
        content: `
**Cause**: Codeforces Polygon rejects graphics larger than 50 kB.

**Fix**: The preflight linter intercepts the image locally. Compress the PNG (e.g. using \`pngquant\` or TinyPNG) before uploading.
        `,
      },
      {
        id: 'error-bad-gateway',
        title: 'HTTP 502 / 504 Bad Gateway',
        level: 2,
        content: `
**Cause**: Polygon backend servers are temporarily under heavy load.

**Fix**: The client automatically retries up to 4 times with exponential backoff and regenerated timestamps.
        `,
      },
      {
        id: 'error-name-collision',
        title: 'Solution Base Name Collision',
        level: 2,
        content: `
**Cause**: Polygon forbids registering two solutions with the same stem (e.g. \`solution.cpp\` and \`solution.py\` collide).

**Fix**: Give distinct names to each language implementation (e.g. \`solution.cpp\` and \`sol_python.py\`).
        `,
      },
    ],
  },

  'troubleshooting/faq': {
    title: 'Frequently Asked Questions',
    category: 'Troubleshooting & FAQ',
    description: 'Frequently asked questions regarding Codeforces Polygon automation and MCP server operation.',
    lastUpdated: 'October 2026',
    toc: [
      { id: 'faq-safe', title: 'Is it safe to store API keys in .env?', level: 2 },
      { id: 'faq-multi-user', title: 'Can multiple people use one server?', level: 2 },
      { id: 'faq-existing', title: 'Can I edit problems created manually?', level: 2 },
    ],
    prevPage: { title: 'Common Errors & Fixes', href: '/docs/troubleshooting/common-errors' },
    sections: [
      {
        id: 'faq-safe',
        title: 'Is it safe to store API keys in .env?',
        level: 2,
        content: `
Yes. The server sanitizes API keys and secrets from all logs and error stack traces. Ensure your \`.env\` is listed in \`.gitignore\` so it is never committed to version control.
        `,
      },
      {
        id: 'faq-multi-user',
        title: 'Can multiple people use one server?',
        level: 2,
        content: `
Yes. By passing \`api_key\` and \`api_secret\` as optional arguments to any tool, different users or agents can interact with distinct Polygon accounts on the fly.
        `,
      },
      {
        id: 'faq-existing',
        title: 'Can I edit problems created manually?',
        level: 2,
        content: `
Yes! The Tier 2 tools (\`polygon_get_problem\`, \`polygon_update_statement\`, \`polygon_upload_solution\`, \`polygon_update_tests\`) work seamlessly on any existing problem on your account.
        `,
      },
    ],
  },
};
