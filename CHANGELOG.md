# Changelog

## 0.1.0 — 2026-07-16

The v0 release. Everything described in `DESIGN_PHILOSOPHY.md`, minus the parts we deleted.

### Components (7, hard cap)

`button`, `input`, `textarea`, `checkbox`, `select`, `dialog`, `tabs`. Each is a single self-contained `.tsx` file: JSDoc → props type → implementation → import-free `manifest` export. Every component passes the CI hard gate: **≤ 1500 tokens** and **≤ 4096 bytes** per component.

Deliberately not shipped: `switch` (served by `<Checkbox role="switch" />`), variants (`className` escape hatch instead), a theming layer, or any component that native HTML + ARIA can already deliver.

### CLI

`npx @joinclass/axiom-ui add <name>` copies a component's `.tsx` file into your repo verbatim. `list` prints available components; `mcp` starts the MCP server. That's the entire CLI surface.

### MCP server

Two tools, `list_components` and `get_component`. Write tools were considered and rejected — side effects belong to the CLI.

### Infrastructure

- CI hard gate: `pnpm gate` measures token/component and bundle/component per PR.
- Periodic KPI: `pnpm eval` runs a one-shot generation benchmark against the Anthropic API (nightly, not gating).
- Deletion ratio: `pnpm deletion-ratio <from>` recorded per release.

### Requires

Node.js 22+, React 19, Tailwind CSS v4 in the consuming project.
