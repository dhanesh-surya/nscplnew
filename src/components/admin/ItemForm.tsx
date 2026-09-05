"use client";

import { saveItemAction } from "@/lib/admin/actions";
import { savePageAction } from "@/lib/admin/page-actions";
import { schemas, type FieldDef } from "@/lib/admin/schema";
import type { CollectionKey } from "@/lib/content";
import PageBlocksField from "./PageBlocksField";
import ImageField from "./ImageField";
import RepeaterField from "./RepeaterField";

function toFormValue(field: FieldDef, value: unknown): string {
  if (value === undefined || value === null) return "";
  if (field.type === "lines") return (value as string[]).join("\n");
  if (field.type === "json") return JSON.stringify(value, null, 2);
  if (field.type === "repeater") return JSON.stringify(Array.isArray(value) ? value : []);
  if (field.type === "boolean") return value ? "on" : "";
  return String(value);
}

function Field({ field, value, collection }: { field: FieldDef; value: unknown; collection: CollectionKey }) {
  const id = `f_${field.name}`;
  const common = { id, name: field.name };

  if (collection === "pages" && field.name === "blocks") {
    return <PageBlocksField value={value} />;
  }
  if (field.type === "image") {
    return (
      <ImageField
        name={field.name}
        id={id}
        defaultValue={toFormValue(field, value)}
        accept={field.accept ?? "image/*"}
      />
    );
  }
  if (field.type === "repeater") {
    return (
      <RepeaterField
        name={field.name}
        id={id}
        defaultValue={toFormValue(field, value)}
        subfields={field.subfields ?? []}
        itemLabel={field.itemLabel ?? "Item"}
      />
    );
  }
  if (field.type === "textarea") {
    return (
      <textarea {...common} defaultValue={toFormValue(field, value)} rows={4} />
    );
  }
  if (field.type === "lines") {
    return (
      <textarea {...common} defaultValue={toFormValue(field, value)} rows={5} />
    );
  }
  if (field.type === "json") {
    return (
      <textarea
        {...common}
        defaultValue={toFormValue(field, value)}
        rows={5}
        style={{ fontFamily: "monospace" }}
      />
    );
  }
  if (field.type === "select") {
    const current = toFormValue(field, value);
    return (
      <select {...common} defaultValue={current}>
        {field.options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === "boolean") {
    return (
      <input
        type="checkbox"
        id={id}
        name={field.name}
        defaultChecked={Boolean(value)}
      />
    );
  }
  if (field.type === "number") {
    return <input {...common} type="number" defaultValue={toFormValue(field, value)} />;
  }
  if (field.type === "date") {
    return <input {...common} type="date" defaultValue={toFormValue(field, value)} />;
  }
  return <input {...common} type="text" defaultValue={toFormValue(field, value)} />;
}

export default function ItemForm({
  collection,
  id,
  values,
}: {
  collection: CollectionKey;
  id: string | null;
  values: Record<string, unknown>;
}) {
  const schema = schemas[collection];
  const action = collection === "pages"
    ? savePageAction.bind(null, id)
    : saveItemAction.bind(null, collection, id);

  const isSystem = collection === "pages" && Boolean(values.system);

  return (
    <form action={action}>
      {schema.fields.map((field) => {
        // Built-in pages (home, about) keep a fixed slug.
        if (isSystem && field.name === "slug") {
          return (
            <div className="field" key={field.name}>
              <label htmlFor={`f_${field.name}`}>{field.label}</label>
              <input
                id={`f_${field.name}`}
                type="text"
                value={String(values.slug ?? "")}
                disabled
                readOnly
                style={{ background: "var(--surface)", color: "var(--muted)" }}
              />
              <input type="hidden" name="slug" value={String(values.slug ?? "")} />
              <div style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: 4 }}>
                This is a built-in page; its URL cannot be changed.
              </div>
            </div>
          );
        }
        return (
          <div className="field" key={field.name}>
            <label htmlFor={`f_${field.name}`}>
              {field.label}
              {field.required ? " *" : ""}
            </label>
            <Field field={field} value={values[field.name]} collection={collection} />
            {field.help && (
              <div style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: 4 }}>
                {field.help}
              </div>
            )}
          </div>
        );
      })}

      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button className="btn btn-primary" type="submit">
          Save
        </button>
        <a href={`/admin/${collection}`} className="btn btn-ghost">
          Cancel
        </a>
      </div>
    </form>
  );
}
