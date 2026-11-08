import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getAdminSession } from "@/lib/admin/actions";

export const metadata = { title: "Admin login" };

export default async function AdminLoginPage() {
  // Already signed in? Skip the form and go straight to the dashboard, so the
  // admin is only ever asked for credentials once. Logging out clears the
  // cookie and brings them back here.
  if (await getAdminSession()) redirect("/admin");

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
      </div>
    </div>
  );
}
