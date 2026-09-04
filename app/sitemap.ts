import type { MetadataRoute } from "next";
import { getAllRestaurants } from "@/lib/queries/restaurants";
import { getCategories } from "@/lib/queries/categories";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [restaurants, categories] = await Promise.all([
    getAllRestaurants(),
    getCategories(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/restaurants`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/offers`, changeFrequency: "daily", priority: 0.6 },
    { url: `${siteUrl}/categories/all`, changeFrequency: "daily", priority: 0.8 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/categories/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const restaurantRoutes: MetadataRoute.Sitemap = restaurants.map((r) => ({
    url: `${siteUrl}/restaurant/${r.slug}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...restaurantRoutes];
}
