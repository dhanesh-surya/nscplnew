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
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <aside
        style={{
          width: 240,
          background: "var(--brand-dark, #070F1E)",
          color: "#ffffff",
          padding: "24px 18px",
          flex: "none",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "#ffffff", marginBottom: 2 }}>
          NSCPL Admin
        </div>
        <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", marginBottom: 22 }}>
          Content manager
        </div>
        <nav style={{ display: "grid", gap: 6 }}>
          <Link href="/admin" className="admin-nav-item">
            Dashboard
          </Link>
          {COLLECTIONS.map((c) => (
            <Link key={c.key} href={`/admin/${c.key}`} className="admin-nav-item">
              {c.label}
            </Link>
          ))}
          <a
            href="/admin/logout"
            className="admin-nav-item"
            style={{ marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 14 }}
          >
            Log out
          </a>
        </nav>
      </aside>

      <main
        style={{
          flex: 1,
          padding: "32px 40px",
          background: "#f8fafc",
          color: "#0F172A",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        {children}
      </main>

      <style>{`
        .admin-nav-item {
          color: rgba(255, 255, 255, 0.85) !important;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 0.92rem;
          font-weight: 500;
          text-decoration: none !important;
          transition: background 0.15s ease, color 0.15s ease;
          display: block;
        }
        .admin-nav-item:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
