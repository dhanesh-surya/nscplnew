"use client";

import { useState } from "react";
import Lightbox, { type LightboxImage } from "@/components/Lightbox";
import type { EventGalleryItem } from "@/data/types";

interface EventGalleryProps {
  images: EventGalleryItem[];
  title: string;
}

export default function EventGallery({ images, title }: EventGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const normalized = (images || [])
    .map((item) => {
      if (typeof item === "string") {
        return { src: item, caption: "" };
      }
      return {
        src: item?.src || "",
        caption: item?.caption || "",
      };
    })
    .filter((img) => Boolean(img.src));

  const lightboxImages: LightboxImage[] = normalized.map((img, i) => ({
    src: img.src,
    caption: img.caption
      ? `${img.caption} (${i + 1}/${normalized.length})`
      : `${title} — Photo ${i + 1} of ${normalized.length}`,
  }));

  if (normalized.length === 0) return null;

  return (
    <section className="event-gallery" style={{ marginTop: 40 }}>
      <h3
        style={{
          marginBottom: 20,
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "var(--brand-dark, #070F1E)",
        }}
      >
        Event Gallery
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {normalized.map((img, idx) => (
          <div
            key={idx}
            role="button"
            tabIndex={0}
            onClick={() => setOpenIndex(idx)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpenIndex(idx);
              }
            }}
            aria-label={img.caption || `View photo ${idx + 1} of ${normalized.length} fullscreen`}
            className="gallery-item-card"
            style={{
              position: "relative",
              borderRadius: 12,
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm, 0 2px 6px rgba(0,0,0,0.08))",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ position: "relative", height: 200, width: "100%", background: "#070F1E", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.caption || `${title} - Gallery Photo ${idx + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.35s ease",
                }}
              />

              <div className="gallery-card-overlay">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginBottom: 4 }}
                >
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
                <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Click to enlarge</span>
              </div>
            </div>

            {img.caption && (
              <div
                style={{
                  padding: "10px 12px",
                  background: "#ffffff",
                  borderTop: "1px solid #f1f5f9",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#0F172A",
                  lineHeight: 1.35,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={img.caption}
              >
                {img.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      <Lightbox
        images={lightboxImages}
        title={title}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndex={setOpenIndex}
      />

      <style jsx>{`
        .gallery-item-card :global(img) {
          transition: transform 0.35s ease;
        }
        .gallery-item-card:hover :global(img) {
          transform: scale(1.06);
        }
        .gallery-card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10, 25, 47, 0.65);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          opacity: 0;
          transition: opacity 0.25s ease;
          pointer-events: none;
        }
        .gallery-item-card:hover .gallery-card-overlay,
        .gallery-item-card:focus-visible .gallery-card-overlay {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
