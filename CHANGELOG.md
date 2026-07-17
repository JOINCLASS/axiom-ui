# Changelog

## 0.2.0 — 2026-07-17

Five new components after an honest audit of what a UI library actually needs beyond what native HTML + ARIA provide. The v0.1 "hard cap 7" was a heuristic; the strict-audit result revises it upward.

### New components (7 → 12)

- **`popover`** — Controlled wrapper around the native `<div popover>` element (Baseline 2024). Top-layer rendering, no z-index stacking. `open` + `onOpenChange` + optional `anchor` ref.
- **`menu`** — Anchored menu on Popover with `role="menu"` / `role="menuitem"`, roving tabindex, ArrowUp/Down/Home/End keyboard nav, first-item autofocus on open.
- **`tooltip`** — Wraps a trigger with hover (150ms delay) + focus handlers; associates content via `aria-describedby`.
- **`toast`** — Stateless notification in the top layer (`popover="manual"`). Caller owns queue + timing. For imperative `toast()` sugar, use Sonner.
- **`combobox`** — Controlled single-select with substring filter, arrow-key highlight, Enter to select, Escape to close, `aria-activedescendant` wired.

### Recommended companions (still don't build)

For domains where a third-party library already dominates, README now points readers there instead of shipping an inferior in-house version: Command Palette → cmdk, Data Table → TanStack Table, DatePicker (advanced) → react-day-picker, Forms → React Hook Form + Zod, Charts → Recharts, Toast queue/sugar → Sonner.

### Rejected under the honest audit

`native + className` covers these, so no component is warranted: Card, Divider, Container, Alert, Badge, Skeleton, Spinner, Label, Link, Progress, Slider, DatePicker input, FileInput, RadioGroup, Toggle, Accordion (`<details>`), Breadcrumb, Table (basic), Sheet (Dialog covers), Avatar, Aspect Ratio, ScrollArea.

### Requires

Unchanged from v0.1.0: Node.js 22+, React 19, Tailwind CSS v4 in the consuming project. The Popover-based components (Popover, Menu, Tooltip, Toast) additionally require a browser with the native Popover API — Chrome/Edge 114+, Safari 17.4+, Firefox 125+. Older browsers render the element inline (functional, not floating).

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

### Known limitations

- **Runtime dependency size.** `@modelcontextprotocol/sdk` pulls in a fair number of transitive dependencies (express, hono, ajv, …) that the stdio-only MCP server does not need. A future split into `axiom-ui` (add/list) + `axiom-ui-mcp` (MCP server) is the intended fix; not blocking for v0.
- **Stale `manifests.json` after `add`.** `axiom-ui mcp` serves the manifest that shipped in the installed package — it does not reflect local edits to copied components. Intentional; the manifest describes what was shipped, not what you own.
