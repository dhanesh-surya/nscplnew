import { notFound } from "next/navigation";
import ItemForm from "@/components/admin/ItemForm";
import GalleryItemForm from "@/components/admin/GalleryItemForm";
import MenuItemForm from "@/components/admin/MenuItemForm";
import { COLLECTIONS, getAllPages, getStore } from "@/lib/content";
import { schemas } from "@/lib/admin/schema";

export default async function NewItem({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const meta = COLLECTIONS.find((c) => c.key === collection);
  if (!meta) notFound();
  // settings/footer are singletons edited via their own dedicated pages.
  if (meta.key === "settings" || meta.key === "footer") notFound();

  const pages = meta.key === "menu" ? (await getAllPages()).filter((page) => page.status === "published") : [];
  const menuItems = meta.key === "menu" ? (await getStore()).menu : [];

  const values: Record<string, unknown> = {};
  for (const f of schemas[meta.key].fields) {
    if (f.type === "lines" || f.type === "json" || f.type === "repeater")
      values[f.name] = [];
    else if (f.type === "number") values[f.name] = 0;
    else if (f.type === "boolean") values[f.name] = false;
    else values[f.name] = "";
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>New {meta.label.replace(/s$/, "")}</h1>
      {meta.key === "gallery" ? (
        <GalleryItemForm id={null} values={values} />
      ) : meta.key === "menu" ? (
        <MenuItemForm id={null} values={values} pages={pages} menuItems={menuItems} />
      ) : (
        <ItemForm collection={meta.key} id={null} values={values} />
      )}
    </div>
  );
}
