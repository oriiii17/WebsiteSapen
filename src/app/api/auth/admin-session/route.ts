import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const session = verifyAdminSession(cookies().get(ADMIN_COOKIE)?.value);
  return NextResponse.json({ success: Boolean(session), data: session ? {
    isAdmin: true,
    username: session.username,
    nama: session.nama,
    role: session.role,
  } : null }, { status: session ? 200 : 401 });
}
