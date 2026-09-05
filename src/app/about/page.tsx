import Link from "next/link";
import Cover from "@/components/Cover";
import Section from "@/components/Section";
import StatGrid from "@/components/StatGrid";
import PageRenderer from "@/components/PageRenderer";
import { getSystemPage } from "@/lib/content";
import { stats } from "@/data/site";

const values = [
  { title: "Organisation you can trust", body: "Clear schedules, neutral officiating and transparent communication on every event we run." },
  { title: "Opportunity for all", body: "From schoolyards to corporate cups, we design formats where everyone has a place to compete." },
  { title: "Community over everything", body: "Clubs, fans and volunteers are the reason our events keep growing. We protect that spirit." },
  { title: "Quality experiences", body: "Thoughtful venues, live updates and a smooth matchday — the details players remember." },
];

const milestones = [
  { year: "2014", text: "NSCPL founded with a single local cricket league." },
  { year: "2017", text: "Expanded into football and athletics across three cities." },
  { year: "2021", text: "Launched the national 3x3 basketball circuit." },
  { year: "2026", text: "Crossed 9,000 registered players and 320 events delivered." },
];

export async function generateMetadata() {
  const managed = await getSystemPage("about");
  if (!managed?.seoTitle) return { title: "About" };
  return { title: managed.seoTitle, description: managed.seoDescription };
}

/**
 * The About page is a managed CMS page — see /admin/pages. The layout below is
 * the fallback used when the page has been unpublished or has no sections yet.
 */
export default async function AboutPage() {
  const managed = await getSystemPage("about");
  if (managed && managed.blocks.length) {
    return <PageRenderer blocks={managed.blocks} cover={managed.cover} />;
  }

  return (
    <>
      <Cover
        eyebrow="About us"
        title="We make sport happen"
        subtitle="NSCPL Private Limited is a sports and event management company built on a simple belief: great competition should be well organised, inclusive and fun."
        image={managed?.cover || "/covers/athletics-meet.svg"}
      />

      <Section
        eyebrow="Our story"
        title="From one league to a movement"
        subtitle="What started as a neighbourhood cricket competition is now a multi-sport platform connecting athletes, clubs and communities."
      >
        <div className="prose">
          <p className="lead">
            For over a decade we have planned, promoted and delivered leagues, cups and community
            programmes across India. Our team handles the parts that make or break an event —
            scheduling, venues, officials, live scores and the little touches that turn a matchday
            into a memory.
          </p>
          <p>
            We work with schools, academies, corporate HR teams and local clubs. Some come for a
            one-off tournament; many stay for a season. Either way, our job is the same: take the
            stress out of sport so the people on the field can simply play.
          </p>
        </div>
      </Section>

      <Section alt eyebrow="By the numbers" title="A decade of impact">
        <StatGrid items={stats} />
      </Section>

      <Section eyebrow="What we value" title="The principles behind every event">
        <div className="grid grid-2">
          {values.map((v) => (
            <div className="feature" key={v.title}>
              <h3>{v.title}</h3>
              <p style={{ color: "var(--muted)", margin: 0 }}>{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section alt eyebrow="Milestones" title="How we got here">
        <div className="grid grid-2">
          {milestones.map((m) => (
            <div className="feature" key={m.year} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div className="ico" style={{ background: "var(--brand)", color: "#fff", flex: "none", minWidth: 64 }}>
                {m.year}
              </div>
              <p style={{ margin: 0, color: "var(--ink)" }}>{m.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div style={{ textAlign: "center" }}>
          <h2>Want to run an event with us?</h2>
          <p className="lead" style={{ margin: "0 auto 22px", maxWidth: "50ch" }}>
            Tell us what you have in mind — we&apos;ll help shape it into something your players will love.
          </p>
          <Link href="/contact" className="btn btn-primary">Start a conversation</Link>
        </div>
      </Section>
    </>
  );
}
