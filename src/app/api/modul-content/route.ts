import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { authStatus } = await req.json();

    // Halaman 1 (Cover) selalu publik/bisa diintip
    const publicPage = {
      pageNumber: 1,
      title: "Buku Panduan & Warta Kegiatan Kampung Sapen",
      subtitle: "Edisi Mandiri Warga - Terbuka Untuk Umum",
      content: "Selamat datang di Portal Informasi Kegiatan Kampung Sapen. Modul ini diterbitkan oleh panitia rukun warga secara independen untuk transparansi kegiatan, keamanan, kas desa, dan kemandirian warga.",
      date: "Tahun 2026/2027"
    };

    // Jika bukan Warga Asli dan belum Bayar, TOLAK akses ke halaman inti
    if (authStatus !== "WARGA_ASLI" && authStatus !== "PAID_GUEST") {
      return NextResponse.json({
        isLocked: true,
        pages: [publicPage],
        message: "Halaman 2 sampai seterusnya terkunci. Silakan verifikasi kode token warga atau bayar tiket modul."
      });
    }

    // Materi lengkap dikirim hanya jika memiliki hak akses
    const fullPages = [
      publicPage,
      {
        pageNumber: 2,
        title: "Struktur Keamanan & Jadwal Ronda",
        subtitle: "Siskamling Pos Terpadu Sapen",
        content: "• Pos 1 (Pintu Masuk Barat): RT 01 (Senin s/d Rabu)\n• Pos 2 (Dekat Balai): RT 02 (Kamis s/d Sabtu)\n• Patroli Keliling Lingkungan: Setiap malam pukul 23:00 - 03:30 WIB.\n\nNomor Darurat Hansip Desa: 0812-XXXX-9901",
        date: "Diperbarui Minggu Ini"
      },
      {
        pageNumber: 3,
        title: "Transparansi Dana Kas & Pembangunan",
        subtitle: "Laporan Keuangan Triwulan",
        content: "Total Kas Terkumpul: Rp 14.850.000\nPengeluaran:\n1. Pemasangan 6 Titik Lampu Jalan LED (Rp 4.200.000)\n2. Perbaikan Saluran Irigasi Sawah Selatan (Rp 3.500.000)\n3. Kas Tersisa: Rp 7.150.000 (Aman dan Siap Diaudit).",
        date: "Laporan Bendahara Desa"
      },
      {
        pageNumber: 4,
        title: "Katalog UMKM & Kerajinan Warga",
        subtitle: "Pemberdayaan Ekonomi Lokal",
        content: "Dukung usaha warga sendiri:\n1. Kripik Singkong Gurih - Ibu Nur (RT 01)\n2. Bibit Ikan Lele & Nila Kolam Bersama - Pemuda Sapen\n3. Jasa Servis Pompa Air & Listrik - Mas Dwi (RT 03)\n\nHubungi sekretariat warga untuk mendaftarkan UMKM Anda.",
        date: "Pojok UMKM Sapen"
      }
    ];

    return NextResponse.json({
      isLocked: false,
      pages: fullPages,
      message: "Akses Penuh Diberikan."
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memproses data modul." }, { status: 500 });
  }
}