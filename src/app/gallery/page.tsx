import Cover from "@/components/Cover";
import Section from "@/components/Section";
import { getGallery } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const gallery = await getGallery();
  return (
    <>
      <Cover
        eyebrow="Gallery"
        title="Moments from the field"
        subtitle="A peek at matches, medals and community days across NSCPL events."
        image="/covers/cricket-league.svg"
      />

      <Section
        eyebrow="Highlights"
        title={`${gallery.length} moments`}
        subtitle="Tap any tile to view the full set."
      >
        <div className="grid grid-3">
          {gallery.map((item) => {
            const cover = item.images?.[0]?.src ?? item.image;
            const photoCount = item.images?.length ?? (item.image ? 1 : 0);
            return (
              <figure className="card" key={item.id} style={{ margin: 0 }}>
                <a href={`/gallery/${item.id}`} style={{ display: "block", position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt={item.title} style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover" }} />
                  {photoCount > 1 ? (
                    <span
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: "rgba(0,0,0,.6)",
                        color: "#fff",
                        fontSize: ".72rem",
                        padding: "3px 8px",
                        borderRadius: 999,
                      }}
                    >
                      {photoCount} photos
                    </span>
                  ) : null}
                </a>
                <figcaption className="body">
                  <strong>{item.title}</strong>
                  <div className="meta">
                    <span>{item.category}</span>
                    <span>{formatDate(item.date)}</span>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Section>
    </>
  );
}
