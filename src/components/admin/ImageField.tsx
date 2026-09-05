"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders an asset field with two ways to set the value:
 *  1. a real `<input type="file">` (submitted as `<name>__file`, saved to
 *     /public/uploads and stored as the field value), or
 *  2. the plain text input (`<name>`) for an existing path / external URL.
 *
 * If a file is chosen it takes precedence over the typed path.
 */
export default function ImageField({
  name,
  id,
  defaultValue = "",
  accept = "image/*",
}: {
  name: string;
  id?: string;
  defaultValue?: string;
  accept?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [picked, setPicked] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  function setPreviewUrl(file: File | null) {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const next = file ? URL.createObjectURL(file) : null;
    urlRef.current = next;
    setObjectUrl(next);
  }

  function onPick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setPicked(file ? file.name : null);
    setPreviewUrl(file);
  }

  function clear() {
    setValue("");
    setPicked(null);
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  const typed = value.trim();
  const isDisplayable = /^(https?:\/\/|\/|data:)/i.test(typed);
  const preview = objectUrl ?? (isDisplayable ? typed : "");

  const box: React.CSSProperties = {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  };
  const thumb: React.CSSProperties = {
    width: 104,
    height: 72,
    flex: "0 0 auto",
    borderRadius: 8,
    border: "1px solid var(--line)",
    objectFit: "cover",
    background: "#f8fafc",
  };
  const placeholder: React.CSSProperties = {
    ...thumb,
    display: "grid",
    placeItems: "center",
    borderStyle: "dashed",
    color: "var(--muted)",
    fontSize: ".72rem",
    textAlign: "center",
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={box}>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" style={thumb} />
        ) : (
          <div style={placeholder}>No image</div>
        )}

        <div style={{ flex: 1, minWidth: 220, display: "grid", gap: 6 }}>
          <input
            ref={fileRef}
            type="file"
            id={`${id ?? name}__file`}
            name={`${name}__file`}
            accept={accept}
            onChange={onPick}
          />
          <input
            type="text"
            id={id}
            name={name}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Or paste an image path / URL, e.g. /covers/news.svg"
          />
        </div>

        {(value || picked) && (
          <button type="button" className="btn btn-ghost" onClick={clear}>
            Clear
          </button>
        )}
      </div>

      <small style={{ color: "var(--muted)", fontSize: ".78rem" }}>
        {picked
          ? `Selected: ${picked} — this replaces the current image when you save.`
          : "Choose a file to upload it to the portal. Leave the file empty to keep the current image."}
      </small>
    </div>
  );
}
