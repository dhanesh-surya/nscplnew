import Link from "next/link";
import { notFound } from "next/navigation";
import { getSport, getSports, getEvents, getTeams } from "@/lib/content";
import { EventCard, TeamCard } from "@/components/Cards";
import Section from "@/components/Section";

export async function generateStaticParams() {
  const sports = await getSports();
  return sports.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sport = await getSport(slug);
  return { title: sport ? sport.name : "Sport" };
}

export default async function SportDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sport = await getSport(slug);
  if (!sport) notFound();

  const events = await getEvents();
  const teams = await getTeams();
  const sportEvents = events.filter((e) => e.category.toLowerCase() === sport.name.toLowerCase());
  const sportTeams = teams.filter((t) => t.sport.toLowerCase() === sport.name.toLowerCase());

  return (
    <>
      <header className="cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={sport.cover} alt="" />
        <div className="scrim" />
        <div className="container inner">
          <span className="eyebrow" style={{ fontSize: "2rem" }}>{sport.icon} {sport.name}</span>
          <p style={{ fontSize: "1.15rem", maxWidth: "52ch", color: "rgba(255,255,255,0.92)", marginTop: 8 }}>
            {sport.tagline}
          </p>
        </div>
      </header>

      <Section>
        <div className="prose">
          <p className="lead">{sport.description}</p>

          <h3 style={{ marginTop: 24 }}>Programmes</h3>
          <ul className="list-check">
            {sport.programs.map((p) => (
              <li key={p}><span className="tick">✓</span><span>{p}</span></li>
            ))}
          </ul>
        </div>
      </Section>

      {sportEvents.length > 0 && (
        <Section alt eyebrow="Competitions" title={`${sport.name} events`}>
          <div className="grid grid-3">
            {sportEvents.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </Section>
      )}

      {sportTeams.length > 0 && (
        <Section eyebrow="Clubs" title={`Teams in ${sport.name}`}>
          <div className="grid grid-3">
            {sportTeams.map((t) => (
              <TeamCard key={t.slug} team={t} />
            ))}
          </div>
        </Section>
      )}

      <Section alt>
        <div style={{ textAlign: "center" }}>
          <h2>Interested in {sport.name}?</h2>
          <p className="lead" style={{ margin: "0 auto 22px", maxWidth: "50ch" }}>
            Reach out and we&apos;ll point you to the right league, circuit or club.
          </p>
          <Link href="/contact" className="btn btn-primary">Get in touch</Link>
        </div>
      </Section>
    </>
  );
}
