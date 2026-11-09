import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent, getEvents } from "@/lib/content";
import { formatDate, statusLabel } from "@/lib/format";
import Section from "@/components/Section";
import EventGallery from "@/components/EventGallery";
import { EventCard } from "@/components/Cards";

export async function generateStaticParams() {
  const events = await getEvents();
  return events.flatMap((e) => [
    { slug: e.slug },
    ...(e.id !== undefined && String(e.id) !== e.slug ? [{ slug: String(e.id) }] : []),
  ]);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  return {
    title: event ? `${event.title} - NSCPL PRIVATE LIMITED` : "Event - NSCPL",
    description: event?.summary,
  };
}

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const events = await getEvents();
  const related = events.filter((e) => e.slug !== event.slug && e.category === event.category).slice(0, 3);
  const locationText =
    event.venue && event.city && event.venue.toLowerCase() !== event.city.toLowerCase()
      ? `${event.venue}, ${event.city}`
      : event.venue || event.city;

  return (
    <>
      <header className="cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.cover || "/media/page_heroes/sports1.jpg"} alt="" />
        <div className="scrim" />
        <div className="container inner">
          <span className="eyebrow">{event.category}</span>
          <h1>{event.title}</h1>
          <div
            className="meta"
            style={{
              color: "rgba(255,255,255,0.9)",
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              marginTop: 10,
            }}
          >
            <span>📅 {formatDate(event.date)}</span>
            <span>📍 {locationText}</span>
            <span className={`pill pill-${event.status}`}>● {statusLabel(event.status)}</span>
          </div>
        </div>
      </header>

      <Section>
        <div className="grid grid-3" style={{ alignItems: "start", gap: 36 }}>
          <div style={{ gridColumn: "span 2" }}>
            {event.cover && (
              <div
                style={{
                  marginBottom: 28,
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                  background: "#070F1E",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.cover}
                  alt={event.title}
                  style={{ width: "100%", maxHeight: 460, objectFit: "cover", display: "block" }}
                />
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ marginTop: 0, fontSize: "1.4rem", fontWeight: 700, color: "var(--brand-dark, #070F1E)" }}>
                Event Description
              </h3>
              <div className="lead" style={{ marginTop: 8 }}>
                <p>{event.summary}</p>
              </div>
              {event.body &&
                event.body
                  .filter((p) => p !== event.summary)
                  .map((para, i) => (
                    <p key={i} style={{ color: "#334155", lineHeight: 1.7 }}>
                      {para}
                    </p>
                  ))}
            </div>

            {event.highlights && event.highlights.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ marginTop: 24, fontSize: "1.2rem", fontWeight: 700 }}>At a glance</h3>
                <ul className="list-check" style={{ marginTop: 12 }}>
                  {event.highlights.map((h) => (
                    <li key={h}>
                      <span className="tick">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {event.gallery && event.gallery.length > 0 && (
              <EventGallery images={event.gallery} title={event.title} />
            )}
          </div>

          <aside style={{ position: "sticky", top: 100 }}>
            <div className="feature" style={{ padding: 24 }}>
              <h3 style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: 700 }}>Event Information</h3>
              <hr className="divider" style={{ margin: "14px 0" }} />
              <p style={{ margin: "0 0 12px", color: "var(--ink)" }}>
                <strong>Date:</strong> <span style={{ color: "var(--muted)" }}>{formatDate(event.date)}</span>
              </p>
              <p style={{ margin: "0 0 12px", color: "var(--ink)" }}>
                <strong>Location:</strong> <span style={{ color: "var(--muted)" }}>{locationText}</span>
              </p>
              <p style={{ margin: "0 0 12px", color: "var(--ink)" }}>
                <strong>Sport:</strong> <span style={{ color: "var(--muted)" }}>{event.category}</span>
              </p>
              <p style={{ margin: "0 0 20px", color: "var(--ink)" }}>
                <strong>Status:</strong>{" "}
                <span className={`pill pill-${event.status}`}>● {statusLabel(event.status)}</span>
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link href="/contact" className="btn btn-primary" style={{ textAlign: "center" }}>
                  Contact Us
                </Link>
                <Link href="/events" className="btn btn-ghost" style={{ textAlign: "center" }}>
                  ← Back to Events
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section alt eyebrow="More like this" title={`Other ${event.category} events`}>
          <div className="grid grid-3">
            {related.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
