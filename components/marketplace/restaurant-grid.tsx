"use client";

import { LocateFixed } from "lucide-react";
import { Restaurant } from "@/types/marketplace";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { useNearbyRestaurants } from "@/lib/use-nearby-restaurants";

export function RestaurantGrid({ restaurants }: { restaurants: Restaurant[] }) {
  const { restaurants: sorted, isRealLocation } = useNearbyRestaurants(restaurants);

  if (sorted.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-400 shadow-card">
        No restaurants in this category yet.
      </p>
    );
  }

  return (
    <div>
      {isRealLocation && (
        <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-brand-600">
          <LocateFixed size={13} />
          Sorted by distance from your current location
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        {sorted.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
    </div>
  );
}
