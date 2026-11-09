import Link from "next/link";
import Cover from "@/components/Cover";
import Section from "@/components/Section";
import StatGrid from "@/components/StatGrid";
import { EventCard, NewsCard, SportCard } from "@/components/Cards";
import { getEvents, getNews, getSports } from "@/lib/content";
import { stats as defaultStats, testimonials as defaultTestimonials } from "@/data/site";
import type { PageBlock, PageBlockItem } from "@/data/types";

function internalOrExternal(href: string) {
  return href.startsWith("/") ? href : href;
}

function gridClass(columns: PageBlock["columns"]) {
  if (columns === "2") return "grid grid-2";
  if (columns === "auto") return "grid grid-auto";
  return "grid grid-3";
}

/** Buttons shared by hero and cta blocks. */
function Buttons({ block, accent }: { block: PageBlock; accent?: boolean }) {
  const primary = block.primaryLabel || block.label;
  const primaryHref = block.primaryHref || block.href;
  if (!primary || !primaryHref) return null;
  return (
    <div className="actions" style={block.centered ? { justifyContent: "center" } : undefined}>
      <Link href={primaryHref} className={accent ? "btn btn-accent" : "btn btn-primary"}>
        {primary}
      </Link>
      {block.secondaryLabel && block.secondaryHref && (
        <Link
          href={block.secondaryHref}
          className="btn btn-ghost"
          style={accent ? { color: "#fff", borderColor: "rgba(255,255,255,0.4)" } : undefined}
        >
          {block.secondaryLabel}
        </Link>
      )}
    </div>
  );
}

/** "See all events →" style link under a live collection block. */
function MoreLink({ block }: { block: PageBlock }) {
  if (!block.linkHref) return null;
  return (
    <div style={{ marginTop: 28 }}>
      <Link href={block.linkHref} className="btn btn-ghost">
        {block.linkLabel || "See all"} →
      </Link>
    </div>
  );
}

function CardItem({ item }: { item: PageBlockItem }) {
  const isTeam = Boolean(item.image?.includes("/team/"));
  return (
    <div className="feature" style={isTeam ? { textAlign: "center" } : undefined}>
      {item.icon && <div className="ico" style={isTeam ? { margin: "0 auto 14px" } : undefined}>{item.icon}</div>}
      {item.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={item.title || ""}
          style={
            isTeam
              ? {
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  objectFit: "cover",
                  margin: "0 auto 16px",
                  display: "block",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }
              : {
                  width: "100%",
                  aspectRatio: "16 / 9",
                  objectFit: "contain",
                  background: "rgba(0,0,0,0.02)",
                  borderRadius: 8,
                  marginBottom: 12,
                  padding: 8,
                }
          }
        />
      )}
      <h3>{item.title}</h3>
      <p style={{ color: "var(--muted)", whiteSpace: "pre-line" }}>{item.body}</p>
      {item.href && (
        <Link
          className="btn btn-ghost"
          href={item.href}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {item.href.startsWith("mailto:") ? "Contact" : "Learn more →"}
        </Link>
      )}
    </div>
  );
}

async function EventsBlock({ block }: { block: PageBlock }) {
  const events = await getEvents();
  const featured = events
    .filter((e) => e.status === "open" || e.status === "upcoming")
    .slice(0, block.count && block.count > 0 ? block.count : 3);
  return (
    <>
      <div className="grid grid-3">
        {featured.map((e) => (
          <EventCard key={e.slug} event={e} />
        ))}
      </div>
      <MoreLink block={block} />
    </>
  );
}

async function NewsBlock({ block }: { block: PageBlock }) {
  const news = await getNews();
  const latest = news.slice(0, block.count && block.count > 0 ? block.count : 3);
  return (
    <>
      <div className="grid grid-3">
        {latest.map((a) => (
          <NewsCard key={a.slug} article={a} />
        ))}
      </div>
      <MoreLink block={block} />
    </>
  );
}

async function SportsBlock({ block }: { block: PageBlock }) {
  const sports = await getSports();
  return (
    <>
      <div className="grid grid-auto">
        {sports.map((s) => (
          <SportCard key={s.slug} sport={s} />
        ))}
      </div>
      <MoreLink block={block} />
    </>
  );
}

function StatsBlock({ block }: { block: PageBlock }) {
  const entries = block.entries?.length
    ? block.entries.map((e) => ({ label: e.label ?? "", value: e.value ?? "", hint: e.hint }))
    : defaultStats;
  return <StatGrid items={entries} />;
}

function TestimonialsBlock({ block }: { block: PageBlock }) {
  const entries = block.entries?.length
    ? block.entries.map((e) => ({ name: e.name ?? "", role: e.role ?? "", quote: e.quote ?? "" }))
    : defaultTestimonials;
  return (
    <div className="grid grid-3">
      {entries.map((t, i) => (
        <div className="quote" key={`${t.name}-${i}`}>
          <p>“{t.quote}”</p>
          <div className="who">{t.name}</div>
          <div className="role">{t.role}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * Renders the inner content of a block. `showTitle` is false when an enclosing
 * <Section> already renders the heading.
 */
function BlockBody({ block, showTitle, cover }: { block: PageBlock; showTitle: boolean; cover?: string }) {
  const heading = showTitle && block.title ? <h2>{block.title}</h2> : null;

  if (block.type === "hero") {
    return (
      <Cover
        eyebrow={block.eyebrow}
        title={block.title || ""}
        subtitle={block.subtitle}
        image={cover || block.src}
      >
        <Buttons block={block} accent />
      </Cover>
    );
  }

  if (block.type === "stats") {
    return (
      <>
        {heading}
        <StatsBlock block={block} />
      </>
    );
  }

  if (block.type === "testimonials") {
    return (
      <>
        {heading}
        <TestimonialsBlock block={block} />
      </>
    );
  }

  if (block.type === "events") {
    return (
      <>
        {heading}
        <EventsBlock block={block} />
      </>
    );
  }

  if (block.type === "news") {
    return (
      <>
        {heading}
        <NewsBlock block={block} />
      </>
    );
  }

  if (block.type === "sports") {
    return (
      <>
        {heading}
        <SportsBlock block={block} />
      </>
    );
  }

  if (block.type === "richText") {
    return (
      <div className={showTitle ? undefined : "prose"}>
        {heading}
        {(block.body || "")
          .split(/\n\s*\n/)
          .filter(Boolean)
          .map((p, i) => (
            <p key={i} className={i === 0 ? "lead" : undefined}>
              {p}
            </p>
          ))}
      </div>
    );
  }

  if (block.type === "image" && block.src) {
    return (
      <figure className="card" style={{ margin: 0, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.src}
          alt={block.alt || block.title || ""}
          style={{ width: "100%", maxHeight: 620, objectFit: "cover" }}
        />
        {block.caption && <figcaption className="body">{block.caption}</figcaption>}
      </figure>
    );
  }

  if (block.type === "file" && block.src) {
    return (
      <div className="feature">
        <strong>{block.title || block.fileName || "Download"}</strong>
        <p style={{ color: "var(--muted)" }}>{block.fileName}</p>
        <a
          className="btn btn-primary"
          href={internalOrExternal(block.src)}
          download={Boolean(block.fileName)}
          target={block.src.startsWith("http") ? "_blank" : undefined}
          rel={block.src.startsWith("http") ? "noreferrer" : undefined}
        >
          {block.label || "Download file"}
        </a>
      </div>
    );
  }

  if (block.type === "cards") {
    return (
      <>
        {heading}
        <div className={gridClass(block.columns)}>
          {(block.items || []).map((card, i) => (
            <CardItem key={i} item={card} />
          ))}
        </div>
      </>
    );
  }

  if (block.type === "cta") {
    return (
      <section
        className="hero"
        style={{ borderRadius: 14, textAlign: block.centered ? "center" : undefined }}
      >
        <div className="container inner">
          {block.title && <h1>{block.title}</h1>}
          {block.body && <p>{block.body}</p>}
          <Buttons block={block} accent />
        </div>
      </section>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote className="quote">
        <p>“{block.body}”</p>
        <div className="who">{block.caption}</div>
      </blockquote>
    );
  }

  if (block.type === "video" && block.src) {
    return (
      <div className="card" style={{ overflow: "hidden", aspectRatio: "16 / 9" }}>
        <iframe
          title={block.title || "Video"}
          src={block.src}
          style={{ width: "100%", height: "100%", border: 0 }}
          allowFullScreen
        />
      </div>
    );
  }

  if (block.type === "html") {
    return <div dangerouslySetInnerHTML={{ __html: block.body || "" }} />;
  }

  if (block.type === "divider") {
    return <hr style={{ width: "100%", border: 0, borderTop: "1px solid var(--line)" }} />;
  }

  return null;
}

export default async function PageRenderer({ blocks, cover }: { blocks: PageBlock[]; cover?: string }) {
  return (
    <>
      {blocks.map((block) => {
        // A block becomes a full-width site section when it declares section
        // chrome; otherwise it renders inline as before. Hero blocks are always
        // a full-bleed banner (rendered by Cover), so they must never be wrapped
        // in a Section heading — that would duplicate the same eyebrow/title.
        const wrapped =
          block.type !== "hero" &&
          Boolean(block.eyebrow || block.subtitle || block.sectionAlt);
        if (wrapped) {
          return (
            <Section
              key={block.id}
              alt={block.sectionAlt}
              eyebrow={block.eyebrow}
              title={block.title}
              subtitle={block.subtitle}
            >
              <BlockBody block={block} showTitle={false} cover={cover} />
            </Section>
          );
        }
        return (
          <div key={block.id} className="block-gap">
            <BlockBody block={block} showTitle cover={cover} />
          </div>
        );
      })}
    </>
  );
}
