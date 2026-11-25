import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { SiteFeedbackProvider } from "../components/site-feedback";

const atkinson = localFont({
  src: [
    { path: "../../public/fonts/AtkinsonHyperlegible-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/AtkinsonHyperlegible-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-atkinson",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Warta Sapen — Berita Kampung Sapen",
  description: "Berita, pengumuman, dan kabar warga Kampung Sapen, Yogyakarta.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${atkinson.className} ${atkinson.variable} bg-slate-50 text-slate-900 antialiased min-h-screen`}>
        <SiteFeedbackProvider>{children}</SiteFeedbackProvider>
      {/* impeccable-live-start */}
<Script src="http://localhost:8400/live.js?token=c90f335a-ddaf-4793-8873-386dcc046db3" strategy="afterInteractive" />
{/* impeccable-live-end */}
</body>
    </html>
  );
}
