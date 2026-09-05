import Link from "next/link";
import Cover from "@/components/Cover";
import Section from "@/components/Section";
import StatGrid from "@/components/StatGrid";
import PageRenderer from "@/components/PageRenderer";
import HeroCarousel from "@/components/HeroCarousel";
import { EventCard, NewsCard, SportCard } from "@/components/Cards";
import { getEvents, getHeroes, getNews, getSports, getSystemPage } from "@/lib/content";
import { homeFeatures, site, stats, testimonials } from "@/data/site";

export async function generateMetadata() {
  const managed = await getSystemPage("home");
  if (!managed?.seoTitle) return {};
  return { title: managed.seoTitle, description: managed.seoDescription };
}

/**
 * The Home page is a managed CMS page: admins edit, add, remove and reorder its
 * sections from /admin/pages. The layout below is the fallback used when the
 * page has been unpublished or has no sections yet.
 */
export default async function HomePage() {
  const managed = await getSystemPage("home");
  const heroes = await getHeroes();
  if (managed && managed.blocks.length) {
    // The homepage banner IS the admin-managed carousel. Drop any `hero` block
    // from the managed page so the same headline never renders twice (once as a
    // slide, once as a static banner underneath it).
    const blocks = heroes.length
      ? managed.blocks.filter((b) => b.type !== "hero")
      : managed.blocks;
    if (blocks.length) {
      return (
        <>
          {heroes.length > 0 && <HeroCarousel banners={heroes} />}
          <PageRenderer blocks={blocks} cover={managed.cover} />
        </>
      );
    }
  }

  const events = await getEvents();
  const news = await getNews();
  const sports = await getSports();

  const featuredEvents = events
    .filter((e) => e.status === "open" || e.status === "upcoming")
    .slice(0, 3);
  const latestNews = news.slice(0, 3);

  return (
    <>
      {heroes.length > 0 ? (
        <HeroCarousel banners={heroes} />
      ) : (
        <Cover
          eyebrow={site.tagline}
          title={`Welcome to ${site.name}`}
          subtitle={site.description}
          image={managed?.cover}
        >
          <div className="actions">
            <Link href="/events" className="btn btn-accent">Explore events</Link>
            <Link href="/contact" className="btn btn-ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>
              Get in touch
            </Link>
          </div>
        </Cover>
      )}

      <Section alt>
        <StatGrid items={stats} />
      </Section>

      <Section
        eyebrow="Why NSCPL"
        title="Sport, organised properly"
        subtitle="We take care of the logistics so players, clubs and fans can focus on what they love."
      >
        <div className="grid grid-3">
          {homeFeatures.map((f) => (
            <div className="feature" key={f.title}>
              <div className="ico">{f.icon}</div>
              <h3>{f.title}</h3>
              <p style={{ color: "var(--muted)", margin: 0 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Up next"
        title="Featured events"
        subtitle="Open registrations and upcoming competitions you can be part of."
      >
        <div className="grid grid-3">
          {featuredEvents.map((e) => (
            <EventCard key={e.slug} event={e} />
          ))}
        </div>
        <div style={{ marginTop: 28 }}>
          <Link href="/events" className="btn btn-ghost">See all events →</Link>
        </div>
      </Section>

      <Section alt eyebrow="What we run" title="Sports at NSCPL">
        <div className="grid grid-auto">
          {sports.map((s) => (
            <SportCard key={s.slug} sport={s} />
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <Link href="/sports" className="btn btn-ghost">Browse all sports →</Link>
        </div>
      </Section>

      <Section
        eyebrow="From the sidelines"
        title="Latest news"
        subtitle="Updates from across our leagues, circuits and community programmes."
      >
        <div className="grid grid-3">
          {latestNews.map((a) => (
            <NewsCard key={a.slug} article={a} />
          ))}
        </div>
        <div style={{ marginTop: 28 }}>
          <Link href="/news" className="btn btn-ghost">Read all news →</Link>
        </div>
      </Section>

      <Section alt>
        <div className="grid grid-3">
          {testimonials.map((t) => (
            <div className="quote" key={t.name}>
              <p>“{t.quote}”</p>
              <div className="who">{t.name}</div>
              <div className="role">{t.role}</div>
            </div>
          ))}
        </div>
      </Section>

      <section className="hero" style={{ marginTop: 8 }}>
        <div className="container inner" style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>Ready to play?</h1>
          <p style={{ margin: "0 auto 22px", maxWidth: "52ch" }}>
            Whether you&apos;re a club, a company or a community group, we&apos;ll help you run
            an event people remember.
          </p>
          <div className="actions" style={{ justifyContent: "center" }}>
            <Link href="/contact" className="btn btn-accent">Talk to our team</Link>
            <Link href="/teams" className="btn btn-ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>
              Meet the teams
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
