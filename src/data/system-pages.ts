import type { PageBlock, PageItem } from "./types";
import { homeFeatures, site, stats, testimonials } from "./site";

/**
 * Default content for the two built-in pages (Home and About).
 *
 * These mirror the sections that used to be hardcoded in `src/app/page.tsx` and
 * `src/app/about/page.tsx`. They are inserted once as *system* pages so an
 * admin can edit, reorder, add or remove every section from the CMS — while the
 * original layouts remain as a fallback if either page is unpublished.
 *
 * Block ids are stable so uploaded assets keep mapping to the right block.
 */

const now = () => new Date().toISOString();

function homeBlocks(): PageBlock[] {
  // NOTE: no `hero` block here on purpose. The homepage banner is the
  // admin-managed carousel (/admin/heroes -> HeroCarousel), so a hero block
  // would just duplicate it. HomePage also filters hero blocks out defensively.
  return [
    {
      id: "home-stats",
      type: "stats",
      sectionAlt: true,
      entries: stats.map((s) => ({ label: s.label, value: s.value, hint: s.hint })),
    },
    {
      id: "home-features",
      type: "cards",
      eyebrow: "Why NSCPL",
      title: "Sport, organised properly",
      subtitle:
        "We take care of the logistics so players, clubs and fans can focus on what they love.",
      columns: "3",
      items: homeFeatures.map((f) => ({ title: f.title, body: f.body, icon: f.icon })),
    },
    {
      id: "home-events",
      type: "events",
      eyebrow: "Up next",
      title: "Featured events",
      subtitle: "Open registrations and upcoming competitions you can be part of.",
      count: 3,
      linkLabel: "See all events",
      linkHref: "/events",
    },
    {
      id: "home-sports",
      type: "sports",
      sectionAlt: true,
      eyebrow: "What we run",
      title: "Sports at NSCPL",
      linkLabel: "Browse all sports",
      linkHref: "/sports",
    },
    {
      id: "home-news",
      type: "news",
      eyebrow: "From the sidelines",
      title: "Latest news",
      subtitle: "Updates from across our leagues, circuits and community programmes.",
      count: 3,
      linkLabel: "Read all news",
      linkHref: "/news",
    },
    {
      id: "home-testimonials",
      type: "testimonials",
      sectionAlt: true,
      entries: testimonials.map((t) => ({ name: t.name, role: t.role, quote: t.quote })),
    },
    {
      id: "home-cta",
      type: "cta",
      centered: true,
      title: "Ready to play?",
      body: "Whether you're a club, a company or a community group, we'll help you run an event people remember.",
      primaryLabel: "Talk to our team",
      primaryHref: "/contact",
      secondaryLabel: "Meet the teams",
      secondaryHref: "/teams",
    },
  ];
}

function aboutBlocks(): PageBlock[] {
  return [
    {
      id: "about-hero",
      type: "hero",
      eyebrow: "About us",
      title: "We make sport happen",
      subtitle:
        "NSCPL Private Limited is a sports and event management company built on a simple belief: great competition should be well organised, inclusive and fun.",
      src: "/covers/athletics-meet.svg",
    },
    {
      id: "about-story",
      type: "richText",
      eyebrow: "Our story",
      title: "From one league to a movement",
      subtitle:
        "What started as a neighbourhood cricket competition is now a multi-sport platform connecting athletes, clubs and communities.",
      body:
        "For over a decade we have planned, promoted and delivered leagues, cups and community programmes across India. Our team handles the parts that make or break an event — scheduling, venues, officials, live scores and the little touches that turn a matchday into a memory.\n\nWe work with schools, academies, corporate HR teams and local clubs. Some come for a one-off tournament; many stay for a season. Either way, our job is the same: take the stress out of sport so the people on the field can simply play.",
    },
    {
      id: "about-stats",
      type: "stats",
      sectionAlt: true,
      eyebrow: "By the numbers",
      title: "A decade of impact",
      entries: stats.map((s) => ({ label: s.label, value: s.value, hint: s.hint })),
    },
    {
      id: "about-values",
      type: "cards",
      eyebrow: "What we value",
      title: "The principles behind every event",
      columns: "2",
      items: [
        {
          title: "Organisation you can trust",
          body: "Clear schedules, neutral officiating and transparent communication on every event we run.",
        },
        {
          title: "Opportunity for all",
          body: "From schoolyards to corporate cups, we design formats where everyone has a place to compete.",
        },
        {
          title: "Community over everything",
          body: "Clubs, fans and volunteers are the reason our events keep growing. We protect that spirit.",
        },
        {
          title: "Quality experiences",
          body: "Thoughtful venues, live updates and a smooth matchday — the details players remember.",
        },
      ],
    },
    {
      id: "about-milestones",
      type: "cards",
      sectionAlt: true,
      eyebrow: "Milestones",
      title: "How we got here",
      columns: "2",
      items: [
        { title: "2014", body: "NSCPL founded with a single local cricket league." },
        { title: "2017", body: "Expanded into football and athletics across three cities." },
        { title: "2021", body: "Launched the national 3x3 basketball circuit." },
        { title: "2026", body: "Crossed 9,000 registered players and 320 events delivered." },
      ],
    },
    {
      id: "about-cta",
      type: "cta",
      centered: true,
      title: "Want to run an event with us?",
      body: "Tell us what you have in mind — we'll help shape it into something your players will love.",
      primaryLabel: "Start a conversation",
      primaryHref: "/contact",
    },
  ];
}

export function homePage(): PageItem {
  return {
    slug: "home",
    title: "Home",
    excerpt: site.description,
    status: "published",
    blocks: homeBlocks(),
    seoTitle: `${site.name} — ${site.tagline}`,
    seoDescription: site.description,
    updatedAt: now(),
    system: true,
  };
}

export function aboutPage(): PageItem {
  return {
    slug: "about",
    title: "About",
    excerpt:
      "A sports and event management company built on a simple belief: great competition should be well organised, inclusive and fun.",
    status: "published",
    blocks: aboutBlocks(),
    seoTitle: "About NSCPL",
    seoDescription:
      "From one local cricket league to a multi-sport platform connecting athletes, clubs and communities across India.",
    updatedAt: now(),
    system: true,
  };
}

/** Slugs owned by the site itself — these can be edited but never deleted. */
export const SYSTEM_PAGE_SLUGS = ["home", "about"] as const;
