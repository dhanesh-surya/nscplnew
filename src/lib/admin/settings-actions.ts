"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./actions";
import { saveCoverAsset } from "./uploads";
import { upsertItem } from "@/lib/content";
import { defaultFooter, defaultSettings } from "@/data/site-defaults";
import type { SiteFooterData, SiteSettings } from "@/data/types";

/* ------------------------------------------------------------------ */
/* Site settings                                                      */
/* ------------------------------------------------------------------ */

const SETTINGS_COLOR_KEYS: (keyof SiteSettings)[] = [
  "brand",
  "brandDark",
  "brandSoft",
  "accent",
  "ink",
  "muted",
  "line",
  "surface",
  "white",
];

/**
 * Saves the single site-settings record. Every field is a string (colours are
 * hex, radii/sizes are CSS lengths). An uploaded background image wins over a
 * typed path/URL when the background style is "image".
 */
export async function saveSettingsAction(form: FormData): Promise<void> {
  await requireAdmin();
  try {
    const base = defaultSettings();
    const obj: Record<string, unknown> = { id: "site" };

    // Background value: resolve image upload first.
    const bgStyle = String(form.get("backgroundStyle") ?? base.backgroundStyle).trim();
    let bgValue = String(form.get("backgroundValue") ?? base.backgroundValue).trim();
    const bgFile = form.get("backgroundValue__file");
    if (bgStyle === "image" && bgFile instanceof File && bgFile.size > 0) {
      try {
        bgValue = await saveCoverAsset("settings", "site", bgFile);
      } catch {
        // keep typed path on failure
      }
    }
    obj.backgroundStyle = bgStyle as SiteSettings["backgroundStyle"];
    obj.backgroundValue = bgValue;
    obj.backgroundValue2 = String(form.get("backgroundValue2") ?? base.backgroundValue2 ?? "").trim();
    // `Number(null)` is 0 (not NaN), so guard the raw value before parsing to
    // avoid clobbering a stored value to 0 when the field is absent.
    const bgOpacityRaw = form.get("bgOpacity");
    const bgOpacityNum =
      bgOpacityRaw != null && bgOpacityRaw !== "" ? Number(bgOpacityRaw) : NaN;
    obj.bgOpacity = Number.isFinite(bgOpacityNum) ? bgOpacityNum : base.bgOpacity;
    const bgBlurRaw = form.get("bgBlur");
    const bgBlurNum = bgBlurRaw != null && bgBlurRaw !== "" ? Number(bgBlurRaw) : NaN;
    obj.bgBlur = Number.isFinite(bgBlurNum) ? bgBlurNum : base.bgBlur;

    // Colour tokens.
    for (const key of SETTINGS_COLOR_KEYS) {
      const raw = String(form.get(key) ?? "").trim();
      obj[key] = raw || base[key];
    }

    // Plain string tokens.
    obj.radius = String(form.get("radius") ?? base.radius).trim() || base.radius;
    obj.radiusSm = String(form.get("radiusSm") ?? base.radiusSm).trim() || base.radiusSm;
    obj.font = String(form.get("font") ?? base.font).trim() || base.font;
    obj.maxw = String(form.get("maxw") ?? base.maxw).trim() || base.maxw;
    obj.linkStyle = (String(form.get("linkStyle") ?? base.linkStyle).trim() ||
      base.linkStyle) as SiteSettings["linkStyle"];
    obj.buttonStyle = (String(form.get("buttonStyle") ?? base.buttonStyle).trim() ||
      base.buttonStyle) as SiteSettings["buttonStyle"];
    obj.linkHoverColor =
      String(form.get("linkHoverColor") ?? base.linkHoverColor).trim() || base.linkHoverColor;

    // Header customisation.
    obj.headerBg = String(form.get("headerBg") ?? base.headerBg).trim() || base.headerBg;
    obj.headerColor =
      String(form.get("headerColor") ?? base.headerColor).trim() || base.headerColor;
    // Logo: an uploaded file wins over a typed path/URL.
    const logoFile = form.get("logo__file");
    let logo = String(form.get("logo") ?? base.logo).trim();
    if (logoFile instanceof File && logoFile.size > 0) {
      try {
        logo = await saveCoverAsset("settings", "site", logoFile);
      } catch {
        // keep typed path/URL on failure
      }
    }
    obj.logo = logo;
    obj.siteName = String(form.get("siteName") ?? base.siteName).trim() || base.siteName;
    obj.glass = form.get("glass") === "on";

    // The gallery strip is now assigned per image in Admin → Gallery. Settings
    // keeps only the shared strip labels; page/image checkboxes are persisted on
    // each GalleryImage record by saveGalleryAction.

    await upsertItem("settings", obj as unknown as Record<string, unknown>);
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    redirect("/admin/settings");
  } catch (err) {
    if (err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT")) throw err;
    throw err;
  }
}

/* ------------------------------------------------------------------ */
/* Footer                                                             */
/* ------------------------------------------------------------------ */

function parseJsonArray<T>(raw: string | null): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

/**
 * Saves the single footer record. Columns and social links are nested arrays
 * posted as JSON in hidden fields; contact details are flat fields.
 */
export async function saveFooterAction(form: FormData): Promise<void> {
  await requireAdmin();
  try {
    const base = defaultFooter();
    const columns = parseJsonArray<SiteFooterData["columns"][number]>(
      String(form.get("columns") ?? "[]")
    );
    const social = parseJsonArray<SiteFooterData["social"][number]>(
      String(form.get("social") ?? "[]")
    ).map((s) => ({ ...s, icon: (s.icon || "") as SiteFooterData["social"][number]["icon"] }));

    const obj: Record<string, unknown> = {
      id: "main",
      brand: String(form.get("brand") ?? "").trim() || base.brand,
      about: String(form.get("about") ?? "").trim() || base.about,
      columns,
      contact: {
        email: String(form.get("contact_email") ?? "").trim(),
        phone: String(form.get("contact_phone") ?? "").trim(),
        address: String(form.get("contact_address") ?? "").trim(),
        city: String(form.get("contact_city") ?? "").trim(),
      },
      copyright:
        String(form.get("copyright") ?? "").trim() || base.copyright,
      social,
      mapEmbed: String(form.get("mapEmbed") ?? "").trim(),
    };

    await upsertItem("footer", obj);
    revalidatePath("/", "layout");
    revalidatePath("/admin/footer");
    redirect("/admin/footer");
  } catch (err) {
    if (err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT")) throw err;
    throw err;
  }
}
