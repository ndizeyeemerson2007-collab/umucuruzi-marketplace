import { notFound } from "next/navigation";
import { categories } from "@/data/categories";
import { restaurants } from "@/data/restaurants";
import { products } from "@/data/products";
import { CategoryNav } from "@/components/marketplace/category-nav";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { CategoryProductGrid } from "@/components/marketplace/category-product-grid";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const isAll = category.slug === "all";
  const matchingRestaurants = isAll
    ? restaurants
    : restaurants.filter((r) => r.categories.includes(category.slug));

  const matchingRestaurantIds = new Set(matchingRestaurants.map((r) => r.id));
  const matchingProducts = products.filter((p) =>
    matchingRestaurantIds.has(p.restaurantId)
  );

  return (
    <div className="pb-8">
      <div className="px-5 pt-6 sm:px-8 lg:px-10">
        <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">
          {category.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {matchingRestaurants.length} restaurant
          {matchingRestaurants.length !== 1 ? "s" : ""} in this category
        </p>
      </div>

      <CategoryNav activeSlug={category.slug} />

      <section className="px-5 sm:px-8 lg:px-10">
        <h2 className="mb-3 text-base font-bold text-brand-navy">Restaurants</h2>
        {matchingRestaurants.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-400 shadow-card">
            No restaurants in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {matchingRestaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </section>

      {matchingProducts.length > 0 && (
        <section className="mt-8 px-5 sm:px-8 lg:px-10">
          <h2 className="mb-3 text-base font-bold text-brand-navy">Popular items</h2>
          <CategoryProductGrid products={matchingProducts} />
        </section>
      )}
    </div>
  );
}
