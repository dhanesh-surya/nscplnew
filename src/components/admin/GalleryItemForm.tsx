"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveGalleryAction } from "@/lib/admin/actions";
import { GALLERY_STRIP_PAGES } from "@/data/site";

interface ImgEntry {
  src: string; // existing public path
  caption: string;
  pageSlugs: string[];
  file?: File; // present only for newly selected (not-yet-saved) files
  preview?: string; // object URL for new files
  isNew: boolean;
}

// Must stay below `experimental.serverActions.bodySizeLimit` in next.config.mjs
// (25mb). Multipart encoding adds ~1% overhead, so leave headroom.
const MAX_TOTAL_BYTES = 24 * 1024 * 1024;

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function toInitialImages(values: Record<string, unknown>): ImgEntry[] {
  const stored = values.images as
    | { src: string; caption?: string; pageSlugs?: string[] }[]
    | undefined;
  if (stored && stored.length) {
    return stored.map((i) => ({
      src: i.src,
      caption: i.caption ?? "",
      pageSlugs: Array.isArray(i.pageSlugs) ? i.pageSlugs : [],
      isNew: false,
    }));
  }
  const single = values.image ? String(values.image) : "";
  if (single) return [{ src: single, caption: "", pageSlugs: [], isNew: false }];
  return [];
}

export default function GalleryItemForm({
  id,
  values,
}: {
  id: string | null;
  values: Record<string, unknown>;
}) {
  const [itemId, setItemId] = useState(id ?? String(values.id ?? ""));
  const [title, setTitle] = useState(String(values.title ?? ""));
  const [category, setCategory] = useState(String(values.category ?? ""));
  const [date, setDate] = useState(String(values.date ?? ""));
  const [images, setImages] = useState<ImgEntry[]>(toInitialImages(values));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function onAddFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const added: ImgEntry[] = Array.from(files).map((f) => ({
      src: "",
      caption: "",
      pageSlugs: [],
      file: f,
      preview: URL.createObjectURL(f),
      isNew: true,
    }));
    setImages((prev) => [...prev, ...added]);
    e.target.value = ""; // allow selecting the same file again
  }

  function updateCaption(i: number, cap: string) {
    setImages((prev) =>
      prev.map((img, idx) => (idx === i ? { ...img, caption: cap } : img))
    );
  }

  function removeAt(i: number) {
    setImages((prev) => {
      const target = prev[i];
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((_, idx) => idx !== i);
    });
  }

  function togglePage(i: number, slug: string) {
    setImages((prev) =>
      prev.map((img, idx) => {
        if (idx !== i) return img;
        const has = img.pageSlugs.includes(slug);
        return {
          ...img,
          pageSlugs: has
            ? img.pageSlugs.filter((value) => value !== slug)
            : [...img.pageSlugs, slug],
        };
      })
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    // Pre-flight check: the server rejects bodies over 25 MB with a 413 that
    // never reaches our action. Catch it here so the user sees a real message.
    const newFiles = images.filter((img) => img.isNew && img.file);
    const totalBytes = newFiles.reduce((sum, img) => sum + (img.file?.size ?? 0), 0);
    if (totalBytes > MAX_TOTAL_BYTES) {
      setError(
        `These images total ${formatMB(totalBytes)}, but the upload limit is ` +
          `${formatMB(MAX_TOTAL_BYTES)}. Please select fewer or smaller images.`
      );
      setPending(false);
      return;
    }

    const fd = new FormData();
    fd.set("id", itemId);
    fd.set("title", title);
    fd.set("category", category);
    fd.set("date", date);

    const meta: {
      src: string;
      caption: string;
      pageSlugs: string[];
      fileKey: string | null;
    }[] = [];
    let newIdx = 0;
    for (const img of images) {
      if (img.isNew && img.file) {
        const key = `newfile_${newIdx}`;
        fd.append(key, img.file);
        meta.push({
          src: "",
          caption: img.caption,
          pageSlugs: img.pageSlugs,
          fileKey: key,
        });
        newIdx++;
      } else if (!img.isNew && img.src) {
        meta.push({
          src: img.src,
          caption: img.caption,
          pageSlugs: img.pageSlugs,
          fileKey: null,
        });
      }
    }
    fd.set("meta", JSON.stringify(meta));

    const res = await saveGalleryAction(id, fd);

    if (res?.error) {
      setError(res.error);
      setPending(false);
      return;
    }

    setPending(false);
    router.push("/admin/gallery");
    router.refresh();
  }

  const thumb = (img: ImgEntry) => img.preview || img.src;

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontWeight: 600,
    fontSize: "0.92rem",
    color: "#0F172A",
    marginBottom: 6,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    fontSize: "0.95rem",
    color: "#0F172A",
    background: "#ffffff",
    boxSizing: "border-box",
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      {error ? (
        <div
          role="alert"
          style={{
            marginBottom: 20,
            padding: "12px 16px",
            border: "1px solid #fca5a5",
            borderRadius: 8,
            background: "#fef2f2",
            color: "#991b1b",
            fontSize: "0.92rem",
            fontWeight: 500,
          }}
        >
          <strong>Could not save:</strong> {error}
        </div>
      ) : null}

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="f_id" style={labelStyle}>
          ID *
        </label>
        <input
          id="f_id"
          name="id"
          value={itemId}
          disabled={!!id}
          onChange={(e) => setItemId(e.target.value)}
          required
          style={{
            ...inputStyle,
            background: id ? "#f1f5f9" : "#ffffff",
            color: id ? "#1e293b" : "#0F172A",
            fontWeight: id ? 600 : 400,
            cursor: id ? "not-allowed" : "text",
            borderColor: "#cbd5e1",
          }}
        />
        {id ? (
          <div style={{ fontSize: "0.82rem", color: "#64748B", marginTop: 5 }}>
            ID is fixed once created.
          </div>
        ) : null}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="f_title" style={labelStyle}>
          Title *
        </label>
        <input
          id="f_title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="f_category" style={labelStyle}>
          Category
        </label>
        <input
          id="f_category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label htmlFor="f_date" style={labelStyle}>
          Date
        </label>
        <input
          id="f_date"
          name="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 28 }}>
        <label style={labelStyle}>
          Images {images.length > 0 && `(${images.length})`}
        </label>
        <div
          style={{
            border: "2px dashed #cbd5e1",
            borderRadius: 12,
            padding: "20px",
            background: "#f8fafc",
          }}
        >
          <p
            style={{
              margin: "0 0 16px",
              fontSize: "0.88rem",
              color: "#475569",
              lineHeight: 1.5,
            }}
          >
            Add one or more images. Give each a caption; remove any you don&apos;t
            want. The first image is used as the cover. Maximum{" "}
            {formatMB(MAX_TOTAL_BYTES)} per save.
          </p>

          {images.length === 0 ? (
            <div
              style={{
                padding: "24px 16px",
                textAlign: "center",
                fontSize: "0.9rem",
                color: "#64748B",
                background: "#ffffff",
                borderRadius: 8,
                border: "1px dashed #e2e8f0",
              }}
            >
              No images in this album yet.
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 14 }}>
              {images.map((img, i) => (
                <li
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "84px 1fr auto",
                    gap: 16,
                    alignItems: "center",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    padding: "14px 16px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb(img)}
                    alt={img.caption || "preview"}
                    style={{
                      width: 84,
                      height: 84,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      background: "#f1f5f9",
                    }}
                  />
                  <div>
                    <input
                      type="text"
                      placeholder="Caption (optional)"
                      value={img.caption}
                      onChange={(e) => updateCaption(i, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "9px 13px",
                        border: "1px solid #cbd5e1",
                        borderRadius: 6,
                        fontSize: "0.92rem",
                        color: "#0F172A",
                        background: "#ffffff",
                        boxSizing: "border-box",
                      }}
                    />
                    {img.isNew ? (
                      <div style={{ fontSize: "0.75rem", color: "#0284c7", fontWeight: 600, marginTop: 4 }}>
                        ● New — will be uploaded on save
                      </div>
                    ) : null}
                    <div style={{ marginTop: 10 }}>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: "#334155",
                          marginBottom: 6,
                        }}
                      >
                        Show this image on:
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 10px" }}>
                        {GALLERY_STRIP_PAGES.map((page) => {
                          const active = img.pageSlugs.includes(page.slug);
                          return (
                            <label
                              key={page.slug}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: "0.8rem",
                                padding: "4px 10px",
                                borderRadius: 6,
                                cursor: "pointer",
                                userSelect: "none",
                                background: active ? "#e0f2fe" : "#f1f5f9",
                                color: active ? "#0369a1" : "#475569",
                                border: active ? "1px solid #7dd3fc" : "1px solid #e2e8f0",
                                fontWeight: active ? 600 : 500,
                                transition: "all 0.15s ease",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={active}
                                onChange={() => togglePage(i, page.slug)}
                                style={{ accentColor: "#0284c7", cursor: "pointer" }}
                              />
                              {page.label}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 6,
                      border: "1px solid #fecaca",
                      background: "#fef2f2",
                      color: "#b91c1c",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fee2e2";
                      e.currentTarget.style.color = "#991b1b";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fef2f2";
                      e.currentTarget.style.color = "#b91c1c";
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: 16 }}>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0F172A",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#94a3b8";
                e.currentTarget.style.background = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.background = "#ffffff";
              }}
            >
              <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>+</span>
              <span>Add images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onAddFiles}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 24,
          paddingTop: 18,
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <button
          type="submit"
          disabled={pending}
          style={{
            background: "#0A192F",
            color: "#ffffff",
            padding: "12px 28px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.95rem",
            border: "none",
            cursor: pending ? "not-allowed" : "pointer",
            opacity: pending ? 0.7 : 1,
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          }}
        >
          {pending ? "Saving…" : "Save Changes"}
        </button>
        <a
          href="/admin/gallery"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "12px 22px",
            borderRadius: 8,
            background: "#f1f5f9",
            color: "#334155",
            fontWeight: 600,
            fontSize: "0.95rem",
            border: "1px solid #cbd5e1",
            textDecoration: "none",
          }}
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
