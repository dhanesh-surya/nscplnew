import type { FooterLink, SiteFooterData, SiteSettings } from "./types";
import { mainNav, site } from "./site";

const FONT_SYSTEM =
  'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export function defaultSettings(): SiteSettings {
  return {
    id: "site",
    brand: "#0f766e",
    brandDark: "#0f3d39",
    brandSoft: "#ecfdf5",
    accent: "#f59e0b",
    ink: "#0f172a",
    muted: "#64748b",
    line: "#e2e8f0",
    surface: "#f8fafc",
    white: "#ffffff",
    headerBg: "#ffffff",
    headerColor: "#0f172a",
    logo: "",
    siteName: site.shortName,
    glass: false,
    radius: "16px",
    radiusSm: "10px",
    font: FONT_SYSTEM,
    backgroundStyle: "solid",
    backgroundValue: "#ffffff",
    backgroundValue2: "#eef2f7",
    bgOpacity: 100,
    bgBlur: 0,
    linkStyle: "hover",
    buttonStyle: "filled",
    linkHoverColor: "#f59e0b",
    maxw: "1140px",
    galleryStripEyebrow: "Highlights",
    galleryStripTitle: "Moments from the field",
    // Gallery strips are opt-in per image/page in Admin → Gallery. No image
    // shows on any page until page checkboxes are selected.
  };
}

export function defaultFooter(): SiteFooterData {
  return {
    id: "main",
    brand: site.shortName,
    about: site.description,
    columns: [
      {
        title: "Explore",
        links: mainNav.map((n) => ({ label: n.label, href: n.href })),
      },
      {
        title: "Contact",
        links: [
          { label: site.email, href: `mailto:${site.email}` },
          { label: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
          { label: site.address, href: "#" },
          { label: site.city, href: "#" },
        ],
      },
      {
        title: "Quick links",
        links: [
          { label: "Upcoming events", href: "/events" },
          { label: "Sports we run", href: "/sports" },
          { label: "Our teams", href: "/teams" },
          { label: "Gallery", href: "/gallery" },
          { label: "Admin login", href: "/admin/login" },
        ],
      },
    ],
    contact: {
      email: site.email,
      phone: site.phone,
      address: site.address,
      city: site.city,
    },
    copyright: `${site.name}. All rights reserved.`,
    social: site.social.map((s) => ({
      label: s.label,
      href: s.href,
      icon: s.icon as FooterLink["icon"],
    })),
    mapEmbed: "",
  };
}
