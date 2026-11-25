---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

# Surface Brief — Beranda Portal Warga Kampung Sapen

## Scope and Mode

Route `/`, Operate. Beranda informasi dan layanan harian bagi warga Kampung Sapen; desktop tetap didukung, dengan komposisi utama dirancang lebih dulu untuk layar HP.

## Audience and Job

Warga lintas usia, termasuk lansia, membuka beranda terutama dari ponsel untuk segera melihat kabar terbaru, jadwal ronda, bank sampah, kas lingkungan, lokasi layanan, dan aktivitas warga. Pengurus RW memakai mode pengurus untuk memperbarui informasi.

## Content and Constraints

Pertahankan semua fitur dan alur yang ada: login, bilah kontrol pengurus dan keluar; ticker dan hero slider; statistik, berita, empat layanan, peta satelit beserta pemilihan lokasi, game Panen Berkah Sapen; modal empat tab untuk info desa; akses modul ber-token; API, CRUD, data cadangan, dan key localStorage. Bahasa Indonesia. Utamakan kontras tinggi, teks jelas, fokus keyboard, ikon lucide-react, dan target sentuh besar.

## Direction contract

THESIS: Beranda menjadi serah-terima kabar dan layanan kampung yang jelas: warga dapat melihat kondisi dan jadwal penting sebelum menelusuri berita serta layanan. Tolak susunan portal generik yang menyamakan semua bagian sebagai deretan kartu.

OWN-WORLD: Arah Gardu Warga memakai bidang krem kertas roster, tinta cokelat tua, bata, dan hijau; pembatas penuh dan label sederhana, bukan tekstur dekoratif. Gunakan sans antarmuka yang mudah dibaca, angka jadwal tabular, dan ukuran teks besar. Warna menyampaikan status dengan label dan ikon pendamping. Empat pintasan layanan memiliki ruang sentuh lega. Sistem tab membantu modal/info layanan; peta lokasi mempertahankan kontrol peta standar.

STORY: Dalam beberapa detik warga mengenali bahwa ini portal RW 05, melihat pengumuman dan regu ronda malam, lalu memilih berita atau layanan yang dibutuhkan. Pengurus tetap dapat masuk, mengubah info, mengelola berita, dan keluar dengan alur yang sama.

FIRST VIEWPORT: Di HP, identitas Kampung Sapen dan tombol masuk pengurus di atas; ticker info warga berikutnya; judul langsung menyebut kabar dan layanan kampung; blok serah-terima menonjolkan regu serta jam ronda; empat tombol besar menamai Berita, Ronda, Bank Sampah, dan Kas; awal berita terbaru terlihat sebelum gulir jauh. Status selalu memuat teks, tidak hanya warna. Di desktop, grid melebar tanpa mengecilkan tipografi.

FORM: Papan giliran dan serah-terima di pos ronda kampung; kandidat grounded urutan 6. SEED REFERENCE: seed:a18bccee8e5c945c.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved Decisions

Tidak ada keputusan arah visual yang terbuka. Struktur implementasi akan mengikuti perilaku yang telah ada; perubahan fungsi tidak termasuk scope.
