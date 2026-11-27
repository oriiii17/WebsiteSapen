import id from "@/dictionaries/id.json";
import en from "@/dictionaries/en.json";

export const dictionaries = { id, en } as const;
export type Locale = keyof typeof dictionaries;
export type Dictionary = typeof id;
export const ALL_CATEGORY = "Semua";
export const ANNOUNCEMENT_CATEGORY = "Pengumuman";

export function isLocale(value: string | undefined): value is Locale {
  return value === "id" || value === "en";
}

export function localizedPath(locale: Locale, path: string) {
  const pathWithoutLocale = path.replace(/^\/(id|en)(?=\/|$)/, "") || "/";
  return `/${locale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
}

const indonesianMonths: Record<string, number> = {
  januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
  juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11,
};

export function formatNewsDate(value: string | undefined, locale: Locale) {
  if (!value) return dictionaries[locale].latest;
  let date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    const match = value.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (match) {
      const month = indonesianMonths[match[2].toLocaleLowerCase("id-ID")];
      if (month !== undefined) date = new Date(Number(match[3]), month, Number(match[1]));
    }
  }
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta",
  }).format(date);
}

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US").format(value);
}

export function categoryLabel(category: string | undefined, _locale: Locale, dictionary: Dictionary) {
  const labels: Record<string, string> = {
    "Pengumuman": dictionary.categoryAnnouncement,
    "Berita Warga": dictionary.categoryCommunity,
    "Berita Utama": dictionary.categoryFeatured,
    "Kepemudaan": dictionary.categoryYouth,
    "Olahraga": dictionary.categorySports,
    "Pemberdayaan": dictionary.categoryEmpowerment,
  };
  return category ? labels[category] || category : dictionary.communityNews;
}

export function formatReadTime(value: string | undefined, locale: Locale, dictionary: Dictionary) {
  const match = value?.match(/\d+/);
  const amount = match ? formatNumber(Number(match[0]), locale) : formatNumber(2, locale);
  return `${amount} ${dictionary.minute} ${dictionary.readTime}`;
}
