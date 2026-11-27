"use client";

import "./article.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock3 } from "lucide-react";
import { INITIAL_BERITA, getBeritaById } from "@/data/beritaData";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { WaveDivider } from "@/components/wave-divider";
import { categoryLabel, dictionaries, formatNewsDate, formatReadTime, isLocale } from "@/lib/i18n";
import { site } from "@/config/site";

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
  translationFallback?: boolean;
}

const DEFAULT_IMAGE = "/sapen.jpg";

export default function HalamanBacaBeritaWarga() {
  const params = useParams();
  const locale = isLocale(String(params.lang || "")) ? String(params.lang) as "id" | "en" : "id";
  const t = dictionaries[locale];
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [related, setRelated] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      const id = String(params.id || "");
      try {
        const response = await fetch(`/api/berita?lang=${locale}`, { cache: "no-store" });
        const result = await response.json();
        if (!response.ok || !Array.isArray(result.data)) throw new Error(t.loadError);
        const stories = result.data as NewsItem[];
        const selected = stories.find((story) => String(story.id) === id) || getBeritaById(id) || null;
        setArticle(selected);
        setRelated(stories.filter((story) => String(story.id) !== id).slice(0, 3));
      } catch {
        const fallback = getBeritaById(id) as NewsItem | undefined;
        setArticle(fallback ? { ...fallback, translationFallback: locale === "en" } : null);
        setRelated(INITIAL_BERITA.filter((story) => String(story.id) !== id).slice(0, 3).map((story) => ({ ...story, translationFallback: locale === "en" })));
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [params.id, locale, t.loadError]);

  const paragraphs = article
    ? Array.isArray(article.content)
      ? article.content
      : (article.content || "").split("\n\n").filter(Boolean)
    : [];

  return (
    <div className="article-page">
      <header className="article-header">
        <Link href={`/${locale}`} className="article-back"><ArrowLeft size={18} aria-hidden="true" /> {t.backToNews}</Link>
        <div className="article-header__identity"><span>{t.brand}</span><LocaleSwitcher locale={locale} label={t.localeLabel} /></div>
      </header>
      {!loading && article && (
        <section className="article-title">
          <div className="article-title__inner">
            {locale === "en" && article.translationFallback && <p className="article-translation-note">{t.englishFallback}</p>}
            <div className="article-meta"><b>{categoryLabel(article.category, locale, t)}</b><time>{formatNewsDate(article.date, locale)}</time></div>
            <h1>{article.title}</h1>
            <div className="article-byline">
              <span>{article.author || t.redaction}</span>
              <span><Clock3 size={16} aria-hidden="true" /> {formatReadTime(article.read_time || article.readTime, locale, t)}</span>
            </div>
          </div>
        </section>
      )}
      {!loading && article && <div className="article-title-band" aria-hidden="true" />}
      {!loading && article && <WaveDivider className="article-wave article-wave--reading" />}
      {loading ? (
        <main className="article-main article-state" role="status">{t.loadingNews}</main>
      ) : !article ? (
        <main className="article-main article-state">
          <h1>{t.notFound}</h1>
          <Link href={`/${locale}`} className="article-back"><ArrowLeft size={18} aria-hidden="true" /> {t.backHome}</Link>
        </main>
      ) : (
        <main className="article-main">
          <article className="article-story">
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
              <h2 id="article-related-title">{t.relatedNews}</h2>
              <div className="article-related__list">
                {related.map((story) => (
                  <Link href={`/${locale}/berita/${story.id}`} className="article-related__item" key={story.id}>
                    <img src={story.image || DEFAULT_IMAGE} alt="" loading="lazy" onError={(event) => { event.currentTarget.src = DEFAULT_IMAGE; }} />
                    <span className="article-related__copy">
                        <span className="article-related__meta"><b>{categoryLabel(story.category, locale, t)}</b><time>{formatNewsDate(story.date, locale)}</time></span>
                        <strong>{story.title}</strong>
                        {story.excerpt && <span className="article-related__excerpt">{story.excerpt}</span>}
                        {locale === "en" && story.translationFallback && <span className="article-translation-note">{t.englishFallback}</span>}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>
      )}
      <WaveDivider className="article-wave article-wave--footer" />
      <footer className="article-footer"><span>{t.footerIdentity} · {t.address}</span><span><a href={`tel:${site.contacts.phone}`}>{site.contacts.phoneDisplay[locale]}</a> · <a href={`mailto:${site.contacts.email}`}>{site.contacts.email}</a></span></footer>
    </div>
  );
}
