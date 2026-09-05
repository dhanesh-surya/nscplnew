import type { CollectionKey } from "@/lib/content";

export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "number"
  | "select"
  | "lines"
  | "json"
  | "boolean"
  | /** Text field backed by a real file upload; the file wins over the path. */
  "image"
  | /** Repeatable group of inputs stored as an array of objects (JSON). */
  "repeater";

/** One input inside a `repeater` row. */
export interface SubFieldDef {
  name: string;
  label: string;
  placeholder?: string;
  /** Relative width inside the row; defaults to 1. */
  span?: number;
}

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  help?: string;
  /** `accept` attribute for `image` fields, e.g. "image/*" or ".pdf,.docx". */
  accept?: string;
  /** Column definitions for `repeater` fields. */
  subfields?: SubFieldDef[];
  /** Singular noun used by repeater row actions, e.g. "Member". */
  itemLabel?: string;
}

export interface CollectionSchema {
  key: CollectionKey;
  label: string;
  idField: string;
  titleField: string;
  fields: FieldDef[];
  /** For "new" items, the id is derived from the title field when true. */
  deriveIdFromTitle?: boolean;
}

export const schemas: Record<CollectionKey, CollectionSchema> = {
  events: {
    key: "events",
    label: "Events",
    idField: "slug",
    titleField: "title",
    deriveIdFromTitle: true,
    fields: [
      { name: "slug", label: "Slug (URL id)", type: "text", required: true, help: "Unique id used in the URL. Auto-filled from title if blank." },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "venue", label: "Venue", type: "text" },
      { name: "city", label: "City", type: "text" },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: ["upcoming", "open", "closed", "past"],
      },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "body", label: "Body (one paragraph per line)", type: "lines", required: true },
      {
        name: "cover",
        label: "Cover image",
        type: "image",
        accept: "image/*",
        help: "Upload an image file, or paste an existing path/URL such as /covers/cricket-league.svg. An uploaded file replaces the path.",
      },
      { name: "highlights", label: "Highlights (one per line)", type: "lines" },
    ],
  },
  sports: {
    key: "sports",
    label: "Sports",
    idField: "slug",
    titleField: "name",
    deriveIdFromTitle: true,
    fields: [
      { name: "slug", label: "Slug (URL id)", type: "text", required: true },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "icon", label: "Icon (emoji)", type: "text", help: "e.g. 🏏" },
      {
        name: "cover",
        label: "Cover image",
        type: "image",
        accept: "image/*",
        help: "Upload an image file, or paste an existing path/URL such as /covers/news.svg. An uploaded file replaces the path.",
      },
      { name: "programs", label: "Programmes (one per line)", type: "lines" },
    ],
  },
  teams: {
    key: "teams",
    label: "Teams",
    idField: "slug",
    titleField: "name",
    deriveIdFromTitle: true,
    fields: [
      { name: "slug", label: "Slug (URL id)", type: "text", required: true },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "sport", label: "Sport", type: "text" },
      { name: "captain", label: "Captain", type: "text" },
      { name: "founded", label: "Founded (year)", type: "number" },
      { name: "homeVenue", label: "Home venue", type: "text" },
      { name: "achievements", label: "Achievements (one per line)", type: "lines" },
      {
        name: "cover",
        label: "Cover image",
        type: "image",
        accept: "image/*",
        help: "Upload an image file, or paste an existing path/URL such as /covers/news.svg. An uploaded file replaces the path.",
      },
      {
        name: "members",
        label: "Members",
        type: "repeater",
        itemLabel: "Member",
        subfields: [
          { name: "name", label: "Name", placeholder: "e.g. Priya Nair" },
          { name: "role", label: "Role", placeholder: "e.g. Captain" },
        ],
        help: "Add one row per team member. Leave a row blank to remove it.",
      },
    ],
  },
  news: {
    key: "news",
    label: "News",
    idField: "slug",
    titleField: "title",
    deriveIdFromTitle: true,
    fields: [
      { name: "slug", label: "Slug (URL id)", type: "text", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "author", label: "Author", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
      { name: "body", label: "Body (one paragraph per line)", type: "lines", required: true },
      {
        name: "cover",
        label: "Cover image",
        type: "image",
        accept: "image/*",
        help: "Upload an image file, or paste an existing path/URL such as /covers/news.svg. An uploaded file replaces the path.",
      },
      { name: "featured", label: "Featured", type: "boolean" },
    ],
  },
  gallery: {
    key: "gallery",
    label: "Gallery",
    idField: "id",
    titleField: "title",
    deriveIdFromTitle: false,
    fields: [
      { name: "id", label: "ID", type: "text", required: true, help: "Unique id, e.g. g10" },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "date", label: "Date", type: "date" },
    ],
  },
  pages: {
    key: "pages",
    label: "Pages",
    idField: "slug",
    titleField: "title",
    deriveIdFromTitle: true,
    fields: [
      { name: "slug", label: "Slug (URL path)", type: "text", required: true, help: "The page will be available at /page-slug." },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      {
        name: "cover",
        label: "Cover image",
        type: "image",
        accept: "image/*",
        help: "Upload an image file, or paste an existing path/URL such as /covers/cricket-league.svg. An uploaded file replaces the path.",
      },
      { name: "status", label: "Status", type: "select", required: true, options: ["draft", "published"] },
      { name: "menuLabel", label: "Menu label", type: "text", help: "Optional label used when creating a menu item for this page." },
      { name: "blocks", label: "Content blocks", type: "json", required: true, help: "Use the visual block builder below. Images, documents, and card images can be uploaded directly." },
      { name: "seoTitle", label: "SEO title", type: "text" },
      { name: "seoDescription", label: "SEO description", type: "textarea" },
      { name: "updatedAt", label: "Updated at", type: "text", help: "ISO timestamp; optional." },
    ],
  },
  menu: {
    key: "menu",
    label: "Menu items",
    idField: "id",
    titleField: "label",
    deriveIdFromTitle: true,
    fields: [
      { name: "id", label: "ID", type: "text", required: true, help: "Unique id, e.g. about or about-team." },
      { name: "label", label: "Label", type: "text", required: true },
      { name: "href", label: "Link URL", type: "text", required: true, help: "Use / for internal links or https://... for external links." },
      { name: "parentId", label: "Parent menu ID", type: "text", help: "Leave blank for a top-level item. Set this to another menu item ID for a submenu." },
      { name: "target", label: "Open in", type: "select", options: ["same", "new"] },
      { name: "order", label: "Order", type: "number" },
      { name: "visible", label: "Visible", type: "boolean" },
    ],
  },
  heroes: {
    key: "heroes",
    label: "Hero banners",
    idField: "id",
    titleField: "title",
    deriveIdFromTitle: false,
    fields: [
      { name: "id", label: "ID", type: "text", required: true, help: "Unique id, e.g. summer-league. Used internally to store this banner's image." },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "eyebrow", label: "Eyebrow (small label above title)", type: "text" },
      { name: "subtitle", label: "Subtitle", type: "textarea" },
      {
        name: "image",
        label: "Banner image",
        type: "image",
        accept: "image/*",
        help: "Full-bleed background image. Upload a file or paste a path/URL such as /covers/cricket-league.svg.",
      },
      { name: "ctaLabel", label: "Button label", type: "text", help: "e.g. Explore events" },
      { name: "ctaHref", label: "Button link", type: "text", help: "Internal path like /events or a full URL like https://..." },
      { name: "order", label: "Order", type: "number", help: "Lower numbers appear first in the carousel." },
      { name: "active", label: "Active (show on site)", type: "boolean" },
    ],
  },
  // settings/footer are singletons edited through dedicated admin pages
  // (/admin/settings and /admin/footer), so they have no generic form schema.
  settings: {
    key: "settings",
    label: "Site settings",
    idField: "id",
    titleField: "id",
    fields: [],
  },
  footer: {
    key: "footer",
    label: "Footer",
    idField: "id",
    titleField: "id",
    fields: [],
  },
};
