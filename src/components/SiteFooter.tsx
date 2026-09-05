import Link from "next/link";
import { getFooter } from "@/lib/content";
import { site } from "@/data/site";
import SocialIcon from "@/components/SocialIcon";

/**
 * Renders the site footer from the admin-managed footer record. Falls back to
 * the site defaults if the record is missing so the page never breaks.
 */
export default async function SiteFooter() {
  const footer = await getFooter();
  const year = new Date().getFullYear();
  const columns = footer.columns ?? [];
  const social = footer.social ?? [];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ color: "#fff" }}>
              <span className="dot">{footer.brand?.[0] ?? site.shortName[0]}</span>
              {footer.brand ?? site.shortName}
            </div>
            <p style={{ marginTop: 12, maxWidth: "34ch" }}>
              {footer.about || site.description}
            </p>
            <div className="socials">
              {social.map((s, i) => (
                <a
                  key={s.href || i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  title={s.label}
                >
                  <SocialIcon icon={s.icon} />
                  {!s.icon && (s.label[0] ?? "")}
                </a>
              ))}
            </div>
            {footer.mapEmbed ? (
              <div className="footer-map">
                <iframe
                  src={footer.mapEmbed}
                  title="Our location"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            ) : null}
          </div>

          {columns.map((col, i) => (
            <div key={i}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l, j) => (
                  <li key={j}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>
            © {year} {footer.copyright || site.name}. All rights reserved.
          </span>
          <span>Built with Next.js · A simpler portal for sport.</span>
        </div>
      </div>
    </footer>
  );
}
