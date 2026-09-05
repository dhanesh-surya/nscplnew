"use client";

import { useState } from "react";
import Lightbox, { type LightboxImage } from "@/components/Lightbox";

export type { LightboxImage };

/**
 * Two-column grid of gallery photos. The fullscreen viewer lives in
 * `Lightbox` so the site-wide gallery strip can reuse the same behaviour.
 */
export default function GalleryGrid({
  images,
  title,
}: {
  images: LightboxImage[];
  title: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-2">
        {images.map((img, i) => (
          <figure key={i} className="gallery-thumb card" style={{ margin: 0 }}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`View image ${i + 1} of ${images.length} fullscreen`}
              style={{
                display: "block",
                width: "100%",
                padding: 0,
                border: 0,
                background: "none",
                cursor: "zoom-in",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.caption || title}
                style={{
                  width: "100%",
                  aspectRatio: "4 / 3",
                  objectFit: "cover",
                  borderRadius: 10,
                }}
              />
              <span className="expand-badge" aria-hidden="true">
                ⤢
              </span>
            </button>
            {img.caption ? (
              <figcaption className="body" style={{ padding: "10px 4px 0" }}>
                {img.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      <Lightbox
        images={images}
        title={title}
        index={open}
        onClose={() => setOpen(null)}
        onIndex={setOpen}
      />
    </>
  );
}
