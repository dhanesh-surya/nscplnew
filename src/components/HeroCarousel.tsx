"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { HeroBanner } from "@/data/types";

/**
 * Full-bleed hero carousel for the homepage. Renders every active hero banner as
 * a slide, auto-advances on a timer, pauses on hover, and offers arrow + dot
 * navigation. Banners (and their order) are managed by the admin at
 * /admin/heroes, so the whole section is editor-driven.
 */
export default function HeroCarousel({ banners }: { banners: HeroBanner[] }) {
  const count = banners.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (i: number) => setIndex(((i % count) + count) % count),
    [count]
  );

  // Auto-advance unless paused or there's only one slide.
  useEffect(() => {
    if (count <= 1 || paused) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, 6000);
    return () => clearInterval(id);
  }, [count, paused]);

  if (count === 0) return null;

  return (
    <section
      className="hero-carousel"
      aria-roledescription="carousel"
      aria-label="Featured banners"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="hero-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((b, i) => (
          <div
            className={`hero-slide ${b.image ? "" : "hero-slide--gradient"}`}
            key={b.id}
            aria-hidden={i !== index}
          >
            {b.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="hero-slide-img"
                src={b.image}
                alt=""
                // Only the first slide is needed for the initial paint; the rest
                // load lazily so the carousel doesn't block LCP.
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "low"}
              />
            )}
            <div className="hero-slide-scrim" />
            <div className="container hero-slide-content">
              {b.eyebrow && <span className="eyebrow">{b.eyebrow}</span>}
              <h1>{b.title}</h1>
              {b.subtitle && <p>{b.subtitle}</p>}
              {b.ctaLabel && (
                <div className="actions">
                  <Link href={b.ctaHref || "#"} className="btn btn-accent">
                    {b.ctaLabel}
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            className="hero-arrow hero-arrow--prev"
            aria-label="Previous slide"
            onClick={() => goTo(index - 1)}
          >
            &#8249;
          </button>
          <button
            type="button"
            className="hero-arrow hero-arrow--next"
            aria-label="Next slide"
            onClick={() => goTo(index + 1)}
          >
            &#8250;
          </button>
          <div className="hero-dots" role="tablist" aria-label="Choose slide">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                className={`hero-dot ${i === index ? "is-active" : ""}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-selected={i === index}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
