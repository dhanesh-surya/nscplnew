import type { ReactNode } from "react";

interface SectionProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  alt?: boolean;
  id?: string;
}

export default function Section({ eyebrow, title, subtitle, children, alt, id }: SectionProps) {
  return (
    <section className={`section ${alt ? "alt" : ""}`} id={id}>
      <div className="container">
        {(eyebrow || title || subtitle) && (
          <div className="section-head">
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
