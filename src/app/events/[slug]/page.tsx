import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent, getEvents } from "@/lib/content";
import { formatDate, statusLabel } from "@/lib/format";
import Section from "@/components/Section";
import { EventCard } from "@/components/Cards";

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  return { title: event ? event.title : "Event" };
}

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const events = await getEvents();
  const related = events.filter((e) => e.slug !== event.slug && e.category === event.category).slice(0, 3);

  return (
    <>
      <header className="cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.cover} alt="" />
        <div className="scrim" />
        <div className="container inner">
          <span className="eyebrow">{event.category}</span>
          <h1>{event.title}</h1>
          <div className="meta" style={{ color: "rgba(255,255,255,0.9)", display: "flex", gap: 20, flexWrap: "wrap", marginTop: 10 }}>
            <span>📅 {formatDate(event.date)}</span>
            <span>📍 {event.venue}, {event.city}</span>
            <span className={`pill pill-${event.status}`}>● {statusLabel(event.status)}</span>
          </div>
        </div>
      </header>

      <Section>
        <div className="grid grid-3" style={{ alignItems: "start" }}>
          <div className="prose" style={{ gridColumn: "span 2" }}>
            <p className="lead">{event.summary}</p>
            {event.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}

            {event.highlights && (
              <>
                <h3 style={{ marginTop: 24 }}>At a glance</h3>
                <ul className="list-check">
                  {event.highlights.map((h) => (
                    <li key={h}><span className="tick">✓</span><span>{h}</span></li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside>
            <div className="feature">
              <h3 style={{ marginTop: 0 }}>Event details</h3>
              <hr className="divider" style={{ margin: "12px 0" }} />
              <p style={{ margin: "0 0 6px" }}><strong>Sport:</strong> {event.category}</p>
              <p style={{ margin: "0 0 6px" }}><strong>Date:</strong> {formatDate(event.date)}</p>
              <p style={{ margin: "0 0 6px" }}><strong>Venue:</strong> {event.venue}</p>
              <p style={{ margin: "0 0 6px" }}><strong>City:</strong> {event.city}</p>
              <p style={{ margin: "0 0 16px" }}>
                <strong>Status:</strong> {statusLabel(event.status)}
              </p>
              {(event.status === "open" || event.status === "upcoming") && (
                <Link href="/contact" className="btn btn-primary btn-block">Register interest</Link>
              )}
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
