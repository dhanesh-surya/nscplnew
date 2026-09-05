"use client";

import { useRef, useState } from "react";
import { saveFooterAction } from "@/lib/admin/settings-actions";
import type { FooterColumn, FooterLink, SiteFooterData } from "@/data/types";
import { DEFAULT_SOCIALS, SOCIAL_ICON_OPTIONS } from "@/components/SocialIcon";

type LinkRow = FooterLink;
type ColumnRow = FooterColumn;

function emptyLink(): LinkRow {
  return { label: "", href: "" };
}
function emptyColumn(): ColumnRow {
  return { title: "", links: [emptyLink()] };
}

export default function FooterForm({ values }: { values: SiteFooterData }) {
  const [brand, setBrand] = useState(values.brand ?? "");
  const [about, setAbout] = useState(values.about ?? "");
  const [columns, setColumns] = useState<ColumnRow[]>(
    values.columns?.length ? values.columns : [emptyColumn()]
  );
  const [social, setSocial] = useState<LinkRow[]>(
    values.social?.length ? values.social : [emptyLink()]
  );
  const [contact, setContact] = useState(
    values.contact ?? { email: "", phone: "", address: "", city: "" }
  );

  const formRef = useRef<HTMLFormElement>(null);

  // Serialise the nested structures into the hidden fields just before submit so
  // the server action receives clean JSON in the FormData. We do not prevent
  // default — the native form submission to the server action picks up the
  // populated hidden fields.
  function syncHidden() {
    const form = formRef.current;
    if (!form) return;
    const cols = form.querySelector<HTMLInputElement>('input[name="columns"]');
    const soc = form.querySelector<HTMLInputElement>('input[name="social"]');
    if (cols) cols.value = JSON.stringify(columns);
    if (soc) soc.value = JSON.stringify(social);
  }

  /* ---- column + link helpers ---- */
  function setColumnTitle(i: number, title: string) {
    setColumns((cols) => cols.map((c, idx) => (idx === i ? { ...c, title } : c)));
  }
  function addColumn() {
    setColumns((cols) => [...cols, emptyColumn()]);
  }
  function removeColumn(i: number) {
    setColumns((cols) => cols.filter((_, idx) => idx !== i));
  }
  function setLink(colI: number, linkI: number, patch: Partial<LinkRow>) {
    setColumns((cols) =>
      cols.map((c, ci) =>
        ci !== colI
          ? c
          : {
              ...c,
              links: c.links.map((l, li) => (li === linkI ? { ...l, ...patch } : l)),
            }
      )
    );
  }
  function addLink(colI: number) {
    setColumns((cols) =>
      cols.map((c, ci) => (ci === colI ? { ...c, links: [...c.links, emptyLink()] } : c))
    );
  }
  function removeLink(colI: number, linkI: number) {
    setColumns((cols) =>
      cols.map((c, ci) =>
        ci === colI ? { ...c, links: c.links.filter((_, li) => li !== linkI) } : c
      )
    );
  }

  /* ---- social helpers ---- */
  function setSocialItem(i: number, patch: Partial<LinkRow>) {
    setSocial((items) => items.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function addSocial() {
    setSocial((items) => [...items, emptyLink()]);
  }
  function removeSocial(i: number) {
    setSocial((items) => items.filter((_, idx) => idx !== i));
  }
  /** Replace the social list with the five default platforms (icons included). */
  function useDefaultSocials() {
    setSocial(
      DEFAULT_SOCIALS.map((s) => ({ label: s.label, href: s.href, icon: s.icon }))
    );
  }

  return (
    <form ref={formRef} action={saveFooterAction} onSubmit={syncHidden}>
      <input type="hidden" name="columns" />
      <input type="hidden" name="social" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        <div className="field">
          <label htmlFor="f_brand">Brand short name</label>
          <input id="f_brand" type="text" value={brand} onChange={(e) => setBrand(e.target.value)} name="brand" />
        </div>
        <div className="field">
          <label htmlFor="f_copyright">Copyright line</label>
          <input id="f_copyright" type="text" name="copyright" defaultValue={values.copyright ?? ""} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="f_about">About text</label>
        <textarea id="f_about" rows={3} value={about} onChange={(e) => setAbout(e.target.value)} name="about" />
      </div>

      <h2 style={{ marginTop: 24 }}>Link columns</h2>
      <div style={{ display: "grid", gap: 16 }}>
        {columns.map((col, ci) => (
          <div
            key={ci}
            style={{
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-sm)",
              padding: 14,
              background: "var(--white)",
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <input
                type="text"
                placeholder="Column title (e.g. Explore)"
                value={col.title}
                onChange={(e) => setColumnTitle(ci, e.target.value)}
                style={{ fontWeight: 600, flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-ghost"
                style={{ padding: "6px 12px", color: "#b91c1c", borderColor: "#fecaca" }}
                onClick={() => removeColumn(ci)}
              >
                Remove column
              </button>
            </div>
            <div style={{ display: "grid", gap: 8, paddingLeft: 4 }}>
              {col.links.map((link, li) => (
                <div key={li} style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => setLink(ci, li, { label: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    placeholder="/path or https://"
                    value={link.href}
                    onChange={(e) => setLink(ci, li, { href: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ padding: "6px 10px" }}
                    onClick={() => removeLink(ci, li)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-ghost"
                style={{ padding: "6px 12px", alignSelf: "flex-start" }}
                onClick={() => addLink(ci)}
              >
                + Add link
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-ghost"
          style={{ alignSelf: "flex-start" }}
          onClick={addColumn}
        >
          + Add column
        </button>
      </div>

      <h2 style={{ marginTop: 24 }}>Contact</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <div className="field">
          <label>Email</label>
          <input
            type="text"
            name="contact_email"
            value={contact.email}
            onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Phone</label>
          <input
            type="text"
            name="contact_phone"
            value={contact.phone}
            onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Address</label>
          <input
            type="text"
            name="contact_address"
            value={contact.address}
            onChange={(e) => setContact((c) => ({ ...c, address: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>City</label>
          <input
            type="text"
            name="contact_city"
            value={contact.city}
            onChange={(e) => setContact((c) => ({ ...c, city: e.target.value }))}
          />
        </div>
      </div>

      <h2 style={{ marginTop: 24 }}>Social links</h2>
      <p className="lead" style={{ marginTop: 0 }}>
        Pick an icon for each link, or drop in the five most common platforms in one
        click.
      </p>
      <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <button type="button" className="btn btn-ghost" onClick={useDefaultSocials}>
          Insert default social icons
        </button>
        <button type="button" className="btn btn-ghost" onClick={addSocial}>
          + Add social link
        </button>
      </div>
      <div style={{ display: "grid", gap: 8, maxWidth: 720 }}>
        {social.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Label (e.g. LinkedIn)"
              value={s.label}
              onChange={(e) => setSocialItem(i, { label: e.target.value })}
              style={{ flex: 1 }}
            />
            <input
              type="text"
              placeholder="https://..."
              value={s.href}
              onChange={(e) => setSocialItem(i, { href: e.target.value })}
              style={{ flex: 1 }}
            />
            <select
              value={s.icon ?? ""}
              onChange={(e) => setSocialItem(i, { icon: e.target.value as FooterLink["icon"] })}
              style={{ width: 140, flex: "none" }}
              aria-label="Icon"
            >
              <option value="">Letter</option>
              {SOCIAL_ICON_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ padding: "6px 10px" }}
              onClick={() => removeSocial(i)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 28 }}>Google Map embed</h2>
      <p className="lead" style={{ marginTop: 0 }}>
        Paste a Google Maps embed URL (the <code>src</code> of an embed iframe, e.g.
        <code> https://www.google.com/maps/embed?pb=...</code>). Leave blank to hide the
        map.
      </p>
      <div className="field" style={{ maxWidth: 720 }}>
        <input
          type="text"
          name="mapEmbed"
          defaultValue={values.mapEmbed ?? ""}
          placeholder="https://www.google.com/maps/embed?pb=..."
        />
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
        <button className="btn btn-primary" type="submit">
          Save footer
        </button>
        <a href="/admin" className="btn btn-ghost">
          Cancel
        </a>
      </div>
    </form>
  );
}
