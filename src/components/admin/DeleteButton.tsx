"use client";

import { deleteItemAction } from "@/lib/admin/actions";
import type { CollectionKey } from "@/lib/content";

export default function DeleteButton({
  collection,
  id,
}: {
  collection: CollectionKey;
  id: string;
}) {
  return (
    <form
      action={deleteItemAction.bind(null, collection, id)}
      style={{ display: "inline" }}
      onSubmit={(e) => {
        if (!confirm("Delete this item? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        className="btn btn-ghost"
        type="submit"
        style={{ padding: "6px 12px", color: "#b91c1c", borderColor: "#fecaca" }}
      >
        Delete
      </button>
    </form>
  );
}
