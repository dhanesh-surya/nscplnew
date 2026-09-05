"use client";

import { useState } from "react";
import type { SubFieldDef } from "@/lib/admin/schema";

type Row = Record<string, string>;

function emptyRow(subfields: SubFieldDef[]): Row {
  return Object.fromEntries(subfields.map((sf) => [sf.name, ""]));
}

/** Normalises whatever is stored into a list of string-keyed rows. */
function toRows(raw: string, subfields: SubFieldDef[]): Row[] | null {
  if (!raw.trim()) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed)) return null;
  return parsed.map((entry) => {
    const source = entry && typeof entry === "object" ? (entry as Record<string, unknown>) : {};
    // Keep the declared columns first, then any extra keys already stored,
    // so switching to the row editor never drops data.
    const row = emptyRow(subfields);
    for (const [key, value] of Object.entries(source)) {
      row[key] = value === undefined || value === null ? "" : String(value);
    }
    return row;
  });
}

const rowStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
  gridTemplateColumns: "1fr",
  alignItems: "center",
  padding: 10,
  border: "1px solid var(--line)",
  borderRadius: 8,
  background: "#fff",
};

/**
 * Repeatable group of inputs (e.g. team members). Renders one row of text
 * inputs per entry with add / remove / reorder controls, and submits the
 * result as a single JSON field so the server needs no special handling.
 *
 * If the stored value can't be parsed as an array, it falls back to a raw
 * textarea so no data is silently dropped.
 */
export default function RepeaterField({
  name,
  id,
  defaultValue = "",
  subfields,
  itemLabel = "Item",
  minRows = 0,
}: {
  name: string;
  id?: string;
  defaultValue?: string;
  subfields: SubFieldDef[];
  itemLabel?: string;
  minRows?: number;
}) {
  const initial = toRows(defaultValue, subfields);
  const [unparsed, setUnparsed] = useState(initial === null);
  const [raw, setRaw] = useState(defaultValue);
  const [rows, setRows] = useState<Row[]>(() =>
    initial && initial.length ? initial : Array.from({ length: minRows }, () => emptyRow(subfields))
  );

  function update(index: number, key: string, value: string) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow(subfields)]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function move(index: number, delta: number) {
    setRows((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  if (unparsed) {
    return (
      <div style={{ display: "grid", gap: 6 }}>
        <textarea
          id={id}
          name={name}
          rows={5}
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
          style={{ fontFamily: "monospace" }}
        />
        <small style={{ color: "var(--muted)", fontSize: ".78rem" }}>
          This value isn&apos;t a simple list, so it&apos;s shown as raw JSON. Clear it to switch back
          to the row editor.
        </small>
      </div>
    );
  }

  const gridTemplate = subfields
    .map((sf) => `${sf.span && sf.span > 1 ? sf.span : 1}fr`)
    .concat("auto")
    .join(" ");

  // Blank rows are noise in the stored data — drop them on submit.
  const filled = rows.filter((row) =>
    subfields.some((sf) => (row[sf.name] ?? "").trim() !== "")
  );

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <input type="hidden" name={name} value={JSON.stringify(filled)} readOnly />

      {rows.length === 0 && (
        <div
          style={{
            padding: "14px 12px",
            border: "1px dashed var(--line)",
            borderRadius: 8,
            color: "var(--muted)",
            fontSize: ".85rem",
            textAlign: "center",
          }}
        >
          No {itemLabel.toLowerCase()}s yet.
        </div>
      )}

      {rows.map((row, index) => (
        <div key={index} style={{ display: "grid", gap: 6 }}>
          <div style={{ ...rowStyle, gridTemplateColumns: gridTemplate }}>
            {subfields.map((sf) => (
              <div key={sf.name} style={{ display: "grid", gap: 4 }}>
                <label
                  htmlFor={`${id ?? name}_${index}_${sf.name}`}
                  style={{ fontSize: ".75rem", fontWeight: 600, color: "var(--muted)" }}
                >
                  {sf.label}
                </label>
                <input
                  id={`${id ?? name}_${index}_${sf.name}`}
                  type="text"
                  value={row[sf.name] ?? ""}
                  placeholder={sf.placeholder}
                  onChange={(event) => update(index, sf.name, event.target.value)}
                />
              </div>
            ))}

            <div style={{ display: "flex", gap: 4, alignItems: "flex-end" }}>
              <button
                type="button"
                className="btn btn-ghost"
                title={`Move ${itemLabel.toLowerCase()} up`}
                aria-label={`Move ${itemLabel.toLowerCase()} up`}
                disabled={index === 0}
                onClick={() => move(index, -1)}
                style={{ padding: "4px 8px" }}
              >
                ↑
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                title={`Move ${itemLabel.toLowerCase()} down`}
                aria-label={`Move ${itemLabel.toLowerCase()} down`}
                disabled={index === rows.length - 1}
                onClick={() => move(index, 1)}
                style={{ padding: "4px 8px" }}
              >
                ↓
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                title={`Remove ${itemLabel.toLowerCase()}`}
                onClick={() => removeRow(index)}
                style={{ padding: "4px 8px" }}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      ))}

      <div>
        <button type="button" className="btn btn-ghost" onClick={addRow}>
          + Add {itemLabel.toLowerCase()}
        </button>
      </div>
    </div>
  );
}
