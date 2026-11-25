import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { hasAdminRequest } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    if (!hasAdminRequest(req)) {
      return NextResponse.json({ success: false, message: "Akses admin diperlukan." }, { status: 401 });
    }
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Tidak ada file foto yang dipilih." },
        { status: 400 }
      );
    }

    // Buat nama file unik (agar tidak saling menimpa)
    const fileExt = file.name.split(".").pop() || "jpg";
    const cleanFileName = `berita-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    // Konversi file ke Buffer binary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload langsung ke Supabase Storage Bucket 'sapen-assets'
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.storage
      .from("sapen-assets")
      .upload(cleanFileName, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error("Supabase Storage Error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    // Ambil Link URL Publik foto yang baru di-upload
    const { data: urlData } = supabaseAdmin.storage
      .from("sapen-assets")
      .getPublicUrl(cleanFileName);

    return NextResponse.json({
      success: true,
      imageUrl: urlData.publicUrl,
      message: "Foto berhasil diunggah ke Supabase Storage!",
    });
  } catch (err: any) {
    console.error("Upload Error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Gagal mengunggah foto." },
      { status: 500 }
    );
  }
}
