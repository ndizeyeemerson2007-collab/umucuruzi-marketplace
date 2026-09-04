"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Category, Restaurant } from "@/types/marketplace";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";

export function RestaurantsBrowser({
  restaurants,
  categories,
}: {
  restaurants: Restaurant[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesQuery = r.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || r.categories.includes(activeCategory);
      return matchesQuery && matchesCategory;
    });
  }, [restaurants, query, activeCategory]);

  return (
    <>
      <div className="relative mt-4 max-w-md">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search restaurants..."
          className="w-full rounded-full border border-surface-border bg-white py-2.5 pl-11 pr-4 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-400 focus:outline-none"
        />
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
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCategory(c.slug)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === c.slug
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-surface-border bg-white text-slate-500 hover:border-brand-300"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-2xl bg-white p-8 text-center shadow-card">
          <p className="text-sm font-semibold text-brand-navy">No restaurants found</p>
          <p className="mt-1 text-sm text-slate-400">
            Try a different search term or category.
          </p>
        </div>
      )}
    </>
  );
}
