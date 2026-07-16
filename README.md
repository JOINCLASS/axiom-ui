# Axiom UI

English | [日本語](./README.ja.md)

> An open-source UI library designed for the LLM as its primary consumer.
> LLMを第一の消費者として設計する、オープンソースUIライブラリ。

**Status: pre-v0 — design phase.** The philosophy is settled; the components are not yet written.

---

## The Inversion

Every existing UI library is optimized for **human DX**. Axiom UI is optimized, from first principles, for **generation, comprehension, and modification by LLMs**. Humans are the secondary beneficiaries.

If `shadcn/ui` is *accidentally* AI-friendly, Axiom is **AI-first by design**.

Every design decision must pass one question:

> "Does this decision raise or lower the probability that an LLM generates this component **correctly in one shot**?"

If it doesn't raise it, we don't build it.

Read the full [Design Philosophy](./DESIGN_PHILOSOPHY.md) (Japanese).

## Principles

The five-step algorithm — applied in order, irreversibly:

1. **Question every requirement.** Every prop, component, and option must justify its existence.
2. **Delete.** The best prop is no prop. One way to do each thing — variants are hallucination fuel. The best component is no component.
3. **Simplify.** Polish only what survived deletion.
4. **Accelerate.** Tokens and bytes per component are measured and gated in CI. Fat components don't merge.
5. **Automate — last.** MCP server, CLI, doc generation come only after deletion and unification.

## Architecture

| Decision | Consequence |
|---|---|
| **1 component = 1 file** | Implementation, types, docs, examples, and manifest co-located. Fits in a single context window — by constraint, not by luck. |
| **Type as the contract** | `strict: true`, discriminated unions, no `any`. Types are the primary documentation. |
| **Copy & own** | No npm runtime dependency. A CLI injects code into your repo. You own it; LLMs can freely modify it. No black boxes. |
| **MCP-first distribution** | An MCP server ships alongside the library, so agents (Claude Code, Cursor, …) fetch version-accurate specs without wasting tokens. |
| **Machine-readable manifest** | Each component carries `{ intent, props, states, a11y, examples }` as structured data, so agents can *select and render* components — the foundation for generative UI — instead of being *told about* them. |
| **Zero-config defaults** | Works correctly with no props. Escape hatches exist but are never required. |

## Tech stack (v0)

| Choice | Why |
|---|---|
| **React** only | Go narrow and deep. One abstraction layer deleted. |
| **Tailwind CSS** | Class strings are directly readable and generatable by LLMs. |
| **TypeScript strict** | Type = contract = primary documentation. |
| **CLI injection + MCP server** | Zero black-box dependencies. |
| **Minimal runtime dependencies** | Keeps the idiot index — actual cost over essential cost — low. |

These are v0 decisions, not philosophy. They can be replaced for better reasons — but never in the direction of *more options*.

## Non-goals

- Infinite theme customization (one good default instead)
- Multi-framework support (in v0)
- Anything claiming to "cover every use case"
- A second API for the same purpose
- Config options for features nobody asked for

## Success metrics

Measured, not felt:

- **token/component** — the average component fits in a single context window
- **bundle/component** — bytes per component are tracked and never regress
- **one-shot generation rate** — the primary KPI: how often an LLM generates correct code with zero fixes
- **deletion ratio** — lines deleted vs. lines added, recorded per release

## Contributing

Before requesting review, every PR must answer:

1. Does this **delete** something? If not, why can't it?
2. Does this introduce a *second way* to do something?
3. Does the component still fit in a single context window?
4. Can an LLM use this correctly by reading the types alone?
5. Does this keep `token/component` and `bundle/component` from regressing?

If you're stuck on any of these, it's not ready to merge.

---

*The best part is no part. The best process is no process. — This library is an attempt to apply that to UI.*
