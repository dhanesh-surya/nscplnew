import Cover from "@/components/Cover";
import Section from "@/components/Section";
import { EventCard } from "@/components/Cards";
import { getEvents } from "@/lib/content";

export const metadata = { title: "Events" };

export default async function EventsPage() {
  const events = await getEvents();
  const upcoming = events.filter((e) => e.status !== "past");
  const shown = upcoming.length ? upcoming : events;

  return (
    <>
      <Cover
        eyebrow="Events"
        title="Leagues, tournaments & festivals"
        subtitle="Browse our upcoming and open competitions. Most accept club, corporate or community entries."
        image="/covers/football-trophy.svg"
      />

      <Section
        eyebrow="All events"
        title={`${shown.length} event${shown.length === 1 ? "" : "s"} on the calendar`}
        subtitle="Registration status is shown on each card — open events are accepting entries now."
      >
        <div className="grid grid-auto">
          {shown.map((e) => (
            <EventCard key={e.slug} event={e} />
          ))}
        </div>
      </Section>
    </>
  );
}
