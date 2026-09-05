import Cover from "@/components/Cover";
import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";
import SocialIcon from "@/components/SocialIcon";
import { getFooter } from "@/lib/content";
import { site } from "@/data/site";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const footer = await getFooter();
  const social = footer.social ?? site.social;
  return (
    <>
      <Cover
        eyebrow="Contact"
        title="Let's run something together"
        subtitle="Tell us about your event, club or idea. We usually reply within two working days."
        image="/covers/football-trophy.svg"
      />

      <Section>
        <div className="contact-grid">
          <div>
            <h2 style={{ marginTop: 0 }}>Send us a message</h2>
            <p className="lead" style={{ marginTop: 0 }}>
              Fill in the form and our team will get back to you. For event registrations, tell us
              the sport and expected number of participants.
            </p>
            <ContactForm />
          </div>

          <aside>
            <h3>Reach us directly</h3>
            <ul className="info-list">
              <li>
                <span className="ic">✉️</span>
                <div>
                  <strong>Email</strong>
                  <br />
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </div>
              </li>
              <li>
                <span className="ic">📞</span>
                <div>
                  <strong>Phone</strong>
                  <br />
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
                </div>
              </li>
              <li>
                <span className="ic">📍</span>
                <div>
                  <strong>Office</strong>
                  <br />
                  {site.address}
                  <br />
                  {site.city}
                </div>
              </li>
              <li>
                <span className="ic">🕒</span>
                <div>
                  <strong>Hours</strong>
                  <br />
                  Mon–Sat, 9:00 – 18:00 IST
                </div>
              </li>
            </ul>

            <div style={{ marginTop: 22 }}>
              <h3>Follow along</h3>
              <div className="socials socials-light">
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
                    {!s.icon && (s.label?.[0] ?? "")}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
