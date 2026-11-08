import type { Metadata } from "next";
import { headers } from "next/headers";
import "bootstrap/dist/css/bootstrap-utilities.min.css";
import "./globals.css";
import { site } from "@/data/site";
import { getSettings } from "@/lib/content";
import { googleFontsHref, settingsToCss } from "@/lib/theme";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SiteGalleryStrip from "@/components/SiteGalleryStrip";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  icons: { icon: "/favicon.svg" },
};

// This is a database-backed CMS: content changes via the admin at runtime, so
// every route must render on-demand (read the live DB) rather than being cached
// as static HTML at build time.
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const css = settingsToCss(settings);
  // `x-pathname` is set by src/middleware.ts. The public gallery strip must not
  // appear inside the admin dashboard.
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html
      lang="en"
      data-links={settings.linkStyle}
      data-buttons={settings.buttonStyle}
      data-glass={settings.glass ? "true" : "false"}
      style={{ ["--link-hover" as string]: settings.linkHoverColor } as React.CSSProperties}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={googleFontsHref()} />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <SiteHeader settings={settings} />
        <main>{children}</main>
        {isAdmin ? null : <SiteGalleryStrip pathname={pathname} />}
        <SiteFooter />
      </body>
    </html>
  );
}
