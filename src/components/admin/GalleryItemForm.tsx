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

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      {error ? (
        <div
          role="alert"
          className="err"
          style={{
            marginBottom: 16,
            padding: "10px 12px",
            border: "1px solid #e0a1a1",
            borderRadius: 8,
            background: "#fdecec",
            color: "#8a2c2c",
            fontSize: ".9rem",
          }}
        >
          <strong>Could not save:</strong> {error}
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="f_id">ID *</label>
        <input
          id="f_id"
          name="id"
          value={itemId}
          disabled={!!id}
          onChange={(e) => setItemId(e.target.value)}
          required
        />
        {id ? (
          <div style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: 4 }}>
            ID is fixed once created.
          </div>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="f_title">Title *</label>
        <input
          id="f_title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="f_category">Category</label>
        <input
          id="f_category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="f_date">Date</label>
        <input
          id="f_date"
          name="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Images {images.length > 0 && `(${images.length})`}</label>
        <div
          style={{
            border: "1px dashed var(--line)",
            borderRadius: 10,
            padding: 14,
            background: "var(--card)",
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              fontSize: ".85rem",
              color: "var(--muted)",
            }}
          >
            Add one or more images. Give each a caption; remove any you don&apos;t
            want. The first image is used as the cover. Maximum{" "}
            {formatMB(MAX_TOTAL_BYTES)} per save.
          </p>

          {images.length === 0 ? (
            <p style={{ margin: 0, fontSize: ".85rem", color: "var(--muted)" }}>
              No images yet.
            </p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 }}>
              {images.map((img, i) => (
                <li
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "72px 1fr auto",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb(img)}
                    alt={img.caption || "preview"}
                    style={{
                      width: 72,
                      height: 72,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid var(--line)",
                    }}
                  />
                  <div>
                    <input
                      type="text"
                      placeholder="Caption (optional)"
                      value={img.caption}
                      onChange={(e) => updateCaption(i, e.target.value)}
                      style={{ width: "100%" }}
                    />
                    {img.isNew ? (
                      <div style={{ fontSize: ".72rem", color: "var(--accent)", marginTop: 2 }}>
                        New — saved on submit
                      </div>
                    ) : null}
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: ".76rem", fontWeight: 700, marginBottom: 4 }}>
                        Show this image on:
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 12px" }}>
                        {GALLERY_STRIP_PAGES.map((page) => (
                          <label
                            key={page.slug}
                            style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: ".76rem" }}
                          >
                            <input
                              type="checkbox"
                              checked={img.pageSlugs.includes(page.slug)}
                              onChange={() => togglePage(i, page.slug)}
                              style={{ width: "auto" }}
                            />
                            {page.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ padding: "6px 10px" }}
                    onClick={() => removeAt(i)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: 12 }}>
            <label
              className="btn btn-ghost"
              style={{ display: "inline-block", cursor: "pointer" }}
            >
              + Add images
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

      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </button>
        <a href="/admin/gallery" className="btn btn-ghost">
          Cancel
        </a>
      </div>
    </form>
  );
}
