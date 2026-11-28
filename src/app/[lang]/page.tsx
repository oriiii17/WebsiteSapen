"use client";

import "./news-portal.css";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight, LogIn, LogOut, Mail, MapPin, Menu, Newspaper, Phone, RotateCcw, Search, Sparkles, X } from "lucide-react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { WaveDivider } from "@/components/wave-divider";
import { ALL_CATEGORY, ANNOUNCEMENT_CATEGORY, categoryLabel, dictionaries, formatNewsDate, formatNumber, isLocale } from "@/lib/i18n";
import { site } from "@/config/site";

interface NewsItem {
  id: number | string;
  title: string;
  excerpt?: string;
  content?: string[] | string;
  category?: string;
  date?: string;
  author?: string;
  image?: string;
  translationFallback?: boolean;
}

interface AdminUser {
  nama: string;
  role: string;
}

const DEFAULT_IMAGE = "/sapen.jpg";
const PAGE_SIZE = 9;

function newsTimestamp(value?: string) {
  const timestamp = Date.parse(value || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export default function PortalKampungSapen() {
  const params = useParams<{ lang: string }>();
  const locale = isLocale(params.lang) ? params.lang : "id";
  const t = dictionaries[locale];
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [heroIndex, setHeroIndex] = useState(0);
  const [sliderRevision, setSliderRevision] = useState(0);
  const [sliderHovered, setSliderHovered] = useState(false);
  const [sliderFocused, setSliderFocused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const categoryNavRef = useRef<HTMLElement>(null);
  const loginTriggerRef = useRef<HTMLButtonElement>(null);
  const loginUsernameRef = useRef<HTMLInputElement>(null);
  const loginDialogRef = useRef<HTMLElement>(null);
  const [categoryOverflow, setCategoryOverflow] = useState(false);
  const [categoryHasMore, setCategoryHasMore] = useState(false);

  const loadNews = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await fetch(`/api/berita?lang=${locale}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(t.loadError);
      setNews(Array.isArray(result.data) ? result.data : []);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [locale, t.loadError]);

  useEffect(() => {
    void loadNews();

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
  }, [loadNews]);

  const categories = useMemo(() => {
    const values = Array.from(new Set(news.map((item) => item.category?.trim()).filter(Boolean) as string[]));
    return [ALL_CATEGORY, ...Array.from(new Set([ANNOUNCEMENT_CATEGORY, ...values]))];
  }, [news]);

  const newestFirst = useMemo(() => [...news].sort((left, right) => newsTimestamp(right.date) - newsTimestamp(left.date)), [news]);
  const heroStories = newestFirst.slice(0, 5);
  const heroStory = heroStories[heroIndex] || heroStories[0];

  useEffect(() => {
    if (heroIndex >= heroStories.length) setHeroIndex(0);
  }, [heroIndex, heroStories.length]);

  useEffect(() => {
    if (sliderHovered || sliderFocused || heroStories.length < 2) return;
    const timer = window.setInterval(() => setHeroIndex((index) => (index + 1) % heroStories.length), 6000);
    return () => window.clearInterval(timer);
  }, [heroStories.length, sliderHovered, sliderFocused, sliderRevision]);

  const moveHero = (direction: -1 | 1) => {
    if (heroStories.length < 2) return;
    setHeroIndex((index) => (index + direction + heroStories.length) % heroStories.length);
    setSliderRevision((revision) => revision + 1);
  };

  const selectHero = (index: number) => {
    setHeroIndex(index);
    setSliderRevision((revision) => revision + 1);
  };

  const filteredNews = useMemo(() => {
    const localeTag = locale === "en" ? "en-US" : "id-ID";
    const needle = query.trim().toLocaleLowerCase(localeTag);
    const results = newestFirst.filter((item) => {
      const categoryMatch = activeCategory === ALL_CATEGORY || item.category?.trim() === activeCategory;
      const searchMatch = !needle || [item.title, item.excerpt]
        .some((value) => value?.toLocaleLowerCase(localeTag).includes(needle));
      return categoryMatch && searchMatch;
    });
    return sortOrder === "newest" ? results : results.reverse();
  }, [newestFirst, query, activeCategory, locale, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(filteredNews.length / PAGE_SIZE));
  const pageStories = filteredNews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const visiblePageNumbers = Array.from({ length: pageCount }, (_, index) => index + 1)
    .filter((pageNumber) => pageNumber === 1 || pageNumber === pageCount || Math.abs(pageNumber - page) <= 1);

  const updateCategoryOverflow = useCallback(() => {
    const nav = categoryNavRef.current;
    const overflow = Boolean(nav && nav.scrollWidth > nav.clientWidth + 1);
    setCategoryOverflow(overflow);
    setCategoryHasMore(Boolean(nav && nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 1));
  }, []);

  useEffect(() => {
    const nav = categoryNavRef.current;
    if (!nav) return;
    updateCategoryOverflow();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateCategoryOverflow);
    observer?.observe(nav);
    window.addEventListener("resize", updateCategoryOverflow);
    nav.addEventListener("scroll", updateCategoryOverflow, { passive: true });
    return () => {
      observer?.disconnect();
      nav.removeEventListener("scroll", updateCategoryOverflow);
      window.removeEventListener("resize", updateCategoryOverflow);
    };
  }, [categories, updateCategoryOverflow]);

  const closeLogin = useCallback(() => {
    flushSync(() => setShowLogin(false));
    window.setTimeout(() => {
      const trigger = loginTriggerRef.current;
      const fallback = document.querySelector<HTMLElement>(".news-admin-bar a")
        || document.querySelector<HTMLElement>(".news-brand");
      (trigger?.isConnected ? trigger : fallback)?.focus();
    }, 50);
  }, []);

  useEffect(() => {
    if (!showLogin) return;
    loginUsernameRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLogin();
        return;
      }
      if (event.key !== "Tab" || !loginDialogRef.current) return;
      const focusable = loginDialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showLogin, closeLogin]);

  const resetFilters = () => {
    setQuery("");
    setActiveCategory(ALL_CATEGORY);
    setPage(1);
  };

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
      if (!response.ok || !result.success || !result.data) throw new Error(t.loginInvalid);
      const user = { nama: result.data.nama, role: result.data.role };
      setAdminUser(user);
      localStorage.setItem("sapen_admin_data", JSON.stringify(user));
      setPin("");
      closeLogin();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : t.loginFailed);
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
      <header className="news-header" aria-hidden={showLogin}>
        <div className="news-topbar">
          <div className="news-header__inner">
            <Link className="news-brand" href={`/${locale}`} aria-label={`${t.footerIdentity}, ${t.home}`}>
              <Image className="news-brand__logo" src="/images/sapen-logo-2x.png" width={225} height={88} alt={t.logoAlt} priority />
              <span className="news-brand__copy"><strong>{t.brand}</strong><small>{t.brandSubtitle}</small></span>
            </Link>
            <label className="news-search news-search--header">
              <Search size={19} aria-hidden="true" />
              <span className="sr-only">{t.searchLabel}</span>
              <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={t.searchPlaceholder} aria-label={t.searchPlaceholder} />
            </label>
            <div className="news-header__controls">
              <LocaleSwitcher locale={locale} label={t.localeLabel} />
              <button className="news-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="news-primary-nav" aria-label={menuOpen ? t.closeMenu : t.openMenu} onClick={() => setMenuOpen((open) => !open)}>
                {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
        <nav id="news-primary-nav" className={`news-nav${menuOpen ? " is-open" : ""}`} aria-label={t.primaryNavigation}>
          <div className="news-nav__inner">
            <Link className="is-active" aria-current="page" href={`/${locale}`} onClick={() => setMenuOpen(false)}>{t.homeNav}</Link>
            <a href="#berita-terkini" onClick={() => setMenuOpen(false)}>{t.newsNav}</a>
            <Link href={`/${locale}/wayang-uwuh`} onClick={() => setMenuOpen(false)}>{t.homeWayangCardTitle}</Link>
          </div>
        </nav>
      </header>

      {adminUser && (
        <div className="news-admin-bar" aria-hidden={showLogin}>
          <span>{t.adminSignedIn} · {adminUser.nama}</span>
          <div>
            <Link href="/admin/berita">{t.manageNews}</Link>
            <button type="button" onClick={logout}><LogOut size={15} aria-hidden="true" /> {t.logout}</button>
          </div>
        </div>
      )}

      <section className="home-hero" aria-label={t.heroSliderLabel} aria-hidden={showLogin} onMouseEnter={() => setSliderHovered(true)} onMouseLeave={() => setSliderHovered(false)} onFocusCapture={() => setSliderFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setSliderFocused(false); }} onTouchStart={(event) => { touchStartXRef.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => { const start = touchStartXRef.current; const end = event.changedTouches[0]?.clientX; touchStartXRef.current = null; if (start !== null && end !== undefined && Math.abs(end - start) > 48) moveHero(end < start ? 1 : -1); }}>
        {heroStory ? (
          <>
            <Image className="home-hero__image" src={heroStory.image || DEFAULT_IMAGE} alt="" fill priority sizes="100vw" quality={85} unoptimized onError={(event) => { event.currentTarget.src = DEFAULT_IMAGE; }} />
            <div className="home-hero__shade" />
            <div className="home-hero__content">
              <span className="home-hero__eyebrow">{t.homeHeroLabel}</span>
              <div className="home-hero__meta"><span>{categoryLabel(heroStory.category, locale, t)}</span><time>{formatNewsDate(heroStory.date, locale)}</time></div>
              <h1>{heroStory.title}<span className="sr-only"> — {t.homeHeading}</span></h1>
              <Link className="home-hero__cta" href={`/${locale}/berita/${heroStory.id}`}>
                <strong>{t.homeReadMore}</strong><span><ArrowRight aria-hidden="true" size={18} /></span>
              </Link>
            </div>
            {heroStories.length > 1 && (
              <>
                <button className="home-hero__arrow home-hero__arrow--prev" type="button" aria-label={t.homePreviousStory} onClick={() => moveHero(-1)}><ChevronLeft aria-hidden="true" size={23} strokeWidth={1.7} /></button>
                <button className="home-hero__arrow home-hero__arrow--next" type="button" aria-label={t.homeNextStory} onClick={() => moveHero(1)}><ChevronRight aria-hidden="true" size={23} strokeWidth={1.7} /></button>
                <div className="home-hero__dots" role="group" aria-label={t.heroSliderLabel}>
                  {heroStories.map((story, index) => <button key={story.id} type="button" className={index === heroIndex ? "is-active" : ""} aria-label={t.homeSlidePosition.replace("{current}", formatNumber(index + 1, locale)).replace("{total}", formatNumber(heroStories.length, locale))} aria-current={index === heroIndex ? "true" : undefined} onClick={() => selectHero(index)} />)}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <Image className="home-hero__image" src={DEFAULT_IMAGE} alt="" fill priority sizes="100vw" quality={85} />
            <div className="home-hero__shade" />
            <div className="home-hero__empty">
              <span className="home-hero__eyebrow">{t.homeHeroLabel}</span>
              <h1>{t.homeHeroEmptyTitle}</h1>
              <p>{t.homeHeroEmptyText}</p>
            </div>
          </>
        )}
      </section>

      <WaveDivider className="news-wave news-wave--content" />
      <main className="news-main" aria-hidden={showLogin}>
        <section id="berita-terkini" className="news-section" aria-labelledby="news-section-title">
          <div className="news-section__heading">
            <span className="news-section__eyebrow">{t.homeSectionLabel}</span>
            <h2 id="news-section-title">{t.latestNews}</h2>
          </div>
        <div className="news-categories-shell">
          <nav ref={categoryNavRef} className="news-categories" aria-label={t.categoryFilter}>
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={activeCategory === category ? "is-active" : ""}
                aria-pressed={activeCategory === category}
                onClick={() => { setActiveCategory(category); setPage(1); }}
              >
                {category === ALL_CATEGORY ? t.categoryAll : categoryLabel(category, locale, t)}
              </button>
            ))}
          </nav>
          {categoryOverflow && (
            <button
              type="button"
              className="news-categories-next"
              aria-label={t.categoryNext}
              title={t.categoryNextTitle}
              disabled={!categoryHasMore}
              onClick={() => {
                const nav = categoryNavRef.current;
                nav?.scrollBy({
                  left: (nav?.clientWidth || 0) * 0.75,
                  behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                });
              }}
            >
              <span>{t.categoryNextButton}</span><ChevronRight size={17} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="news-toolbar">
          <label className="news-search news-search--section">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">{t.newsSearchLabel}</span>
            <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={t.searchPlaceholder} aria-label={t.newsSearchLabel} />
          </label>
          <label className="news-sort">
            <span>{t.sortNewsLabel}</span>
            <select value={sortOrder} onChange={(event) => { setSortOrder(event.target.value as "newest" | "oldest"); setPage(1); }} aria-label={t.sortNewsLabel}>
              <option value="newest">{t.sortNewest}</option>
              <option value="oldest">{t.sortOldest}</option>
            </select>
          </label>
        </div>

        <section className="news-feed" aria-label={t.feedLabel} aria-live="polite">
          {loading ? (
            <p className="news-state" role="status">{t.loadingNews}</p>
          ) : loadError ? (
            <div className="news-state news-state--error" role="alert">
              <p>{t.loadError}</p>
              <button type="button" onClick={loadNews}><RotateCcw size={17} aria-hidden="true" /> {t.retry}</button>
            </div>
          ) : filteredNews.length > 0 ? (
            <>
              <div className="news-card-grid">
                {pageStories.map((story) => (
                  <article className="news-card" key={story.id}>
                    <Link className="news-card__link" href={`/${locale}/berita/${story.id}`}>
                      <span className="news-card__media">
                        <img src={story.image || DEFAULT_IMAGE} alt="" loading="lazy" onError={(event) => { event.currentTarget.src = DEFAULT_IMAGE; }} />
                        <span className="news-card__category">{categoryLabel(story.category, locale, t)}</span>
                        <time className="news-card__date" dateTime={story.date || undefined}>{formatNewsDate(story.date, locale)}</time>
                      </span>
                      <span className="news-card__copy">
                        {locale === "en" && story.translationFallback && <span className="news-translation-note">{t.englishFallback}</span>}
                        <strong>{story.title}</strong>
                        {story.excerpt && <span className="news-card__excerpt">{story.excerpt}</span>}
                      </span>
                    <span className="news-card__footer">
                      <span className="news-card__author"><span aria-hidden="true">{(story.author || t.redaction).trim().charAt(0).toLocaleUpperCase(locale)}</span>{story.author || t.redaction}</span>
                      <span className="news-card__read">{t.readNews}<ArrowRight aria-hidden="true" size={15} /></span>
                    </span>
                    </Link>
                  </article>
                ))}
              </div>
              <nav className="news-pagination" aria-label={t.paginationLabel}>
                <span className="news-pagination__status">{t.paginationStatus.replace("{page}", formatNumber(page, locale)).replace("{pages}", formatNumber(pageCount, locale)).replace("{total}", formatNumber(filteredNews.length, locale))}</span>
                <div className="news-pagination__controls">
                  <button type="button" aria-label={t.previousPage} disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft aria-hidden="true" /></button>
                  {visiblePageNumbers.map((pageNumber, index) => <Fragment key={pageNumber}>
                    {index > 0 && pageNumber - visiblePageNumbers[index - 1] > 1 && <span className="news-pagination__ellipsis" aria-hidden="true">…</span>}
                    <button type="button" className={pageNumber === page ? "is-active" : ""} aria-current={pageNumber === page ? "page" : undefined} onClick={() => setPage(pageNumber)}>{formatNumber(pageNumber, locale)}</button>
                  </Fragment>)}
                  <button type="button" aria-label={t.nextPage} disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}><ChevronRight aria-hidden="true" /></button>
                </div>
              </nav>
            </>
          ) : (
            <div className="news-empty">
              <span className="news-empty__icon"><Newspaper aria-hidden="true" size={25} /></span>
              <h3>{query.trim() ? t.searchEmptyTitle : activeCategory !== ALL_CATEGORY ? t.categoryEmptyTitle : t.emptyNewsTitle}</h3>
              <p>{query.trim()
                ? t.searchEmpty.replace("{query}", query.trim())
                : activeCategory !== ALL_CATEGORY
                  ? t.categoryEmpty.replace("{category}", categoryLabel(activeCategory, locale, t))
                  : t.emptyNewsMessage}</p>
              {(query.trim() || activeCategory !== ALL_CATEGORY) && (
                <button className="news-empty__reset" type="button" onClick={resetFilters}>{t.showAll}</button>
              )}
            </div>
          )}
        </section>
        </section>
      </main>

      <WaveDivider className="news-wave news-wave--dark" />
      <section className="home-wayang" aria-hidden={showLogin}>
        <div className="home-wayang__inner">
          <Image src="/images/wayang-uwuh/galeri-pigura.webp" width={1200} height={896} sizes="(max-width: 680px) 100vw, 42vw" alt={t.homeWayangCardAlt} />
          <div className="home-wayang__copy">
            <span className="home-wayang__icon"><Sparkles aria-hidden="true" size={23} /></span>
            <span className="home-wayang__eyebrow">{t.homeWayangCardTitle}</span>
            <h2>{t.homeWayangSectionTitle}</h2>
            <p>{t.homeWayangSectionText}</p>
            <Link href={`/${locale}/wayang-uwuh`}>{t.homeWayangCardLink}<span><ArrowRight aria-hidden="true" size={17} /></span></Link>
          </div>
        </div>
      </section>

      <footer className={`news-footer${showLogin ? " is-login-open" : ""}`} aria-hidden={showLogin}>
        <div className="news-footer__inner">
          <div className="news-footer__identity">
            <Link className="news-brand" href={`/${locale}`} aria-label={`${t.footerIdentity}, ${t.home}`}>
              <Image className="news-brand__logo" src="/images/sapen-logo-2x.png" width={225} height={88} alt={t.logoAlt} />
              <span className="news-brand__copy"><strong>{t.brand}</strong><small>{t.brandSubtitle}</small></span>
            </Link>
            <p><span><MapPin aria-hidden="true" size={16} /></span>{site.address[locale]}</p>
          </div>
          <div className="news-footer__column">
            <strong>{t.homeFooterLinks}</strong>
            <Link href={`/${locale}`}>{t.homeNav}</Link>
            <a href="#berita-terkini">{t.newsNav}</a>
            <Link href={`/${locale}/wayang-uwuh`}>{t.homeWayangCardTitle}</Link>
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin aria-hidden="true" size={16} />{t.viewLocation}</a>
          </div>
          <div className="news-footer__column news-footer__contact">
            <strong>{t.homeFooterContact}</strong>
            <a href={`mailto:${site.contacts.email}`}><span><Mail aria-hidden="true" size={16} /></span>{site.contacts.email}</a>
            <a href={`tel:${site.contacts.phone}`}><span><Phone aria-hidden="true" size={16} /></span>{site.contacts.phoneDisplay[locale]}</a>
            {!adminUser && <button id="login-admin-trigger" ref={loginTriggerRef} type="button" onClick={() => { setLoginError(""); setShowLogin(true); }}><LogIn size={15} aria-hidden="true" /> {t.loginAdmin}</button>}
          </div>
        </div>
        <div className="news-footer__bottom"><span>© {new Date().getFullYear()} {t.homeCopyright}</span></div>
      </footer>

      {showLogin && (
        <div className="news-login-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) closeLogin(); }}>
          <section ref={loginDialogRef} className="news-login" role="dialog" aria-modal="true" aria-labelledby="news-login-title" aria-describedby="news-login-description">
            <button className="news-login__close" type="button" aria-label={t.closeLogin} onClick={closeLogin}><X size={21} /></button>
            <h2 id="news-login-title">{t.loginAdmin}</h2>
            <p id="news-login-description">{t.loginDescription}</p>
            <form onSubmit={submitLogin}>
              <label htmlFor="news-admin-username">{t.username}</label>
              <input ref={loginUsernameRef} id="news-admin-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
              <label htmlFor="news-admin-pin">{t.pin}</label>
              <input id="news-admin-pin" type="password" autoComplete="current-password" value={pin} onChange={(event) => setPin(event.target.value)} required />
              {loginError && <p className="news-login__error" role="alert">{loginError}</p>}
              <button className="news-login__submit" type="submit" disabled={loginLoading}>{loginLoading ? t.loginChecking : t.login}</button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
