import Cover from "@/components/Cover";
import Section from "@/components/Section";
import { EventCard } from "@/components/Cards";
import { getEvents } from "@/lib/content";

export const metadata = {
  title: "Events - NSCPL PRIVATE LIMITED",
  description:
    "Discover all our exciting sports events and tournaments. Stay updated with the latest happenings in the world of sports.",
};

export default async function EventsPage() {
  const events = await getEvents();
  const sportsCount = new Set(events.map((e) => e.category)).size;

  return (
    <>
      <Cover
        eyebrow="Sports Tournaments & Competitions"
        title="All Events"
        subtitle="Discover all our exciting sports events and tournaments. Stay updated with the latest happenings in the world of sports."
        image="/media/page_heroes/sports1.jpg"
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 20,
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              color: "var(--brand)",
              padding: "8px 20px",
              borderRadius: 24,
              fontWeight: 600,
              fontSize: "0.95rem",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            <span>📅</span>
            <span>{events.length} Events</span>
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              color: "var(--brand)",
              padding: "8px 20px",
              borderRadius: 24,
              fontWeight: 600,
              fontSize: "0.95rem",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            <span>🏆</span>
            <span>{sportsCount} Sports</span>
          </div>
        </div>
      </Cover>

      <Section
        eyebrow="Upcoming & Past Events"
        title="Sports Events & Tournaments"
        subtitle="Explore details and updates from our competitions."
      >
        <div className="grid grid-auto">
          {events.map((e) => (
            <EventCard key={e.slug} event={e} />
          ))}
        </div>
      </Section>
    </>
  );
}
