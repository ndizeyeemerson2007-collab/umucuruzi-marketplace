"use client";

import { useFavorites } from "@/context/favorites-context";
import { restaurants } from "@/data/restaurants";
import { products } from "@/data/products";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { ProductCard } from "@/components/product/product-card";
import { useState } from "react";
import { Product } from "@/types/marketplace";
import { ProductModal } from "@/components/product/product-modal";

export default function FavoritesPage() {
  const { favoriteRestaurantIds, favoriteProductIds } = useFavorites();
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const favoriteRestaurants = restaurants.filter((r) =>
    favoriteRestaurantIds.includes(r.id)
  );
  const favoriteProducts = products.filter((p) => favoriteProductIds.includes(p.id));
  const isEmpty = favoriteRestaurants.length === 0 && favoriteProducts.length === 0;

  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10">
      <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">Favorites</h1>
      <p className="mt-1 text-sm text-slate-500">
        Restaurants and items you&apos;ve saved.
      </p>

      {isEmpty && (
        <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-card">
          <p className="text-base font-semibold text-brand-navy">No favorites yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Tap the heart icon on any restaurant or item to save it here.
          </p>
        </div>
      )}

      {favoriteRestaurants.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-base font-bold text-brand-navy">Restaurants</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {favoriteRestaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </section>
      )}

      {favoriteProducts.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-base font-bold text-brand-navy">Items</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {favoriteProducts.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={setActiveProduct} />
            ))}
          </div>
        </section>
      )}

      {activeProduct && (
        <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
      )}
    </div>
  );
}
