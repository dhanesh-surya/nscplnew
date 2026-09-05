"use client";

import { useCallback, useEffect, useRef, type CSSProperties } from "react";

export interface LightboxImage {
  src: string;
  caption: string;
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  background: "rgba(6, 12, 20, 0.94)",
  display: "flex",
  flexDirection: "column",
  animation: "lbFade 0.18s ease-out",
};

const roundBtn: CSSProperties = {
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  border: "1px solid rgba(255, 255, 255, 0.28)",
  background: "rgba(255, 255, 255, 0.10)",
  color: "#fff",
  cursor: "pointer",
  backdropFilter: "blur(4px)",
  flex: "0 0 auto",
};

const navBtn: CSSProperties = {
  ...roundBtn,
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: 48,
  height: 48,
  fontSize: "1.9rem",
  lineHeight: 1,
  paddingBottom: 4,
};

const SWIPE_THRESHOLD = 45;

/**
 * Fullscreen image viewer shared by the gallery grid and the site-wide gallery
 * strip. It is *controlled*: the parent owns which index is open, so it can be
 * driven from any layout (grid, marquee, carousel).
 *
 * Handles keyboard (Esc/←/→), background scroll lock, focus restore, touch swipe
 * and neighbour preloading. Renders nothing when `index` is null.
 */
export default function Lightbox({
  images,
  title,
  index,
  onClose,
  onIndex,
}: {
  images: LightboxImage[];
  title: string;
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const count = images.length;

  const go = useCallback(
    (delta: number) => {
      if (index === null || count === 0) return;
      onIndex((index + delta + count) % count);
    },
    [count, index, onIndex]
  );

  // Keyboard: Esc closes, arrows navigate.
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go, onClose]);

  // Lock background scroll while open, move focus in, restore it on close.
  useEffect(() => {
    if (index === null) return;
    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      restoreFocusTo.current?.focus?.();
    };
  }, [index]);

  // Warm the neighbours so prev/next feels instant.
  useEffect(() => {
    if (index === null || count < 2) return;
    for (const i of [(index + 1) % count, (index - 1 + count) % count]) {
      const preload = new Image();
      preload.src = images[i].src;
    }
  }, [index, count, images]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.changedTouches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) > SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1);
  }

  if (index === null) return null;
  const current = images[index];
  if (!current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — image ${index + 1} of ${count}`}
      style={overlayStyle}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          color: "#fff",
        }}
      >
        <span style={{ fontSize: ".85rem", letterSpacing: ".05em", opacity: 0.8 }}>
          {index + 1} / {count}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close fullscreen view"
          style={{ ...roundBtn, width: 40, height: 40, fontSize: "1.25rem" }}
        >
          ✕
        </button>
      </div>

      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px 60px",
          minHeight: 0,
        }}
      >
        {count > 1 ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous image"
            style={{ ...navBtn, left: 10 }}
          >
            ‹
          </button>
        ) : null}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.caption || title}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: "100%",
            maxHeight: "78vh",
            objectFit: "contain",
            borderRadius: 8,
            boxShadow: "0 24px 70px rgba(0, 0, 0, 0.55)",
            animation: "lbPop 0.18s ease-out",
          }}
        />

        {count > 1 ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next image"
            style={{ ...navBtn, right: 10 }}
          >
            ›
          </button>
        ) : null}
      </div>

      <div
        style={{
          padding: "10px 24px 8px",
          textAlign: "center",
          color: "#e5e7eb",
          fontSize: ".92rem",
          minHeight: "1.6em",
        }}
      >
        {current.caption || title}
        {count > 1 ? (
          <div style={{ fontSize: ".75rem", opacity: 0.55, marginTop: 4 }}>
            Use ← → to browse, Esc to close
          </div>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="lb-thumbs" role="tablist" aria-label="Choose image">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to image ${i + 1}`}
              className={i === index ? "active" : ""}
              onClick={(e) => {
                e.stopPropagation();
                onIndex(i);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt="" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
