"use client";

import { useEffect, useRef, useState } from "react";

interface MultiImageUploadFieldProps {
  name: string;
  id?: string;
  defaultValue?: unknown;
}

interface UnifiedGalleryItem {
  id: string;
  type: "existing" | "new";
  src: string;
  file?: File;
  preview: string;
  caption: string;
}

function parseInitialValue(val: unknown): UnifiedGalleryItem[] {
  let list: unknown[] = [];
  if (Array.isArray(val)) {
    list = val;
  } else if (typeof val === "string" && val.trim()) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) list = parsed;
      else if (typeof parsed === "string") list = [parsed];
    } catch {
      list = [val];
    }
  }

  const result: UnifiedGalleryItem[] = [];
  list.forEach((item, idx) => {
    if (typeof item === "string" && item.trim()) {
      result.push({
        id: `init-${idx}-${item}`,
        type: "existing",
        src: item.trim(),
        preview: item.trim(),
        caption: "",
      });
    } else if (item && typeof item === "object" && "src" in item) {
      const obj = item as { src?: string; caption?: string };
      const src = typeof obj.src === "string" ? obj.src.trim() : "";
      if (src) {
        result.push({
          id: `init-${idx}-${src}`,
          type: "existing",
          src,
          preview: src,
          caption: typeof obj.caption === "string" ? obj.caption : "",
        });
      }
    }
  });

  return result;
}

export default function MultiImageUploadField({
  name,
  defaultValue = [],
}: MultiImageUploadFieldProps) {
  const [items, setItems] = useState<UnifiedGalleryItem[]>(() =>
    parseInitialValue(defaultValue)
  );
  const [urlInput, setUrlInput] = useState("");
  const [urlCaption, setUrlCaption] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickerInputRef = useRef<HTMLInputElement>(null);

  // Synchronize new files to the hidden file input submitted with the form
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (typeof DataTransfer !== "undefined" && fileInputRef.current) {
        const dt = new DataTransfer();
        for (const item of items) {
          if (item.type === "new" && item.file) {
            dt.items.add(item.file);
          }
        }
        fileInputRef.current.files = dt.files;
      }
    } catch (err) {
      console.warn("Could not sync files with DataTransfer", err);
    }
  }, [items]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.type === "new" && item.preview.startsWith("blob:")) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, [items]);

  function handlePickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const added: UnifiedGalleryItem[] = Array.from(files).map((file) => ({
      id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: "new",
      src: "",
      file,
      preview: URL.createObjectURL(file),
      caption: "",
    }));

    setItems((prev) => [...prev, ...added]);
    e.target.value = "";
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.preview.startsWith("blob:")) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((item) => item.id !== id);
    });
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  }

  function updateCaption(id: string, caption: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, caption } : item))
    );
  }

  function handleAddUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setItems((prev) => [
      ...prev,
      {
        id: `url-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: "existing",
        src: trimmed,
        preview: trimmed,
        caption: urlCaption.trim(),
      },
    ]);
    setUrlInput("");
    setUrlCaption("");
    setShowUrlInput(false);
  }

  // Construct metadata payload for form submission
  let newFileIndex = 0;
  const metaPayload = items.map((item) => {
    if (item.type === "new") {
      const idx = newFileIndex++;
      return {
        type: "new" as const,
        fileIndex: idx,
        caption: item.caption.trim(),
      };
    }
    return {
      type: "existing" as const,
      src: item.src,
      caption: item.caption.trim(),
    };
  });

  const existingOnly = items
    .filter((i) => i.type === "existing")
    .map((i) => i.src);

  return (
    <div
      style={{
        border: "1px solid #cbd5e1",
        borderRadius: 12,
        padding: "18px 20px",
        background: "#f8fafc",
      }}
    >
      {/* Hidden inputs submitted with the form */}
      <input
        type="hidden"
        name={`${name}__meta`}
        value={JSON.stringify(metaPayload)}
      />
      <input
        type="hidden"
        name={`${name}__existing`}
        value={JSON.stringify(existingOnly)}
      />
      <input
        ref={fileInputRef}
        type="file"
        name={`${name}__files`}
        multiple
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* Top action bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0F172A" }}
          >
            Event Photos
          </span>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              padding: "3px 9px",
              borderRadius: 12,
              background: items.length > 0 ? "#e0f2fe" : "#e2e8f0",
              color: items.length > 0 ? "#0369a1" : "#64748B",
            }}
          >
            {items.length} {items.length === 1 ? "photo" : "photos"}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => pickerInputRef.current?.click()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 8,
              background: "#0A192F",
              color: "#ffffff",
              fontSize: "0.88rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>+</span>
            <span>Upload Photos</span>
          </button>
          <input
            ref={pickerInputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePickFiles}
          />

          <button
            type="button"
            onClick={() => setShowUrlInput((v) => !v)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 8,
              background: "#ffffff",
              color: "#0F172A",
              fontSize: "0.88rem",
              fontWeight: 600,
              border: "1px solid #cbd5e1",
              cursor: "pointer",
            }}
          >
            + Add by URL
          </button>
        </div>
      </div>

      {/* Add by URL input form */}
      {showUrlInput && (
        <div
          style={{
            marginBottom: 16,
            padding: 14,
            background: "#ffffff",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Image path or URL (e.g. /media/events/gallery/photo1.jpeg or https://...)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
              style={{
                flex: "2 1 240px",
                padding: "8px 12px",
                fontSize: "0.88rem",
                borderRadius: 6,
                border: "1px solid #cbd5e1",
                outline: "none",
              }}
            />
            <input
              type="text"
              placeholder="Caption (optional)"
              value={urlCaption}
              onChange={(e) => setUrlCaption(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
              style={{
                flex: "1 1 180px",
                padding: "8px 12px",
                fontSize: "0.88rem",
                borderRadius: 6,
                border: "1px solid #cbd5e1",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={handleAddUrl}
              style={{
                padding: "8px 16px",
                background: "#0A192F",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "0.88rem",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Add Photo
            </button>
            <button
              type="button"
              onClick={() => {
                setShowUrlInput(false);
                setUrlInput("");
                setUrlCaption("");
              }}
              style={{
                padding: "8px 12px",
                background: "#f1f5f9",
                color: "#475569",
                fontWeight: 500,
                fontSize: "0.88rem",
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Grid of photos */}
      {items.length === 0 ? (
        <div
          onClick={() => pickerInputRef.current?.click()}
          style={{
            border: "2px dashed #cbd5e1",
            borderRadius: 10,
            padding: "36px 20px",
            textAlign: "center",
            background: "#ffffff",
            cursor: "pointer",
            transition: "border-color 0.2s ease, background 0.2s ease",
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              marginBottom: 8,
              lineHeight: 1,
              color: "#94a3b8",
            }}
          >
            📸
          </div>
          <div
            style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.95rem" }}
          >
            No photos in this gallery yet
          </div>
          <div
            style={{ color: "#64748b", fontSize: "0.82rem", marginTop: 4 }}
          >
            Click here to select multiple photos from your computer, or use "+ Add by URL"
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 14,
          }}
        >
          {items.map((item, idx) => (
            <div
              key={item.id}
              style={{
                position: "relative",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Image Preview Box */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 130,
                  background: "#0F172A",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.preview}
                  alt={item.caption || `Gallery photo ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect fill='%231e293b' width='100' height='100'/><text fill='%2394a3b8' font-family='sans-serif' font-size='11' x='50%' y='50%' text-anchor='middle' dominant-baseline='middle'>Image Error</text></svg>";
                  }}
                />

                {/* Top left order & badge */}
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    left: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      background: "rgba(15, 23, 42, 0.8)",
                      color: "#ffffff",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 4,
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    #{idx + 1}
                  </span>
                  {item.type === "new" && (
                    <span
                      style={{
                        background: "#10b981",
                        color: "#ffffff",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        padding: "2px 5px",
                        borderRadius: 4,
                      }}
                    >
                      NEW
                    </span>
                  )}
                </div>

                {/* Top right remove button */}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  title="Remove this photo"
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.72)",
                    color: "#ffffff",
                    border: "none",
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "0.85rem",
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Card Controls & Reordering */}
              <div
                style={{
                  padding: "6px 8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#f1f5f9",
                  borderTop: "1px solid #e2e8f0",
                }}
              >
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "#64748B",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 100,
                  }}
                  title={item.src || (item.file ? item.file.name : "Uploaded file")}
                >
                  {item.file ? item.file.name : (item.src.split("/").pop() || item.src)}
                </span>
                <div style={{ display: "flex", gap: 3 }}>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, -1)}
                    style={{
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      cursor: idx === 0 ? "default" : "pointer",
                      opacity: idx === 0 ? 0.35 : 1,
                      fontSize: "0.75rem",
                      borderRadius: 4,
                      padding: "2px 6px",
                      color: "#1e293b",
                    }}
                    title="Move left"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    disabled={idx === items.length - 1}
                    onClick={() => moveItem(idx, 1)}
                    style={{
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      cursor: idx === items.length - 1 ? "default" : "pointer",
                      opacity: idx === items.length - 1 ? 0.35 : 1,
                      fontSize: "0.75rem",
                      borderRadius: 4,
                      padding: "2px 6px",
                      color: "#1e293b",
                    }}
                    title="Move right"
                  >
                    ▶
                  </button>
                </div>
              </div>

              {/* Caption Input Section */}
              <div
                style={{
                  padding: "8px 10px",
                  background: "#ffffff",
                  borderTop: "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <label
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: "#475569",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Caption</span>
                  {item.caption && (
                    <span style={{ color: "#0284c7", fontWeight: 500 }}>Saved</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Award presentation"
                  value={item.caption}
                  onChange={(e) => updateCaption(item.id, e.target.value)}
                  style={{
                    width: "100%",
                    fontSize: "0.8rem",
                    padding: "5px 8px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    color: "#0F172A",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helper text */}
      <div
        style={{
          marginTop: 14,
          fontSize: "0.78rem",
          color: "#64748B",
          lineHeight: 1.4,
        }}
      >
        💡 <strong>Tips:</strong> You can upload multiple photos simultaneously, rearrange their display order using ◀ / ▶, and add individual captions for each photo. Captions will appear both in the gallery grid and the fullscreen lightbox viewer.
      </div>
    </div>
  );
}
