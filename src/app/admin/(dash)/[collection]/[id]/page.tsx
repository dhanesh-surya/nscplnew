import { notFound } from "next/navigation";
import ItemForm from "@/components/admin/ItemForm";
import GalleryItemForm from "@/components/admin/GalleryItemForm";
import MenuItemForm from "@/components/admin/MenuItemForm";
import { COLLECTIONS, getAllPages, getStore, type CollectionKey } from "@/lib/content";

export default async function EditItem({
  params,
}: {
  params: Promise<{ collection: string; id: string }>;
}) {
  const { collection, id } = await params;
  const meta = COLLECTIONS.find((c) => c.key === collection);
  if (!meta) notFound();
  // settings/footer are singletons edited via their own dedicated pages.
  if (meta.key === "settings" || meta.key === "footer") notFound();

  const store = await getStore();
  const item = (store[meta.key as CollectionKey] as unknown as Record<string, unknown>[]).find(
    (it) => String(it[meta.idField]) === id
  );
  if (!item) notFound();
  const pages = meta.key === "menu" ? (await getAllPages()).filter((page) => page.status === "published") : [];
  const menuItems = meta.key === "menu" ? store.menu : [];

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: "1.75rem", fontWeight: 700, color: "#0F172A" }}>
            Edit {meta.label.replace(/s$/, "")}
          </h1>
          <div style={{ fontSize: "0.88rem", color: "#64748B" }}>
            Manage {meta.label.toLowerCase()} content and media assets
          </div>
        </div>
        <span
          style={{
            fontSize: "0.82rem",
            color: "#475569",
            background: "#E2E8F0",
            padding: "5px 12px",
            borderRadius: 6,
            fontWeight: 600,
          }}
        >
          {collection} / {id}
        </span>
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #E2E8F0",
          borderRadius: 14,
          padding: 28,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        {meta.key === "gallery" ? (
          <GalleryItemForm id={id} values={item} />
        ) : meta.key === "menu" ? (
          <MenuItemForm id={id} values={item} pages={pages} menuItems={menuItems} />
        ) : (
          <ItemForm collection={meta.key} id={id} values={item} />
        )}
      </div>
    </div>
  );
}
