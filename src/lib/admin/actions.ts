"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import crypto from "crypto";
import {
  COLLECTIONS,
  type CollectionKey,
  deleteItem,
  getStore,
  slugify,
  upsertItem,
} from "@/lib/content";
import { schemas } from "./schema";
import { saveCoverAsset, saveUploadedFile } from "./uploads";

const COOKIE = "portal_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret(): string {
  return process.env.ADMIN_SECRET || "dev-insecure-change-me-please";
}

function sign(value: string): string {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export type LoginState = { error?: string };

export async function adminLogin(
  _prev: LoginState,
  form: FormData
): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");

  const wantEmail = (process.env.ADMIN_EMAIL || "admin@nscpl.in").toLowerCase();
  const wantPass = process.env.ADMIN_PASSWORD || "nscpl@admin";

  if (email !== wantEmail || password !== wantPass) {
    return { error: "Invalid email or password." };
  }

  const payload = Buffer.from(email).toString("base64url");
  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  redirect("/admin");
}

export async function adminLogout(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
  redirect("/admin/login");
}

export async function getAdminSession(): Promise<string | null> {
  const jar = await cookies();
  const value = jar.get(COOKIE)?.value;
  if (!value) return null;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;
  if (sign(payload) !== sig) return null;
  try {
    return Buffer.from(payload, "base64url").toString();
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<string> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export type SaveResult = { error?: string } | void;

/** Save a menu item with an optional CMS page association. */
export async function saveMenuItemAction(
  id: string | null,
  form: FormData
): Promise<void> {
  await requireAdmin();
  const label = String(form.get("label") ?? "").trim();
  if (!label) return;

  const pageSlug = String(form.get("pageSlug") ?? "").trim();
  const customHref = String(form.get("customHref") ?? "").trim();
  const href = pageSlug && pageSlug !== "__external__"
    ? pageSlug === "home" ? "/" : `/${pageSlug}`
    : customHref;
  if (!href) return;

  const itemId = id || slugify(label);
  if (!itemId) return;
  const parentId = String(form.get("parentId") ?? "").trim();
  const target = String(form.get("target") ?? "same").trim() === "new" ? "new" : "same";
  const orderRaw = Number(form.get("order") ?? 0);

  await upsertItem("menu", {
    id: itemId,
    label,
    href,
    parentId,
    pageSlug: pageSlug && pageSlug !== "__external__" ? pageSlug : "",
    target,
    order: Number.isFinite(orderRaw) ? orderRaw : 0,
    visible: form.get("visible") === "on",
  });
  redirect("/admin/menu");
}

export async function saveItemAction(
  collection: CollectionKey,
  id: string | null,
  form: FormData
): Promise<void> {
  await requireAdmin();
  const schema = schemas[collection];

  // Resolve the record id up front so uploaded assets can be namespaced by it.
  const idField = schema.idField;
  let itemId: string;
  if (id) {
    itemId = id;
  } else if (schema.deriveIdFromTitle) {
    itemId = slugify(String(form.get(schema.titleField) ?? ""));
  } else {
    itemId = String(form.get(idField) ?? "").trim();
  }
  if (!itemId) return;

  const obj: Record<string, unknown> = {};
  for (const field of schema.fields) {
    // Upload-backed asset field: a chosen file wins over the typed path.
    if (field.type === "image") {
      const file = form.get(`${field.name}__file`);
      if (file instanceof File && file.size > 0) {
        try {
          obj[field.name] = await saveCoverAsset(collection, itemId, file);
        } catch {
          // Upload failed (e.g. unsupported/too large): keep the typed path
          // instead of losing the whole submission.
          obj[field.name] = String(form.get(field.name) ?? "").trim();
        }
        continue;
      }
      const path = String(form.get(field.name) ?? "").trim();
      if (field.required && !path) return;
      obj[field.name] = path;
      continue;
    }

    const raw = String(form.get(field.name) ?? "");
    if (field.required && !raw.trim()) {
      // HTML `required` already blocks empty submits; bail out silently.
      return;
    }
    switch (field.type) {
      case "lines":
        obj[field.name] = raw
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        break;
      case "json":
      case "repeater":
        try {
          obj[field.name] = raw.trim() ? JSON.parse(raw) : [];
        } catch {
          // Invalid JSON: skip save (browser-side validation is best-effort).
          return;
        }
        break;
      case "number":
        obj[field.name] = raw === "" ? 0 : Number(raw);
        break;
      case "boolean":
        obj[field.name] = form.get(field.name) === "on";
        break;
      default:
        obj[field.name] = raw;
    }
  }

  obj[idField] = itemId;

  await upsertItem(collection, obj);
  redirect(`/admin/${collection}`);
}

export async function deleteItemAction(
  collection: CollectionKey,
  id: string
): Promise<void> {
  await requireAdmin();
  await deleteItem(collection, id);
  redirect(`/admin/${collection}`);
}

interface GalleryMetaEntry {
  src: string;
  caption: string;
  pageSlugs?: string[];
  fileKey: string | null;
}

export type GallerySaveResult = { error?: string };

/**
 * Saves a gallery item along with its (possibly multiple) images + captions.
 * The client sends a `meta` JSON array describing the final ordered image
 * list; entries with `fileKey` reference a newly uploaded File in the same
 * FormData (written to /public/uploads/gallery), others keep their existing
 * `src`. `image` is set to the first image (cover) for backward compatibility.
 *
 * Returns a result instead of redirecting, so failures surface in the UI
 * (e.g. the Server Action body-size limit) instead of being swallowed.
 */
export async function saveGalleryAction(
  id: string | null,
  form: FormData
): Promise<GallerySaveResult> {
  await requireAdmin(); // may redirect to /admin/login

  try {
    const idVal = (id ?? String(form.get("id") ?? "")).toString().trim();
    if (!idVal) return { error: "ID is required." };

    const title = String(form.get("title") ?? "").trim();
    const category = String(form.get("category") ?? "").trim();
    const date = String(form.get("date") ?? "").trim();

    let meta: GalleryMetaEntry[] = [];
    try {
      const parsed = JSON.parse(String(form.get("meta") ?? "[]"));
      if (Array.isArray(parsed)) meta = parsed as GalleryMetaEntry[];
    } catch {
      meta = [];
    }

    const images: { src: string; caption: string; pageSlugs: string[] }[] = [];
    for (const m of meta) {
      const pageSlugs = Array.isArray(m?.pageSlugs)
        ? m.pageSlugs.filter((slug): slug is string => typeof slug === "string")
        : [];
      if (m?.fileKey) {
        const f = form.get(m.fileKey);
        const isFile =
          !!f && typeof f === "object" && "arrayBuffer" in (f as object);
        if (isFile && (f as File).size > 0) {
          const src = await saveUploadedFile(idVal, f as File);
          images.push({ src, caption: String(m.caption ?? ""), pageSlugs });
        }
      } else if (m?.src) {
        images.push({ src: String(m.src), caption: String(m.caption ?? ""), pageSlugs });
      }
    }

    const obj: Record<string, unknown> = {
      id: idVal,
      title,
      category,
      date,
      image: images.length ? images[0].src : "",
      images,
    };

    await upsertItem("gallery", obj);
    return {};
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Could not save the gallery item.",
    };
  }
}
