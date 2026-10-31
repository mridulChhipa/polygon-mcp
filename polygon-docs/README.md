# Codeforces Polygon MCP Server - Documentation Site

A modern, multipage documentation application built with **Next.js 14**, **Tailwind CSS**, and **TypeScript**, organized according to standard globally used developer product documentation structures (inspired by Stripe, Vercel, Cloudflare, and Supabase Docs).

## Documentation Structure

- **Getting Started**:
  - `Overview`: High-level purpose, why AI agents need Polygon MCP, architecture at a glance.
  - `Quickstart`: 5-minute zero to verified package walkthrough.
  - `Installation`: Prerequisites (`g++`, `testlib.h`, Python 3.10+), editable install.
  - `Configuration & Auth`: Generating Polygon API credentials, `.env`, `mcp_config.json`, dynamic auth.
  - `Client Integration`: Antigravity, Claude Desktop, Cursor, and Windsurf configurations.
- **Core Architecture**:
  - `Two-Tier Tool Design`: Composite workflows vs targeted primitives (80 turns down to 1 turn).
  - `Protocol & Signing`: Canonical parameter sorting, 6-character random nonces, SHA-512 signing, form-payload normalization.
  - `Preflight Engine`: Fail-fast local `g++` compilation with official `testlib.h`, LaTeX math linter, 50 kB image size checks.
  - `Working Copy & Package Lifecycle`: Working copy staging, commit messages, background verification polling.
- **MCP Tools Reference**:
  - `Workflow Tools (Tier 1)`: `polygon_create_problem_bundle`, `polygon_sync_from_directory`, `polygon_build_and_verify`.
  - `Primitive Tools (Tier 2)`: `polygon_list_problems`, `polygon_get_problem`, `polygon_update_statement`, `polygon_upload_solution`, `polygon_update_validator`, `polygon_update_tests`, `polygon_check_audit`.
  - `Resources & Prompts`: `polygon://rules/codeforces`, `polygon://problems`, and `polygon_problem_checklist`.
- **Guides & Tutorials**:
  - `End-to-End Walkthrough`: Preparing "Retro Keypad Phone" as an authentic case study.
  - `Directory Sync`: Organizing local folders for automated mirroring.
  - `testlib.h Best Practices`: Strict validation, line-ending checks (`inf.readEoln()`, `inf.readEof()`), reproducible generators.
  - `Codeforces Checklist`: 11-point audit requirements.
- **Transports & Deployment**:
  - `Stdio Transport`: Default local AI agent communication.
  - `Streamable HTTP`: Remote team server deployment.
  - `Docker`: Production container deployment.
- **Troubleshooting & FAQ**:
  - `Common Errors`: Catalog of error codes (`apiKey: Incorrect signature`, `testset: Field should not be empty`, image limits, 502 Bad Gateway).
  - `FAQ`: Answers to common author questions.

## Running Locally

### Option 1: Instant Python Runner (Zero `npm` / Zero Node.js)
```bash
python -m http.server 3000 -d dist
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Live Development Server (Node.js & npm)
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for hot-reloading development.

### Option 3: Production Static Export & Local Server
```bash
npm run build
npm run start
```
`npm run build` pre-renders the entire static site into `dist/`, and `npm run start` launches a local static server at [http://localhost:3000](http://localhost:3000).

## Features

- **Responsive Multi-Section Navigation**: Collapsible categories with Lucide icons, status badges, and active path tracking.
- **Fast Instant Search (Ctrl + K)**: Modal search querying all documentation pages, tools, and error guides.
- **Right Table of Contents**: Scroll-spy heading tracker for smooth reading.
- **Dark / Light Mode**: Seamless developer theme toggle.
- **Interactive Code Blocks**: Copy-to-clipboard functionality with language badges.
- **Semantic Callouts**: GitHub-style `note`, `tip`, `important`, `warning`, and `caution` alerts.
