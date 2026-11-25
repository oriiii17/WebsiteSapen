"use client";

import "./news-portal.css";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Building2, LogIn, LogOut, Search, X } from "lucide-react";

interface NewsItem {
  id: number | string;
  title: string;
  excerpt?: string;
  content?: string[] | string;
  category?: string;
  date?: string;
  author?: string;
  image?: string;
}

interface AdminUser {
  nama: string;
  role: string;
}

const DEFAULT_IMAGE = "/sapen.jpg";
const PAGE_SIZE = 10;

export default function PortalKampungSapen() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    fetch("/api/berita", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error("Gagal memuat berita.");
        setNews(Array.isArray(result.data) ? result.data : []);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));

    fetch("/api/auth/admin-session", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          localStorage.removeItem("sapen_admin_data");
          return;
        }
        const result = await response.json();
        if (result.success && result.data) {
          const user = { nama: result.data.nama, role: result.data.role };
          setAdminUser(user);
          localStorage.setItem("sapen_admin_data", JSON.stringify(user));
        }
      })
      .catch(() => setAdminUser(null));
  }, []);

  const categories = useMemo(() => {
    const values = Array.from(new Set(news.map((item) => item.category?.trim()).filter(Boolean) as string[]));
    return ["Semua", ...Array.from(new Set(["Pengumuman", ...values]))];
  }, [news]);

  const filteredNews = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("id-ID");
    return news.filter((item) => {
      const categoryMatch = activeCategory === "Semua" || item.category?.trim() === activeCategory;
      const bodyText = Array.isArray(item.content) ? item.content.join(" ") : item.content;
      const searchMatch = !needle || [item.title, item.excerpt, item.category, item.author, item.date]
        .concat(bodyText || "")
        .some((value) => value?.toLocaleLowerCase("id-ID").includes(needle));
      return categoryMatch && searchMatch;
    });
  }, [news, query, activeCategory]);

  const featured = filteredNews[0];
  const visibleStories = filteredNews.slice(1, visibleCount + 1);
  const hasMore = filteredNews.length > visibleCount + 1;

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, pin }),
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.data) throw new Error(result.message || "Username atau PIN Admin salah.");
      const user = { nama: result.data.nama, role: result.data.role };
      setAdminUser(user);
      localStorage.setItem("sapen_admin_data", JSON.stringify(user));
      setPin("");
      setShowLogin(false);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Login belum berhasil. Silakan coba lagi.");
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/admin-logout", { method: "POST" });
    localStorage.removeItem("sapen_admin_data");
    setAdminUser(null);
  };

  return (
    <div className="news-home">
      <header className="news-header">
        <div className="news-header__inner">
          <Link className="news-brand" href="/" aria-label="Portal Warga Kampung Sapen, beranda">
            <span className="news-brand__mark"><Building2 aria-hidden="true" size={22} /></span>
            <span className="news-brand__copy"><strong>Warta Sapen</strong><small>Kampung Sapen · Yogyakarta</small></span>
          </Link>
          <label className="news-search">
            <Search size={19} aria-hidden="true" />
            <span className="sr-only">Cari berita</span>
            <input
              type="search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setVisibleCount(PAGE_SIZE); }}
              placeholder="Cari berita atau pengumuman"
              aria-label="Cari berita atau pengumuman"
            />
          </label>
        </div>
      </header>

      {adminUser && (
        <div className="news-admin-bar">
          <span>Masuk sebagai Admin · {adminUser.nama}</span>
          <div>
            <Link href="/admin/berita">Kelola berita</Link>
            <button type="button" onClick={logout}><LogOut size={15} aria-hidden="true" /> Keluar</button>
          </div>
        </div>
      )}

      <main className="news-main">
        <nav className="news-categories" aria-label="Filter kategori berita">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={activeCategory === category ? "is-active" : ""}
              aria-pressed={activeCategory === category}
              onClick={() => { setActiveCategory(category); setVisibleCount(PAGE_SIZE); }}
            >
              {category}
            </button>
          ))}
        </nav>

        <section className="news-feed" aria-label="Berita Kampung Sapen" aria-live="polite">
          {loading ? (
            <p className="news-state" role="status">Memuat berita Kampung Sapen…</p>
          ) : loadError ? (
            <p className="news-state" role="alert">Berita belum dapat dimuat. Periksa koneksi lalu muat ulang halaman.</p>
          ) : featured ? (
            <>
              <Link href={`/berita/${featured.id}`} className="news-featured">
                <img src={featured.image || DEFAULT_IMAGE} alt="" onError={(event) => { event.currentTarget.src = DEFAULT_IMAGE; }} />
                <div className="news-featured__body">
                  <span className="news-meta"><b>{featured.category || "Berita Warga"}</b><time>{featured.date || "Terbaru"}</time></span>
                  <h1>{featured.title}</h1>
                  <span className="news-featured__link">Baca berita <span aria-hidden="true">→</span></span>
                </div>
              </Link>

              <section className="news-list" aria-label="Berita lainnya">
                <h2>Berita terbaru</h2>
                {visibleStories.length > 0 ? visibleStories.map((story) => (
                  <Link className="news-row" href={`/berita/${story.id}`} key={story.id}>
                    <img src={story.image || DEFAULT_IMAGE} alt="" loading="lazy" onError={(event) => { event.currentTarget.src = DEFAULT_IMAGE; }} />
                    <span className="news-row__copy">
                      <strong>{story.title}</strong>
                      <span className="news-meta"><b>{story.category || "Berita Warga"}</b><time>{story.date || "Terbaru"}</time></span>
                    </span>
                  </Link>
                )) : <p className="news-list__empty">Belum ada berita lainnya.</p>}
                {hasMore && (
                  <button className="news-load-more" type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                    Muat 10 berita lagi
                  </button>
                )}
              </section>
            </>
          ) : (
            <div className="news-empty"><h1>Berita tidak ditemukan</h1><p>{query.trim() ? `Tidak ada berita yang cocok dengan '${query.trim()}'.` : "Belum ada berita lainnya."}</p></div>
          )}
        </section>
      </main>

      {!showLogin && <footer className="news-footer">
        <div className="news-footer__inner">
          <div><strong>Portal Warga Kampung Sapen</strong><p>Demangan, Kemantren Gondokusuman, Kota Yogyakarta</p></div>
          <div className="news-footer__links">
            <a href="tel:0274556652736">(0274) 5566-SAPEN</a>
            <a href="mailto:sekretariat@kampungsapen-jogja.id">Email sekretariat</a>
            <a href="https://www.google.com/maps?q=-7.786500,110.393200" target="_blank" rel="noreferrer">Lihat lokasi</a>
            {!adminUser && <button type="button" onClick={() => { setLoginError(""); setShowLogin(true); }}><LogIn size={14} aria-hidden="true" /> Login Admin</button>}
          </div>
        </div>
      </footer>}

      {showLogin && (
        <div className="news-login-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowLogin(false); }}>
          <section className="news-login" role="dialog" aria-modal="true" aria-labelledby="news-login-title">
            <button className="news-login__close" type="button" aria-label="Tutup login" onClick={() => setShowLogin(false)}><X size={21} /></button>
            <h2 id="news-login-title">Login Admin</h2>
            <p>Masuk untuk mengelola berita Kampung Sapen.</p>
            <form onSubmit={submitLogin}>
              <label htmlFor="news-admin-username">Username Admin</label>
              <input id="news-admin-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
              <label htmlFor="news-admin-pin">PIN Admin</label>
              <input id="news-admin-pin" type="password" autoComplete="current-password" value={pin} onChange={(event) => setPin(event.target.value)} required />
              {loginError && <p className="news-login__error" role="alert">{loginError}</p>}
              <button className="news-login__submit" type="submit" disabled={loginLoading}>{loginLoading ? "Memeriksa…" : "Masuk"}</button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
