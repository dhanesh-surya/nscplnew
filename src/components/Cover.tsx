import type { ReactNode } from "react";

interface CoverProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  children?: ReactNode;
}

export default function Cover({ eyebrow, title, subtitle, image, children }: CoverProps) {
  if (image) {
    return (
      <section className="cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" />
        <div className="scrim" />
        <div className="container inner">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
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
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
