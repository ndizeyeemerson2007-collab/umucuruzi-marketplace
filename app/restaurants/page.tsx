import type { Metadata } from "next";
import { getAllRestaurants } from "@/lib/queries/restaurants";
import { getCategories } from "@/lib/queries/categories";
import { RestaurantsBrowser } from "@/components/marketplace/restaurants-browser";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Restaurants Near You in Musanze, Rwanda | UMUCURUZI",
  description:
    "Browse every restaurant and shop delivering on UMUCURUZI in Musanze, Rwanda. Filter by cuisine, search by name, and order for fast delivery.",
  alternates: { canonical: "/restaurants" },
};

export default async function RestaurantsPage() {
  const [restaurants, categories] = await Promise.all([
    getAllRestaurants(),
    getCategories(),
  ]);

  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10">
      <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">Restaurants</h1>
      <p className="mt-1 text-sm text-slate-500">
        {restaurants.length} place{restaurants.length !== 1 ? "s" : ""} near Musanze, Rwanda
      </p>

      <RestaurantsBrowser restaurants={restaurants} categories={categories} />
    </div>
  );
}
