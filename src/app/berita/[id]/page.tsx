"use client";

import "./article.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  Eye, 
  User, 
  Share2, 
  MapPin, 
  Check, 
  ChevronRight, 
  ArrowLeft, 
  Loader2,
  Image as ImageIcon,
  Copy,
  Building2,
  ArrowUpRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getBeritaById, DAFTAR_BERITA_SAPEN } from "@/data/beritaData";

// GANTI DENGAN NOMOR WA ANDA JIKA PERLU (Awalan 62)
const NOMOR_WHATSAPP_PENGURUS = "6281234567890";
const DEFAULT_NEWS_IMAGE = "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1000&auto=format&fit=crop";

export default function HalamanBacaBeritaWarga() {
  const params = useParams();
  const [berita, setBerita] = useState<any>(null);
  const [beritaLainnya, setBeritaLainnya] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!params.id) return;
      try {
        setLoading(true);

        // 1. Ambil artikel dari Supabase sesuai ID yang diklik
        const { data: dbArticle, error } = await supabase
          .from("berita")
          .select("*")
          .eq("id", params.id)
          .single();

        if (dbArticle && !error) {
          setBerita(dbArticle);
        } else {
          // Fallback ke data lokal jika di database tidak ada
          const fallback = getBeritaById(params.id as string);
          setBerita(fallback || DAFTAR_BERITA_SAPEN[0]);
        }

        // 2. Ambil artikel lainnya untuk rekomendasi di samping
        const { data: otherDb } = await supabase
          .from("berita")
          .select("*")
          .neq("id", params.id)
          .order("id", { ascending: false })
          .limit(4);

        if (otherDb && otherDb.length > 0) {
          setBeritaLainnya(otherDb);
        } else {
          setBeritaLainnya(DAFTAR_BERITA_SAPEN.filter(b => String(b.id) !== String(params.id)).slice(0, 3));
        }

      } catch (err) {
        const fallback = getBeritaById(params.id as string);
        setBerita(fallback || DAFTAR_BERITA_SAPEN[0]);
        setBeritaLainnya(DAFTAR_BERITA_SAPEN.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  const handleShareWA = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = encodeURIComponent(`*${berita?.title}*\n\nBaca selengkapnya di Portal Warta Kampung Sapen:\n${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="article-state">
        <Loader2 className="article-spinner" aria-hidden="true" />
        <span>Memuat isi artikel berita...</span>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="article-state article-state--empty">
        <h2>Berita Tidak Ditemukan</h2>
        <p>Artikel warta yang Anda cari mungkin telah dipindahkan atau dihapus.</p>
        <Link href="/" className="article-button article-button--primary">
          <ArrowLeft aria-hidden="true" size={18} /> Kembali ke Halaman Utama
        </Link>
      </div>
    );
  }

  const contentParagraphs = Array.isArray(berita.content) 
    ? berita.content 
    : (berita.content || "").split("\n\n").filter(Boolean);

  return (
    <div className="article-page">
      
      {/* 1. TOP HEADER RESMI */}
      <header className="article-masthead">
        <div className="article-masthead__place">
          <MapPin aria-hidden="true" size={16} />
          <span>Warta Resmi Warga Kampung Sapen, Demangan, Gondokusuman, Kota Yogyakarta</span>
        </div>
        <Link href="/" className="article-masthead__back">
          <ArrowLeft aria-hidden="true" size={16} /> Kembali ke Portal
        </Link>
      </header>

      {/* 2. BREADCRUMB */}
      <nav className="article-breadcrumb" aria-label="Lokasi halaman">
        <Link href="/">Portal Sapen</Link>
        <ChevronRight aria-hidden="true" size={14} />
        <span>Berita Warga</span>
        <ChevronRight aria-hidden="true" size={14} />
        <span className="article-breadcrumb__current">
          {berita.title}
        </span>
      </nav>

      {/* 3. KONTEN MEMBACA ARTIKEL */}
      <main className="article-layout">
        
        {/* ARTIKEL UTAMA */}
        <article className="article-story">
          <span className="article-category">
            {berita.category || "Berita Warga"}
          </span>

          <h1>
            {berita.title}
          </h1>

          <div className="article-meta">
            <span className="article-meta__author">
              <User aria-hidden="true" size={16} /> {berita.author || "Pengurus RW 05"}
            </span>
            <span><Calendar aria-hidden="true" size={16} /> {berita.date || "Terbaru"}
            </span>
            <span><Clock aria-hidden="true" size={16} /> {berita.read_time || berita.readTime || "2 min"} baca
            </span>
            <span><Eye aria-hidden="true" size={16} /> {berita.views || 1} pembaca
            </span>
          </div>

          <div className="article-cover">
            <img 
              src={berita.image || DEFAULT_NEWS_IMAGE} 
              alt={berita.title} 
              className="article-cover__image"
              onError={(e) => { e.currentTarget.src = DEFAULT_NEWS_IMAGE; }}
            />
          </div>
          <span className="article-caption">
            <ImageIcon aria-hidden="true" size={15} /> {berita.caption || "Dokumentasi kegiatan warga Kampung Sapen Yogyakarta."}
          </span>

          {berita.excerpt && (
            <div className="article-summary">
              {berita.excerpt}
            </div>
          )}

          <div className="article-content">
            {contentParagraphs.map((paragraph: string, index: number) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Tombol Bagikan ke WhatsApp */}
          <div className="article-share">
            <span>Bagikan warta ini ke warga</span>
            
            <div className="article-share__actions">
              <button
                onClick={handleShareWA}
                className="article-button article-button--whatsapp"
              >
                <span>Bagikan ke WhatsApp</span><ArrowUpRight aria-hidden="true" size={16} />
              </button>

              <button
                onClick={handleCopyLink}
                className="article-button article-button--secondary"
              >
                {copied ? <Check aria-hidden="true" size={17} /> : <Copy aria-hidden="true" size={17} />}
                <span>{copied ? "Link Tersalin!" : "Salin Link"}</span>
              </button>
            </div>
          </div>
        </article>

        {/* SIDEBAR */}
        <aside className="article-sidebar" aria-label="Info dan berita terkait">
          
          <section className="article-contact">
            <div className="article-contact__mark"><Building2 aria-hidden="true" size={22} /></div>
            <h3>Punya Info Kegiatan RT?</h3>
            <p>
              Sampaikan agenda kerja bakti atau kegiatan warga ke pengurus RW 05 untuk dimuat di warta portal resmi.
            </p>
            <a 
              href={`https://wa.me/${NOMOR_WHATSAPP_PENGURUS}?text=${encodeURIComponent("Halo Pengurus Sapen, saya ingin mengirimkan informasi kegiatan warga.")}`}
              target="_blank" 
              rel="noreferrer"
              className="article-button article-button--primary"
            >
              Kirim Info via WhatsApp
            </a>
          </section>

          <section className="article-related">
            <h3>
              Berita Terkait Lainnya
            </h3>

            <div className="article-related__list">
              {beritaLainnya.map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.id}`}
                  className="article-related__item"
                >
                  <img 
                    src={item.image || DEFAULT_NEWS_IMAGE} 
                    alt={item.title} 
                    className="article-related__image"
                    onError={(e) => { e.currentTarget.src = DEFAULT_NEWS_IMAGE; }}
                  />
                  <div>
                    <h4>
                      {item.title}
                    </h4>
                    <span>
                      {item.date || "Terbaru"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </aside>
      </main>

      {/* FOOTER */}
      <footer className="article-footer">
        <div>© 2026 Portal Warga Kampung Sapen Yogyakarta • RT 01, 02, 03 RW 05 Demangan.</div>
      </footer>
    </div>
  );
}
