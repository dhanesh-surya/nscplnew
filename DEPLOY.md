# Deploying NSCPL Portal to Vercel

This guide walks through taking the portal (Next.js 15 App Router) from this repo
to a live Vercel deployment **with a real, persistent database** (Postgres).

The app uses a single storage layer (`src/lib/content.ts`) that auto-selects its
engine at boot:

| `DATABASE_URL` / `POSTGRES_URL` set? | Engine used        | Good for        |
| ------------------------------------ | ------------------ | --------------- |
| No                                   | SQLite (better-sqlite3) | Local dev |
| Yes                                  | Postgres (`postgres`)    | Vercel / Neon   |

No code changes are needed to switch engines. The rest of the app only talks to
the shared `getStore()` / `upsertItem()` / `deleteItem()` API.

---

## 0. Before you start

You need:

1. A **GitHub** (or GitLab/Bitbucket) repository containing this project.
2. A **Vercel** account (free tier is fine) linked to that Git provider.
3. A **Postgres** database — either **Vercel Postgres** or **Neon** (both free).
4. The project builds clean (already verified: `npx tsc --noEmit` passes).

> The site is `force-dynamic` (set in `src/app/layout.tsx`), so `next build`
> never connects to the database at build time and CMS edits appear instantly
> at runtime. This is exactly what we want for a DB-backed CMS.

---

## 1. Create the Postgres database

### Option A — Vercel Postgres (easiest if hosting on Vercel)
1. In the Vercel dashboard, open your project → **Storage** → **Create** →
   **Postgres** → **Continue**.
2. Pick a region close to your users.
3. After creation, Vercel shows environment variables. Copy the **`POSTGRES_URL`**
   value (it is the pooled connection string). Vercel auto-injects these into the
   project, but you can also add them manually in step 3.

### Option B — Neon (great free Postgres, works anywhere)
1. Go to https://neon.tech → **New project**.
2. Copy the connection string from the dashboard. It looks like:
   `postgresql://user:password@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require`
3. Use this as `POSTGRES_URL` below.

> The code reads `process.env.DATABASE_URL || process.env.POSTGRES_URL`, so either
> variable name works. If you use Vercel Postgres, `POSTGRES_URL` is already set
> for you.

---

## 2. Push the code to Git

```bash
cd nscpl-portal-simple
git add -A
git commit -m "Vercel-ready: dual Postgres/SQLite storage adapter"
git push
```

Make sure these are **not** committed (they're already in `.gitignore`):
- `.env*.local` — your local admin secrets.
- `/data/` and `*.db*` — the local SQLite file.
- `/public/uploads/` — admin-uploaded images (see the caveat in step 4).
- `content/store.json` — local seed export.

---

## 3. Import the project in Vercel

1. **Vercel Dashboard → Add New → Project → Import** your Git repo.
2. Framework preset is detected automatically as **Next.js**.
3. Build & output settings can stay at defaults:
   - Build command: `next build` (auto)
   - Output: Auto (managed by Next)
   - Node version: **18.18+ / 20** (set **Settings → Functions → Node.js Version**
     to 20 if you want to be explicit).
4. **Important — Environment Variables** (Project → Settings → Environment Variables,
   apply to **Production**, **Preview**, and **Development**):

   | Key             | Value                                              |
   | --------------- | -------------------------------------------------- |
   | `POSTGRES_URL`  | your Postgres connection string from step 1        |
   | `ADMIN_EMAIL`   | admin login email (e.g. `admin@nscpl.in`)          |
   | `ADMIN_PASSWORD`| a strong admin password                             |
   | `ADMIN_SECRET`  | any long random string, e.g. `openssl rand -hex 32`|

   > `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_SECRET` currently have safe local
   > defaults in `.env.local`. **Set them explicitly on Vercel** so the live admin
   > area is not using the well-known dev credentials.

   If you used **Vercel Postgres**, the `POSTGRES_*` vars are already injected —
   just confirm `POSTGRES_URL` is present.

5. Click **Deploy**.

---

## 4. First boot & what to expect

On the **first request** after deploy, `bootstrap()` runs once per function
instance (idempotent):

1. `CREATE TABLE IF NOT EXISTS items (collection TEXT, id TEXT, data JSONB, PRIMARY KEY (collection, id))`
2. `seedIfEmpty()` — only if the table is empty, seeds events/sports/teams/news/
   gallery/heroes from the static modules in `src/data`.
3. `ensureSystemPages()` — guarantees Home & About pages exist.
4. `ensureSiteDefaults()` — guarantees the single settings + footer records exist
   and backfills any new fields.

So you do **not** need to run any migration by hand. Visit the site, then log in
at `/admin` with the credentials you set.

### Persistence caveat — uploaded images

The CMS writes admin-uploaded images to **`public/uploads/...`** on the local
filesystem (`src/lib/admin/uploads.ts`). **Vercel's runtime filesystem is
read-only and ephemeral**, so:

- ✅ The **database row** (path string) persists in Postgres.
- ❌ The **uploaded file itself** is lost when the function instance recycles.

Committed static art in `public/covers/*.svg` is fine (it ships with the
deployment).

**To make uploads survive on Vercel, choose one:**
1. **Vercel Blob** (recommended): store uploads in Blob and reference them by URL.
   This requires swapping `src/lib/admin/uploads.ts` to use
   `@vercel/blob` instead of `fs.writeFile`. I can wire this up on request.
2. **Commit seed images**: skip runtime uploads in production; ship the images
   you need in the repo under `public/`.
3. **External object storage** (S3 / R2 / Cloudinary) via their SDKs.

Tell me which you'd like and I'll adapt the upload path accordingly.

---

## 5. Local development (unchanged)

```bash
npm install
npm run dev          # starts Next on port 3005 (scripts/dev.mjs)
```

With no `DATABASE_URL` set, it uses the local SQLite file at `data/portal.db`
(created and seeded automatically on first run). Your existing data is untouched
by the Postgres path.

---

## 6. Troubleshooting

| Symptom | Fix |
| ------- | ---- |
| `MODULE_NOT_FOUND: better-sqlite3` on Vercel | Shouldn't happen — it's externalized in `next.config.mjs` and only loaded when `DATABASE_URL` is absent. Confirm `POSTGRES_URL` is set. |
| "prepared statement already exists" | Already handled: the Postgres client uses `prepare: false` for PgBouncer compatibility. |
| Admin edits don't show | The site is `force-dynamic`, so a hard refresh should show them. Check you're not looking at a stale preview deployment. |
| Uploaded images 404 after a while | Expected on Vercel — see the persistence caveat in step 4. Switch to Blob storage. |
| Build fails connecting to DB | It shouldn't (force-dynamic = no build-time DB access). If it does, verify no top-level `getStore()` call runs at module import. |

---

## Summary of changes made for Vercel readiness
- `src/lib/content.ts`: introduced a `StoreAdapter` interface with Postgres +
  SQLite implementations, chosen at boot from `DATABASE_URL`/`POSTGRES_URL`.
  Postgres uses the pure-JS `postgres` client (no native compile) with
  `prepare: false` for PgBouncer. Public data API unchanged.
- `package.json`: added `postgres`; dual-engine description.
- `.gitignore`: already excludes secrets, the SQLite DB, and runtime uploads.
- `next.config.mjs`: `better-sqlite3` kept external (never loaded on Vercel).
