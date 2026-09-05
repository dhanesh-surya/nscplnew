import { mainNav } from "@/data/site";
import { getStore } from "@/lib/content";
import type { SiteSettings } from "@/data/types";
import SiteHeaderClient from "./SiteHeaderClient";

export default async function SiteHeader({
  settings,
}: {
  settings?: SiteSettings;
}) {
  // Always show the built-in default navigation, then append every custom menu
  // item the admin created — so nothing is ever dropped from the navbar.
  const store = await getStore();
  const items = [...mainNav, ...store.menu];
  return (
    <SiteHeaderClient
      items={items}
      logo={settings?.logo ?? ""}
      siteName={settings?.siteName ?? ""}
      headerBg={settings?.headerBg ?? ""}
      headerColor={settings?.headerColor ?? ""}
    />
  );
}
