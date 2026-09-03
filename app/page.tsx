import { Hero } from "@/components/marketplace/hero";
import { CategoryNav } from "@/components/marketplace/category-nav";
import { FeaturedRestaurants } from "@/components/marketplace/featured-restaurants";
import { BestSellers } from "@/components/marketplace/best-sellers";
import { OffersSection } from "@/components/marketplace/offers-section";
import { restaurants } from "@/data/restaurants";
import { getBestSellers } from "@/data/products";
import { offers } from "@/data/offers";

export default function HomePage() {
  const featuredRestaurants = restaurants.filter((r) => r.isFeatured);
  const bestSellers = getBestSellers(5);
  const topOffers = offers.slice(0, 4);

  return (
    <div className="space-y-6 pb-8">
      <Hero />
      <CategoryNav activeSlug="all" />
      <FeaturedRestaurants restaurants={featuredRestaurants} />
      <BestSellers products={bestSellers} />
      <OffersSection offers={topOffers} />
    </div>
  );
}
