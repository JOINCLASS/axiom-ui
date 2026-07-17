import { StrictMode, useEffect, useRef, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "../src/components/button";
import { Checkbox } from "../src/components/checkbox";
import { Combobox } from "../src/components/combobox";
import { Dialog } from "../src/components/dialog";
import { Input } from "../src/components/input";
import { Menu, MenuItem } from "../src/components/menu";
import { Popover } from "../src/components/popover";
import { Select } from "../src/components/select";
import { Tab, TabPanel, Tabs } from "../src/components/tabs";
import { Textarea } from "../src/components/textarea";
import { Toast } from "../src/components/toast";
import { Tooltip } from "../src/components/tooltip";
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
        <h3 id="dialog-title" className="mb-3 text-base font-semibold">Confirm</h3>
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
  const items = [
    { id: "one" as const, label: "One", body: "First panel." },
    { id: "two" as const, label: "Two", body: "Second panel." },
    { id: "three" as const, label: "Three", body: "Third panel." },
  ];
  return (
    <div>
      <Tabs>
        {items.map((item) => (
          <Tab key={item.id} selected={value === item.id} id={`tab-${item.id}`}
            aria-controls={`panel-${item.id}`} onClick={() => setValue(item.id)}>
            {item.label}
          </Tab>
        ))}
      </Tabs>
      {items.map((item) => (
        <TabPanel key={item.id} id={`panel-${item.id}`} aria-labelledby={`tab-${item.id}`}
          selected={value === item.id}>
          {item.body}
        </TabPanel>
      ))}
    </div>
  );
}

function PopoverDemo() {
  const anchor = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button ref={anchor} onClick={() => setOpen((o) => !o)}>Open popover</Button>
      <Popover open={open} onOpenChange={setOpen} anchor={anchor} className="max-w-xs">
        Any React content lives here. Press Escape or click outside to close.
      </Popover>
    </>
  );
}

function MenuDemo() {
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <>
      <Button ref={trigger} onClick={() => setOpen((o) => !o)}>Actions</Button>
      <Menu open={open} onOpenChange={setOpen} anchor={trigger}>
        <MenuItem onClick={() => { setMessage("Renamed"); setOpen(false); }}>Rename</MenuItem>
        <MenuItem onClick={() => { setMessage("Duplicated"); setOpen(false); }}>Duplicate</MenuItem>
        <MenuItem disabled>Archive (soon)</MenuItem>
      </Menu>
      {message && <span className="ml-3 text-sm text-zinc-500">{message}</span>}
    </>
  );
}

function TooltipDemo() {
  return (
    <div className="flex gap-4">
      <Tooltip content="Save the changes"><Button>Save</Button></Tooltip>
      <Tooltip content="Discard the changes"><Button className="!bg-zinc-100 !text-zinc-900">Cancel</Button></Tooltip>
    </div>
  );
}

function ToastDemo() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => setOpen(false), 3000);
    return () => clearTimeout(id);
  }, [open]);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Show toast</Button>
      <Toast open={open}>Changes saved.</Toast>
    </>
  );
}

function ComboboxDemo() {
  const [value, setValue] = useState("");
  return (
    <Combobox
      value={value}
      onChange={setValue}
      placeholder="Search a fruit..."
      options={[
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "cherry", label: "Cherry" },
        { value: "durian", label: "Durian" },
        { value: "elderberry", label: "Elderberry" },
      ]}
    />
  );
}

function App() {
  return (
    <main className="mx-auto max-w-2xl space-y-10 p-8">
      <h1 className="text-2xl font-bold">Axiom UI</h1>

      <Section title="Button">
        <div className="flex gap-2"><Button>Save</Button><Button disabled>Save</Button></div>
      </Section>
      <Section title="Input"><Input placeholder="you@example.com" type="email" /></Section>
      <Section title="Textarea"><Textarea rows={3} placeholder="Write a note..." /></Section>
      <Section title="Checkbox (and switch)">
        <label className="inline-flex items-center gap-2"><Checkbox name="terms" /><span className="text-sm">Accept terms</span></label>
        <label className="ml-6 inline-flex items-center gap-2"><Checkbox role="switch" defaultChecked /><span className="text-sm">Enable notifications</span></label>
      </Section>
      <Section title="Select">
        <Select defaultValue="">
          <option value="" disabled>Choose a fruit</option>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
        </Select>
      </Section>
      <Section title="Dialog"><DialogDemo /></Section>
      <Section title="Tabs"><TabsDemo /></Section>

      <Section title="Popover"><PopoverDemo /></Section>
      <Section title="Menu"><MenuDemo /></Section>
      <Section title="Tooltip"><TooltipDemo /></Section>
      <Section title="Toast"><ToastDemo /></Section>
      <Section title="Combobox"><ComboboxDemo /></Section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode><App /></StrictMode>,
);
