import { StrictMode, useRef, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "../src/components/button";
import { Checkbox } from "../src/components/checkbox";
import { Dialog } from "../src/components/dialog";
import { Input } from "../src/components/input";
import { Select } from "../src/components/select";
import { Tab, TabPanel, Tabs } from "../src/components/tabs";
import { Textarea } from "../src/components/textarea";
import "./styles.css";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function DialogDemo() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <Button onClick={() => dialogRef.current?.showModal()}>Open dialog</Button>
      <Dialog ref={dialogRef} aria-labelledby="dialog-title">
        <h3 id="dialog-title" className="mb-3 text-base font-semibold">
          Confirm
        </h3>
        <p className="mb-4 text-sm text-zinc-600">Delete this item?</p>
        <form method="dialog" className="flex justify-end gap-2">
          <Button type="submit">Cancel</Button>
        </form>
      </Dialog>
    </>
  );
}

function TabsDemo() {
  const [value, setValue] = useState<"one" | "two" | "three">("one");
  const items: { id: "one" | "two" | "three"; label: string; body: string }[] = [
    { id: "one", label: "One", body: "First panel." },
    { id: "two", label: "Two", body: "Second panel." },
    { id: "three", label: "Three", body: "Third panel." },
  ];
  return (
    <div>
      <Tabs>
        {items.map((item) => (
          <Tab
            key={item.id}
            selected={value === item.id}
            id={`tab-${item.id}`}
            aria-controls={`panel-${item.id}`}
            onClick={() => setValue(item.id)}
          >
            {item.label}
          </Tab>
        ))}
      </Tabs>
      {items.map((item) => (
        <TabPanel
          key={item.id}
          id={`panel-${item.id}`}
          aria-labelledby={`tab-${item.id}`}
          selected={value === item.id}
        >
          {item.body}
        </TabPanel>
      ))}
    </div>
  );
}

function App() {
  return (
    <main className="mx-auto max-w-2xl space-y-10 p-8">
      <h1 className="text-2xl font-bold">Axiom UI</h1>

      <Section title="Button">
        <div className="flex gap-2">
          <Button>Save</Button>
          <Button disabled>Save</Button>
        </div>
      </Section>

      <Section title="Input">
        <Input placeholder="you@example.com" type="email" />
      </Section>

      <Section title="Textarea">
        <Textarea rows={3} placeholder="Write a note..." />
      </Section>

      <Section title="Checkbox (and switch)">
        <label className="inline-flex items-center gap-2">
          <Checkbox name="terms" />
          <span className="text-sm">Accept terms</span>
        </label>
        <label className="ml-6 inline-flex items-center gap-2">
          <Checkbox role="switch" defaultChecked />
          <span className="text-sm">Enable notifications</span>
        </label>
      </Section>

      <Section title="Select">
        <Select defaultValue="">
          <option value="" disabled>
            Choose a fruit
          </option>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="cherry">Cherry</option>
        </Select>
      </Section>

      <Section title="Dialog">
        <DialogDemo />
      </Section>

      <Section title="Tabs">
        <TabsDemo />
      </Section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
