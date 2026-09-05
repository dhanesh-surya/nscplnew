"use client";

import Link from "next/link";
import { useState } from "react";
import Lightbox, { type LightboxImage } from "@/components/Lightbox";

export interface StripImage extends LightboxImage {
  /** Gallery album the photo belongs to — shown on hover and in the lightbox. */
  title: string;
  /** Category label, e.g. "Cricket". */
  category?: string;
}

/**
 * Site-wide auto-scrolling photo strip. Photos come from the main gallery
 * collection (see `SiteGalleryStrip`), so anything an admin adds at
 * /admin/gallery shows up here automatically.
 *
 * The track renders the list twice and animates to `translateX(-50%)`, which
 * makes the loop seamless. Item spacing uses margin (not `gap`) so the second
 * copy lands exactly where the first began.
 */
export default function GalleryStrip({
  images,
  eyebrow,
  title,
}: {
  images: StripImage[];
  eyebrow?: string;
  title: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  if (images.length === 0) return null;

  // Too few photos to fill the viewport: show them centred, no animation.
  const loop = images.length >= 5;
  const track = loop ? [...images, ...images] : images;
  // Bigger collections scroll a little slower so each photo is readable.
  const duration = Math.min(90, Math.max(30, images.length * 5));

  return (
    <section className="section gallery-strip" aria-label={title}>
      <div className="container strip-head">
        <div className="section-head" style={{ marginBottom: 0 }}>
          {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
          <h2>{title}</h2>
        </div>
        <Link href="/gallery" className="btn btn-ghost">
          View full gallery →
        </Link>
      </div>

      <div className="strip-viewport">
        <ul
          className={`strip-track ${loop ? "is-looping" : "is-static"}`}
          style={loop ? { animationDuration: `${duration}s` } : undefined}
        >
          {track.map((img, i) => {
            const duplicate = loop && i >= images.length;
            const realIndex = i % images.length;
            return (
              <li className="strip-item" key={`${img.src}-${i}`} aria-hidden={duplicate || undefined}>
                <button
                  type="button"
                  onClick={() => setOpen(realIndex)}
                  tabIndex={duplicate ? -1 : undefined}
                  aria-label={`View ${img.title} fullscreen`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.caption || img.title} loading="lazy" />
                  <span className="strip-item-label">
                    <strong>{img.title}</strong>
                    {img.category ? <em>{img.category}</em> : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <Lightbox
        images={images}
        title={title}
        index={open}
        onClose={() => setOpen(null)}
        onIndex={setOpen}
      />
    </section>
  );
}
