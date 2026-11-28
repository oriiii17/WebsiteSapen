import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin, MessageCircle, ShoppingBag } from "lucide-react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { WayangGallery } from "@/components/wayang-gallery";
import { WaveDivider } from "@/components/wave-divider";
import { dictionaries, isLocale } from "@/lib/i18n";
import { wayangUwuhLinks } from "@/config/wayang-uwuh";
import "./wayang-uwuh.css";

type PageParams = { lang: string };

export function generateMetadata({ params }: { params: PageParams }): Metadata {
  const locale = isLocale(params.lang) ? params.lang : "id";
  const t = dictionaries[locale];
  const path = `/${locale}/wayang-uwuh`;
  return {
    title: t.wayangMetaTitle,
    description: t.wayangMetaDescription,
    alternates: {
      canonical: path,
      languages: { id: "/id/wayang-uwuh", en: "/en/wayang-uwuh", "x-default": "/id/wayang-uwuh" },
    },
    openGraph: { title: t.wayangMetaTitle, description: t.wayangMetaDescription, url: path, type: "article" },
  };
}

export default function WayangUwuhPage({ params }: { params: PageParams }) {
  const locale = isLocale(params.lang) ? params.lang : "id";
  const t = dictionaries[locale];
  const whatsappUrl = `${wayangUwuhLinks.whatsapp}?text=${encodeURIComponent(t.wayangWhatsappMessage)}`;
  const existingGallery = [
    { src: "/images/wayang-uwuh/galeri-sanggar.webp", alt: t.wayangGalleryAlts[0], width: 1024, height: 1536 },
    { src: "/images/wayang-uwuh/galeri-koleksi.webp", alt: t.wayangGalleryAlts[1], width: 1195, height: 896 },
    { src: "/images/wayang-uwuh/wayang-pandawa.webp", alt: t.wayangGalleryAlts[2], width: 896, height: 1200 },
    { src: "/images/wayang-uwuh/galeri-pigura.webp", alt: t.wayangHeroAlt, width: 1200, height: 896 },
  ];
  const newGallery = Array.from({ length: 13 }, (_, index) => index + 1)
    .filter((number) => number !== 10)
    .map((number) => ({
      src: `/images/wayang-uwuh/foto-sapen-${String(number).padStart(2, "0")}.webp`,
      alt: t.wayangGalleryAltGeneric,
      width: number === 2 ? 1280 : 960,
      height: number === 2 ? 960 : 1280,
    }));
  const gallery = [...existingGallery, ...newGallery];

  return (
    <div className="wayang-page">
      <header className="wayang-header">
        <div className="wayang-header__inner">
          <Link className="wayang-header__back" href={`/${locale}`}>
            <ArrowLeft aria-hidden="true" size={18} /> {t.wayangBackToPortal}
          </Link>
          <div className="wayang-header__tools">
            <Image className="wayang-header__logo" src="/images/sapen-logo-2x.png" width={225} height={88} alt={t.logoAlt} priority />
            <LocaleSwitcher locale={locale} label={t.localeLabel} />
          </div>
        </div>
      </header>
      <WaveDivider className="wayang-wave wayang-wave--hero" />

      <main>
        <section className="wayang-hero">
          <div className="wayang-hero__inner">
            <div className="wayang-hero__copy">
              <h1>{t.wayangPageTitle}</h1>
              <p className="wayang-hero__subtitle">{t.wayangSubtitle}</p>
              <div className="wayang-hero__actions">
                <a className="wayang-button wayang-button--primary" href={wayangUwuhLinks.shopee} target="_blank" rel="noopener noreferrer">
                  <ShoppingBag aria-hidden="true" size={19} /> {t.wayangShopee} <ArrowUpRight aria-hidden="true" size={16} />
                </a>
                <a className="wayang-button wayang-button--secondary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle aria-hidden="true" size={19} /> {t.wayangWhatsapp}
                </a>
              </div>
            </div>
            <figure className="wayang-hero__figure">
              <Image
                src="/images/wayang-uwuh/foto-sapen-10.webp"
                alt={t.wayangGalleryAltGeneric}
                width={960}
                height={1280}
                priority
                sizes="(max-width: 760px) 100vw, 58vw"
              />
              <figcaption>{t.brandSubtitle}</figcaption>
            </figure>
          </div>
        </section>
        <WaveDivider className="wayang-wave wayang-wave--gallery" flip />

        <section className="wayang-gallery" aria-labelledby="wayang-gallery-title">
          <div className="wayang-container">
            <h2 id="wayang-gallery-title">{t.wayangGalleryHeading}</h2>
            <WayangGallery
              photos={gallery}
              labels={{ open: t.wayangGalleryOpen, label: t.wayangGalleryLightbox, close: t.wayangGalleryClose, previous: t.wayangGalleryPrevious, next: t.wayangGalleryNext }}
            />
          </div>
        </section>
        <WaveDivider className="wayang-wave wayang-wave--story" />

        <section className="wayang-story">
          <article className="wayang-story__about">
            <h2>{t.wayangAboutHeading}</h2>
            <p>{t.wayangAbout}</p>
          </article>
          <article className="wayang-story__origin">
            <h2>{t.wayangOriginHeading}</h2>
            <p>{t.wayangOrigin}</p>
          </article>
        </section>
        <WaveDivider className="wayang-wave wayang-wave--detail" />

        <section className="wayang-detail">
          <div className="wayang-container wayang-detail__grid">
            <h2>{t.wayangMaterialsHeading}</h2>
            <p>{t.wayangMaterials}</p>
          </div>
        </section>
        <WaveDivider className="wayang-wave wayang-wave--education" flip />

        <section className="wayang-education">
          <h2>{t.wayangEducationHeading}</h2>
          <p>{t.wayangEducation}</p>
        </section>
        <WaveDivider className="wayang-wave wayang-wave--founder" />

        <section className="wayang-founder">
          <div className="wayang-container wayang-founder__inner">
            <Image
              src="/images/wayang-uwuh/iskandar-hardjodimuljo.webp"
              alt={t.wayangFounderAlt}
              width={1536}
              height={1024}
              sizes="(max-width: 760px) 100vw, 40vw"
            />
            <div>
              <h2>{t.wayangFounderHeading}</h2>
              <p>{t.wayangFounderName}</p>
            </div>
          </div>
        </section>
        <WaveDivider className="wayang-wave wayang-wave--contact" flip />

        <section className="wayang-contact" aria-labelledby="wayang-contact-title">
          <div className="wayang-contact__details">
            <h2 id="wayang-contact-title">{t.wayangContactHeading}</h2>
            <h3>{t.wayangAddressLabel}</h3>
            <p>{t.wayangAddress}</p>
            <a className="wayang-map-link" href={wayangUwuhLinks.maps} target="_blank" rel="noopener noreferrer">
              <MapPin aria-hidden="true" size={18} /> {t.wayangMapLink} <ArrowUpRight aria-hidden="true" size={15} />
            </a>
            <p className="wayang-contact__number">WhatsApp · {t.wayangWhatsappNumber}</p>
          </div>
          <div className="wayang-contact__actions">
            <a className="wayang-button wayang-button--primary" href={wayangUwuhLinks.shopee} target="_blank" rel="noopener noreferrer">
              <ShoppingBag aria-hidden="true" size={19} /> {t.wayangShopee} <ArrowUpRight aria-hidden="true" size={16} />
            </a>
            <a className="wayang-button wayang-button--secondary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden="true" size={19} /> {t.wayangWhatsapp}
            </a>
          </div>
        </section>
      </main>

      <WaveDivider className="wayang-wave wayang-wave--footer" />
      <footer className="wayang-footer">{t.wayangFooter}</footer>

      <nav className="wayang-sticky-actions" aria-label={t.wayangContactHeading}>
        <a className="wayang-button wayang-button--primary" href={wayangUwuhLinks.shopee} target="_blank" rel="noopener noreferrer">
          <ShoppingBag aria-hidden="true" size={18} /> {t.wayangShopee}
        </a>
        <a className="wayang-button wayang-button--secondary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle aria-hidden="true" size={18} /> {t.wayangWhatsapp}
        </a>
      </nav>
    </div>
  );
}
