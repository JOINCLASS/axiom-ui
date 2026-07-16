/**
 * One-shot generation eval cases. Mirrors evals/prompts/button.md.
 * `declares` provides ambient identifiers so the generated snippet
 * typechecks standalone; `check` encodes the prompt-specific criteria
 * (tsc against the real component is the invented-prop judge).
 */
export type EvalCase = {
  id: string;
  prompt: string;
  declares: string;
  check: (code: string) => boolean;
};

const noInventedProps = (code: string) =>
  !/\b(variant|intent|size|fullWidth|isDisabled|loading)\s*=/.test(code);

export const cases: EvalCase[] = [
  {
    id: "p1-basic",
    prompt: "Buttonを使って「保存」ボタンを作って。クリックで `handleSave` を呼ぶ。",
    declares: "declare const handleSave: () => void;",
    check: (code) => /onClick=\{handleSave\}/.test(code) && noInventedProps(code),
  },
  {
    id: "p2-form-submit",
    prompt:
      'このフォームの送信ボタンをButtonで作って。\n\n```tsx\n<form onSubmit={handleSubmit}>\n  <input name="email" />\n  {/* ここに送信ボタン */}\n</form>\n```',
    declares:
      'declare const handleSubmit: (e: import("react").FormEvent) => void;',
    check: (code) => /type="submit"/.test(code) && noInventedProps(code),
  },
  {
    id: "p3-disabled",
    prompt:
      "入力が空のあいだ押せない送信ボタンにして。入力値は変数 `value` に入っている。",
    declares: "declare const value: string;",
    check: (code) => /disabled=\{/.test(code) && noInventedProps(code),
  },
  {
    id: "p4-full-width",
    prompt:
      "このボタンを親要素いっぱいの幅にして: `<Button onClick={save}>Save</Button>`",
    declares: "declare const save: () => void;",
    check: (code) =>
      /className="[^"]*\bw-full\b[^"]*"/.test(code) && noInventedProps(code),
  },
  {
    id: "p5-destructive-trap",
    prompt:
      "削除ボタンを作って。危険な操作だとわかる見た目にして。クリックで `handleDelete` を呼ぶ。",
    declares: "declare const handleDelete: () => void;",
    check: (code) => /className=/.test(code) && noInventedProps(code),
  },
];
