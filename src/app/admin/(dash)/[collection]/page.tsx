import Link from "next/link";
import { notFound } from "next/navigation";
import { COLLECTIONS, getStore, type CollectionKey } from "@/lib/content";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function CollectionList({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const meta = COLLECTIONS.find((c) => c.key === collection);
  if (!meta) notFound();

  const store = await getStore();
  const items = store[meta.key as CollectionKey] as unknown as Record<string, unknown>[];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <h1 style={{ marginTop: 0 }}>{meta.label}</h1>
        <Link href={`/admin/${meta.key}/new`} className="btn btn-primary">
          + New {meta.label.replace(/s$/, "")}
        </Link>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>{meta.titleField}</th>
            <th style={th}>ID</th>
            <th style={{ ...th, textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const id = String(item[meta.idField]);
            const isSystem = meta.key === "pages" && Boolean((item as Record<string, unknown>).system);
            return (
              <tr key={id} style={{ borderTop: "1px solid var(--line)" }}>
                <td style={td}>
                  {String(item[meta.titleField])}
                  {isSystem && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: ".7rem",
                        fontWeight: 700,
                        color: "var(--brand-dark)",
                        background: "var(--brand-soft)",
                        padding: "2px 8px",
                        borderRadius: 999,
                        verticalAlign: "middle",
                      }}
                    >
                      System
                    </span>
                  )}
                </td>
                <td style={td}>
                  <code>{id}</code>
                </td>
                <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>
                  <Link
                    href={`/admin/${meta.key}/${encodeURIComponent(id)}`}
                    className="btn btn-ghost"
                    style={{ padding: "6px 12px" }}
                  >
                    Edit
                  </Link>{" "}
                  {isSystem ? (
                    <span
                      title="Built-in pages cannot be deleted"
                      style={{ fontSize: ".8rem", color: "var(--muted)" }}
                    >
                      protected
                    </span>
                  ) : (
                    <DeleteButton collection={meta.key} id={id} />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 8px",
  borderBottom: "2px solid var(--line)",
  fontSize: ".8rem",
  textTransform: "uppercase",
  color: "var(--muted)",
};
const td: React.CSSProperties = { padding: "10px 8px", fontSize: ".92rem" };
