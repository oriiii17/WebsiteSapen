"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localizedPath, type Locale } from "@/lib/i18n";

export function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() || `/${locale}`;
  const switchTo = (nextLocale: Locale) => {
    document.cookie = `sapen_locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <nav className="site-locale-switch" aria-label={label}>
      {(["id", "en"] as const).map((option, index) => (
        <span className="site-locale-switch__item" key={option}>
          {index > 0 && <span aria-hidden="true">|</span>}
          <Link
            href={localizedPath(option, pathname)}
            hrefLang={option}
            lang={option}
            aria-current={locale === option ? "page" : undefined}
            onClick={() => switchTo(option)}
          >
            {option.toUpperCase()}
          </Link>
        </span>
      ))}
    </nav>
  );
}
