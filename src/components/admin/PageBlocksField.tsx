"use client";

import { useMemo, useState } from "react";
import type { PageBlock, PageBlockEntry, PageBlockItem, PageBlockType } from "@/data/types";

const types: { value: PageBlockType; label: string; hint: string }[] = [
  { value: "hero", label: "Hero banner", hint: "Full-width banner with buttons" },
  { value: "richText", label: "Rich text", hint: "Heading and paragraphs" },
  { value: "image", label: "Image", hint: "Upload an image with alt text/caption" },
  { value: "file", label: "File download", hint: "Upload a downloadable document" },
  { value: "cards", label: "Cards", hint: "Repeated title/body/image cards" },
  { value: "stats", label: "Stats", hint: "Number grid, e.g. 320 events" },
  { value: "events", label: "Featured events", hint: "Live list from the Events collection" },
  { value: "news", label: "Latest news", hint: "Live list from the News collection" },
  { value: "sports", label: "Sports", hint: "Live grid from the Sports collection" },
  { value: "testimonials", label: "Testimonials", hint: "Quote cards with attribution" },
  { value: "cta", label: "Call to action", hint: "Banner with buttons" },
  { value: "quote", label: "Quote", hint: "Single testimonial or pull quote" },
  { value: "divider", label: "Divider", hint: "Visual separator" },
  { value: "video", label: "Video", hint: "Embed URL" },
  { value: "html", label: "HTML", hint: "Trusted HTML snippet" },
];

const blank: PageBlock = { id: "", type: "richText", title: "", body: "" };

function blockId(type: PageBlockType): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function newBlock(type: PageBlockType): PageBlock {
  const base: PageBlock = { ...blank, id: blockId(type), type };
  switch (type) {
    case "cards":
      base.items = [{ title: "", body: "", image: "", href: "" }];
      base.columns = "3";
      break;
    case "hero":
      Object.assign(base, {
        eyebrow: "",
        subtitle: "",
        src: "",
        primaryLabel: "Learn more",
        primaryHref: "",
        secondaryLabel: "",
        secondaryHref: "",
      });
      break;
    case "stats":
      base.entries = [{ label: "", value: "", hint: "" }];
      break;
    case "testimonials":
      base.entries = [{ name: "", role: "", quote: "" }];
      break;
    case "events":
    case "news":
      Object.assign(base, { count: 3, linkLabel: "", linkHref: "" });
      break;
    case "sports":
      Object.assign(base, { linkLabel: "", linkHref: "" });
      break;
    case "cta":
      Object.assign(base, {
        body: "",
        primaryLabel: "Learn more",
        primaryHref: "",
        secondaryLabel: "",
        secondaryHref: "",
        centered: false,
      });
      break;
    case "image":
      Object.assign(base, { src: "", alt: "", caption: "" });
      break;
    case "file":
      Object.assign(base, { src: "", fileName: "", label: "Download file" });
      break;
    case "quote":
      Object.assign(base, { body: "", caption: "" });
      break;
    case "video":
      Object.assign(base, { src: "", title: "" });
      break;
    default:
      break;
  }
  return base;
}

function Upload({ name, accept, current, onChange }: { name: string; accept: string; current?: string; onChange: (file: File | null) => void }) {
  return (
    <div style={{ display: "grid", gap: 5 }}>
      <input type="file" name={name} accept={accept} onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
      {current && <small style={{ color: "var(--muted)" }}>Current: {current}</small>}
      <small style={{ color: "var(--muted)" }}>Choose a file to replace the current asset. Leave empty to keep it.</small>
    </div>
  );
}

/** Section chrome: eyebrow / subtitle / tinted background. */
function SectionChrome({ block, update }: { block: PageBlock; update: (patch: Partial<PageBlock>) => void }) {
  return (
    <div style={{ display: "grid", gap: 6, marginBottom: 8 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          value={block.eyebrow ?? ""}
          onChange={(e) => update({ eyebrow: e.target.value })}
          placeholder="Eyebrow (small label above the heading)"
          style={{ flex: "1 1 200px" }}
        />
        <input
          value={block.subtitle ?? ""}
          onChange={(e) => update({ subtitle: e.target.value })}
          placeholder="Subtitle (below the heading)"
          style={{ flex: "2 1 260px" }}
        />
      </div>
      <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: ".82rem", color: "var(--muted)" }}>
        <input
          type="checkbox"
          checked={Boolean(block.sectionAlt)}
          onChange={(e) => update({ sectionAlt: e.target.checked })}
        />
        Tinted section background
      </label>
      <small style={{ color: "var(--muted)", fontSize: ".75rem" }}>
        Leave eyebrow, subtitle and background empty to render this block without section padding.
      </small>
    </div>
  );
}

export default function PageBlocksField({ value }: { value: unknown }) {
  const initial = useMemo(
    () => (Array.isArray(value) ? value.filter((b): b is PageBlock => Boolean(b && typeof b === "object")) : []),
    [value]
  );
  const [blocks, setBlocks] = useState<PageBlock[]>(initial);
  const [selected, setSelected] = useState<PageBlockType>("richText");
  const [assetKeys, setAssetKeys] = useState<string[]>([]);

  function update(index: number, patch: Partial<PageBlock>) {
    setBlocks((prev) => prev.map((block, i) => (i === index ? { ...block, ...patch } : block)));
  }
  function registerAsset(key: string, file: File | null) {
    setAssetKeys((prev) => (file ? [...prev.filter((k) => k !== key), key] : prev.filter((k) => k !== key)));
  }
  function updateCard(blockIndex: number, cardIndex: number, patch: Partial<PageBlockItem>) {
    setBlocks((prev) =>
      prev.map((block, i) =>
        i !== blockIndex
          ? block
          : { ...block, items: (block.items ?? []).map((item, j) => (j === cardIndex ? { ...item, ...patch } : item)) }
      )
    );
  }
  function updateEntry(blockIndex: number, entryIndex: number, patch: PageBlockEntry) {
    setBlocks((prev) =>
      prev.map((block, i) =>
        i !== blockIndex
          ? block
          : { ...block, entries: (block.entries ?? []).map((entry, j) => (j === entryIndex ? { ...entry, ...patch } : entry)) }
      )
    );
  }

  return (
    <div>
      <input type="hidden" name="blocks" value={JSON.stringify(blocks)} />
      <input type="hidden" name="assetKeys" value={JSON.stringify(assetKeys)} />

      <div style={{ display: "grid", gap: 12 }}>
        {blocks.map((block, index) => {
          const patch = (p: Partial<PageBlock>) => update(index, p);
          return (
            <div
              key={block.id || index}
              style={{ border: "1px solid var(--line)", borderRadius: 10, padding: 14, background: "var(--card)" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <strong>
                  {index + 1}. {types.find((t) => t.value === block.type)?.label ?? block.type}
                </strong>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    disabled={index === 0}
                    onClick={() =>
                      setBlocks((p) => {
                        const a = [...p];
                        [a[index - 1], a[index]] = [a[index], a[index - 1]];
                        return a;
                      })
                    }
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    disabled={index === blocks.length - 1}
                    onClick={() =>
                      setBlocks((p) => {
                        const a = [...p];
                        [a[index + 1], a[index]] = [a[index], a[index + 1]];
                        return a;
                      })
                    }
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setBlocks((p) => p.filter((_, i) => i !== index))}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {block.type !== "hero" && block.type !== "divider" && (
                <SectionChrome block={block} update={patch} />
              )}

              {block.type !== "divider" &&
                block.type !== "image" &&
                block.type !== "file" &&
                block.type !== "video" && (
                  <input
                    value={block.title ?? ""}
                    onChange={(e) => patch({ title: e.target.value })}
                    placeholder="Block heading (optional)"
                    style={{ width: "100%", marginBottom: 8 }}
                  />
                )}

              {block.type === "richText" && (
                <textarea
                  value={block.body ?? ""}
                  onChange={(e) => patch({ body: e.target.value })}
                  placeholder="Write paragraphs separated by blank lines"
                  rows={5}
                  style={{ width: "100%" }}
                />
              )}

              {block.type === "hero" && (
                <div style={{ display: "grid", gap: 8 }}>
                  <input value={block.eyebrow ?? ""} onChange={(e) => patch({ eyebrow: e.target.value })} placeholder="Eyebrow (e.g. Play. Compete. Belong.)" />
                  <input value={block.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="Banner heading" />
                  <textarea value={block.subtitle ?? ""} onChange={(e) => patch({ subtitle: e.target.value })} placeholder="Banner text" rows={3} />
                  <Upload
                    name={`${block.id}::image`}
                    accept="image/*"
                    current={block.src}
                    onChange={(file) => registerAsset(`${block.id}::image`, file)}
                  />
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <input value={block.primaryLabel ?? ""} onChange={(e) => patch({ primaryLabel: e.target.value })} placeholder="Primary button label" style={{ flex: "1 1 160px" }} />
                    <input value={block.primaryHref ?? ""} onChange={(e) => patch({ primaryHref: e.target.value })} placeholder="Primary button URL" style={{ flex: "1 1 160px" }} />
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <input value={block.secondaryLabel ?? ""} onChange={(e) => patch({ secondaryLabel: e.target.value })} placeholder="Secondary button label (optional)" style={{ flex: "1 1 160px" }} />
                    <input value={block.secondaryHref ?? ""} onChange={(e) => patch({ secondaryHref: e.target.value })} placeholder="Secondary button URL" style={{ flex: "1 1 160px" }} />
                  </div>
                </div>
              )}

              {block.type === "image" && (
                <div style={{ display: "grid", gap: 8 }}>
                  <Upload name={`${block.id}::image`} accept="image/*" current={block.src} onChange={(file) => registerAsset(`${block.id}::image`, file)} />
                  <input value={block.alt ?? ""} onChange={(e) => patch({ alt: e.target.value })} placeholder="Alt text" />
                  <input value={block.caption ?? ""} onChange={(e) => patch({ caption: e.target.value })} placeholder="Caption (optional)" />
                </div>
              )}

              {block.type === "file" && (
                <div style={{ display: "grid", gap: 8 }}>
                  <Upload name={`${block.id}::file`} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip" current={block.src} onChange={(file) => registerAsset(`${block.id}::file`, file)} />
                  <input value={block.fileName ?? ""} onChange={(e) => patch({ fileName: e.target.value })} placeholder="Displayed file name (optional)" />
                  <input value={block.label ?? "Download file"} onChange={(e) => patch({ label: e.target.value })} placeholder="Button label" />
                </div>
              )}

              {block.type === "cards" && (
                <div style={{ display: "grid", gap: 8 }}>
                  <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: ".82rem", color: "var(--muted)" }}>
                    Columns
                    <select value={block.columns ?? "3"} onChange={(e) => patch({ columns: e.target.value as PageBlock["columns"] })}>
                      <option value="3">3 columns</option>
                      <option value="2">2 columns</option>
                      <option value="auto">Auto fit</option>
                    </select>
                  </label>
                  {(block.items ?? []).map((item, cardIndex) => (
                    <div key={cardIndex} style={{ borderTop: "1px solid var(--line)", paddingTop: 8, display: "grid", gap: 6 }}>
                      <strong>Card {cardIndex + 1}</strong>
                      <input value={item.icon ?? ""} onChange={(e) => updateCard(index, cardIndex, { icon: e.target.value })} placeholder="Icon (emoji, optional)" />
                      <input value={item.title} onChange={(e) => updateCard(index, cardIndex, { title: e.target.value })} placeholder="Card title" />
                      <textarea value={item.body} onChange={(e) => updateCard(index, cardIndex, { body: e.target.value })} placeholder="Card body" rows={2} />
                      <Upload name={`${block.id}::cardImage::${cardIndex}`} accept="image/*" current={item.image} onChange={(file) => registerAsset(`${block.id}::cardImage::${cardIndex}`, file)} />
                      <input value={item.href ?? ""} onChange={(e) => updateCard(index, cardIndex, { href: e.target.value })} placeholder="Card link (optional)" />
                      <button type="button" className="btn btn-ghost" onClick={() => patch({ items: (block.items ?? []).filter((_, j) => j !== cardIndex) })}>
                        Remove card
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-ghost" onClick={() => patch({ items: [...(block.items ?? []), { title: "", body: "", image: "", href: "" }] })}>
                    + Add card
                  </button>
                </div>
              )}

              {block.type === "stats" && (
                <div style={{ display: "grid", gap: 8 }}>
                  {(block.entries ?? []).map((entry, entryIndex) => (
                    <div key={entryIndex} style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                      <input value={entry.value ?? ""} onChange={(e) => updateEntry(index, entryIndex, { value: e.target.value })} placeholder="Value (e.g. 320)" style={{ flex: "1 1 90px" }} />
                      <input value={entry.label ?? ""} onChange={(e) => updateEntry(index, entryIndex, { label: e.target.value })} placeholder="Label (e.g. Events delivered)" style={{ flex: "2 1 180px" }} />
                      <input value={entry.hint ?? ""} onChange={(e) => updateEntry(index, entryIndex, { hint: e.target.value })} placeholder="Hint (optional)" style={{ flex: "2 1 160px" }} />
                      <button type="button" className="btn btn-ghost" onClick={() => patch({ entries: (block.entries ?? []).filter((_, j) => j !== entryIndex) })}>
                        ✕
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-ghost" onClick={() => patch({ entries: [...(block.entries ?? []), { label: "", value: "", hint: "" }] })}>
                    + Add stat
                  </button>
                  <small style={{ color: "var(--muted)", fontSize: ".78rem" }}>
                    Leave the list empty to show the site&apos;s default stats.
                  </small>
                </div>
              )}

              {block.type === "testimonials" && (
                <div style={{ display: "grid", gap: 8 }}>
                  {(block.entries ?? []).map((entry, entryIndex) => (
                    <div key={entryIndex} style={{ borderTop: "1px solid var(--line)", paddingTop: 8, display: "grid", gap: 6 }}>
                      <strong>Quote {entryIndex + 1}</strong>
                      <textarea value={entry.quote ?? ""} onChange={(e) => updateEntry(index, entryIndex, { quote: e.target.value })} placeholder="Quote" rows={2} />
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <input value={entry.name ?? ""} onChange={(e) => updateEntry(index, entryIndex, { name: e.target.value })} placeholder="Name" style={{ flex: "1 1 140px" }} />
                        <input value={entry.role ?? ""} onChange={(e) => updateEntry(index, entryIndex, { role: e.target.value })} placeholder="Role" style={{ flex: "1 1 160px" }} />
                      </div>
                      <button type="button" className="btn btn-ghost" onClick={() => patch({ entries: (block.entries ?? []).filter((_, j) => j !== entryIndex) })}>
                        Remove quote
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-ghost" onClick={() => patch({ entries: [...(block.entries ?? []), { name: "", role: "", quote: "" }] })}>
                    + Add testimonial
                  </button>
                </div>
              )}

              {(block.type === "events" || block.type === "news") && (
                <div style={{ display: "grid", gap: 8 }}>
                  <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: ".82rem", color: "var(--muted)" }}>
                    Number of items
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={block.count ?? 3}
                      onChange={(e) => patch({ count: Number(e.target.value) })}
                      style={{ width: 90 }}
                    />
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <input value={block.linkLabel ?? ""} onChange={(e) => patch({ linkLabel: e.target.value })} placeholder={`"See all" link label`} style={{ flex: "1 1 160px" }} />
                    <input value={block.linkHref ?? ""} onChange={(e) => patch({ linkHref: e.target.value })} placeholder="Link URL (e.g. /events)" style={{ flex: "1 1 160px" }} />
                  </div>
                  <small style={{ color: "var(--muted)", fontSize: ".78rem" }}>
                    Content comes from the {block.type === "events" ? "Events" : "News"} collection, so it stays up to date automatically.
                  </small>
                </div>
              )}

              {block.type === "sports" && (
                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <input value={block.linkLabel ?? ""} onChange={(e) => patch({ linkLabel: e.target.value })} placeholder={`"Browse all sports" link label`} style={{ flex: "1 1 160px" }} />
                    <input value={block.linkHref ?? ""} onChange={(e) => patch({ linkHref: e.target.value })} placeholder="Link URL (e.g. /sports)" style={{ flex: "1 1 160px" }} />
                  </div>
                  <small style={{ color: "var(--muted)", fontSize: ".78rem" }}>
                    Shows every sport in the Sports collection.
                  </small>
                </div>
              )}

              {block.type === "cta" && (
                <div style={{ display: "grid", gap: 8 }}>
                  <textarea value={block.body ?? ""} onChange={(e) => patch({ body: e.target.value })} placeholder="Supporting text" rows={3} />
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <input value={block.primaryLabel ?? ""} onChange={(e) => patch({ primaryLabel: e.target.value })} placeholder="Primary button label" style={{ flex: "1 1 160px" }} />
                    <input value={block.primaryHref ?? ""} onChange={(e) => patch({ primaryHref: e.target.value })} placeholder="Primary button URL" style={{ flex: "1 1 160px" }} />
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <input value={block.secondaryLabel ?? ""} onChange={(e) => patch({ secondaryLabel: e.target.value })} placeholder="Secondary button label (optional)" style={{ flex: "1 1 160px" }} />
                    <input value={block.secondaryHref ?? ""} onChange={(e) => patch({ secondaryHref: e.target.value })} placeholder="Secondary button URL" style={{ flex: "1 1 160px" }} />
                  </div>
                  <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: ".82rem", color: "var(--muted)" }}>
                    <input type="checkbox" checked={Boolean(block.centered)} onChange={(e) => patch({ centered: e.target.checked })} />
                    Centre the text
                  </label>
                </div>
              )}

              {block.type === "quote" && (
                <div style={{ display: "grid", gap: 8 }}>
                  <textarea value={block.body ?? ""} onChange={(e) => patch({ body: e.target.value })} placeholder="Quote" rows={3} />
                  <input value={block.caption ?? ""} onChange={(e) => patch({ caption: e.target.value })} placeholder="Attribution" />
                </div>
              )}

              {block.type === "video" && (
                <div style={{ display: "grid", gap: 8 }}>
                  <input value={block.src ?? ""} onChange={(e) => patch({ src: e.target.value })} placeholder="YouTube/Vimeo/embed URL" />
                  <input value={block.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="Video title" />
                </div>
              )}

              {block.type === "html" && (
                <textarea
                  value={block.body ?? ""}
                  onChange={(e) => patch({ body: e.target.value })}
                  placeholder="Trusted HTML only"
                  rows={6}
                  style={{ width: "100%", fontFamily: "monospace" }}
                />
              )}

              {block.type === "divider" && (
                <div style={{ color: "var(--muted)", fontSize: ".85rem" }}>A horizontal divider will appear here.</div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center", flexWrap: "wrap" }}>
        <select value={selected} onChange={(e) => setSelected(e.target.value as PageBlockType)}>
          {types.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label} — {t.hint}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-ghost" onClick={() => setBlocks((p) => [...p, newBlock(selected)])}>
          + Add block
        </button>
      </div>
    </div>
  );
}
