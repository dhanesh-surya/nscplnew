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
    <div>
      <h1 style={{ marginTop: 0 }}>Edit {meta.label.replace(/s$/, "")}</h1>
      {meta.key === "gallery" ? (
        <GalleryItemForm id={id} values={item} />
      ) : meta.key === "menu" ? (
        <MenuItemForm id={id} values={item} pages={pages} menuItems={menuItems} />
      ) : (
        <ItemForm collection={meta.key} id={id} values={item} />
      )}
    </div>
  );
}
