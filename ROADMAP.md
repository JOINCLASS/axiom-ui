# Axiom UI — Roadmap to v0

> 計画は[設計思想](./DESIGN_PHILOSOPHY.md)の規律に従う。
> 特に「自動化は最後（原則2.5）」— CLIとMCPサーバーは、コンポーネントの形式が削除と一本化を経て安定した**後**に作る。

フェーズは順序であり、日付ではない。前のフェーズの完了条件を満たすまで次に進まない。

---

## Phase 0 — 基盤（完了）

- [x] 設計思想（`DESIGN_PHILOSOPHY.md`）
- [x] README（英語・日本語）
- [x] MITライセンス

## Phase 1 — トレーサーバレット：形式の確定と最初の1個

v0の最重要成果物は、コンポーネントそのものではなく **「1コンポーネント = 1ファイル」形式の確定** である。
最初の1個（Button）を末端まで作り切り、以降の全コンポーネントの鋳型にする。

- [x] リポジトリのscaffolding（TypeScript `strict`、React、Tailwind、テスト環境）
- [x] 単一ファイル形式の仕様を確定：実装 + 型 + ドキュメント + 使用例 + 機械可読manifest `{ intent, props, states, a11y, examples }` を1つの `.tsx` に co-locate
- [x] **Button** をリファレンス実装として完成（a11y含む）
- [x] one-shot generation 評価の最小プロトタイプ：代表プロンプト集に対してLLMがButtonを修正なしで正しく使えるかを手動で検証（初回 5/5 — `evals/prompts/button.md`）

**完了条件**: Buttonのファイルを読んだだけで、LLMが型・使い方・a11y要件の全てを把握できる。形式に未解決の設計課題がない。

## Phase 2 — 計測とCIゲート（高速化）

コンポーネントを増やす**前**に、退行を防ぐゲートを敷く。

ゲートとKPIを区別する（思想 §2.4 / §6 に対応）：

- **ハードゲート（PRごと・決定的）**: token / bundle。閾値超過は機械的にマージ不可
- **KPI（定期・LLM依存で非決定的）**: one-shot generation rate。PRゲートにはせず、nightly またはリリースごとに計測して追跡する

- [x] `token/component` 計測スクリプト（tokenizerベース）— `scripts/measure.ts`
- [x] `bundle/component` 計測スクリプト（コンポーネント単位のバイト数）— 同上（vite buildでコンポーネント単体をminify計測）
- [x] 上記2指標のCIゲート化：閾値超過のPRはマージ不可 — `.github/workflows/ci.yml` の `pnpm gate`（予算: 1500 tokens / 4096 bytes）
- [x] one-shot generation rate ベンチマークの自動化（プロンプト集 → LLM生成 → 型チェック/テストで合否判定）— `evals/run.ts` + `.github/workflows/eval.yml`（週次+手動。APIキーはsecrets、未設定ならスキップ。コスト上限はケース数×max_tokensで抑制）
- [x] 削除比率のリリースごとの記録 — `pnpm deletion-ratio <from> [to]`

**完了条件**: 全PRが2つのハードゲート（token / bundle）で機械的に判定され、one-shot rate が定期計測されている。

## Phase 3 — コアコンポーネント（極小セット）

Buttonを鋳型に、v0スコープの残りを実装する。**当初は8個を上限に置いたが、審査の結果 7個で打ち止めた。** 追加提案は原則2.2（削除）の審査を通過しなければならない。

| # | コンポーネント | 状態 | 備考 |
|---|---|---|---|
| 1 | Button | 完成 | Phase 1 |
| 2 | Input | 完成 | Phase 3 |
| 3 | Textarea | 完成 | Phase 3 |
| 4 | Select | 完成 | ネイティブ `<select>` の薄いラッパー |
| 5 | Checkbox | 完成 | ネイティブ `<input type="checkbox">` の薄いラッパー |
| ~~6~~ | ~~Switch~~ | **削除** | Checkbox + `role="switch"` + `className` で代替可能。実装は原則2.2に反する |
| 6 | Dialog | 完成 | ネイティブ `<dialog>` ベース |
| 7 | Tabs | 完成 | ARIA `tablist` パターン + 矢印キーによるフォーカス移動のみ。選択状態は呼び出し側管理 |

**Switch削除の判断根拠**: 見た目のトグル形状は `className` で作れる。意味論はネイティブ checkbox + `role="switch"`（ARIA仕様で認められた合法パターン）で表現できる。独立コンポーネントを追加すると「同じ目的の2つ目のAPI」が生まれ、LLMが Checkbox と Switch を選ぶ迷いが生じる。**8個未満で終わることは成功である**（原則2.2）。

各コンポーネントの受け入れ条件：

- CIハードゲート（token / bundle）を通過
- 素のHTML/ARIA primitiveで代替できない理由を説明できる（説明できなければ実装しない）
- 単一のcontext窓に収まる

**完了条件**: 生き残った全コンポーネントがゲートを通過し、one-shot generation rate がベースラインを確立している。

**現在の実測**（Phase 3 完了時、予算 1500 tokens / 4096 bytes）:

| Component | tokens | bytes |
|---|---:|---:|
| button | 511 | 1,832 |
| checkbox | 617 | 2,107 |
| dialog | 566 | 1,868 |
| input | 572 | 1,907 |
| select | 560 | 1,896 |
| tabs | 1,110 | 3,301 |
| textarea | 510 | 1,746 |

Tabs が最重（3プリミティブ + 矢印キーナビ）だが予算内。全7コンポーネントが単一のcontext窓に収まる。

## Phase 4 — 自動化（最後）

形式とコンポーネントが安定した後にのみ着手する。

- [x] **CLI**: `npx @joinclass/axiom-ui add <component>` によるコピー注入。ユーザーのリポジトリにコードを所有させる（`cli/`, `templates/`, `dist/cli/bin.js`）
- [x] **MCPサーバー**: manifestを構造化データとして配信（`mcp/server.ts`, tools: `list_components`, `get_component`）
- [x] v0.1.0 リリース準備（`package.json` publishable、`CHANGELOG.md`）— 実 `npm publish` と `git tag v0.1.0` はユーザーが手動で実行

**完了条件**: エージェント（Claude Code / Cursor）がMCP経由でコンポーネントを発見し、CLIで注入し、修正なしで使用できる。

## Phase 5 — v0.2: honest audit で不足を埋める（7 → 12）

v0.1 出荷後、「shadcn/ui との比較で本当にこれ以上必要ないのか」という問いから honest audit を実施。**native + className で足りるもの**（Card, Divider, Badge, Alert, Accordion `<details>`, Progress, Slider, DatePicker native input, RadioGroup, Sheet 等）は却下、**ネイティブに存在しない5コンポーネント**を追加した。

「投機的機能追加を拒否」の原則は保つ。今回は投機ではなく **UIライブラリの空白領域を honest audit で埋めた** 判断。以前設定した「8個上限 → 7」は heuristic に過ぎず、正しい情報（strict-audit結果）を得たので修正した。**scope の変更を「削る」方向のみに縛る規律は撤回する** — audit 結果に基づく追加であれば正当。

| # | コンポーネント | ネイティブに無い理由 |
|---|---|---|
| 8 | Popover | native Popover API はある（Baseline 2024）が、React `open` prop への薄い橋渡しが必要 |
| 9 | Menu | Popover + `role="menu"` + roving tabindex + 矢印/Home/End/Escape |
| 10 | Tooltip | hover(150ms delay) / focus + `aria-describedby` |
| 11 | Toast | native なし。stateless `<Toast>`（キューは呼び出し側 or Sonner） |
| 12 | Combobox | Input + filterable listbox + 矢印キー。native `<datalist>` は制約多い |

**v0.2 実測**（予算 1500 tokens / 4096 bytes）:

| Component | tokens | bytes |
|---|---:|---:|
| button | 540 | 1,928 |
| checkbox | 643 | 2,197 |
| combobox | 1,310 | 3,926 |
| dialog | 603 | 2,000 |
| input | 601 | 2,003 |
| menu | 1,106 | 3,948 |
| popover | 1,067 | 3,226 |
| select | 589 | 1,992 |
| tabs | 1,193 | 3,616 |
| textarea | 539 | 1,842 |
| toast | 887 | 2,755 |
| tooltip | 793 | 3,409 |

全12コンポーネントが予算内。

**推奨コンパニオン**（自作しない）: Command Palette → cmdk、Data Table → TanStack Table、DatePicker → react-day-picker、Forms → React Hook Form + Zod、Charts → Recharts、Toast queue → Sonner。README に明記。

---

## Non-Goals

- 13個目以降のコンポーネント（実ユーザーからの複数報告なしには追加しない）
- テーマカスタマイズ機構
- React以外のフレームワーク対応
- ドキュメントサイト（単一ファイル形式とMCPがドキュメントである）

## この計画の変更について

より良い理由があればフェーズの中身は差し替える。ただし：

- フェーズの**順序**（形式 → 計測 → 実装 → 自動化）は思想の帰結であり、変更しない
- scopeの変更は「削る」方向を第一とし、追加は honest audit（`native + className` で足りないことの証明）を通過したものに限る
