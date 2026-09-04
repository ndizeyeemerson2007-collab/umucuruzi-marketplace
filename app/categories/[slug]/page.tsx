import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getCategoryBySlug } from "@/lib/queries/categories";
import { getAllRestaurants, getRestaurantsByCategory } from "@/lib/queries/restaurants";
import { getProductsByRestaurantIds } from "@/lib/queries/menu-items";
import { CategoryNav } from "@/components/marketplace/category-nav";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { CategoryProductGrid } from "@/components/marketplace/category-product-grid";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

const ALL_CATEGORY = { id: "all", slug: "all", name: "All", icon: "LayoutGrid" };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (params.slug === "all") {
    return {
      title: "All Restaurants Near You in Musanze, Rwanda | UMUCURUZI",
      description: "Browse every restaurant and shop delivering on UMUCURUZI in Musanze, Rwanda.",
      alternates: { canonical: "/categories/all" },
    };
  }

  const category = await getCategoryBySlug(params.slug);
  if (!category) return {};

  return {
    title: category.seoTitle || `Best ${category.name} in Musanze, Rwanda | UMUCURUZI`,
    description:
      category.seoDescription ||
      `Order the best ${category.name.toLowerCase()} for delivery in Musanze, Rwanda on UMUCURUZI.`,
    alternates: { canonical: `/categories/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const isAll = params.slug === "all";
  const category = isAll ? ALL_CATEGORY : await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const matchingRestaurants = isAll
    ? await getAllRestaurants()
    : await getRestaurantsByCategory(category.slug);

  const matchingProducts = await getProductsByRestaurantIds(
    matchingRestaurants.map((r) => r.id)
  );
  const allCategories = await getCategories();

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

      <CategoryNav categories={allCategories} activeSlug={category.slug} />

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
