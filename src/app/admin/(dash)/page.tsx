import Link from "next/link";
import { COLLECTIONS, getStore } from "@/lib/content";

export const metadata = { title: "Admin dashboard" };

export default async function AdminDashboard() {
  const store = await getStore();

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      <p className="lead" style={{ marginTop: 0 }}>
        Manage the content shown on the public site. Changes are saved to the
        SQLite database and appear immediately. Create pages with reusable blocks,
        then add them to the menu as top-level items or submenus.
      </p>

      <div className="grid grid-2" style={{ marginTop: 24 }}>
        {COLLECTIONS.map((c) => (
          <div className="feature" key={c.key}>
            <h3 style={{ marginTop: 0 }}>{c.label}</h3>
            <p style={{ color: "var(--muted)", margin: "0 0 14px" }}>
              {store[c.key].length} item{store[c.key].length === 1 ? "" : "s"}
            </p>
            <Link href={`/admin/${c.key}`} className="btn btn-ghost">
              Manage →
            </Link>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 32 }}>Quick edits</h2>
      <div className="grid grid-2">
        <div className="feature">
          <h3 style={{ marginTop: 0 }}>Home page</h3>
          <p style={{ color: "var(--muted)", margin: "0 0 14px" }}>
            Edit the homepage sections, hero, stats, events, news, and more.
          </p>
          <Link href="/admin/pages/home" className="btn btn-primary">
            Edit Home →
          </Link>
        </div>
        <div className="feature">
          <h3 style={{ marginTop: 0 }}>About page</h3>
          <p style={{ color: "var(--muted)", margin: "0 0 14px" }}>
            Edit the about sections, story, sports, and testimonials.
          </p>
          <Link href="/admin/pages/about" className="btn btn-primary">
            Edit About →
          </Link>
        </div>
      </div>
    </div>
  );
}
