// Offline SVG asset generator for the NSCPL simple portal.
// Produces gradient cover images, gallery tiles, logo and favicon.
// Run with: node scripts/gen-assets.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");

const palettes = {
  cricket: ["#0f766e", "#22c55e"],
  basketball: ["#b45309", "#ef4444"],
  football: ["#1e3a8a", "#3b82f6"],
  athletics: ["#7c3aed", "#ec4899"],
  running: ["#0e7490", "#06b6d4"],
  events: ["#9d174d", "#f59e0b"],
};

function svg(w, h, [c1, c2], label, sub) {
  const circles = [
    `<circle cx="${w * 0.82}" cy="${h * 0.2}" r="${h * 0.28}" fill="#ffffff" opacity="0.08" />`,
    `<circle cx="${w * 0.15}" cy="${h * 0.85}" r="${h * 0.22}" fill="#ffffff" opacity="0.06" />`,
    `<circle cx="${w * 0.5}" cy="${h * 0.5}" r="${h * 0.45}" fill="#ffffff" opacity="0.04" />`,
  ].join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  ${circles}
  <g fill="#ffffff" font-family="'Segoe UI', Arial, sans-serif" text-anchor="middle">
    <text x="${w / 2}" y="${h / 2 - 6}" font-size="${Math.round(h * 0.09)}" font-weight="700" opacity="0.96">${label}</text>
    ${sub ? `<text x="${w / 2}" y="${h / 2 + h * 0.1}" font-size="${Math.round(h * 0.045)}" opacity="0.8" letter-spacing="2">${sub}</text>` : ""}
  </g>
</svg>`;
}

function write(rel, content) {
  const p = join(publicDir, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  console.log("wrote", rel);
}

// Covers (16:9)
const covers = [
  ["covers/cricket-league.svg", "cricket", "Cricket", "NSCPL LEAGUE"],
  ["covers/basketball-circuit.svg", "basketball", "Basketball", "3X3 CIRCUIT"],
  ["covers/football-trophy.svg", "football", "Football", "CORPORATE CUP"],
  ["covers/athletics-meet.svg", "athletics", "Athletics", "YOUTH MEET"],
  ["covers/run-series.svg", "running", "Running", "COMMUNITY RUN"],
];
for (const [file, key, label, sub] of covers) {
  write(file, svg(1200, 800, palettes[key], label, sub));
}

// Gallery tiles (square)
const galleryPalettes = [
  "cricket", "basketball", "football", "athletics", "running",
  "events", "cricket", "basketball", "events",
];
const galleryLabels = [
  "Cricket", "Basketball", "Football", "Athletics", "Running",
  "Events", "Academy", "3x3", "Community",
];
for (let i = 1; i <= 9; i++) {
  const key = galleryPalettes[i - 1];
  write(`gallery/g${i}.svg`, svg(800, 800, palettes[key], galleryLabels[i - 1], `NSCPL`));
}

// Logo
write(
  "logo.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="40" viewBox="0 0 160 40" role="img" aria-label="NSCPL">
  <rect x="0" y="6" width="28" height="28" rx="7" fill="#0f766e"/>
  <text x="14" y="27" font-family="'Segoe UI', Arial, sans-serif" font-size="15" font-weight="800" fill="#ffffff" text-anchor="middle">N</text>
  <text x="38" y="27" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="800" fill="#0f172a">NSCPL</text>
</svg>`
);

// Favicon
write(
  "favicon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" role="img" aria-label="NSCPL">
  <rect width="32" height="32" rx="8" fill="#0f766e"/>
  <text x="16" y="22" font-family="'Segoe UI', Arial, sans-serif" font-size="17" font-weight="800" fill="#ffffff" text-anchor="middle">N</text>
</svg>`
);

console.log("done");
