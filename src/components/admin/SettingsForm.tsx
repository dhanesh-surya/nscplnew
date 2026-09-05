"use client";

import { useState } from "react";
import { saveSettingsAction } from "@/lib/admin/settings-actions";
import { FONT_PRESETS } from "@/lib/theme";
import type { SiteSettings } from "@/data/types";
import { site } from "@/data/site";

const COLOR_KEYS: { name: keyof SiteSettings; label: string }[] = [
  { name: "brand", label: "Brand (primary)" },
  { name: "brandDark", label: "Brand dark" },
  { name: "brandSoft", label: "Brand soft (tint)" },
  { name: "accent", label: "Accent" },
  { name: "ink", label: "Ink (text)" },
  { name: "muted", label: "Muted text" },
  { name: "line", label: "Line / border" },
  { name: "surface", label: "Surface (page)" },
  { name: "white", label: "White" },
];

function ColorField({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value: string;
}) {
  const [v, setV] = useState(value || "#000000");
  return (
    <div className="field">
      <label htmlFor={`f_${name}`}>{label}</label>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(v) ? v : "#000000"}
          onChange={(e) => setV(e.target.value)}
          style={{ width: 46, height: 40, padding: 0, border: "1px solid var(--line)", borderRadius: 8, background: "none" }}
          aria-label={`${label} swatch`}
        />
        <input
          id={`f_${name}`}
          name={name}
          type="text"
          value={v}
          onChange={(e) => setV(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>
    </div>
  );
}

export default function SettingsForm({
  values,
}: {
  values: SiteSettings;
}) {
  const [bgStyle, setBgStyle] = useState<SiteSettings["backgroundStyle"]>(
    values.backgroundStyle || "solid"
  );

  return (
    <form action={saveSettingsAction}>
      <h2 style={{ marginTop: 0 }}>Colours</h2>
      <p className="lead" style={{ marginTop: 0 }}>
        These tokens drive every component on the site. Change a value and save to
        restyle buttons, headings, and backgrounds instantly.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {COLOR_KEYS.map((c) => (
          <ColorField
            key={c.name}
            name={c.name}
            label={c.label}
            value={values[c.name] as string}
          />
        ))}
      </div>

      <h2 style={{ marginTop: 28 }}>Header</h2>
      <p className="lead" style={{ marginTop: 0 }}>
        Customise the top navigation bar — logo, site name, and its colours. Leave the
        logo blank to use the brand badge.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        <div className="field">
          <label htmlFor="f_siteName">Site name (header)</label>
          <input id="f_siteName" name="siteName" type="text" defaultValue={values.siteName ?? ""} placeholder={site.shortName} />
        </div>
        <div className="field">
          <label htmlFor="f_logo">Logo image</label>
          <input id="f_logo__file" name="logo__file" type="file" accept="image/*" />
          <div style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: 4 }}>
            Or paste a path/URL:
          </div>
          <input
            id="f_logo"
            name="logo"
            type="text"
            defaultValue={values.logo ?? ""}
            placeholder="/uploads/... or https://..."
          />
        </div>
        <ColorField name="headerBg" label="Header background" value={values.headerBg || "#ffffff"} />
        <ColorField name="headerColor" label="Header text colour" value={values.headerColor || "#0f172a"} />
        <div className="field">
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
            <input type="checkbox" name="glass" defaultChecked={Boolean(values.glass)} style={{ width: "auto" }} />
            Glassmorphism (with image/gradient bg)
          </label>
        </div>
      </div>

      <h2 style={{ marginTop: 28 }}>Shape &amp; typography</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <div className="field">
          <label htmlFor="f_radius">Corner radius (cards)</label>
          <input id="f_radius" name="radius" type="text" defaultValue={values.radius} />
        </div>
        <div className="field">
          <label htmlFor="f_radiusSm">Small radius (buttons)</label>
          <input id="f_radiusSm" name="radiusSm" type="text" defaultValue={values.radiusSm} />
        </div>
        <div className="field">
          <label htmlFor="f_maxw">Max content width</label>
          <input id="f_maxw" name="maxw" type="text" defaultValue={values.maxw} />
        </div>
        <div className="field">
          <label htmlFor="f_font">Font</label>
          <select id="f_font" name="font" defaultValue={values.font}>
            {FONT_PRESETS.some((f) => f.value === values.font) ? (
              FONT_PRESETS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))
            ) : (
              <>
                <option value={values.font}>{values.font} (custom)</option>
                {FONT_PRESETS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>

      <h2 style={{ marginTop: 28 }}>Background</h2>
      <div className="field">
        <label htmlFor="f_backgroundStyle">Background style</label>
        <select
          id="f_backgroundStyle"
          name="backgroundStyle"
          value={bgStyle}
          onChange={(e) => setBgStyle(e.target.value as SiteSettings["backgroundStyle"])}
        >
          <option value="solid">Solid colour</option>
          <option value="gradient">Gradient</option>
          <option value="image">Image</option>
        </select>
      </div>

      {bgStyle === "image" ? (
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="f_backgroundValue">Background image</label>
          <input id="f_backgroundValue__file" name="backgroundValue__file" type="file" accept="image/*" />
          <div style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: 4 }}>
            Or paste an image URL / path:
          </div>
          <input
            id="f_backgroundValue"
            name="backgroundValue"
            type="text"
            defaultValue={values.backgroundValue}
            placeholder="/uploads/... or https://..."
          />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <ColorField
            name="backgroundValue"
            label={bgStyle === "gradient" ? "Gradient start" : "Background colour"}
            value={values.backgroundValue}
          />
          {bgStyle === "gradient" && (
            <ColorField
              name="backgroundValue2"
              label="Gradient end"
              value={values.backgroundValue2 || "#eef2f7"}
            />
          )}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
          marginTop: 16,
        }}
      >
        <div className="field">
          <label htmlFor="f_bgOpacity">Image opacity (%)</label>
          <input
            id="f_bgOpacity"
            name="bgOpacity"
            type="number"
            min={0}
            max={100}
            defaultValue={values.bgOpacity ?? 100}
          />
        </div>
        <div className="field">
          <label htmlFor="f_bgBlur">Image blur (px)</label>
          <input
            id="f_bgBlur"
            name="bgBlur"
            type="number"
            min={0}
            max={100}
            defaultValue={values.bgBlur ?? 0}
          />
        </div>
        <p className="lead" style={{ gridColumn: "1 / -1", marginTop: 0, color: "var(--muted)" }}>
          These apply when the background style is set to <strong>Image</strong> — they
          soften the photo behind your content (0% opacity hides it; blur in px).
        </p>
      </div>

      <h2 style={{ marginTop: 28 }}>Link &amp; button style</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <div className="field">
          <label htmlFor="f_linkStyle">Link style</label>
          <select id="f_linkStyle" name="linkStyle" defaultValue={values.linkStyle}>
            <option value="hover">Underline on hover</option>
            <option value="always">Always underlined</option>
            <option value="none">No underline (clean)</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="f_buttonStyle">Primary button style</label>
          <select id="f_buttonStyle" name="buttonStyle" defaultValue={values.buttonStyle}>
            <option value="filled">Filled</option>
            <option value="soft">Soft (tinted)</option>
            <option value="outline">Outline</option>
          </select>
        </div>
        <ColorField
          name="linkHoverColor"
          label="Link & menu hover colour"
          value={values.linkHoverColor || "#f59e0b"}
        />
      </div>

      <p className="lead" style={{ marginTop: 28, color: "var(--muted)" }}>
        Gallery placement is now managed per image from <a href="/admin/gallery">Admin → Gallery</a>.
        Use the page checkboxes on each image to show it on one or more pages.
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
        <button className="btn btn-primary" type="submit">
          Save settings
        </button>
        <a href="/admin" className="btn btn-ghost">
          Cancel
        </a>
      </div>
    </form>
  );
}

