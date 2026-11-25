import { NextResponse } from "next/server";
import { createAdminSession, ADMIN_COOKIE } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const configuredUsername = process.env.ADMIN_USERNAME;
    const configuredPassword = process.env.ADMIN_PASSWORD;
    if (!configuredUsername || !configuredPassword) {
      return NextResponse.json({ success: false, message: "Login admin belum dikonfigurasi di server." }, { status: 503 });
    }

    const body = await req.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : typeof body.pin === "string" ? body.pin : "";
    if (username.toLowerCase() !== configuredUsername.trim().toLowerCase() || password !== configuredPassword) {
      return NextResponse.json({ success: false, message: "Username atau PIN Admin salah!" }, { status: 401 });
    }

    const nama = "Admin Kampung Sapen";
    const { token, session, maxAge } = createAdminSession(configuredUsername.trim(), nama);
    const response = NextResponse.json({
      success: true,
      message: `Login Berhasil! Selamat bertugas, ${nama}.`,
      data: { isAdmin: true, username: session.username, nama, role: "ADMIN" },
    });
    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
