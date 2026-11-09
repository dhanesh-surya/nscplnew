// ---------------------------------------------------------------------------
// Domain types for the NSCPL simple portal.
// Kept intentionally small — the portal reads from local modules, not a DB.
// ---------------------------------------------------------------------------

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "linkedin" | "instagram" | "twitter" | "youtube" | "facebook";
}

export interface SiteInfo {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  founded: number;
  social: SocialLink[];
}

export interface Stat {
  label: string;
  value: string;
  hint?: string;
}

export interface Feature {
  title: string;
  body: string;
  icon: string;
}

export interface EventGalleryImage {
  src: string;
  caption?: string;
}

export type EventGalleryItem = string | EventGalleryImage;

export interface EventItem {
  slug: string;
  id?: string | number;
  title: string;
  category: string;
  date: string; // ISO date
  venue: string;
  city: string;
  status: "upcoming" | "open" | "closed" | "past";
  summary: string;
  body: string[];
  cover: string;
  highlights?: string[];
  gallery?: EventGalleryItem[];
}

export interface SportItem {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string; // emoji used as a lightweight icon
  cover: string;
  programs: string[];
}

export interface TeamMember {
  name: string;
  role: string;
}

export interface TeamItem {
  slug: string;
  name: string;
  sport: string;
  captain: string;
  founded: number;
  homeVenue: string;
  achievements: string[];
  cover: string;
  members: TeamMember[];
}

export interface NewsArticle {
  slug: string;
  title: string;
  date: string; // ISO date
  category: string;
  author: string;
  excerpt: string;
  body: string[];
  cover: string;
  featured?: boolean;
}

export interface GalleryImage {
  src: string;
  caption: string;
  /** Public page slugs where this image should appear in the gallery strip. */
  pageSlugs?: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  /** Cover image (kept for backward compatibility; equals images[0]?.src). */
  image: string;
  /** Multiple images with per-image captions. */
  images?: GalleryImage[];
  date: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export type PageBlockType =
  | "richText"
  | "image"
  | "file"
  | "cards"
  | "cta"
  | "quote"
  | "divider"
  | "video"
  | "html"
  /** Page banner with up to two buttons. */
  | "hero"
  /** Stat grid. */
  | "stats"
  /** Live list of featured events. */
  | "events"
  /** Live list of latest news. */
  | "news"
  /** Live grid of sports. */
  | "sports"
  /** Testimonial / quote grid. */
  | "testimonials";

/** A card inside a `cards` block. */
export interface PageBlockItem {
  title: string;
  body: string;
  image?: string;
  href?: string;
  /** Emoji or short badge shown above the heading. */
  icon?: string;
}

/**
 * A row inside `stats` or `testimonials`. Keys are optional because each block
 * type uses the subset it needs:
 *  - stats:        value / label / hint
 *  - testimonials: name / role / quote
 */
export interface PageBlockEntry {
  value?: string;
  label?: string;
  hint?: string;
  name?: string;
  role?: string;
  quote?: string;
}

export interface PageBlock {
  id: string;
  type: PageBlockType;
  title?: string;
  body?: string;
  text?: string;
  src?: string;
  /** Alt text for `image` blocks. */
  alt?: string;
  caption?: string;
  href?: string;
  label?: string;
  fileName?: string;
  items?: PageBlockItem[];
  entries?: PageBlockEntry[];
  style?: string;

  /* ---- Section wrapper (any block) ---- */
  eyebrow?: string;
  subtitle?: string;
  /** Tinted background, matching the site's alternating sections. */
  sectionAlt?: boolean;

  /* ---- Buttons (hero / cta) ---- */
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;

  /* ---- Live collection blocks (events / news) ---- */
  count?: number;
  linkLabel?: string;
  linkHref?: string;

  /* ---- Layout ---- */
  columns?: "2" | "3" | "auto";
  centered?: boolean;
}

export interface PageItem {
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  status: "draft" | "published";
  menuLabel?: string;
  blocks: PageBlock[];
  seoTitle?: string;
  seoDescription?: string;
  updatedAt: string;
  /**
   * True for built-in pages (home, about) that the public site depends on.
   * They can be edited but not deleted or re-slugged.
   */
  system?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  parentId?: string | null;
  /** Slug of the CMS page selected for this menu item. */
  pageSlug?: string;
  target?: "same" | "new";
  order: number;
  visible: boolean;
}

/* ------------------------------------------------------------------ */
/* Site settings (theme / style / typography)                          */
/* ------------------------------------------------------------------ */

export type BackgroundStyle = "solid" | "gradient" | "image";
export type LinkStyle = "always" | "hover" | "none";
export type ButtonStyle = "filled" | "soft" | "outline";

/**
 * All visual tokens for the site. The root layout turns these into CSS custom
 * properties (--brand, --accent, --radius, --font, ...) and data-* attributes
 * so every component picks them up automatically.
 */
export interface HeroBanner {
  /** Unique id, e.g. "summer-league". */
  id: string;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  /** Full-bleed background image path/URL; empty falls back to a brand gradient. */
  image: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Sort order; lower numbers display first. */
  order: number;
  /** When false the banner is hidden from the homepage carousel. */
  active: boolean;
}

export interface SiteSettings {
  id: string;  /** Primary brand colour (buttons, headings, accents). */
  brand: string;
  brandDark: string;
  brandSoft: string;
  /** Secondary accent colour. */
  accent: string;
  /** Base text colour. */
  ink: string;
  muted: string;
  line: string;
  surface: string;
  white: string;
  /** Header background colour (any CSS colour). */
  headerBg: string;
  /** Header foreground (text/logo) colour. */
  headerColor: string;
  /** Logo image path/URL; empty = use the brand dot + name. */
  logo: string;
  /** Header brand text; empty = site short name. */
  siteName: string;
  /** Enable glassmorphism on cards/sections when the background is image/gradient. */
  glass: boolean;
  /** Corner radius for cards, e.g. "16px". */
  radius: string;
  radiusSm: string;
  /** Font stack. */
  font: string;
  backgroundStyle: BackgroundStyle;
  /** Hex for solid, gradient start, or an image URL. */
  backgroundValue: string;
  /** Gradient end colour (only used when backgroundStyle === "gradient"). */
  backgroundValue2?: string;
  /** Image background opacity, 0–100%. Only used when backgroundStyle === "image". */
  bgOpacity: number;
  /** Image background blur, in px (0–100). Only used when backgroundStyle === "image". */
  bgBlur: number;
  linkStyle: LinkStyle;
  buttonStyle: ButtonStyle;
  /** Hex colour applied to links and the nav menu on hover (pointer state). */
  linkHoverColor: string;
  /** Max content width, e.g. "1140px". */
  maxw: string;
  /* ---- Optional gallery strip (scrolling photos above the footer) ----
     Images opt into pages from their own `pageSlugs` checkboxes in the gallery
     editor. These two labels remain shared site-wide. */
  /** Small label above the strip heading, e.g. "Highlights". */
  galleryStripEyebrow: string;
  /** Strip heading, e.g. "Moments from the field". */
  galleryStripTitle: string;
}

/* ------------------------------------------------------------------ */
/* Footer (managed, editable by admin)                                 */
/* ------------------------------------------------------------------ */

export interface FooterLink {
  label: string;
  href: string;
  /** Social icon key; empty/undefined renders the first letter instead. */
  icon?: "" | "linkedin" | "instagram" | "twitter" | "youtube" | "facebook";
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SiteFooterData {
  id: string;
  /** Brand short name shown next to the dot. */
  brand: string;
  about: string;
  columns: FooterColumn[];
  contact: { email: string; phone: string; address: string; city: string };
  copyright: string;
  social: FooterLink[];
  /** Google Maps embed URL (iframe src). Empty = no map shown. */
  mapEmbed: string;
}

