"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, BadgeCheck } from "lucide-react";
import { Restaurant } from "@/types/marketplace";
import { useFavorites } from "@/context/favorites-context";
import { formatDeliveryRange, formatRwf } from "@/lib/format";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const { isFavoriteRestaurant, toggleFavoriteRestaurant } = useFavorites();
  const favorite = isFavoriteRestaurant(restaurant.id);

  return (
    <Link
      href={`/restaurant/${restaurant.slug}`}
      className="group block shrink-0 overflow-hidden rounded-xl bg-white shadow-card transition-shadow hover:shadow-panel"
    >
      <div className="relative h-24 w-full overflow-hidden sm:h-28">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          sizes="280px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {restaurant.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-card">
            Featured
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleFavoriteRestaurant(restaurant.id);
          }}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-brand-navy shadow-card hover:text-red-500 sm:right-3 sm:top-3 sm:h-8 sm:w-8"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={15} className={favorite ? "fill-red-500 text-red-500" : ""} />
        </button>
      </div>

      <div className="p-2.5 sm:p-3">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate text-sm font-bold text-brand-navy sm:text-[15px]">
            {restaurant.name}
          </h3>
          {restaurant.verified && (
            <BadgeCheck size={16} className="shrink-0 fill-brand-500 text-white" />
          )}
        </div>

        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 sm:mt-1.5 sm:gap-1.5 sm:text-sm">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          <span className="font-semibold text-brand-navy">{restaurant.rating}</span>
          <span>({restaurant.reviewCount})</span>
          <span>&middot;</span>
          <span>{restaurant.distanceKm} km</span>
        </div>

        <p className="mt-1 truncate text-xs text-slate-400 sm:text-sm">
          {restaurant.categories
            .map((c) => c.replace("-", " "))
            .join(" \u00b7 ")}
        </p>

        <div className="mt-1.5 flex items-center justify-between text-xs sm:mt-2 sm:text-sm">
          <span className="text-slate-500">
            {formatDeliveryRange(restaurant.deliveryTimeMin, restaurant.deliveryTimeMax)}
            {" \u00b7 "}
            {formatRwf(restaurant.deliveryFee)}
          </span>
        </div>

        <p
          className={`mt-1 text-xs font-semibold sm:mt-1.5 sm:text-sm ${
            restaurant.isOpen ? "text-success" : "text-red-500"
          }`}
        >
          {restaurant.isOpen ? "Open" : "Closed"}
        </p>
      </div>
    </Link>
  );
}
