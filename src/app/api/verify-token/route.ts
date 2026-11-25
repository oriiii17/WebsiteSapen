import { NextResponse } from "next/server";

// Daftar Token Resmi yang dibagikan Ketua RT/RW di WhatsApp Grup Warga
const VALID_TOKENS = ["SAPEN-RT01", "SAPEN-RT02", "SAPEN-RT03", "WARGA-SAPEN"];

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ success: false, message: "Token wajib diisi." }, { status: 400 });
    }

    const cleanToken = token.trim().toUpperCase();

    if (VALID_TOKENS.includes(cleanToken)) {
      return NextResponse.json({
        success: true,
        message: "Verifikasi Berhasil! Selamat Datang Warga Asli Kampung Sapen.",
        role: "WARGA_ASLI",
      });
    }

    return NextResponse.json(
      { success: false, message: "Kode Token RT tidak valid. Hubungi pengurus RT Anda." },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}