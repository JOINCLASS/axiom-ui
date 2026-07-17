/**
 * Single-select combobox. Controlled: caller owns `value`. Options
 * filter as the user types. ArrowDown/Up highlight, Enter selects,
 * Escape closes. For multi-select, roll your own or use Downshift.
 */
import { useEffect, useId, useRef, useState } from "react";

export type ComboboxOption = { value: string; label: string; disabled?: boolean };

export type ComboboxProps = {
  options: readonly ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  id?: string;
};

export function Combobox({
  options, value, onChange, placeholder,
  emptyMessage = "No results", className, id,
}: ComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listboxId = useId();
  const closingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";
  const filtered = options.filter(
    (o) => !o.disabled && o.label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => { setActive(0); }, [query]);
  useEffect(() => () => { if (closingTimer.current) clearTimeout(closingTimer.current); }, []);

  const select = (option: ComboboxOption) => {
    onChange(option.value);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className={"relative" + (className ? " " + className : "")}>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-activedescendant={open && filtered[active] ? `${listboxId}-${active}` : undefined}
        value={open ? query : selectedLabel}
        placeholder={placeholder}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => { closingTimer.current = setTimeout(() => setOpen(false), 100); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActive((i) => Math.min(i + 1, filtered.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") {
            const opt = filtered[active];
            if (opt) { e.preventDefault(); select(opt); }
          } else if (e.key === "Escape") setOpen(false);
        }}
        className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      />
      {open && (
        <ul id={listboxId} role="listbox"
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-200 bg-white p-1 shadow-lg">
          {filtered.length === 0 ? (
            <li className="px-3 py-1.5 text-sm text-zinc-500">{emptyMessage}</li>
          ) : filtered.map((opt, i) => (
            <li key={opt.value} id={`${listboxId}-${i}`} role="option"
              aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); select(opt); }}
              className={"cursor-pointer rounded px-3 py-1.5 text-sm " +
                (i === active ? "bg-zinc-100" : "hover:bg-zinc-100")}>
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const manifest = {
  intent:
    "Controlled single-select combobox. Input filters options by substring on label; ArrowDown/Up highlight, Enter selects, Escape closes. No multi-select — use Downshift for that.",
  props: {
    options: "readonly ComboboxOption[]: { value, label, disabled? }.",
    value: "Selected option's value. Empty string = nothing selected.",
    onChange: "(value: string) => void.",
    placeholder: "Input placeholder when nothing selected and unfocused.",
    emptyMessage: "Shown when no options match. Default 'No results'.",
    id: "Optional input id for external <label htmlFor>.",
    className: "Wrapper escape hatch. Prefix with `!` to override conflicting defaults.",
  },
  states: ["closed", "open", "empty"],
  a11y: [
    'combobox / listbox / option roles wired; aria-expanded and aria-activedescendant kept in sync.',
    "Enter selects highlighted; Escape closes without changing selection.",
    "Case-insensitive substring filter on label. Disabled options omitted.",
    "State is caller-owned — URL/form/context-driven selection works out of the box.",
  ],
  examples: [
    {
      title: "Controlled",
      code: 'const [v, setV] = useState("");\n<Combobox value={v} onChange={setV}\n  placeholder="Choose a fruit"\n  options={[{value:"apple",label:"Apple"},{value:"banana",label:"Banana"}]} />',
    },
    {
      title: "With external label",
      code: '<label htmlFor="p">Fruit</label>\n<Combobox id="p" value={v} onChange={setV} options={opts} />',
    },
  ],
} as const;
