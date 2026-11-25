"use client";

import "../portal.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays } from "lucide-react";
import { DAFTAR_BERITA_SAPEN } from "@/data/beritaData";

export default function BeritaWargaPage() {
  const [stories, setStories] = useState<any[]>(DAFTAR_BERITA_SAPEN as any[]);

  useEffect(() => {
    fetch("/api/berita")
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        if (result?.success && Array.isArray(result.data) && result.data.length) setStories(result.data);
      })
      .catch(() => undefined);
  }, []);

  const [featured, ...moreStories] = stories;

  return (
    <main className="standalone-page">
      <header className="standalone-header">
        <Link href="/" className="standalone-back"><ArrowLeft size={18} aria-hidden="true" /> Portal Warga Sapen</Link>
        <span>Warta dan kabar warga</span>
      </header>
      <section className="standalone-content" id="berita">
        <p className="standalone-eyebrow">Kampung Sapen · Yogyakarta</p>
        <h1>Berita Warga</h1>
        <p className="standalone-lead">Kabar kegiatan, pengumuman, dan cerita kebersamaan warga Kampung Sapen.</p>
        {featured && (
          <Link href={`/berita/${featured.id}`} className="sapen-featured-news standalone-featured">
            <img src={featured.image || "/sapen.jpg"} alt="" />
            <div className="sapen-featured-news__body">
              <span className="news-category-label">{featured.category || "Berita Utama"}</span>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <span className="news-date"><CalendarDays size={15} aria-hidden="true" /> {featured.date || "Terbaru"}</span>
              <span className="news-read-more">Baca selengkapnya <ArrowUpRight size={17} aria-hidden="true" /></span>
            </div>
          </Link>
        )}
        <div className="sapen-news-grid standalone-news-grid">
          {moreStories.map((story, index) => (
            <Link key={story.id ?? index} href={`/berita/${story.id}`} className="news-list-item">
              <img src={story.image || "/sapen.jpg"} alt="" />
              <div>
                <span className="news-category-label">{story.category || "Berita Warga"}</span>
                <h2>{story.title}</h2>
                <p>{story.excerpt}</p>
                <span className="news-date"><CalendarDays size={14} aria-hidden="true" /> {story.date || "Terbaru"}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
