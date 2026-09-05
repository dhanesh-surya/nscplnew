"use client";

import { useState } from "react";
import { saveMenuItemAction } from "@/lib/admin/actions";
import type { MenuItem, PageItem } from "@/data/types";

const EXTERNAL = "__external__";

function pageHref(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}

function pageLabel(page: PageItem) {
  return page.menuLabel?.trim() || page.title || page.slug;
}

export default function MenuItemForm({
  id,
  values,
  pages,
  menuItems,
}: {
  id: string | null;
  values: Record<string, unknown>;
  pages: PageItem[];
  menuItems: MenuItem[];
}) {
  const existingPageSlug = String(values.pageSlug ?? "");
  const initialPage = pages.find((p) => p.slug === existingPageSlug);
  const initialHref = String(values.href ?? "");
  const initialPageSelection = initialPage
    ? initialPage.slug
    : initialHref === "/"
      ? "home"
      : pages.find((p) => pageHref(p.slug) === initialHref)?.slug ?? EXTERNAL;
  const [pageSlug, setPageSlug] = useState(initialPageSelection);
  const [label, setLabel] = useState(String(values.label ?? ""));
  const [labelTouched, setLabelTouched] = useState(Boolean(values.label));
  const [parentId, setParentId] = useState(String(values.parentId ?? ""));
  const [customHref, setCustomHref] = useState(initialHref);
  const [target, setTarget] = useState(String(values.target ?? "same") || "same");
  const [order, setOrder] = useState(String(values.order ?? 0));
  // New menu items are visible by default so they appear in the navbar right
  // after creation; edited items keep whatever the admin last set.
  const [visible, setVisible] = useState<boolean>(id ? Boolean(values.visible) : true);
  const isSubmenu = parentId !== "";

  function selectPage(slug: string) {
    setPageSlug(slug);
    if (!labelTouched && slug !== EXTERNAL) {
      const selected = pages.find((p) => p.slug === slug);
      if (selected) setLabel(pageLabel(selected));
    }
    if (slug !== EXTERNAL) setCustomHref(pageHref(slug));
  }

  return (
    <form action={saveMenuItemAction.bind(null, id)}>
      {id ? (
        <div className="field">
          <label htmlFor="f_id">Menu item ID</label>
          <input id="f_id" value={id} disabled readOnly style={{ background: "var(--surface)", color: "var(--muted)" }} />
          <input type="hidden" name="id" value={id} />
          <div style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: 4 }}>
            The ID is fixed after creation.
          </div>
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="f_label">Menu / submenu name *</label>
        <input
          id="f_label"
          name="label"
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
            setLabelTouched(true);
          }}
          placeholder="For example: Events or Cricket"
          required
        />
        <div style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: 4 }}>
          This is the name visitors will see in the navigation.
        </div>
      </div>

      <div className="field">
        <label htmlFor="f_pageSlug">Created page</label>
        <select id="f_pageSlug" name="pageSlug" value={pageSlug} onChange={(e) => selectPage(e.target.value)}>
          <option value="">Select a created page (optional)</option>
          {pages.map((page) => (
            <option key={page.slug} value={page.slug}>
              {pageLabel(page)} — /{page.slug === "home" ? "" : page.slug}
            </option>
          ))}
          <option value={EXTERNAL}>Custom / external URL</option>
        </select>
        <div style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: 4 }}>
          Selecting a page fills the correct internal URL automatically.
        </div>
      </div>

      {pageSlug === EXTERNAL ? (
        <div className="field">
          <label htmlFor="f_customHref">Custom link URL *</label>
          <input
            id="f_customHref"
            name="customHref"
            value={customHref}
            onChange={(e) => setCustomHref(e.target.value)}
            placeholder="https://example.com or /custom-path"
            required
          />
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="f_parentId">Menu level</label>
        <select id="f_parentId" name="parentId" value={parentId} onChange={(e) => setParentId(e.target.value)}>
          <option value="">Top-level menu item</option>
          {menuItems
            .filter((item) => item.id !== id && !item.parentId)
            .map((item) => (
              <option key={item.id} value={item.id}>
                Submenu of {item.label}
              </option>
            ))}
        </select>
        <div style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: 4 }}>
          Choose a parent to create a submenu. Leave it as top-level for a main menu item.
        </div>
      </div>

      <div className="field">
        <label htmlFor="f_target">Open link in</label>
        <select id="f_target" name="target" value={target} onChange={(e) => setTarget(e.target.value)}>
          <option value="same">Same window</option>
          <option value="new">New window</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="f_order">Display order</label>
        <input id="f_order" name="order" type="number" value={order} onChange={(e) => setOrder(e.target.value)} min={0} />
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
        <input type="checkbox" name="visible" checked={visible} onChange={(e) => setVisible(e.target.checked)} style={{ width: "auto" }} />
        Show this {isSubmenu ? "submenu item" : "menu item"} in the navigation
      </label>

      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button className="btn btn-primary" type="submit">Save menu item</button>
        <a href="/admin/menu" className="btn btn-ghost">Cancel</a>
      </div>
    </form>
  );
}
