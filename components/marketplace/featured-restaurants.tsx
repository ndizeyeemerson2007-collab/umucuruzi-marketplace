import Link from "next/link";
import { Restaurant } from "@/types/marketplace";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";

export function FeaturedRestaurants({ restaurants }: { restaurants: Restaurant[] }) {
  return (
    <section className="px-5 py-2 sm:px-8 lg:px-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-brand-navy sm:text-xl">
          Featured Restaurants
        </h2>
        <Link href="/restaurants" className="text-sm font-semibold text-brand-500">
          View all
        </Link>
      </div>

      {restaurants.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-400 shadow-card">
          No featured restaurants match your filters right now.
        </p>
      ) : (
        <div className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible xl:grid-cols-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="w-[260px] sm:w-auto">
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
