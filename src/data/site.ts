import type { Feature, NavItem, SiteInfo, Stat, Testimonial } from "./types";

export const site: SiteInfo = {
  name: "NSCPL Private Limited",
  shortName: "NSCPL",
  tagline: "Play. Compete. Belong.",
  description:
    "NSCPL Private Limited is a sports and event management company that runs leagues, tournaments and community programmes across India — connecting athletes, clubs and fans through well-organised competition and memorable events.",
  email: "hello@nscpl.in",
  phone: "+91 11 4987 2200",
  address: "Plot 14, Sector 18, Dwarka",
  city: "New Delhi, India",
  founded: 2014,
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com", icon: "linkedin" },
    { label: "Instagram", href: "https://www.instagram.com", icon: "instagram" },
    { label: "Twitter", href: "https://twitter.com", icon: "twitter" },
    { label: "YouTube", href: "https://www.youtube.com", icon: "youtube" },
  ],
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Sports", href: "/sports" },
  { label: "Teams", href: "/teams" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

/**
 * Pages that can have their own (opt-in) gallery strip. These are the public
 * landing/section pages; detail routes like `/events/[slug]` fall back to their
 * section slug (e.g. `events`) so one selection covers the whole section.
 */
export const GALLERY_STRIP_PAGES: { slug: string; label: string }[] = [
  { slug: "home", label: "Home" },
  { slug: "about", label: "About" },
  { slug: "events", label: "Events" },
  { slug: "sports", label: "Sports" },
  { slug: "news", label: "News" },
  { slug: "teams", label: "Teams" },
  { slug: "contact", label: "Contact" },
  { slug: "gallery", label: "Gallery" },
];

/** Maps a request pathname to a gallery-strip page key, or null if ineligible. */
export function resolveStripPage(pathname: string): string | null {
  const clean = pathname.replace(/\/+$/, "");
  if (clean === "" || clean === "/") return "home";
  const seg = clean.split("/")[1];
  return GALLERY_STRIP_PAGES.some((p) => p.slug === seg) ? seg : null;
}

export const stats: Stat[] = [
  { label: "Years active", value: "11+", hint: "Since 2014" },
  { label: "Events delivered", value: "320", hint: "Leagues & tournaments" },
  { label: "Registered players", value: "9,400", hint: "Across all sports" },
  { label: "Partner clubs", value: "160", hint: "Nationwide" },
];

export const homeFeatures: Feature[] = [
  {
    title: "End-to-end event management",
    body: "From scheduling and venues to live scores and medals — we run the whole show so organisers can focus on the sport.",
    icon: "🗓️",
  },
  {
    title: "Grassroots to elite",
    body: "School leagues, corporate cups and professional circuits. There is a place to compete at every level.",
    icon: "🏆",
  },
  {
    title: "Community first",
    body: "Clubs, fans and volunteers are the heart of every NSCPL event. We build programmes people return to.",
    icon: "🤝",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Priya Nair",
    role: "Captain, Delhi Strikers (Cricket)",
    quote:
      "NSCPL gave our club a proper fixture calendar for the first time. The organisation was flawless and the players loved it.",
  },
  {
    name: "Arjun Mehta",
    role: "Academy Director, Northside FC",
    quote:
      "The youth league they ran for us doubled our sign-ups. Parents actually enjoyed the matchdays.",
  },
  {
    name: "Sara Qureshi",
    role: "Corporate HR Lead",
    quote:
      "We booked a company tournament and it was the best team-building day we have ever had. Zero hassle.",
  },
];
