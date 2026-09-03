"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { restaurants } from "@/data/restaurants";
import { categories } from "@/data/categories";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";

export default function RestaurantsPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesQuery = r.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || r.categories.includes(activeCategory);
      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory]);

  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10">
      <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">Restaurants</h1>
      <p className="mt-1 text-sm text-slate-500">
        {filtered.length} place{filtered.length !== 1 ? "s" : ""} near Musanze, Rwanda
      </p>

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
    </div>
  );
}
