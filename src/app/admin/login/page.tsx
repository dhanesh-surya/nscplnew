import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata = { title: "Admin login" };

export default function AdminLoginPage() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div className="form" style={{ width: "100%", maxWidth: 420 }}>
        <h2 style={{ marginTop: 0 }}>NSCPL Admin</h2>
        <p className="lead" style={{ marginTop: 0 }}>
          Sign in to manage site content.
        </p>
        <AdminLoginForm />
        <p style={{ marginTop: 16, fontSize: ".85rem", color: "var(--muted)" }}>
          Default dev credentials — <code>admin@nscpl.in</code> /{" "}
          <code>nscpl@admin</code>. Set <code>ADMIN_EMAIL</code>,{" "}
          <code>ADMIN_PASSWORD</code> and <code>ADMIN_SECRET</code> in{" "}
          <code>.env.local</code> to override.
        </p>
      </div>
    </div>
  );
}
