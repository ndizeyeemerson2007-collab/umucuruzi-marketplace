"use client";

import { useMemo, useState } from "react";
import { LocateFixed, Search, X } from "lucide-react";
import type { Category, Restaurant } from "@/types/marketplace";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { useNearbyRestaurants } from "@/lib/use-nearby-restaurants";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function RestaurantsBrowser({
  restaurants,
  categories,
  initialQuery = "",
}: {
  restaurants: Restaurant[];
  categories: Category[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("all");
  const { restaurants: sortedByLocation, isRealLocation } = useNearbyRestaurants(restaurants);
  const normalizedQuery = normalize(query);
  const searchTerms = normalizedQuery.split(/\s+/).filter(Boolean);

  const filtered = useMemo(() => {
    return sortedByLocation.filter((restaurant) => {
      const searchableText = normalize(
        [
          restaurant.name,
          restaurant.description,
          restaurant.location,
          restaurant.addressLine ?? "",
          restaurant.city,
          ...restaurant.categories,
        ].join(" "),
      );
      const matchesQuery = searchTerms.every((term) => searchableText.includes(term));
      const matchesCategory =
        activeCategory === "all" || restaurant.categories.includes(activeCategory);
      return matchesQuery && matchesCategory;
    });
  }, [sortedByLocation, searchTerms, activeCategory]);

  return (
    <>
      {isRealLocation && (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-brand-600">
          <LocateFixed size={13} />
          Sorted by distance from your current location
        </p>
      )}

      <div className="relative mt-4 max-w-xl">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by restaurant, cuisine, location, or dish..."
          aria-label="Search by restaurant, cuisine, location, or dish"
          className="w-full rounded-full border border-surface-border bg-white py-2.5 pl-11 pr-11 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-400 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-surface-muted hover:text-brand-navy"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
        <span>
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
          {query ? ` for “${query}”` : ""}
        </span>
        {query && <span className="hidden sm:inline">Search matches names, cuisine, location, and descriptions</span>}
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === "all"
              ? "border-brand-500 bg-brand-500 text-white"
              : "border-surface-border bg-white text-slate-500 hover:border-brand-300"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.slug)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === category.slug
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-surface-border bg-white text-slate-500 hover:border-brand-300"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        {filtered.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-2xl bg-white p-8 text-center shadow-card">
          <p className="text-sm font-semibold text-brand-navy">No restaurants found</p>
          <p className="mt-1 text-sm text-slate-400">
            Try a different term, clear the search, or choose another cuisine.
          </p>
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-4 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </>
  );
}
