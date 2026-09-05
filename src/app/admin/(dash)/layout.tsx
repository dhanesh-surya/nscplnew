import Link from "next/link";
import { requireAdmin } from "@/lib/admin/actions";
import { COLLECTIONS } from "@/lib/content";

export default async function AdminDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 230,
          background: "var(--brand-dark)",
          color: "#fff",
          padding: 20,
          flex: "none",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: "1.15rem", marginBottom: 4 }}>
          NSCPL Admin
        </div>
        <div style={{ fontSize: ".8rem", color: "rgba(255,255,255,.6)", marginBottom: 18 }}>
          Content manager
        </div>
        <nav style={{ display: "grid", gap: 4 }}>
          <Link href="/admin" style={navLink}>
            Dashboard
          </Link>
          {COLLECTIONS.map((c) => (
            <Link key={c.key} href={`/admin/${c.key}`} style={navLink}>
              {c.label}
            </Link>
          ))}
          <a href="/admin/logout" style={{ ...navLink, marginTop: 14 }}>
            Log out
          </a>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 28, background: "var(--surface)" }}>
        {children}
      </main>
    </div>
  );
}

const navLink: React.CSSProperties = {
  color: "rgba(255,255,255,.85)",
  padding: "8px 10px",
  borderRadius: 8,
};
