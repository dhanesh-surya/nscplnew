import type { ReactNode } from "react";

interface CoverProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  children?: ReactNode;
}

export default function Cover({ eyebrow, title, subtitle, image, children }: CoverProps) {
  const subtitleNodes = subtitle
    ? subtitle.split(/\n\s*\n/).map((p, i) => (
        <p key={i} className={i === 0 ? "lead" : undefined} style={{ whiteSpace: "pre-line" }}>
          {p}
        </p>
      ))
    : null;

  if (image) {
    return (
      <section className="cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" />
        <div className="scrim" />
        <div className="container inner">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          {subtitleNodes}
          {children}
        </div>
      </section>
    );
  }

  return (
    <section className="hero">
      <div className="container inner">
        {eyebrow && (
          <span className="eyebrow" style={{ color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.8rem" }}>
            {eyebrow}
          </span>
        )}
        <h1>{title}</h1>
        {subtitleNodes}
        {children}
      </div>
    </section>
  );
}
