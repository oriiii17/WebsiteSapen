import type { MetadataRoute } from "next";
import { getSupabase } from "@/lib/supabase";

const siteUrl = "https://www.sapen.my.id";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
  ];

  try {
    const { data, error } = await getSupabase().from("berita").select("id").order("id", { ascending: false });
    if (error) throw error;
    for (const article of data ?? []) {
      pages.push({
        url: `${siteUrl}/berita/${encodeURIComponent(String(article.id))}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error("Sitemap tidak dapat memuat daftar berita:", error);
  }

  return pages;
}
