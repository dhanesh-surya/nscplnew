import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getNews } from "@/lib/content";
import { formatDate } from "@/lib/format";
import Section from "@/components/Section";

export async function generateStaticParams() {
  const news = await getNews();
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  return { title: article ? article.title : "News" };
}

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const news = await getNews();
  const more = news.filter((n) => n.slug !== article.slug).slice(0, 3);

  return (
    <>
      <header className="cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.cover || "/covers/placeholder.svg"} alt="" />
        <div className="scrim" />
        <div className="container inner">
          <span className="eyebrow">{article.category}</span>
          <h1 style={{ maxWidth: "22ch" }}>{article.title}</h1>
          <div className="meta" style={{ color: "rgba(255,255,255,0.9)", display: "flex", gap: 20, flexWrap: "wrap", marginTop: 10 }}>
            <span>🗞️ {formatDate(article.date)}</span>
            <span>✍️ {article.author}</span>
          </div>
        </div>
      </header>

      <Section>
        <div className="prose" style={{ margin: "0 auto" }}>
          <p className="lead">{article.excerpt}</p>
          {article.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <hr className="divider" style={{ margin: "24px 0" }} />
          <Link href="/news" className="btn btn-ghost">← Back to news</Link>
        </div>
      </Section>

      <Section alt eyebrow="Keep reading" title="More news">
        <div className="grid grid-3">
          {more.map((a) => (
            <article className="card" key={a.slug}>
              <div className="media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.cover || "/covers/placeholder.svg"} alt={a.title} />
              </div>
              <div className="body">
                <span className="tag">{a.category}</span>
                <h3>{a.title}</h3>
                <Link className="more" href={`/news/${a.slug}`}>Read more →</Link>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
