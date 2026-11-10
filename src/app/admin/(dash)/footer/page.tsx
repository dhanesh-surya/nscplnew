import FooterForm from "@/components/admin/FooterForm";
import { getFooter } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Footer" };

export default async function AdminFooterPage() {
  const footer = await getFooter();
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Footer</h1>
      <p className="lead" style={{ marginTop: 0 }}>
        Edit the footer brand, about text, link columns, contact details, and social
        links shown on every page.
      </p>
      {/* Key on the serialized footer so the form (and its useState
          fields) fully remounts after a save+redirect and reflects the new values,
          instead of showing stale state. */}
      <FooterForm key={JSON.stringify(footer)} values={footer} />
    </div>
  );
}
