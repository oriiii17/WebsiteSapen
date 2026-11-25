"use client";

import "./portal.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Gamepad2,
  Users, 
  Calendar, 
  Wallet,
  ShieldCheck, 
  Search,
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Volume2, 
  VolumeX, 
  X,
  MapPin,
  Clock,
  ShoppingBag,
  ArrowUp,
  ArrowUpRight,
  Megaphone,
  FileText,
  Building,
  Activity,
  Compass,
  Edit,
  Save,
  LogOut,
  Settings,
  Eye,
  CheckCircle2,
  Recycle,
  ShieldAlert,
  Building2,
} from "lucide-react";
import confetti from "canvas-confetti";

// KONFIGURASI WHATSAPP PENGURUS
const NOMOR_WHATSAPP_LINK = "6281234567890";
const NOMOR_WHATSAPP_TAMPILAN = "0812-3456-7890";
const DEFAULT_NEWS_IMAGE = "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1000&auto=format&fit=crop";

// 3 SLIDE BANNER HERO RESMI DENGAN FOTO ASLI SAPEN
const HERO_SLIDES = [
  {
    tag: "PORTAL RESMI WARGA",
    title: "Selamat Datang di Portal Kampung Sapen Yogyakarta",
    subtitle: "Informasi dan layanan untuk seluruh warga Kampung Sapen",
    desc: "Akses berita warga, jadwal siskamling, bank sampah, dan kegiatan gotong royong Kampung Sapen, Gondokusuman, Kota Yogyakarta.",
    bg: "/sapen.jpg"
  },
  {
    tag: "UPDATE HARIAN",
    title: "Tetap Terhubung dengan Kegiatan Warga Sapen",
    subtitle: "Warta, Event, dan Pengumuman Resmi Lingkungan",
    desc: "Dapatkan update berkala seputar kegiatan gotong royong, program bank sampah pilah, dan kesejahteraan sosial di Kampung Sapen Demangan.",
    bg: "/re9.jpg"
  },
  {
    tag: "PELAYANAN WARGA",
    title: "Guyub Rukun & Siskamling Mandiri",
    subtitle: "Menjaga Ketenangan Pemukiman Warga Sapen",
    desc: "Penjagaan terpadu pos ronda malam dengan regu bergiliran RT 01, RT 02, dan RT 03 demi kenyamanan lingkungan di jantung Kota Yogyakarta.",
    bg: "/sapen.jpg"
  }
];

// DATA TITIK GEOGRAFIS SATELIT KAMPUNG SAPEN YOGYAKARTA
const GEOGRAFIS_LOCATIONS = [
  {
    id: 1,
    name: "Balai RW Sapen (Pusat Pelayanan)",
    wilayah: "Sapen, Demangan, Gondokusuman, Yogyakarta",
    lat: -7.786500,
    lng: 110.393200,
    koordinat: "-7.786500, 110.393200",
    gmapsUrl: "https://www.google.com/maps?q=-7.786500,110.393200",
    pic: "Bpk. H. Slamet Raharjo (Ketua RW Sapen)",
    desc: "Pusat musyawarah warga RW Sapen Demangan, pelayanan administrasi pengantar surat RT/RW, dan senam lansia.",
    icon: "🏛️"
  },
  {
    id: 2,
    name: "Posko Siskamling Induk Sapen",
    wilayah: "Jl. Bimasakti, Sapen, Yogyakarta",
    lat: -7.787200,
    lng: 110.392100,
    koordinat: "-7.787200, 110.392100",
    gmapsUrl: "https://www.google.com/maps?q=-7.787200,110.392100",
    pic: "Bpk. Bambang Sudiro (Hansip RT 01)",
    desc: "Pusat koordinasi ronda malam siskamling dan pos pantau keamanan pemukiman.",
    icon: "🚨"
  },
  {
    id: 3,
    name: "Bank Sampah 'Sapen Resik' & Posyandu",
    wilayah: "Jl. Bimokurdo No. 33, Sapen, Yogyakarta",
    lat: -7.785951,
    lng: 110.392512,
    koordinat: "-7.785951, 110.392512",
    gmapsUrl: "https://www.google.com/maps?q=-7.785951,110.392512",
    pic: "Ibu Hj. Maryatun (Pengelola Bank Sampah)",
    desc: "Pusat penimbangan sampah anorganik warga dan pembagian bibit tanaman penghijauan.",
    icon: "♻️"
  },
  {
    id: 4,
    name: "Sentra Kuliner & UMKM Warga Sapen",
    wilayah: "Kawasan Pemukiman Sapen, Gondokusuman",
    lat: -7.787800,
    lng: 110.394100,
    koordinat: "-7.787800, 110.394100",
    gmapsUrl: "https://www.google.com/maps?q=-7.787800,110.394100",
    pic: "Ibu Rahayu (Koordinator UMKM Sapen)",
    desc: "Pusat olahan pangan rumahan, katering hajatan, dan keripik tempe renyah khas Sapen.",
    icon: "🛍️"
  }
];

const DEFAULT_FALLBACK_NEWS = [
  {
    id: 1,
    title: "Pengurus RW 05 Kampung Sapen Serahkan Bantuan Biaya Ibadah & Santunan Bagi 24 Warga, Total Rp 89,2 Jt",
    excerpt: "YOGYAKARTA - Pengurus Rukun Warga 05 Kampung Sapen, Demangan menyalurkan paket bantuan dana sosial keagamaan bagi takmir mushola dan keluarga prasejahtera bertempat di Balai Pertemuan Sapen.",
    category: "Berita Utama",
    date: "28 Oktober 2026",
    readTime: "3 min",
    views: 248,
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Bank Sampah 'Sapen Resik' Berhasil Olah 1,4 Ton Sampah Anorganik Bulan Ini",
    excerpt: "Warga RW 05 Kampung Sapen antusias mengikuti program tabungan emas berbasis sampah plastik dan kardus di Balai RT 03.",
    category: "Lingkungan",
    date: "28 Oktober 2026",
    readTime: "2 min",
    views: 112,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=600&auto=format&fit=crop"
  }
];

const DEFAULT_MODUL_PAGES = [
  {
    page: 1,
    tag: "WARTA RESMI WARGA",
    issue: "EDISI 01 • TAHUN 2026",
    title: "Membangun Kemandirian & Ketertiban Warga Kampung Sapen",
    subtitle: "Warta Kegiatan, Siskamling, dan Gotong Royong Warga",
    lead: "Selamat datang di Portal Layanan & Warta Mandiri Kampung Sapen, Kemantren Gondokusuman, Kota Yogyakarta. Temukan kabar dan jadwal kegiatan warga dalam satu tempat.",
    colLeft: "Kampung Sapen yang terletak di kawasan strategis Kota Yogyakarta berkomitmen menjaga suasana pemukiman yang asri, guyub rukun, dan mandiri. Warga bersama-sama menjaga keamanan lingkungan, memilah sampah, dan merawat kebersamaan.",
    colRight: "Melalui media warta digital ini, warga dapat memantau jadwal piket pos ronda, kegiatan bank sampah, kerja bakti, serta aktivitas warga RT 01, RT 02, dan RT 03 Sapen.",
    author: "H. Slamet Raharjo",
    role: "Pengelola Portal Kampung Sapen",
    date: "Tahun Anggaran 2026"
  }
];

export default function PortalKampungSapenSmooth() {
  // Sesi Pengurus
  const [adminUser, setAdminUser] = useState<{ nama: string; role: string } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Modal Kelola Info Desa
  const [showEditInfoModal, setShowEditInfoModal] = useState(false);
  const [modalEditTab, setModalEditTab] = useState<"pengumuman" | "ronda" | "banksampah" | "kas">("pengumuman");

  // Data Desa Dinamis
  const [runningText, setRunningText] = useState("• JADWAL KERJA BAKTI SALURAN AIR RT 01-03: MINGGU PUKUL 07.00 WIB • SISKAMLING MALAM INI DIPIMPIN REGU B (RT 02) • PENIMBANGAN BANK SAMPAH HARI MINGGU •");
  const [statusDesa, setStatusDesa] = useState("🟢 AMAN & KONDUSIF");
  const [piketMalam, setPiketMalam] = useState("Regu B (RT 02)");
  const [komandanRonda, setKomandanRonda] = useState("Bpk. Bambang Sudiro");
  const [jamRonda, setJamRonda] = useState("22.30 - 04.00 WIB");
  const [jadwalBankSampah, setJadwalBankSampah] = useState("Minggu Pertama (Pukul 08.00 WIB)");
  const [saldoBankSampah, setSaldoBankSampah] = useState("Rp 3.850.000");
  const [tonaseSampah, setTonaseSampah] = useState("1.4 Ton");
  const [saldoKas, setSaldoKas] = useState("Rp 16.4 Jt");
  const [danaDarurat, setDanaDarurat] = useState("Rp 5.0 Jt");

  // State Halaman
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pages] = useState<any[]>(DEFAULT_MODUL_PAGES);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedGeo, setSelectedGeo] = useState(GEOGRAFIS_LOCATIONS[0]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [liveNews, setLiveNews] = useState<any[]>([]);

  // Muat data dari localStorage
  useEffect(() => {
    const savedAdmin = localStorage.getItem("sapen_admin_data");
    if (savedAdmin) {
      try { setAdminUser(JSON.parse(savedAdmin)); } catch (e) {}
    }

    const savedVillageInfo = localStorage.getItem("sapen_village_info_clean");
    if (savedVillageInfo) {
      try {
        const info = JSON.parse(savedVillageInfo);
        if (info.runningText) setRunningText(info.runningText);
        if (info.statusDesa) setStatusDesa(info.statusDesa);
        if (info.piketMalam) setPiketMalam(info.piketMalam);
        if (info.komandanRonda) setKomandanRonda(info.komandanRonda);
        if (info.jamRonda) setJamRonda(info.jamRonda);
        if (info.jadwalBankSampah) setJadwalBankSampah(info.jadwalBankSampah);
        if (info.saldoBankSampah) setSaldoBankSampah(info.saldoBankSampah);
        if (info.tonaseSampah) setTonaseSampah(info.tonaseSampah);
        if (info.saldoKas) setSaldoKas(info.saldoKas);
        if (info.danaDarurat) setDanaDarurat(info.danaDarurat);
      } catch (e) {}
    }

    const fetchNews = async () => {
      try {
        const res = await fetch("/api/berita");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setLiveNews(json.data);
          }
        }
      } catch (e) {}
    };
    fetchNews();
  }, []);

  const handleSaveAllInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      runningText,
      statusDesa,
      piketMalam,
      komandanRonda,
      jamRonda,
      jadwalBankSampah,
      saldoBankSampah,
      tonaseSampah,
      saldoKas,
      danaDarurat
    };
    localStorage.setItem("sapen_village_info_clean", JSON.stringify(dataToSave));
    setShowEditInfoModal(false);
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
  };

  // Timer Perpindahan Slide (Tiap 6 Detik)
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 350);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    if (
      (loginUsername.toLowerCase() === "admin" && loginPin === "sapen2026") ||
      (loginUsername.toLowerCase() === "pengurus" && loginPin === "wargasapen")
    ) {
      const user = {
        nama: loginUsername.toLowerCase() === "admin" ? "Admin Web Sapen" : "Admin Kampung Sapen",
        role: "ADMIN"
      };
      setAdminUser(user);
      localStorage.setItem("sapen_admin_data", JSON.stringify(user));
      setShowLoginModal(false);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } else {
      setLoginError("Username atau PIN Admin salah!");
    }
    setLoginLoading(false);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("sapen_admin_data");
    setAdminUser(null);
  };

  const slide = HERO_SLIDES[currentSlide];
  const StatusIcon = statusDesa.includes("WASPADA") ? ShieldAlert : statusDesa.includes("SIAGA") ? Activity : ShieldCheck;
  const allDisplayNews = liveNews.length > 0 ? liveNews : DEFAULT_FALLBACK_NEWS;
  const featuredArticle = allDisplayNews[0] || DEFAULT_FALLBACK_NEWS[0];
  const sideArticles = allDisplayNews.slice(1, 4);

  // CSS KHUSUS TRANSISI SLIDER SUPER MULUS (KEN BURNS + DISSOLVE CROSSFADE)
  return (
    <div className="portal-body">


      {/* BILAH KONTROL PENGURUS */}
      {adminUser && (
        <div className="admin-toolbar">
          <div className="admin-toolbar__identity">
            <span className="admin-toolbar__badge">MODE ADMIN</span>
            <span>Masuk sebagai: <b>{adminUser.nama}</b></span>
          </div>

          <div className="admin-toolbar__actions">
            <Link href="/admin/berita">
              <FileText style={{ width: 14, height: 14 }} /> Kelola Berita (CMS)
            </Link>

            <button onClick={() => setShowEditInfoModal(true)}>
              <Edit style={{ width: 14, height: 14 }} /> Perbarui Info Warga
            </button>

            <button onClick={handleAdminLogout}>
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="navbar-glass-iphone">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="brand-mark" aria-hidden="true">
            <Building style={{ width: 21, height: 21 }} />
          </div>
          <div>
            <div className="brand-title">Portal Kampung Sapen</div>
            <div className="brand-subtitle">Gondokusuman • Kota Yogyakarta</div>
          </div>
        </div>

        <div className="nav-links">
          <button className="nav-item" type="button" onClick={scrollToTop}>Beranda</button>
          <Link className="nav-item" href="/peta">Peta Satelit</Link>
          <Link className="nav-item" href="/berita">Berita Warga</Link>
          <Link className="nav-item" href="/agenda">Jadwal &amp; Layanan</Link>
        </div>

        {adminUser && (
          <span className="admin-active">
            <CheckCircle2 style={{ width: 14, height: 14 }} /> Admin Aktif
          </span>
        )}
      </nav>

      {/* 👉 1. HERO SLIDER DENGAN TRANSISI HALUS (LAYER MULTI-FOTO + KEN BURNS) 👈 */}
      <section className="hero-container">
        {/* Layer-layer foto yang bertumpuk dan memudar mulus */}
        {HERO_SLIDES.map((s, idx) => (
          <div
            key={idx}
            className={`hero-bg-layer ${idx === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${s.bg})` }}
          />
        ))}

        <div className="hero-content">
          <div className="ticker-bar" aria-label="Info terkini">
            <div className="ticker-label"><Megaphone aria-hidden="true" size={16} /><span>INFO TERKINI</span></div>
            <div className="ticker-content">{runningText}</div>
          </div>
          <div className="hero-toolbar">
            <div className={`hero-status${statusDesa.includes("WASPADA") ? " is-alert" : ""}`} aria-live="polite">
              <StatusIcon aria-hidden="true" size={17} />
              <span>Status Desa: <b>{statusDesa.replace(/^[^A-Z0-9]*/, "")}</b></span>
            </div>

            <div className="hero-controls" role="group" aria-label="Kontrol berita utama">
              <button type="button" aria-label="Slide sebelumnya" onClick={() => setCurrentSlide((p) => (p === 0 ? HERO_SLIDES.length - 1 : p - 1))}>
                <ChevronLeft style={{ width: 15, height: 15 }} />
              </button>
              <span className="hero-count" aria-live="polite">0{currentSlide + 1} / 0{HERO_SLIDES.length}</span>
              <button type="button" aria-label="Slide berikutnya" onClick={() => setCurrentSlide((p) => (p + 1) % HERO_SLIDES.length)}>
                <ChevronRight style={{ width: 15, height: 15 }} />
              </button>
            </div>
          </div>

          <div key={currentSlide} className="hero-text-fade">
            <h1>{slide.title}</h1>
            <p className="hero-subtitle">{slide.subtitle}</p>
            <p>{slide.desc}</p>

            <div className="hero-stats">
              <div className="hero-stat">
                <strong>{piketMalam}</strong>
                <span>Piket Malam Ini</span>
              </div>
              <div className="hero-stat">
                <strong>{tonaseSampah}</strong>
                <span>Total Sampah Terkelola</span>
              </div>
              <div className="hero-stat">
                <strong>{(() => {
                  const activity = runningText.split("•").map((item) => item.trim()).find((item) => /KERJA BAKTI|KEGIATAN/i.test(item)) || "Kegiatan warga";
                  const detail = activity.includes(":") ? activity.split(":").slice(1).join(":").trim() : activity;
                  return detail.toLocaleLowerCase("id-ID").replace(/^./, (letter) => letter.toLocaleUpperCase("id-ID"));
                })()}</strong>
                <span>Jadwal Kerja Bakti</span>
              </div>
              <div className="hero-stat">
                <strong>{saldoKas}</strong>
                <span>Saldo Kas Lingkungan</span>
              </div>
              <div className="hero-stat">
                <strong>{danaDarurat}</strong>
                <span>Dana Siaga Darurat</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KARTU PINTASAN */}
      <div className="floating-cards-row">
        <Link className="category-card" href="/berita">
          <span className="category-card__top"><FileText className="category-card__icon" size={20} /><span><span className="category-card__title">Berita Warga</span><span className="category-card__description">Kabar kegiatan RT 01–03</span></span></span>
          <span className="category-card__action">Baca warta <ArrowUpRight size={14} aria-hidden="true" /></span>
        </Link>

        <Link className="category-card" href="/agenda#ronda">
          <span className="category-card__top"><ShieldCheck className="category-card__icon" size={20} /><span><span className="category-card__title">Jadwal Siskamling</span><span className="category-card__description">Regu dan jam ronda</span></span></span>
          <span className="category-card__action">Lihat jadwal <ArrowUpRight size={14} aria-hidden="true" /></span>
        </Link>

        <Link className="category-card" href="/agenda#bank-sampah">
          <span className="category-card__top"><Recycle className="category-card__icon" size={20} /><span><span className="category-card__title">Bank Sampah</span><span className="category-card__description">Jadwal dan sampah terkelola</span></span></span>
          <span className="category-card__action">Lihat layanan <ArrowUpRight size={14} aria-hidden="true" /></span>
        </Link>

        <Link className="category-card" href="/agenda#game">
          <span className="category-card__top"><Gamepad2 className="category-card__icon" size={20} /><span><span className="category-card__title">Panen Berkah Sapen</span><span className="category-card__description">Mainkan game Panen Raya</span></span></span>
          <span className="category-card__action">Buka permainan <ArrowUpRight size={14} aria-hidden="true" /></span>
        </Link>

      </div>

      {/* KONTEN UTAMA DENGAN LATAR PUTIH KACA TRANSPARAN LEMBUT */}
      <main>
        
        {/* TAB 1: PETA SATELIT & BERITA */}
          <div id="infografis" style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            
            {/* WADAH PETA PUTIH TRANSPARAN */}
            <div className="content-glass-card sapen-map-section">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "14px", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a" }}>
                    Peta Satelit Kampung Sapen Yogyakarta
                  </h2>
                  <p style={{ fontSize: "13.5px", color: "#475569", marginTop: "4px" }}>
                    Citra satelit pemukiman Kampung Sapen terhubung dengan Google Maps.
                  </p>
                </div>
              </div>

              <div className="sapen-map-layout">
                <div className="sapen-map-frame">
                  <iframe
                    className="sapen-map-iframe"
                    key={selectedGeo.id}
                    src={`https://maps.google.com/maps?q=${selectedGeo.lat},${selectedGeo.lng}&t=k&z=18&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: "block" }}
                    loading="lazy"
                    title="Peta Satelit"
                  />
                  <div style={{ position: "absolute", bottom: "14px", left: "14px", right: "14px", display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                    {GEOGRAFIS_LOCATIONS.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => setSelectedGeo(loc)}
                        className={`sapen-map-location${selectedGeo.id === loc.id ? " is-selected" : ""}`}
                        type="button"
                        aria-pressed={selectedGeo.id === loc.id}
                      >
                        {loc.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sapen-map-details">
                  <div>
                    <h3 style={{ fontSize: "19px", fontWeight: 900, color: "#0f172a" }}>{selectedGeo.name}</h3>
                    <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6", marginTop: "8px" }}>{selectedGeo.desc}</p>
                    <div className="sapen-map-facts">
                      <div><b>Pengurus:</b> {selectedGeo.pic}</div>
                      <div><b>Koordinat:</b> {selectedGeo.koordinat}</div>
                    </div>
                  </div>
                  <a className="map-directions" href={selectedGeo.gmapsUrl} target="_blank" rel="noreferrer">
                    Buka rute di Google Maps <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {/* WADAH BERITA PUTIH TRANSPARAN */}
            <div id="berita" className="content-glass-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "14px", marginBottom: "24px" }}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a" }}>Berita Terkini Kampung Sapen</h2>
                  <p style={{ fontSize: "13.5px", color: "#475569", marginTop: "4px" }}>Informasi resmi terupdate seputar aktivitas warga RT 01, RT 02, dan RT 03</p>
                </div>
                {adminUser && (
                  <Link href="/admin/berita" style={{ background: "#2563eb", color: "white", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "12px", fontWeight: 800 }}>
                    + Kelola Berita (CMS)
                  </Link>
                )}
              </div>

              <div className="sapen-news-layout sapen-news-layout--stacked">
                <Link href={`/berita/${featuredArticle.id || 1}`} className="sapen-featured-news">
                  <img src={featuredArticle.image || DEFAULT_NEWS_IMAGE} alt="" onError={(e) => { e.currentTarget.src = DEFAULT_NEWS_IMAGE; }} />
                  <div className="sapen-featured-news__body">
                    <span className="news-category-label">{featuredArticle.category || "Berita Warga"}</span>
                    <h3>{featuredArticle.title}</h3>
                    <p>{featuredArticle.excerpt}</p>
                    <span className="news-date"><Calendar size={15} aria-hidden="true" /> {featuredArticle.date || "Terbaru"}</span>
                    <span className="news-read-more">Baca selengkapnya <ArrowUpRight size={17} aria-hidden="true" /></span>
                  </div>
                </Link>

                <div className="sapen-news-list sapen-news-grid">
                  {sideArticles.map((item, idx) => (
                    <Link key={item.id || idx} href={`/berita/${item.id || idx + 2}`} className="news-list-item">
                      <img src={item.image || DEFAULT_NEWS_IMAGE} alt="" onError={(e) => { e.currentTarget.src = DEFAULT_NEWS_IMAGE; }} />
                      <div>
                        <span className="news-category-label">{item.category || "Berita Warga"}</span>
                        <h4>{item.title}</h4>
                        <p>{item.excerpt}</p>
                        <span className="news-date"><Calendar size={14} aria-hidden="true" /> {item.date || "Terbaru"}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          </div>

        {/* TAB 2: JADWAL & PELAYANAN */}
          <div id="layanan" className="services-view">
            <div className="service-panels-grid">
            <section className="service-panel" id="siskamling">
              <h3><ShieldCheck size={21} aria-hidden="true" /> Jadwal Ronda</h3>
              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>Posko Siskamling: Jam tugas <b>{jamRonda}</b> | Komandan: <b>{komandanRonda}</b></p>
              <div className="service-status">
                Piket malam ini aktif: <b style={{ color: "#1d4ed8" }}>{piketMalam}</b>
              </div>
            </section>

            <section className="service-panel" id="bank-sampah">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3><Recycle size={21} aria-hidden="true" /> Bank Sampah</h3>
                <span style={{ background: "#dcfce7", color: "#15803d", padding: "4px 10px", borderRadius: "6px", fontSize: "11.5px", fontWeight: 800 }}>Pilah Sampah Jadi Emas</span>
              </div>
              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>Jadwal Penimbangan: <b>{jadwalBankSampah}</b></p>
              <div className="service-facts-grid">
                <div className="service-fact-card">
                  <div style={{ fontSize: "12px", color: "#64748b" }}>Total Sampah Terkelola</div>
                  <div style={{ fontSize: "22px", fontWeight: 900, color: "#15803d", marginTop: "4px" }}>{tonaseSampah}</div>
                </div>
              </div>
            </section>
            <section className="service-panel" id="kas-warga">
              <h3><Wallet size={21} aria-hidden="true" /> Saldo Kas &amp; Dana Siaga</h3>
              <div className="service-facts-grid">
                <div className="service-fact-card">
                  <div>Saldo Kas Lingkungan</div>
                  <strong>{saldoKas}</strong>
                </div>
                <div className="service-fact-card">
                  <div>Dana Siaga Darurat</div>
                  <strong>{danaDarurat}</strong>
                </div>
              </div>
            </section>
            </div>

          </div>

      </main>

      {/* FOOTER */}
      <footer className="portal-footer">
        <div className="portal-footer__grid">
          <div>
            <div className="portal-footer__title">Portal Warga Kampung Sapen</div>
            <p>Demangan, Kemantren Gondokusuman, Yogyakarta. Warta dan layanan seluruh warga, guyub rukun.</p>
          </div>
          <nav className="portal-footer__nav" aria-label="Navigasi cepat">
            <b>Navigasi cepat</b>
            <Link href="/peta">Peta Satelit</Link>
            <Link href="/berita">Berita Warga</Link>
            <Link href="/agenda">Jadwal &amp; Layanan</Link>
            {!adminUser && <button type="button" className="portal-footer__admin-login" onClick={() => setShowLoginModal(true)}>Login Admin</button>}
          </nav>
          <div className="portal-footer__contact">
            <b>Kontak sekretariat</b>
            <a href="tel:0274556652736">(0274) 5566-SAPEN</a>
            <a href="mailto:sekretariat@kampungsapen-jogja.id">sekretariat@kampungsapen-jogja.id</a>
            <a href={`https://wa.me/${NOMOR_WHATSAPP_LINK}`} target="_blank" rel="noreferrer">WhatsApp Admin</a>
          </div>
        </div>
      </footer>

      {/* MODAL 1: LOGIN ADMIN */}
      {showLoginModal && (
        <div className="modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowLoginModal(false); }}>
          <div className="modal-card login-modal" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
            <button aria-label="Tutup login" onClick={() => setShowLoginModal(false)} className="modal-close"><X aria-hidden="true" size={20} /></button>
            <div className="modal-heading-icon"><Building2 aria-hidden="true" size={23} /></div>
            <h3 id="login-modal-title">Login Admin</h3>
            <p>Masuk untuk mengelola informasi dan berita warga.</p>
            <form onSubmit={handleAdminLogin} className="portal-form">
              <label htmlFor="admin-username">Username Admin</label>
              <input id="admin-username" type="text" autoComplete="username" placeholder="Masukkan username admin" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} required />
              <label htmlFor="admin-pin">PIN Admin</label>
              <input id="admin-pin" type="password" autoComplete="current-password" placeholder="Masukkan PIN" value={loginPin} onChange={(e) => setLoginPin(e.target.value)} required />
              {loginError && <p className="portal-form-error" role="alert">{loginError}</p>}
              <button type="submit" className="portal-form-submit">Masuk sebagai Admin</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT INFO DESA DENGAN 4 TAB MENU */}
      {showEditInfoModal && (
        <div className="modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowEditInfoModal(false); }}>
          <div className="modal-card info-modal" role="dialog" aria-modal="true" aria-labelledby="info-modal-title">
            <button aria-label="Tutup pusat kendali" onClick={() => setShowEditInfoModal(false)} className="modal-close"><X aria-hidden="true" size={20} /></button>

            <h3 id="info-modal-title" className="info-modal-title">
              <Edit aria-hidden="true" size={21} />
              <span>Pusat Kendali Info Warga</span>
            </h3>
            <p className="info-modal-description">Pilih informasi warga yang ingin diperbarui oleh Admin.</p>

            <div className="info-modal-tabs" role="tablist" aria-label="Jenis informasi warga">
              <button
                type="button"
                onClick={() => setModalEditTab("pengumuman")}
                className={`info-modal-tab${modalEditTab === "pengumuman" ? " is-active" : ""}`} role="tab" aria-selected={modalEditTab === "pengumuman"}
              >
                <Megaphone aria-hidden="true" size={17} /><span>Pengumuman</span>
              </button>
              <button
                type="button"
                onClick={() => setModalEditTab("ronda")}
                className={`info-modal-tab${modalEditTab === "ronda" ? " is-active" : ""}`} role="tab" aria-selected={modalEditTab === "ronda"}
              >
                <ShieldCheck aria-hidden="true" size={17} /><span>Siskamling</span>
              </button>
              <button
                type="button"
                onClick={() => setModalEditTab("banksampah")}
                className={`info-modal-tab${modalEditTab === "banksampah" ? " is-active" : ""}`} role="tab" aria-selected={modalEditTab === "banksampah"}
              >
                <Recycle aria-hidden="true" size={17} /><span>Bank Sampah</span>
              </button>
              <button
                type="button"
                onClick={() => setModalEditTab("kas")}
                className={`info-modal-tab${modalEditTab === "kas" ? " is-active" : ""}`} role="tab" aria-selected={modalEditTab === "kas"}
              >
                <Wallet aria-hidden="true" size={17} /><span>Kas Warga</span>
              </button>
            </div>

            <form onSubmit={handleSaveAllInfo} className="info-modal-form">
              {modalEditTab === "pengumuman" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 800, display: "block", marginBottom: "6px" }}>Teks Berjalan (*Running Text Ticker Atas*)</label>
                    <textarea rows={3} value={runningText} onChange={(e) => setRunningText(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12px" }} required />
                  </div>
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 800, display: "block", marginBottom: "6px" }}>Status Keamanan Desa</label>
                    <select value={statusDesa} onChange={(e) => setStatusDesa(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12.5px" }}>
                      <option value="🟢 AMAN & KONDUSIF">Aman dan kondusif</option>
                      <option value="🟡 SIAGA KERJA BAKTI">Siaga kerja bakti</option>
                      <option value="🔴 WASPADA CUACA EKSTREM">Waspada cuaca ekstrem</option>
                    </select>
                  </div>
                </div>
              )}

              {modalEditTab === "ronda" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 800, display: "block", marginBottom: "6px" }}>Piket Ronda Malam Ini</label>
                    <input type="text" value={piketMalam} onChange={(e) => setPiketMalam(e.target.value)} placeholder="Contoh: Regu B (RT 02)" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }} required />
                  </div>
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 800, display: "block", marginBottom: "6px" }}>Komandan Jaga / Koordinator</label>
                    <input type="text" value={komandanRonda} onChange={(e) => setKomandanRonda(e.target.value)} placeholder="Contoh: Bpk. Bambang Sudiro" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }} required />
                  </div>
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 800, display: "block", marginBottom: "6px" }}>Jam Operasional Siskamling</label>
                    <input type="text" value={jamRonda} onChange={(e) => setJamRonda(e.target.value)} placeholder="Contoh: 22.30 - 04.00 WIB" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }} required />
                  </div>
                </div>
              )}

              {modalEditTab === "banksampah" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 800, display: "block", marginBottom: "6px" }}>Jadwal Penimbangan Sampah Berikutnya</label>
                    <input type="text" value={jadwalBankSampah} onChange={(e) => setJadwalBankSampah(e.target.value)} placeholder="Contoh: Minggu Pertama (Pukul 08.00 WIB)" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }} required />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ fontSize: "12.5px", fontWeight: 800, display: "block", marginBottom: "6px" }}>Total Sampah Terolah</label>
                      <input type="text" value={tonaseSampah} onChange={(e) => setTonaseSampah(e.target.value)} placeholder="Contoh: 1.4 Ton" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }} required />
                    </div>
                  </div>
                </div>
              )}

              {modalEditTab === "kas" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 800, display: "block", marginBottom: "6px" }}>Saldo Kas Lingkungan</label>
                    <input type="text" value={saldoKas} onChange={(e) => setSaldoKas(e.target.value)} placeholder="Contoh: Rp 16,4 juta" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }} required />
                  </div>
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 800, display: "block", marginBottom: "6px" }}>Dana Siaga Darurat</label>
                    <input type="text" value={danaDarurat} onChange={(e) => setDanaDarurat(e.target.value)} placeholder="Contoh: Rp 5 juta" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }} required />
                  </div>
                </div>
              )}


              <button type="submit" className="portal-form-submit info-modal-submit">
                <Save aria-hidden="true" size={17} /> Simpan pembaruan info warga
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

