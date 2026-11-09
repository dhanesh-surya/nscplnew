import PageRenderer from "@/components/PageRenderer";
import { getSystemPage } from "@/lib/content";
import { aboutPage } from "@/data/system-pages";

export async function generateMetadata() {
  const managed = await getSystemPage("about");
  const defaults = aboutPage();
  return {
    title: managed?.seoTitle || defaults.seoTitle || "About Us - NSCPL PRIVATE LIMITED",
    description: managed?.seoDescription || defaults.seoDescription,
  };
}

/**
 * The About page is a managed CMS page — see /admin/pages.
 * If unpublished or empty, it falls back to the system default layout from system-pages.
 */
export default async function AboutPage() {
  const managed = await getSystemPage("about");
  if (managed && managed.blocks.length) {
    return <PageRenderer blocks={managed.blocks} cover={managed.cover} />;
  }

  const fallback = aboutPage();
  return <PageRenderer blocks={fallback.blocks} cover={fallback.cover} />;
}
