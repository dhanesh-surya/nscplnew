"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MenuItem, NavItem } from "@/data/types";
import { site } from "@/data/site";

export default function SiteHeaderClient({
  items,
  logo = "",
  siteName = "",
  headerBg = "",
  headerColor = "",
}: {
  items: (MenuItem | NavItem)[];
  logo?: string;
  siteName?: string;
  headerBg?: string;
  headerColor?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menu = items;
  // Collect the ids that exist so we can detect submenu items whose parent is
  // missing or points at themselves (a common misconfiguration when editing in
  // the admin). Such orphans are promoted to top-level below so they still show
  // in the navbar instead of silently vanishing.
  const ids = new Set(
    menu.filter((it): it is MenuItem => "id" in it).map((it) => it.id)
  );
  const top = menu.filter((item) => {
    if (!("parentId" in item) || !item.parentId) return true;
    const pid = item.parentId;
    const selfId = "id" in item ? item.id : "";
    return pid === selfId || !ids.has(pid);
  });
  const children = menu.filter((item): item is MenuItem => {
    if (!("parentId" in item) || !item.parentId) return false;
    if (item.parentId === item.id) return false; // skip self-references
    return ids.has(item.parentId);
  });
  const brandName = siteName || site.shortName;
  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  }
  return (
    <header
      className="site-header"
      style={
        {
          background: headerBg || undefined,
          color: headerColor || undefined,
          "--header-bg": headerBg || undefined,
          "--header-fg": headerColor || undefined,
        } as React.CSSProperties
      }
    >
      <div className="container inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          {logo ? (
            <img src={logo} alt={brandName} className="brand-logo" />
          ) : (
            <span className="dot">{brandName[0]}</span>
          )}
          {brandName}
        </Link>
        <button className="nav-toggle" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? "✕" : "☰"}
        </button>
        <nav className={`nav ${open ? "open" : ""}`}>
          {top.map((item) => {
            const href = item.href;
            const label = item.label;
            const subs = "id" in item ? children.filter((child) => child.parentId === item.id) : [];
            return (
              <div className="nav-group" key={"id" in item ? item.id : href}>
                <Link
                  href={href}
                  className={`${isActive(href) ? "active" : ""}${subs.length ? " has-sub" : ""}`}
                  target={"target" in item && item.target === "new" ? "_blank" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
                {subs.length ? (
                  <div className="submenu">
                    {subs.map((sub) => (
                      <Link key={sub.id} href={sub.href} target={sub.target === "new" ? "_blank" : undefined} onClick={() => setOpen(false)}>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
          <Link href="/contact" className="btn btn-primary" onClick={() => setOpen(false)}>
            Get in touch
          </Link>
        </nav>
      </div>
    </header>
  );
}
