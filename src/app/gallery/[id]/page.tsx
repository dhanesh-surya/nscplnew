import { notFound } from "next/navigation";
import Link from "next/link";
import Cover from "@/components/Cover";
import Section from "@/components/Section";
import GalleryGrid from "@/components/GalleryGrid";
import { getGalleryItem } from "@/lib/content";
import { formatDate } from "@/lib/format";

export default async function GalleryDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getGalleryItem(id);
  if (!item) notFound();

  const images = item.images?.length
    ? item.images
    : item.image
      ? [{ src: item.image, caption: "" }]
      : [];

  return (
    <>
      <Cover
        eyebrow={item.category}
        title={item.title}
        subtitle={formatDate(item.date)}
        image={images[0]?.src || "/covers/cricket-league.svg"}
      />

      <Section
        eyebrow="Gallery"
        title={`${images.length} photo${images.length === 1 ? "" : "s"}`}
        subtitle="Click any photo to view it fullscreen."
      >
        <GalleryGrid images={images} title={item.title} />

        <div style={{ marginTop: 24 }}>
          <Link href="/gallery" className="btn btn-ghost">
            ← Back to gallery
          </Link>
        </div>
      </Section>
    </>
  );
}
