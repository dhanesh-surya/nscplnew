import FooterForm from "@/components/admin/FooterForm";
import { getFooter } from "@/lib/content";

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
      <FooterForm values={footer} />
    </div>
  );
}
