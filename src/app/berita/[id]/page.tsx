"use client";

import "./article.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock3 } from "lucide-react";
import { INITIAL_BERITA, getBeritaById } from "@/data/beritaData";

interface NewsItem {
  id: number | string;
  title: string;
  excerpt?: string;
  content?: string[] | string;
  category?: string;
  date?: string;
  author?: string;
  read_time?: string;
  readTime?: string;
  image?: string;
  caption?: string;
}

const DEFAULT_IMAGE = "/sapen.jpg";

export default function HalamanBacaBeritaWarga() {
  const params = useParams();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [related, setRelated] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      const id = String(params.id || "");
      try {
        const response = await fetch("/api/berita", { cache: "no-store" });
        const result = await response.json();
        if (!response.ok || !Array.isArray(result.data)) throw new Error("Berita tidak dapat dimuat.");
        const stories = result.data as NewsItem[];
        const selected = stories.find((story) => String(story.id) === id) || getBeritaById(id) || null;
        setArticle(selected);
        setRelated(stories.filter((story) => String(story.id) !== id).slice(0, 3));
      } catch {
        const fallback = getBeritaById(id) as NewsItem | undefined;
        setArticle(fallback || null);
        setRelated(INITIAL_BERITA.filter((story) => String(story.id) !== id).slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [params.id]);

  if (loading) {
    return <main className="article-state" role="status">Memuat berita Kampung Sapen…</main>;
  }
  if (!article) {
    return (
      <main className="article-state">
        <h1>Berita tidak ditemukan</h1>
        <Link href="/" className="article-back"><ArrowLeft size={18} aria-hidden="true" /> Kembali ke beranda</Link>
      </main>
    );
  }

  const paragraphs = Array.isArray(article.content) ? article.content : (article.content || "").split("\n\n").filter(Boolean);

  return (
    <div className="article-page">
      <header className="article-header">
        <Link href="/" className="article-back"><ArrowLeft size={18} aria-hidden="true" /> Kembali ke berita</Link>
        <span>Warta Sapen</span>
      </header>
      <main className="article-main">
        <article className="article-story">
          <div className="article-meta"><b>{article.category || "Berita Warga"}</b><time>{article.date || "Terbaru"}</time></div>
          <h1>{article.title}</h1>
          <div className="article-byline">
            <span>{article.author || "Redaksi Warta Sapen"}</span>
            <span><Clock3 size={16} aria-hidden="true" /> {article.read_time || article.readTime || "2 min"} baca</span>
          </div>
          <figure className="article-cover">
            <img src={article.image || DEFAULT_IMAGE} alt={article.title} onError={(event) => { event.currentTarget.src = DEFAULT_IMAGE; }} />
            {article.caption && <figcaption>{article.caption}</figcaption>}
          </figure>
          {article.excerpt && paragraphs.length === 0 && <p className="article-summary">{article.excerpt}</p>}
          <div className="article-content">
            {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
        </article>

        {related.length > 0 && (
          <section className="article-related" aria-labelledby="article-related-title">
            <h2 id="article-related-title">Berita terkait</h2>
            <div className="article-related__list">
              {related.map((story) => (
                <Link href={`/berita/${story.id}`} className="article-related__item" key={story.id}>
                  <img src={story.image || DEFAULT_IMAGE} alt="" loading="lazy" onError={(event) => { event.currentTarget.src = DEFAULT_IMAGE; }} />
                  <span className="article-related__copy">
                    <b>{story.title}</b>
                    <span className="article-related__meta"><span>{story.category || "Berita Warga"}</span><time>{story.date || "Terbaru"}</time></span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <footer className="article-footer">Portal Warga Kampung Sapen · Demangan, Gondokusuman, Yogyakarta</footer>
    </div>
  );
}
