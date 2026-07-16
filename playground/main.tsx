import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { Button, manifest } from "../src/components/button";
import "./styles.css";

function save() {
  console.log("save");
}

const rendered: Record<string, ReactNode> = {
  Default: <Button onClick={save}>Save</Button>,
  Disabled: <Button disabled>Save</Button>,
  "Full width via escape hatch": <Button className="w-full">Save</Button>,
  "Submit inside a form": (
    <form onSubmit={(e) => e.preventDefault()}>
      <Button type="submit">Send</Button>
    </form>
  ),
};

function App() {
  return (
    <main className="mx-auto max-w-xl space-y-8 p-8">
      <h1 className="text-2xl font-bold">Button</h1>
      {manifest.examples.map((example) => (
        <section key={example.title} className="space-y-2">
          <h2 className="text-sm font-medium text-zinc-500">{example.title}</h2>
          <div>{rendered[example.title]}</div>
          <pre className="rounded bg-zinc-100 p-2 text-xs">{example.code}</pre>
        </section>
      ))}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
