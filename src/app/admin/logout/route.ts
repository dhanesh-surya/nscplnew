import { adminLogout } from "@/lib/admin/actions";

export async function GET() {
  await adminLogout();
}

export async function POST() {
  await adminLogout();
}
