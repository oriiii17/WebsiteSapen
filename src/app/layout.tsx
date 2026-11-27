import type { Metadata } from "next";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import { headers } from "next/headers";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { SiteFeedbackProvider } from "../components/site-feedback";
import { LocaleDocumentSync } from "../components/locale-document-sync";
import { dictionaries, type Locale } from "@/lib/i18n";

const atkinson = localFont({
  src: [
    { path: "../../public/fonts/AtkinsonHyperlegible-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/AtkinsonHyperlegible-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-atkinson",
  display: "swap",
});

export async function generateMetadata({ params }: { params?: { lang?: string } }): Promise<Metadata> {
  const requestHeaders = headers();
  const locale = (params?.lang === "en" || requestHeaders.get("x-sapen-locale") === "en" ? "en" : "id") as Locale;
  const dictionary = dictionaries[locale];
  const pathname = requestHeaders.get("x-sapen-pathname") || `/${locale}`;
  const otherPath = pathname.replace(/^\/(id|en)(?=\/|$)/, locale === "id" ? "/en" : "/id");
  return {
    metadataBase: new URL("https://www.sapen.my.id"),
    title: dictionary.title,
    description: dictionary.description,
    keywords: dictionary.keywords,
    alternates: {
      canonical: pathname,
      languages: { id: pathname.replace(/^\/(id|en)(?=\/|$)/, "/id"), en: otherPath, "x-default": pathname.replace(/^\/(id|en)(?=\/|$)/, "/id") },
    },
    openGraph: {
      type: "website",
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: [locale === "id" ? "en_US" : "id_ID"],
      url: pathname,
      siteName: "Kampung Sapen",
      title: dictionary.title,
      description: dictionary.description,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = headers().get("x-sapen-locale") === "en" ? "en" : "id";
  return (
    <html lang={locale}>
      <body className={`${atkinson.className} ${atkinson.variable} bg-slate-50 text-slate-900 antialiased min-h-screen`}>
        <LocaleDocumentSync />
        <SiteFeedbackProvider locale={locale}>{children}</SiteFeedbackProvider>
      {/* impeccable-live-start */}
<Script src="http://localhost:8400/live.js?token=c90f335a-ddaf-4793-8873-386dcc046db3" strategy="afterInteractive" />
{/* impeccable-live-end */}
</body>
    </html>
  );
}
