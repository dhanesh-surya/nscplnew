import * as fs from "fs";
import path from "path";

import type {
  EventItem,
  SportItem,
  TeamItem,
  NewsArticle,
  GalleryItem,
  PageItem,
  MenuItem,
  SiteSettings,
  SiteFooterData,
  FooterLink,
  HeroBanner,
} from "@/data/types";
import { events as seedEvents } from "@/data/events";
import { sports as seedSports } from "@/data/sports";
import { teams as seedTeams } from "@/data/teams";
import { news as seedNews } from "@/data/news";
import { gallery as seedGallery } from "@/data/gallery";
import { aboutPage, homePage } from "@/data/system-pages";
import { defaultFooter, defaultSettings } from "@/data/site-defaults";

/**
 * Data layer for the portal.
 *
 * Content lives in one generic `items` table keyed by (collection, id) with a
 * JSON payload — this mirrors the original schema-less JSON store and keeps a
 * single CRUD path working for every collection.
 *
 * Storage engine (chosen at boot, no code change needed):
 *   • Postgres when DATABASE_URL / POSTGRES_URL is set (Vercel / Neon) — using
 *     the pure-JS `postgres` client, so there is no native module to compile.
 *   • SQLite (better-sqlite3) otherwise — used for local development.
 *
 * The public API (getStore / upsertItem / deleteItem / getters) is identical for
 * both, so the rest of the app needs no edits.
 */

export interface ContentStore {
  events: EventItem[];
  sports: SportItem[];
  teams: TeamItem[];
  news: NewsArticle[];
  gallery: GalleryItem[];
  pages: PageItem[];
  menu: MenuItem[];
  settings: SiteSettings[];
  footer: SiteFooterData[];
  heroes: HeroBanner[];
}

export type CollectionKey =
  | "events"
  | "sports"
  | "teams"
  | "news"
  | "gallery"
  | "pages"
  | "menu"
  | "settings"
  | "footer"
  | "heroes";

export interface CollectionMeta {
  key: CollectionKey;
  label: string;
  idField: string;
  titleField: string;
}

export const COLLECTIONS: CollectionMeta[] = [
  { key: "events", label: "Events", idField: "slug", titleField: "title" },
  { key: "sports", label: "Sports", idField: "slug", titleField: "name" },
  { key: "teams", label: "Teams", idField: "slug", titleField: "name" },
  { key: "news", label: "News", idField: "slug", titleField: "title" },
  { key: "gallery", label: "Gallery", idField: "id", titleField: "title" },
  { key: "pages", label: "Pages", idField: "slug", titleField: "title" },
  { key: "menu", label: "Menu items", idField: "id", titleField: "label" },
  { key: "settings", label: "Site settings", idField: "id", titleField: "id" },
  { key: "footer", label: "Footer", idField: "id", titleField: "id" },
  { key: "heroes", label: "Hero banners", idField: "id", titleField: "title" },
];

/** Default hero banners seeded into a fresh database. Admins can edit, reorder,
 *  add or remove these from /admin/heroes. */
const defaultHeroes: HeroBanner[] = [
  {
    id: "welcome",
    title: "Welcome to NSCPL",
    eyebrow: "National Sports & Cultural Promotions",
    subtitle:
      "We plan, promote and deliver leagues, cups and community programmes across India — connecting athletes, clubs and fans through well-organised competition.",
    image: "/covers/cricket-league.svg",
    ctaLabel: "Explore events",
    ctaHref: "/events",
    order: 1,
    active: true,
  },
  {
    id: "play-more",
    title: "More sport, less stress",
    eyebrow: "For clubs & communities",
    subtitle:
      "From schoolyards to corporate cups, we design formats where everyone has a place to compete — and handle the logistics so you can simply play.",
    image: "/covers/athletics-meet.svg",
    ctaLabel: "See all sports",
    ctaHref: "/sports",
    order: 2,
    active: true,
  },
  {
    id: "join-community",
    title: "Join the community",
    eyebrow: "9,000+ players",
    subtitle:
      "Clubs, fans and volunteers are the reason our events keep growing. Be part of the next season.",
    image: "/covers/football-trophy.svg",
    ctaLabel: "Get in touch",
    ctaHref: "/contact",
    order: 3,
    active: true,
  },
];

const DB_PATH = path.join(process.cwd(), "data", "portal.db");
const SEED_PATH = path.join(process.cwd(), "content", "store.json");

/**
 * Minimal storage contract implemented by both the Postgres and SQLite adapters.
 * Every collection is a row in the `items` table (collection, id, data).
 */
interface StoreAdapter {
  init(): Promise<void>;
  allRows(): Promise<{ collection: string; id: string; data: string }[]>;
  getRow(collection: string, id: string): Promise<{ data: string } | undefined>;
  insertRow(collection: string, id: string, data: string): Promise<void>;
  upsertRow(collection: string, id: string, data: string): Promise<void>;
  updateRow(collection: string, id: string, data: string): Promise<void>;
  deleteRow(collection: string, id: string): Promise<void>;
  countRows(): Promise<number>;
}

let adapterPromise: Promise<StoreAdapter> | null = null;

function getAdapter(): Promise<StoreAdapter> {
  if (!adapterPromise) {
    adapterPromise = (async () => {
      const pgUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
      const adapter = pgUrl
        ? await createPgAdapter(pgUrl)
        : await createSqliteAdapter();
      await bootstrap(adapter);
      return adapter;
    })();
  }
  return adapterPromise;
}

async function bootstrap(d: StoreAdapter): Promise<void> {
  await d.init();
  await seedIfEmpty(d);
  await ensureSystemPages(d);
  await ensureSiteDefaults(d);
}

/* ----------------------- Postgres adapter ----------------------- */
async function createPgAdapter(url: string): Promise<StoreAdapter> {
  const postgres = (await import("postgres")).default;
  // `prepare: false` is required for Vercel Postgres' pooled (PgBouncer)
  // connection — prepared statements are per-connection and collide under
  // transaction pooling, throwing "prepared statement already exists". This is
  // harmless for a direct (non-pooled) connection too, so we set it always.
  const sql = postgres(url, { max: 5, prepare: false });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Row = any;
  return {
    async init() {
      await sql`CREATE TABLE IF NOT EXISTS items (
        collection TEXT NOT NULL,
        id TEXT NOT NULL,
        data JSONB NOT NULL,
        PRIMARY KEY (collection, id)
      )`;
    },
    async allRows() {
      const rows: Row[] = await sql`SELECT collection, id, data FROM items`;
      return rows.map((r) => ({
        collection: r.collection,
        id: r.id,
        data: JSON.stringify(r.data),
      }));
    },
    async getRow(collection, id) {
      const rows: Row[] =
        await sql`SELECT data FROM items WHERE collection = ${collection} AND id = ${id}`;
      return rows[0] ? { data: JSON.stringify(rows[0].data) } : undefined;
    },
    async insertRow(collection, id, data) {
      await sql`INSERT INTO items (collection, id, data)
        VALUES (${collection}, ${id}, ${sql.json(JSON.parse(data))})
        ON CONFLICT DO NOTHING`;
    },
    async upsertRow(collection, id, data) {
      await sql`INSERT INTO items (collection, id, data)
        VALUES (${collection}, ${id}, ${sql.json(JSON.parse(data))})
        ON CONFLICT (collection, id) DO UPDATE SET data = EXCLUDED.data`;
    },
    async updateRow(collection, id, data) {
      await sql`UPDATE items SET data = ${sql.json(JSON.parse(data))}
        WHERE collection = ${collection} AND id = ${id}`;
    },
    async deleteRow(collection, id) {
      await sql`DELETE FROM items WHERE collection = ${collection} AND id = ${id}`;
    },
    async countRows() {
      const rows: Row[] = await sql`SELECT COUNT(*)::int AS c FROM items`;
      return rows[0].c as number;
    },
  };
}

/* ----------------------- SQLite adapter ----------------------- */
async function createSqliteAdapter(): Promise<StoreAdapter> {
  const Database = (await import("better-sqlite3")).default;
  // Ensure the data directory exists (gitignored; not committed).
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  // WAL improves concurrent read/write behaviour and avoids locking the whole
  // file during writes.
  db.pragma("journal_mode = WAL");
  return {
    init() {
      db.exec(`
        CREATE TABLE IF NOT EXISTS items (
          collection TEXT NOT NULL,
          id          TEXT NOT NULL,
          data        TEXT NOT NULL,
          PRIMARY KEY (collection, id)
        );
      `);
      return Promise.resolve();
    },
    allRows() {
      return Promise.resolve(
        db
          .prepare("SELECT collection, id, data FROM items")
          .all() as { collection: string; id: string; data: string }[]
      );
    },
    getRow(collection, id) {
      return Promise.resolve(
        db
          .prepare("SELECT data FROM items WHERE collection = ? AND id = ?")
          .get(collection, id) as { data: string } | undefined
      );
    },
    insertRow(collection, id, data) {
      db.prepare(
        "INSERT OR IGNORE INTO items (collection, id, data) VALUES (?, ?, ?)"
      ).run(collection, id, data);
      return Promise.resolve();
    },
    upsertRow(collection, id, data) {
      db.prepare(
        "INSERT INTO items (collection, id, data) VALUES (?, ?, ?) ON CONFLICT(collection, id) DO UPDATE SET data = excluded.data"
      ).run(collection, id, data);
      return Promise.resolve();
    },
    updateRow(collection, id, data) {
      db.prepare("UPDATE items SET data = ? WHERE collection = ? AND id = ?").run(
        data,
        collection,
        id
      );
      return Promise.resolve();
    },
    deleteRow(collection, id) {
      db.prepare("DELETE FROM items WHERE collection = ? AND id = ?").run(
        collection,
        id
      );
      return Promise.resolve();
    },
    countRows() {
      const r = db.prepare("SELECT COUNT(*) AS c FROM items").get() as {
        c: number;
      };
      return Promise.resolve(r.c);
    },
  };
}

/**
 * The Home and About pages are part of the site itself, so they must always
 * exist. `seedIfEmpty` only runs on a brand-new store, so this runs on every
 * boot as a lightweight migration: it inserts the two built-in pages the first
 * time they're missing and otherwise leaves the admin's edits untouched.
 */
async function ensureSystemPages(d: StoreAdapter): Promise<void> {
  for (const build of [homePage, aboutPage]) {
    const page = build();
    const existing = await d.getRow("pages", page.slug);
    if (existing) continue;
    await d.insertRow("pages", page.slug, JSON.stringify(page));
  }
}

/** Guarantee the single settings + footer records exist, seeding defaults. */
async function ensureSiteDefaults(d: StoreAdapter): Promise<void> {
  const records: {
    collection: "settings" | "footer";
    id: string;
    build: () => unknown;
  }[] = [
    { collection: "settings", id: "site", build: defaultSettings },
    { collection: "footer", id: "main", build: defaultFooter },
  ];
  for (const r of records) {
    const existing = await d.getRow(r.collection, r.id);
    if (existing) continue;
    await d.insertRow(r.collection, r.id, JSON.stringify(r.build()));
  }

  // Backfill: existing rows seeded before new fields were added (e.g. header
  // colours, glass flag, footer social icons, map embed) keep working without a
  // manual re-save. Only fills *missing* keys and only infers a social icon when
  // one was never set, so deliberate user edits are never overwritten.
  await backfillDefaults(
    d,
    "settings",
    "site",
    defaultSettings() as unknown as Record<string, unknown>
  );
  await backfillDefaults(
    d,
    "footer",
    "main",
    defaultFooter() as unknown as Record<string, unknown>
  );
}

/** Infer a social icon key from a label/href when the record has none yet. */
function inferSocialIcon(label: string, href: string): FooterLink["icon"] {
  const s = `${label} ${href}`.toLowerCase();
  if (s.includes("linkedin")) return "linkedin";
  if (s.includes("instagram")) return "instagram";
  if (s.includes("twitter") || s.includes("x.com")) return "twitter";
  if (s.includes("facebook")) return "facebook";
  if (s.includes("youtube") || s.includes("youtu.be")) return "youtube";
  return "";
}

/** Fill missing top-level keys from defaults and infer footer social icons. */
async function backfillDefaults(
  d: StoreAdapter,
  collection: "settings" | "footer",
  id: string,
  defaults: Record<string, unknown>
): Promise<void> {
  const row = await d.getRow(collection, id);
  if (!row) return;
  const obj = JSON.parse(row.data) as Record<string, unknown>;
  let changed = false;

  for (const [k, v] of Object.entries(defaults)) {
    if (obj[k] === undefined) {
      obj[k] = v;
      changed = true;
    }
  }

  if (collection === "footer" && Array.isArray(obj.social)) {
    for (const s of obj.social as FooterLink[]) {
      if (s.icon === undefined) {
        const inferred = inferSocialIcon(s.label ?? "", s.href ?? "");
        if (inferred) {
          s.icon = inferred;
          changed = true;
        }
      }
    }
  }

  if (changed) {
    await d.updateRow(collection, id, JSON.stringify(obj));
  }
}

/**
 * On a fresh store (e.g. first production deploy) we seed it once from
 * content/store.json if present, otherwise from the static seed modules in
 * src/data. Uploaded media lives in public/uploads (gitignored), so a clean
 * deploy correctly starts from the static seeds.
 */
async function seedIfEmpty(d: StoreAdapter): Promise<void> {
  const count = await d.countRows();
  if (count > 0) return;

  let store: ContentStore | null = null;
  try {
    store = JSON.parse(fs.readFileSync(SEED_PATH, "utf8")) as ContentStore;
  } catch {
    store = null;
  }
  // Older JSON stores predate CMS pages/menu; normalize missing collections.
  if (store) {
    store.pages ??= [];
    store.menu ??= [];
  }
  if (!store) {
    store = {
      events: structuredClone(seedEvents),
      sports: structuredClone(seedSports),
      teams: structuredClone(seedTeams),
      news: structuredClone(seedNews),
      gallery: structuredClone(seedGallery),
      pages: [],
      menu: [],
      settings: [defaultSettings()],
      footer: [defaultFooter()],
      heroes: structuredClone(defaultHeroes),
    };
  } else {
    // Keep existing stores in sync with the schema (no-op if already present).
    store.settings ??= [defaultSettings()];
    store.footer ??= [defaultFooter()];
    store.heroes ??= structuredClone(defaultHeroes);
    if (!Array.isArray(store.settings) || store.settings.length === 0) {
      store.settings = [defaultSettings()];
    }
    if (!Array.isArray(store.footer) || store.footer.length === 0) {
      store.footer = [defaultFooter()];
    }
    if (!Array.isArray(store.heroes) || store.heroes.length === 0) {
      store.heroes = structuredClone(defaultHeroes);
    }
  }

  for (const meta of COLLECTIONS) {
    const list = store[meta.key] as unknown as Record<string, unknown>[];
    for (const item of list) {
      const id = String((item as Record<string, unknown>)[meta.idField] ?? "");
      if (!id) continue;
      await d.insertRow(meta.key, id, JSON.stringify(item));
    }
  }
}

function rowToStore(
  rows: { collection: string; data: string }[]
): ContentStore {
  const store: ContentStore = {
    events: [],
    sports: [],
    teams: [],
    news: [],
    gallery: [],
    pages: [],
    menu: [],
    settings: [],
    footer: [],
    heroes: [],
  };
  for (const r of rows) {
    const key = r.collection as CollectionKey;
    (store[key] as unknown as Record<string, unknown>[]).push(JSON.parse(r.data));
  }
  return store;
}

export async function getStore(): Promise<ContentStore> {
  const d = await getAdapter();
  const rows = await d.allRows();
  return rowToStore(rows);
}

/* ---------------- Typed getters ---------------- */
export const getEvents = async () => (await getStore()).events;
export const getEvent = async (slug: string) =>
  (await getStore()).events.find((e) => e.slug === slug);
export const getSports = async () => (await getStore()).sports;
export const getSport = async (slug: string) =>
  (await getStore()).sports.find((s) => s.slug === slug);
export const getTeams = async () => (await getStore()).teams;
export const getTeam = async (slug: string) =>
  (await getStore()).teams.find((t) => t.slug === slug);
export const getNews = async () => (await getStore()).news;
export const getArticle = async (slug: string) =>
  (await getStore()).news.find((n) => n.slug === slug);
export const getGallery = async () => (await getStore()).gallery;
export const getGalleryItem = async (id: string) =>
  (await getStore()).gallery.find((g) => g.id === id);
export const getPages = async () => (await getStore()).pages;
export const getPage = async (slug: string) =>
  (await getStore()).pages.find((p) => p.slug === slug && p.status === "published");
export const getAllPages = async () => (await getStore()).pages;
/**
 * A published built-in page (home, about). Returns null when the admin has
 * unpublished it, which lets the caller fall back to the original layout.
 */
export const getSystemPage = async (slug: string) =>
  (await getStore()).pages.find(
    (p) => p.slug === slug && p.system === true && p.status === "published"
  );

/* ---------------- Site-wide singletons ---------------- */
/**
 * Merges the stored record over the defaults so settings added after a site was
 * first seeded still resolve to a sane value instead of `undefined` until an
 * admin next saves the form.
 */
export const getSettings = async (): Promise<SiteSettings> => {
  const list = (await getStore()).settings;
  return { ...defaultSettings(), ...(list[0] ?? {}) };
};

export const getFooter = async (): Promise<SiteFooterData> => {
  const list = (await getStore()).footer;
  return list[0] ?? defaultFooter();
};

/** Active hero banners, ordered for the homepage carousel. */
export const getHeroes = async (): Promise<HeroBanner[]> =>
  (await getStore()).heroes
    .filter((h) => h.active !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

/** A single photo pulled out of a gallery album, for use in strips/pickers. */
export interface FlatGalleryImage {
  /** Stable key — the image path/URL (unique enough for selection). */
  src: string;
  /** Album title the photo belongs to. */
  title: string;
  category?: string;
  caption: string;
  pageSlugs?: string[];
}

/**
 * Flattens every gallery album into one list of photos. Used by the site-wide
 * strip and by the admin "import from gallery" picker so both read the same
 * source. Newer albums first, matching the strip's default ordering.
 */
export function flattenGallery(gallery: GalleryItem[]): FlatGalleryImage[] {
  const albums = [...gallery].sort((a, b) => {
    const ta = Date.parse(a.date ?? "");
    const tb = Date.parse(b.date ?? "");
    if (Number.isNaN(ta) || Number.isNaN(tb)) return 0;
    return tb - ta;
  });
  const out: FlatGalleryImage[] = [];
  for (const album of albums) {
    const photos =
      album.images && album.images.length > 0
        ? album.images
        : album.image
          ? [{ src: album.image, caption: "" }]
          : [];
    for (const photo of photos) {
      if (!photo.src) continue;
      out.push({
        src: photo.src,
        title: album.title,
        category: album.category,
        caption: photo.caption || album.title,
        pageSlugs: photo.pageSlugs,
      });
    }
  }
  return out;
}

export const getMenu = async () =>
  (await getStore()).menu
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);

/* ---------------- Mutators ---------------- */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function upsertItem(
  collection: CollectionKey,
  data: Record<string, unknown>
): Promise<void> {
  const d = await getAdapter();
  const meta = COLLECTIONS.find((c) => c.key === collection)!;
  const id = String(data[meta.idField] ?? "");
  if (!id) throw new Error(`Cannot save ${collection} without ${meta.idField}`);
  await d.upsertRow(collection, id, JSON.stringify(data));
}

export async function deleteItem(
  collection: CollectionKey,
  id: string
): Promise<void> {
  const d = await getAdapter();
  await d.deleteRow(collection, id);
}
