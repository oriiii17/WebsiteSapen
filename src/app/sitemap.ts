import type { MetadataRoute } from "next";
import { getSupabase } from "@/lib/supabase";

const siteUrl = "https://www.sapen.my.id";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/id`, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/en`, changeFrequency: "daily", priority: 0.9 },
  ];

  try {
    const { data, error } = await getSupabase().from("berita").select("id").order("id", { ascending: false });
    if (error) throw error;
    for (const article of data ?? []) {
      const idPath = `${siteUrl}/id/berita/${encodeURIComponent(String(article.id))}`;
      const enPath = `${siteUrl}/en/berita/${encodeURIComponent(String(article.id))}`;
      pages.push(
        { url: idPath, changeFrequency: "weekly", priority: 0.7 },
        { url: enPath, changeFrequency: "weekly", priority: 0.7 },
      );
    }
  } catch (error) {
    console.error("Sitemap tidak dapat memuat daftar berita:", error);
  }

  return pages;
}
