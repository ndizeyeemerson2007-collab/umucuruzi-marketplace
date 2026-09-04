import type { Metadata } from "next";
import { Hero } from "@/components/marketplace/hero";
import { CategoryNav } from "@/components/marketplace/category-nav";
import { FeaturedRestaurants } from "@/components/marketplace/featured-restaurants";
import { BestSellers } from "@/components/marketplace/best-sellers";
import { OffersSection } from "@/components/marketplace/offers-section";
import { getFeaturedRestaurants } from "@/lib/queries/restaurants";
import { getBestSellers } from "@/lib/queries/menu-items";
import { getActiveOffers } from "@/lib/queries/offers";
import { getCategories } from "@/lib/queries/categories";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "UMUCURUZI — Order Food Delivery Near You in Musanze, Rwanda",
  description:
    "Order from the best restaurants and shops near you in Musanze, Rwanda. Fast delivery, live order tracking, and daily offers on UMUCURUZI.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [featuredRestaurants, bestSellers, topOffers, categories] = await Promise.all([
    getFeaturedRestaurants(4),
    getBestSellers(5),
    getActiveOffers(4),
    getCategories(),
  ]);

  return (
    <div className="space-y-6 pb-8">
      <Hero />
      <CategoryNav categories={categories} activeSlug="all" />
      <FeaturedRestaurants restaurants={featuredRestaurants} />
      <BestSellers products={bestSellers} />
      <OffersSection offers={topOffers} />
    </div>
  );
}
