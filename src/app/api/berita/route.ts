import { NextResponse } from "next/server";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";
import { hasAdminRequest } from "@/lib/admin-auth";
import { INITIAL_BERITA } from "@/data/beritaData";

// 1. WAJIB HURUF BESAR: GET (Untuk mengambil daftar berita)
export async function GET() {
  try {
    const { data, error } = await getSupabase()
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
    if (!hasAdminRequest(req)) return NextResponse.json({ success: false, message: "Akses admin diperlukan." }, { status: 401 });
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

    const { data, error } = await getSupabaseAdmin()
      .from("berita")
      .insert([
        {
          title: body.title,
          excerpt: body.excerpt,
          content: contentArray,
          category: body.category || "Berita Warga",
          author: body.author || "Admin Kampung Sapen",
          read_time: body.read_time || body.readTime || "2 min",
          date: body.date || new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
          image: body.image || "",
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

export async function PUT(req: Request) {
  try {
    if (!hasAdminRequest(req)) return NextResponse.json({ success: false, message: "Akses admin diperlukan." }, { status: 401 });
    const body = await req.json();
    const id = Number(body.id);
    if (!Number.isInteger(id) || id < 1 || !body.title || !body.excerpt) {
      return NextResponse.json({ success: false, message: "Data berita tidak lengkap." }, { status: 400 });
    }
    const content = Array.isArray(body.content) ? body.content : String(body.content || "").split("\n\n").filter(Boolean);
    const { data, error } = await getSupabaseAdmin().from("berita").update({
      title: body.title,
      excerpt: body.excerpt,
      content,
      category: body.category || "Berita Warga",
      author: body.author || "Admin Kampung Sapen",
      read_time: body.read_time || body.readTime || "2 min",
      image: body.image || "",
      caption: body.caption || "Dokumentasi kegiatan Kampung Sapen Yogyakarta.",
    }).eq("id", id).select().single();
    if (error) return NextResponse.json({ success: false, message: "Gagal memperbarui berita." }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!hasAdminRequest(req)) return NextResponse.json({ success: false, message: "Akses admin diperlukan." }, { status: 401 });
    const id = new URL(req.url).searchParams.get("id")?.trim();
    if (!id) return NextResponse.json({ success: false, message: "ID berita tidak valid." }, { status: 400 });
    const { error } = await getSupabaseAdmin().from("berita").delete().eq("id", id);
    if (error) {
      console.error("Gagal menghapus berita di Supabase:", error.message);
      return NextResponse.json({ success: false, message: "Gagal menghapus berita." }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
