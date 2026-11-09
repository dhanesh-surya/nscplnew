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
      title: "About NSCPL",
      subtitle:
        "NSCPL (NSCPL PRIVATE LIMITED) is dedicated to excellence in sports and event management. We focus on fostering athletic talent, organizing competitive events, and building community engagement through professional sports services.\n\nOur mission is to deliver top-tier sporting experiences and create opportunities for athletes to grow and succeed.",
      src: "/media/themes/601790.jpg",
    },
    {
      id: "about-purpose",
      type: "cards",
      eyebrow: "Our Purpose",
      title: "Vision & Mission",
      columns: "2",
      items: [
        {
          title: "Vision",
          body: "To become a leading force in the world of sports by nurturing talent, inspiring passion, and creating global opportunities through world-class tournaments, events, and sporting excellence across multiple disciplines.",
          icon: "👁️",
        },
        {
          title: "Mission",
          body: "• To promote, organize, and manage cricket and other sports events at national and international levels, fostering sportsmanship and competitive spirit.\n• To support and develop diverse sporting activities such as football, kabaddi, hockey, badminton, volleyball, tennis, athletics, and e-sports, encouraging participation and excellence.\n• To deliver comprehensive sports event management solutions including branding, marketing, ticketing, broadcasting, merchandising, and franchising that elevate the experience for players, fans, and partners alike.\n• To build sustainable platforms that connect athletes, organizations, and audiences, driving the growth of sports culture and industry in India and beyond.",
          icon: "🎯",
        },
      ],
    },
    {
      id: "about-values",
      type: "cards",
      sectionAlt: true,
      eyebrow: "Principles",
      title: "Our Values",
      columns: "3",
      items: [
        {
          title: "Collaboration",
          body: "We work with collaborate",
          icon: "⭐",
        },
        {
          title: "Integrity",
          body: "We uphold the highest ethical standards in all our actions and decisions.",
          icon: "🛡️",
        },
        {
          title: "Innovation",
          body: "We embrace creativity and cutting-edge solutions to drive progress.",
          icon: "💡",
        },
        {
          title: "Collaboration",
          body: "We work together as a unified team to achieve common goals.",
          icon: "👥",
        },
        {
          title: "Excellence",
          body: "We strive for excellence in everything we do, setting high standards for ourselves and others.",
          icon: "🏆",
        },
        {
          title: "Respect",
          body: "We treat everyone with dignity, respect, and fairness in all our interactions.",
          icon: "🤝",
        },
      ],
    },
    {
      id: "about-recognition",
      type: "cards",
      eyebrow: "Accreditations",
      title: "Recognition & Achievements",
      columns: "2",
      items: [
        {
          title: "PVT LTD",
          body: "Official company recognition and portal.",
          image: "/media/recognition/nscpl_logo_com.png",
          href: "http://nscplcg.in",
        },
        {
          title: "MCA",
          body: "Ministry of Corporate Affairs (MCA) registered.",
          image: "/media/recognition/Screenshot_2025-10-23_203959.png",
          href: "https://www.falconebiz.com/company/NSCPL-PRIVATE-LIMITED-U74900CT2025PTC018395",
        },
      ],
    },
    {
      id: "about-team",
      type: "cards",
      sectionAlt: true,
      eyebrow: "Leadership",
      title: "Our Team",
      subtitle:
        "Meet the dedicated professionals behind our success. We are proud to have a team of passionate individuals who work tirelessly to deliver exceptional results.",
      columns: "auto",
      items: [
        {
          title: "Sunita",
          body: "Director\nnareshsunita55@gmail.com",
          image: "/media/about/team/WhatsApp_Image_2025-10-24_at_4.48.42_PM.jpeg",
          href: "mailto:nareshsunita55@gmail.com",
        },
        {
          title: "Naresh Nirala",
          body: "Director\nnareshnirala212@gmail.com",
          image: "/media/about/team/WhatsApp_Image_2025-10-24_at_4.48.41_PM.jpeg",
          href: "mailto:nareshnirala212@gmail.com",
        },
        {
          title: "Chandrashekhar",
          body: "Marketing Manager\ncnauratna@gmail.com",
          image: "/media/about/team/WhatsApp_Image_2025-10-24_at_4.48.42_PM_2.jpeg",
          href: "mailto:cnauratna@gmail.com",
        },
        {
          title: "Bhisam Nauratn",
          body: "CEO\nbnauratn@gmail.com",
          image: "/media/about/team/WhatsApp_Image_2025-10-24_at_4.48.42_PM_1.jpeg",
          href: "mailto:bnauratn@gmail.com",
        },
      ],
    },
    {
      id: "about-cta",
      type: "cta",
      centered: true,
      title: "Ready to Get Started?",
      body: "Join us in promoting sports excellence and community engagement.",
      primaryLabel: "Contact Us",
      primaryHref: "/contact",
      secondaryLabel: "View Events",
      secondaryHref: "/events",
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
    title: "About Us",
    excerpt:
      "NSCPL (NSCPL PRIVATE LIMITED) is dedicated to excellence in sports and event management. We focus on fostering athletic talent, organizing competitive events, and building community engagement through professional sports services.",
    cover: "/media/themes/601790.jpg",
    status: "published",
    blocks: aboutBlocks(),
    seoTitle: "About Us - NSCPL PRIVATE LIMITED",
    seoDescription:
      "NSCPL (NSCPL PRIVATE LIMITED) is dedicated to excellence in sports and event management. We focus on fostering athletic talent, organizing competitive events, and building community engagement through professional sports services.",
    updatedAt: now(),
    system: true,
  };
}

/** Slugs owned by the site itself — these can be edited but never deleted. */
export const SYSTEM_PAGE_SLUGS = ["home", "about"] as const;
