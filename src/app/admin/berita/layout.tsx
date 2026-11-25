import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default function AdminBeritaLayout({ children }: { children: React.ReactNode }) {
  const session = verifyAdminSession(cookies().get(ADMIN_COOKIE)?.value);
  if (!session) redirect("/");
  return children;
}
