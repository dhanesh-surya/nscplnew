import Link from "next/link";
import Cover from "@/components/Cover";
import Section from "@/components/Section";
import { NewsCard } from "@/components/Cards";
import { getNews } from "@/lib/content";

export const metadata = { title: "News" };

export default async function NewsPage() {
  const news = await getNews();
  const [lead, ...rest] = news;

  return (
    <>
      <Cover
        eyebrow="News"
        title="Updates from the NSCPL community"
        subtitle="League announcements, results and stories from across our events."
        image="/covers/run-series.svg"
      />

      <Section>
        {lead && (
          <article className="card" style={{ marginBottom: 28, flexDirection: "row", flexWrap: "wrap" }}>
            <div className="media" style={{ flex: "1 1 320px", aspectRatio: "16 / 10" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lead.cover} alt={lead.title} />
            </div>
            <div className="body" style={{ flex: "1 1 320px" }}>
              <span className="tag">{lead.category}</span>
              <h3 style={{ fontSize: "1.4rem" }}>{lead.title}</h3>
              <p>{lead.excerpt}</p>
              <div className="meta">
                <span>🗞️ {lead.date}</span>
                <span>✍️ {lead.author}</span>
              </div>
              <Link className="more" href={`/news/${lead.slug}`}>Read more →</Link>
            </div>
          </article>
        )}

        <div className="grid grid-3">
          {rest.map((a) => (
            <NewsCard key={a.slug} article={a} />
          ))}
        </div>
      </Section>
    </>
  );
}
