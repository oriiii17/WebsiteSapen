import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_ACCOUNTS: Record<string, { pin: string; role: string; nama: string }> = {
  "admin": { pin: "sapen2026", role: "SUPER_ADMIN", nama: "Admin Pengelola Web" },
  "pengurus": { pin: "wargasapen", role: "PENGURUS_RW", nama: "Pengurus RW 05 Sapen" }
};

export async function POST(req: Request) {
  try {
    const { username, pin } = await req.json();
    const user = ADMIN_ACCOUNTS[username?.trim().toLowerCase()];

    if (!user || user.pin !== pin?.trim()) {
      return NextResponse.json(
        { success: false, message: "Username atau PIN Pengurus salah!" },
        { status: 401 }
      );
    }

    const sessionData = {
      isAdmin: true,
      role: user.role,
      nama: user.nama,
      username: username.toLowerCase()
    };

    const cookieStore = cookies();
    cookieStore.set("sapen_admin_auth", JSON.stringify(sessionData), {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 14,
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({
      success: true,
      message: `Login Berhasil! Selamat bertugas, ${user.nama}.`,
      data: sessionData
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}