import SettingsForm from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Site settings" };

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Site settings</h1>
      <p className="lead" style={{ marginTop: 0 }}>
        Theme, colours, typography, background, and link/button styles. Changes apply
        to the whole site immediately after saving.
      </p>
      {/* Key on the serialized settings so the form (and its defaultValue/useState
          fields) fully remounts after a save+redirect and reflects the new values,
          instead of showing stale selections. */}
      <SettingsForm
        key={JSON.stringify(settings)}
        values={settings}
      />
    </div>
  );
}
