export interface BeritaItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  views: number;
  image: string;
  caption: string;
  content: string[];
}

export const INITIAL_BERITA: BeritaItem[] = [
  {
    id: 1,
    title: "Pengurus RW 05 Kampung Sapen Serahkan Bantuan Biaya Ibadah & Santunan Bagi 24 Warga, Total Rp 89,2 Jt",
    excerpt: "Pengurus Rukun Warga 05 Kampung Sapen, Demangan menyalurkan paket bantuan dana sosial keagamaan bagi takmir dan keluarga prasejahtera di Balai Pertemuan Sapen.",
    category: "Berita Utama",
    date: "28 Oktober 2026",
    author: "Tim Redaksi Warta Sapen",
    readTime: "3 min",
    views: 248,
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1000&auto=format&fit=crop",
    caption: "Penyerahan santunan dan dana bantuan sosial secara simbolis oleh Ketua RW 05 di Balai Sapen.",
    content: [
      "YOGYAKARTA — Pengurus Rukun Warga (RW) 05 Kampung Sapen, Kelurahan Demangan, Kemantren Gondokusuman menyalurkan bantuan sosial dana keagamaan serta santunan pendidikan bagi 24 kepala keluarga dan takmir mushola di lingkungan Sapen pada Rabu (28/10/2026).",
      "Penyaluran bantuan ini bersumber dari alokasi kas swadaya lingkungan serta donasi paguyuban warga perantau Sapen yang dihimpun selama triwulan berjalan. Total dana yang disalurkan mencapai Rp 89.200.000.",
      "Ketua RW 05 Kampung Sapen, Bpk. H. Slamet Raharjo dalam sambutannya menegaskan bahwa keterbukaan informasi anggaran dan kepedulian terhadap sesama tetangga adalah landasan utama kerukunan warga.",
      "Kegiatan yang dihadiri oleh seluruh Ketua RT 01, RT 02, dan RT 03 ini berjalan dengan tertib dan penuh kehangatan kekeluargaan khas budaya guyub rukun Yogyakarta."
    ]
  },
  {
    id: 2,
    title: "Job Fair & Pelatihan Kerja Pemuda Karang Taruna Sapen, Sediakan 150 Lowongan Mitra",
    excerpt: "Karang Taruna Kampung Sapen menggelar bursa lowongan kerja mikro dan pelatihan keterampilan digital bagi pemuda pemudi pencari kerja.",
    category: "Kepemudaan",
    date: "28 Oktober 2026",
    author: "Karang Taruna Sapen",
    readTime: "2 min",
    views: 86,
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop",
    caption: "Suasana pelatihan digital marketing dan rekrutmen kerja pemuda di Balai Sapen.",
    content: [
      "YOGYAKARTA — Divisi Pemberdayaan Karang Taruna RW 05 Kampung Sapen menyelenggarakan program pelatihan keahlian kerja dan bursa kemitraan yang menyediakan lebih dari 150 lowongan pekerjaan bagi warga usia produktif.",
      "Bekerja sama dengan puluhan pelaku usaha lokal di kawasan Demangan dan Yogyakarta, kegiatan ini bertujuan menekan angka pengangguran terbuka di tingkat pemuda kampung."
    ]
  },
  {
    id: 3,
    title: "Ketua RW 05 Lepas Kontingen Atlet Bulutangkis Pemuda Menuju Kejuaraan Wilayah Kota Yogyakarta",
    excerpt: "Kontingen bulutangkis binaan Kampung Sapen resmi diberangkatkan menuju kejuaraan antar-kemantren se-Kota Yogyakarta.",
    category: "Olahraga",
    date: "23 Oktober 2026",
    author: "Sie Olahraga Sapen",
    readTime: "1 min",
    views: 46,
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
    caption: "Pemberangkatan atlet bulutangkis pemuda Sapen di depan Balai Pertemuan RW 05.",
    content: [
      "YOGYAKARTA — Bertempat di Lapangan Serbaguna Jl. Bimokurdo, Ketua RW 05 secara resmi melepas 8 atlet muda bulutangkis yang akan mewakili Kampung Sapen dalam ajang Kejuaraan Wilayah se-Kemantren Gondokusuman."
    ]
  },
  {
    id: 4,
    title: "Pengurus Sapen Perkuat Digitalisasi Perlindungan Sosial untuk Bansos Tepat Sasaran",
    excerpt: "Sistem pendataan digital mandiri diterapkan untuk memvalidasi daftar penerima bantuan sembako dan santunan kesehatan warga.",
    category: "Pemberdayaan",
    date: "19 Oktober 2026",
    author: "Sekretariat RW 05",
    readTime: "2 min",
    views: 44,
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&auto=format&fit=crop",
    caption: "Rapat koordinasi validasi basis data warga di sekretariat Kampung Sapen.",
    content: [
      "YOGYAKARTA — Guna memastikan penyaluran bantuan sosial tepat sasaran dan transparan, pengurus Kampung Sapen meluncurkan pembaruan basis data kependudukan digital berbasis rukun tetangga."
    ]
  }
];

export const DAFTAR_BERITA_SAPEN = INITIAL_BERITA;

// 👉 FUNGSI INI WAJIB DI-EXPORT AGAR TIDAK ERROR "is not a function" 👈
export function getBeritaById(id: number | string): BeritaItem | undefined {
  const numId = Number(id);
  return INITIAL_BERITA.find((b) => b.id === numId) || INITIAL_BERITA[0];
}