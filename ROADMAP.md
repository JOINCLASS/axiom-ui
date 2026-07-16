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

Buttonを鋳型に、v0スコープの残りを実装する。**この8個で打ち止め。** 追加提案は原則2.2（削除）の審査を通過しなければならない。

| # | コンポーネント | 備考 |
|---|---|---|
| 1 | Button | Phase 1で完成済み |
| 2 | Input | |
| 3 | Textarea | |
| 4 | Select | ネイティブ `<select>` で足りるかをまず疑う |
| 5 | Checkbox | |
| 6 | Switch | Checkboxと統合できないかをまず疑う |
| 7 | Dialog | ネイティブ `<dialog>` ベース |
| 8 | Tabs | ARIA `tablist` パターンの薄いラッパーで足りるかをまず疑う |

各コンポーネントの受け入れ条件：

- CIハードゲート（token / bundle）を通過
- 素のHTML/ARIA primitiveで代替できない理由を説明できる（説明できなければ実装しない — 8個未満で終わることは成功である）
- 単一のcontext窓に収まる

**完了条件**: 生き残った全コンポーネントがゲートを通過し、one-shot generation rate がベースラインを確立している。

## Phase 4 — 自動化（最後）

形式とコンポーネントが安定した後にのみ着手する。

- [ ] **CLI**: `npx axiom-ui add <component>` によるコピー注入。ユーザーのリポジトリにコードを所有させる
- [ ] **MCPサーバー**: manifestを構造化データとして配信し、エージェントがバージョン整合の取れた仕様をtoken無駄なく取得できるようにする
- [ ] v0 リリース（タグ付け、公開アナウンス）

**完了条件**: エージェント（Claude Code / Cursor）がMCP経由でコンポーネントを発見し、CLIで注入し、修正なしで使用できる。

---

## v0のNon-Goals（再掲・計画版）

- 9個目以降のコンポーネント
- テーマカスタマイズ機構
- React以外のフレームワーク対応
- ドキュメントサイト（単一ファイル形式とMCPがドキュメントである）

## この計画の変更について

より良い理由があればフェーズの中身は差し替える。ただし：

- フェーズの**順序**（形式 → 計測 → 実装 → 自動化）は思想の帰結であり、変更しない
- スコープの変更は「削る」方向のみ受け入れる
