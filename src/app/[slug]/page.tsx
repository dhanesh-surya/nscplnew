import { notFound, redirect } from "next/navigation";
import Cover from "@/components/Cover";
import Section from "@/components/Section";
import PageRenderer from "@/components/PageRenderer";
import { getPage } from "@/lib/content";

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // The built-in pages have dedicated routes; don't serve them a second time.
  if (slug === "home") redirect("/");
  if (slug === "about") notFound();

  const page = await getPage(slug);
  if (!page) notFound();
  return <><Cover title={page.title} subtitle={page.excerpt} image={page.cover} /><Section><PageRenderer blocks={page.blocks || []} /></Section></>;
}
