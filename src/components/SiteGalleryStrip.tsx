import { flattenGallery, getGallery, getSettings } from "@/lib/content";
import { resolveStripPage } from "@/data/site";
import GalleryStrip, { type StripImage } from "@/components/GalleryStrip";

/** Hard cap so a huge selection can't bloat every page's HTML. */
const MAX_IMAGES = 40;

/**
 * Server-side data half of the site-wide gallery strip. The strip is opt-in per
 * page: each GalleryImage stores its own checked page slugs. Images can be
 * selected for multiple pages, and pages with no checked images render nothing.
 *
 * Rendered by the root layout just above the footer, so every public page can
 * end with the same auto-scrolling strip — but only if its admin enabled it.
 */
export default async function SiteGalleryStrip({ pathname }: { pathname: string }) {
  const slug = resolveStripPage(pathname);
  if (!slug) return null;

  const settings = await getSettings();
  const gallery = await getGallery();

  // Each image owns its page assignments. This lets one image be checked for
  // multiple pages without maintaining a separate site-wide selection map.
  const images: StripImage[] = flattenGallery(gallery)
    .filter((p) => p.pageSlugs?.includes(slug))
    .map((p) => ({
      src: p.src,
      caption: p.caption,
      title: p.title,
      category: p.category,
    }));

  if (images.length === 0) return null;

  return (
    <GalleryStrip
      images={images.slice(0, MAX_IMAGES)}
      eyebrow={settings.galleryStripEyebrow}
      title={settings.galleryStripTitle}
    />
  );
}
