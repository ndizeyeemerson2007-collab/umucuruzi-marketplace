"use client";

import { Heart, Share2 } from "lucide-react";
import { Restaurant } from "@/types/marketplace";
import { useFavorites } from "@/context/favorites-context";

export function RestaurantActions({ restaurant }: { restaurant: Restaurant }) {
  const { isFavoriteRestaurant, toggleFavoriteRestaurant } = useFavorites();
  const favorite = isFavoriteRestaurant(restaurant.id);

  return (
    <div className="ml-auto mb-1 flex gap-2">
      <button
        type="button"
        onClick={() => toggleFavoriteRestaurant(restaurant.id)}
        className="flex items-center gap-1.5 rounded-full border border-surface-border bg-white px-3.5 py-2 text-sm font-medium text-brand-navy shadow-card hover:border-brand-300"
      >
        <Heart size={15} className={favorite ? "fill-red-500 text-red-500" : ""} />
        Favorite
      </button>
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-full border border-surface-border bg-white px-3.5 py-2 text-sm font-medium text-brand-navy shadow-card hover:border-brand-300"
      >
        <Share2 size={15} />
        Share
      </button>
    </div>
  );
}
