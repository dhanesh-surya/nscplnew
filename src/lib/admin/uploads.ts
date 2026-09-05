import { promises as fs } from "fs";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

function sanitize(input: string, fallback: string, max = 40): string {
  const cleaned = input.replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase();
  return cleaned || fallback;
}

/**
 * Persists an uploaded image to /public/uploads/gallery and returns the
 * public path (e.g. /uploads/gallery/g1-169...-ab12cd.png).
 *
 * `galleryId` is used only to namespace the filename so multiple galleries
 * don't collide; the bytes are written verbatim (no resizing).
 */
export async function saveUploadedFile(
  galleryId: string,
  file: File
): Promise<string> {
  return saveAssetFile(`gallery/${galleryId}`, file);
}

/** Persist an image/document uploaded from a CMS page block. */
export async function savePageAsset(
  pageSlug: string,
  file: File
): Promise<string> {
  return saveAssetFile(`pages/${pageSlug}`, file);
}

/**
 * Persist a cover image uploaded from a regular collection form
 * (news, events, sports, teams, pages). Files land in
 * /public/uploads/covers/<collection>/<slug-or-id>/ so each record keeps its
 * own folder and names never collide.
 */
export async function saveCoverAsset(
  collection: string,
  slug: string,
  file: File
): Promise<string> {
  return saveAssetFile(`covers/${collection}/${slug || "misc"}`, file);
}

async function saveAssetFile(namespace: string, file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length === 0) throw new Error("Empty file");

  const ext = (file.name.split(".").pop() || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 5);
  const imageExts = [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp",
    "svg",
    "avif",
    "bmp",
    "ico",
    "tif",
    "tiff",
    "heic",
    "heif",
    "jfif",
  ];
  const documentExts = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "zip"];
  const safeExt = [...imageExts, ...documentExts].includes(ext) ? ext : "bin";
  const safeNamespace = namespace.split("/").map((part) => sanitize(part, "asset")).join("/");
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const fileName = `${sanitize(file.name.replace(/\.[^.]+$/, ""), "upload")}-${stamp}.${safeExt}`;
  const dir = path.join(UPLOAD_ROOT, safeNamespace);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, fileName), bytes);

  return `/uploads/${safeNamespace}/${fileName}`;
}
