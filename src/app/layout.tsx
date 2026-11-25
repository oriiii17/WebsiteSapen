import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";

const atkinson = localFont({
  src: [
    { path: "../../public/fonts/AtkinsonHyperlegible-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/AtkinsonHyperlegible-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-atkinson",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portal Warga Kampung Sapen Mandiri",
  description: "Aktivitas dan Modul Resmi Warga Kampung Sapen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${atkinson.className} ${atkinson.variable} bg-slate-50 text-slate-900 antialiased min-h-screen`}>
        {children}
      {/* impeccable-live-start */}
<Script src="http://localhost:8400/live.js?token=c90f335a-ddaf-4793-8873-386dcc046db3" strategy="afterInteractive" />
{/* impeccable-live-end */}
</body>
    </html>
  );
}
