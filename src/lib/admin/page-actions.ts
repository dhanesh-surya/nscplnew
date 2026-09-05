"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "./actions";
import { saveCoverAsset, savePageAsset } from "./uploads";
import { getAllPages, upsertItem } from "@/lib/content";
import type { PageBlock, PageItem } from "@/data/types";

export async function savePageAction(
  id: string | null,
  form: FormData
): Promise<void> {
  await requireAdmin();
  try {
    const slug = String(form.get("slug") ?? id ?? "").trim();
    const title = String(form.get("title") ?? "").trim();
    if (!slug || !title) return;

    let blocks: PageBlock[] = [];
    try {
      const parsed = JSON.parse(String(form.get("blocks") ?? "[]"));
      if (Array.isArray(parsed)) blocks = parsed as PageBlock[];
    } catch {
      return;
    }

    const fileKeys = JSON.parse(String(form.get("assetKeys") ?? "[]")) as string[];
    for (const key of fileKeys) {
      const file = form.get(key);
      if (!(file instanceof File) || file.size === 0) continue;
      const [blockId, kind, cardIndex] = key.split("::");
      const src = await savePageAsset(slug, file);
      blocks = blocks.map((block) => {
        if (block.id !== blockId) return block;
        if (kind === "image" || kind === "file") return { ...block, src, fileName: block.fileName || file.name };
        if (kind === "cardImage") {
          const items = (block.items ?? []).map((item, index) => index === Number(cardIndex) ? { ...item, image: src } : item);
          return { ...block, items };
        }
        return block;
      });
    }

    // Cover: an uploaded file wins over the typed path.
    const coverFile = form.get("cover__file");
    let cover = String(form.get("cover") ?? "").trim();
    if (coverFile instanceof File && coverFile.size > 0) {
      try {
        cover = await saveCoverAsset("pages", slug, coverFile);
      } catch {
        // keep the typed path if the upload fails
      }
    }

    const existing: PageItem | undefined = (await getAllPages()).find((p) => p.slug === slug);

    const page: PageItem = {
      slug,
      title,
      excerpt: String(form.get("excerpt") ?? "").trim(),
      cover,
      status: String(form.get("status") ?? "draft") === "published" ? "published" : "draft",
      menuLabel: String(form.get("menuLabel") ?? "").trim(),
      blocks,
      seoTitle: String(form.get("seoTitle") ?? "").trim(),
      seoDescription: String(form.get("seoDescription") ?? "").trim(),
      updatedAt: new Date().toISOString(),
      // Preserve the built-in flag so home/about stay protected on edit.
      system: existing?.system ?? false,
    };
    await upsertItem("pages", page as unknown as Record<string, unknown>);
    redirect("/admin/pages");
  } catch (err) {
    if (err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT")) throw err;
    throw err;
  }
}
