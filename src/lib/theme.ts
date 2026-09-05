import type { SiteSettings } from "@/data/types";

/** Builds the small block of CSS variables + background rules from settings. */
export function settingsToCss(s: SiteSettings): string {
  const opacity =
    typeof s.bgOpacity === "number" && Number.isFinite(s.bgOpacity)
      ? Math.min(100, Math.max(0, s.bgOpacity))
      : 100;
  const blur =
    typeof s.bgBlur === "number" && Number.isFinite(s.bgBlur)
      ? Math.min(100, Math.max(0, s.bgBlur))
      : 0;

  let background: string;
  let imageBackdrop = "";
  if (s.backgroundStyle === "image") {
    // A fixed, blurred, semi-transparent backdrop behind the content. Using a
    // ::before layer (rather than the body background directly) lets us fade and
    // blur the image without affecting any page text or cards.
    background = s.surface;
    imageBackdrop = `body{background:transparent;}
body::before{content:"";position:fixed;inset:0;z-index:-1;background:url("${s.backgroundValue}") center / cover no-repeat;opacity:${opacity / 100};filter:blur(${blur}px);}`;
  } else if (s.backgroundStyle === "gradient") {
    background = `linear-gradient(135deg, ${s.backgroundValue}, ${s.backgroundValue2 || s.backgroundValue})`;
  } else {
    background = s.backgroundValue;
  }

  return `:root{
  --brand:${s.brand};
  --brand-dark:${s.brandDark};
  --brand-soft:${s.brandSoft};
  --accent:${s.accent};
  --ink:${s.ink};
  --muted:${s.muted};
  --line:${s.line};
  --surface:${s.surface};
  --white:${s.white};
  --radius:${s.radius};
  --radius-sm:${s.radiusSm};
  --maxw:${s.maxw};
  --font:${s.font};
}
html,body{background:${background};}
body{background:${background};}
${imageBackdrop}`;
}

/** Curated font presets offered in the settings form (professional Google Fonts). */
export const FONT_PRESETS: { label: string; value: string }[] = [
  { label: "System UI (default)", value: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
  { label: "Inter (professional sans)", value: '"Inter", system-ui, -apple-system, Segoe UI, Roboto, sans-serif' },
  { label: "Poppins (geometric)", value: '"Poppins", system-ui, -apple-system, Segoe UI, Roboto, sans-serif' },
  { label: "Montserrat (modern)", value: '"Montserrat", system-ui, -apple-system, Segoe UI, Roboto, sans-serif' },
  { label: "Roboto (clean)", value: '"Roboto", system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif' },
  { label: "Open Sans (readable)", value: '"Open Sans", system-ui, -apple-system, Segoe UI, Roboto, sans-serif' },
  { label: "Lato (humanist)", value: '"Lato", system-ui, -apple-system, Segoe UI, Roboto, sans-serif' },
  { label: "Plus Jakarta Sans (modern)", value: '"Plus Jakarta Sans", system-ui, -apple-system, Segoe UI, Roboto, sans-serif' },
  { label: "DM Sans (friendly)", value: '"DM Sans", system-ui, -apple-system, Segoe UI, Roboto, sans-serif' },
  { label: "Nunito Sans (soft)", value: '"Nunito Sans", system-ui, -apple-system, Segoe UI, Roboto, sans-serif' },
  { label: "Merriweather (serif)", value: '"Merriweather", Georgia, "Times New Roman", serif' },
  { label: "Playfair Display (elegant serif)", value: '"Playfair Display", Georgia, "Times New Roman", serif' },
  { label: "Source Serif 4 (classic serif)", value: '"Source Serif 4", Georgia, "Times New Roman", serif' },
  { label: "JetBrains Mono (technical)", value: '"JetBrains Mono", "Courier New", monospace' },
];

/** Google Fonts families loaded by the layout so the presets above resolve. */
export const GOOGLE_FONTS: { family: string; weights: number[] }[] = [
  { family: "Inter", weights: [400, 500, 600, 700, 800] },
  { family: "Poppins", weights: [400, 500, 600, 700, 800] },
  { family: "Montserrat", weights: [400, 500, 600, 700, 800] },
  { family: "Roboto", weights: [400, 500, 700] },
  { family: "Open Sans", weights: [400, 500, 600, 700] },
  { family: "Lato", weights: [400, 700] },
  { family: "Plus Jakarta Sans", weights: [400, 500, 600, 700, 800] },
  { family: "DM Sans", weights: [400, 500, 600, 700] },
  { family: "Nunito Sans", weights: [400, 600, 700, 800] },
  { family: "Merriweather", weights: [400, 700] },
  { family: "Playfair Display", weights: [500, 600, 700, 800] },
  { family: "Source Serif 4", weights: [400, 600, 700] },
  { family: "JetBrains Mono", weights: [400, 600] },
];

/** Builds the combined Google Fonts stylesheet URL for the layout <head>. */
export function googleFontsHref(): string {
  const fam = GOOGLE_FONTS.map(
    (f) => `family=${f.family.replace(/ /g, "+")}:wght@${f.weights.join(";")}`
  ).join("&");
  return `https://fonts.googleapis.com/css2?${fam}&display=swap`;
}
