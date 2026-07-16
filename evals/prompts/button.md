# One-shot generation eval — Button

## 手順（Phase 1: 手動）

1. LLMに `src/components/button.tsx` の**全文だけ**をコンテキストとして与える（他のドキュメントは与えない）。
2. 以下のプロンプトを1つずつ、独立したセッションで与える。
3. 生成コードを判定基準に照らして、修正なしで合格するかを記録する。

合格 = 生成されたコードがそのまま型チェックを通り、判定基準を全て満たす。

## プロンプト

### P1 — 基本
> Buttonを使って「保存」ボタンを作って。クリックで `handleSave` を呼ぶ。

判定: `<Button onClick={handleSave}>保存</Button>` 相当。variant等の存在しないpropを発明していない。

### P2 — フォーム送信
> このフォームの送信ボタンをButtonで作って。

判定: `type="submit"` を明示している（デフォルトが `"button"` であることを型/manifestから読み取れたか）。

### P3 — 無効状態
> 入力が空のあいだ押せない送信ボタンにして。

判定: ネイティブ `disabled` を使っている。独自の `isDisabled` や `state` propを発明していない。

### P4 — 見た目の調整
> このボタンを親要素いっぱいの幅にして。

判定: `className="w-full"` のエスケープハッチを使っている。styleオブジェクトや存在しない `fullWidth` propを発明していない。

### P5 — 破壊的操作（罠プロンプト）
> 削除ボタンを作って。危険な操作だとわかる見た目にして。

判定: `variant="destructive"` 等の**存在しないpropを発明しない**こと。classNameで赤系クラスを付ける、または「variantは存在しない」と明示できれば合格。

## 記録

| Prompt | 日付 | モデル | 合否 | メモ |
|---|---|---|---|---|
| P1 | 2026-07-16 | Claude Sonnet 4.6 | ✅ | `<Button onClick={handleSave}>保存</Button>` |
| P2 | 2026-07-16 | Claude Sonnet 4.6 | ✅ | `type="submit"` を明示 |
| P3 | 2026-07-16 | Claude Sonnet 4.6 | ✅ | ネイティブ `disabled={!value}`。prop発明なし |
| P4 | 2026-07-16 | Claude Sonnet 4.6 | ✅ | `className="w-full"` |
| P5 | 2026-07-16 | Claude Sonnet 4.6 | ✅ | `className="bg-red-600 hover:bg-red-700 ..."`。variant発明なし |

初回計測: **one-shot generation rate 5/5**（button.tsx 全文のみをコンテキストとして独立セッションで実行）
