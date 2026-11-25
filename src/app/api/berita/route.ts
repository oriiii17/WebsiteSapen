import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { INITIAL_BERITA } from "@/data/beritaData";

// 1. WAJIB HURUF BESAR: GET (Untuk mengambil daftar berita)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("berita")
      .select("*")
      .order("id", { ascending: false });

    // Jika Supabase belum ada data, gunakan data cadangan lokal
    if (error || !data || data.length === 0) {
      return NextResponse.json({ success: true, data: INITIAL_BERITA || [] });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: true, data: INITIAL_BERITA || [] });
  }
}

// 2. WAJIB HURUF BESAR: POST (Untuk menyimpan berita baru ke Supabase)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title || !body.excerpt) {
      return NextResponse.json(
        { success: false, message: "Judul dan ringkasan wajib diisi." },
        { status: 400 }
      );
    }

    const contentArray = Array.isArray(body.content)
      ? body.content
      : (body.content || "").split("\n\n").filter(Boolean);

    const { data, error } = await supabase
      .from("berita")
      .insert([
        {
          title: body.title,
          excerpt: body.excerpt,
          content: contentArray,
          category: body.category || "Berita Warga",
          author: body.author || "Pengurus RW 05",
          read_time: body.readTime || "2 min",
          image: body.image,
          caption: body.caption || "Dokumentasi kegiatan Kampung Sapen Yogyakarta.",
          views: 1,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Berita & foto berhasil tersimpan di Database Supabase!",
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}