import Link from "next/link";
import type { EventItem, NewsArticle, SportItem, TeamItem } from "@/data/types";
import { formatDate, statusLabel } from "@/lib/format";

// Fallback shown when an item has no cover image (empty/undefined cover would
// otherwise render <img src=""> and trigger a React console warning).
const DEFAULT_COVER = "/covers/placeholder.svg";

export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="card">
      <Link href={`/events/${event.slug}`} className="media" style={{ display: "block" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.cover || DEFAULT_COVER} alt={event.title} />
      </Link>
      <div className="body">
        <span className="tag">{event.category}</span>
        <h3>
          <Link href={`/events/${event.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            {event.title}
          </Link>
        </h3>
        <p>{event.summary}</p>
        <div className="meta">
          <span>📅 {formatDate(event.date)}</span>
          <span>📍 {event.city}</span>
        </div>
        <div className="meta">
          <span className={`pill pill-${event.status}`}>● {statusLabel(event.status)}</span>
          <Link className="more" href={`/events/${event.slug}`}>View Details →</Link>
        </div>
      </div>
    </article>
  );
}

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="card">
      <div className="media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.cover || DEFAULT_COVER} alt={article.title} />
      </div>
      <div className="body">
        <span className="tag">{article.category}</span>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <div className="meta">
          <span>🗞️ {formatDate(article.date)}</span>
          <span>✍️ {article.author}</span>
        </div>
        <Link className="more" href={`/news/${article.slug}`}>Read more →</Link>
      </div>
    </article>
  );
}

export function SportCard({ sport }: { sport: SportItem }) {
  return (
    <Link href={`/sports/${sport.slug}`} className="card" style={{ textDecoration: "none" }}>
      <div className="body">
        <div className="feature" style={{ border: "none", padding: 0, boxShadow: "none" }}>
          <div className="ico" style={{ fontSize: "1.8rem" }}>{sport.icon}</div>
          <h3 style={{ marginTop: 8 }}>{sport.name}</h3>
          <p style={{ color: "var(--muted)" }}>{sport.tagline}</p>
        </div>
        <span className="more">Explore →</span>
      </div>
    </Link>
  );
}

export function TeamCard({ team }: { team: TeamItem }) {
  return (
    <article className="card">
      <div className="media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={team.cover || DEFAULT_COVER} alt={team.name} />
      </div>
      <div className="body">
        <span className="tag">{team.sport}</span>
        <h3>{team.name}</h3>
        <div className="meta">
          <span>🧢 {team.captain}</span>
          <span>📅 Est. {team.founded}</span>
        </div>
        <div className="meta">
          <span>📍 {team.homeVenue}</span>
        </div>
      </div>
    </article>
  );
}
