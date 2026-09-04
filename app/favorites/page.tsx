"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "@/context/favorites-context";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import { mapProduct, mapRestaurant } from "@/lib/supabase/mappers";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { ProductCard } from "@/components/product/product-card";
import { Product, Restaurant } from "@/types/marketplace";
import { ProductModal } from "@/components/product/product-modal";

export default function FavoritesPage() {
  const { favoriteRestaurantIds, favoriteProductIds } = useFavorites();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const supabase = getBrowserSupabaseClient();

      const [restaurantsResult, productsResult] = await Promise.all([
        favoriteRestaurantIds.length > 0
          ? supabase
              .from("restaurants")
              .select("*, restaurant_categories(categories(slug))")
              .in("id", favoriteRestaurantIds)
          : Promise.resolve({ data: [], error: null }),
        favoriteProductIds.length > 0
          ? supabase
              .from("menu_items")
              .select("*, restaurants!inner(name, delivery_fee, status)")
              .in("id", favoriteProductIds)
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (cancelled) return;

      const mappedRestaurants = (restaurantsResult.data ?? []).map((row) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = row as any;
        const categorySlugs: string[] = (r.restaurant_categories ?? [])
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((rc: any) => rc.categories?.slug)
          .filter(Boolean);
        return mapRestaurant(r, categorySlugs);
      });

      const mappedProducts = (productsResult.data ?? []).map((row) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = row as any;
        return mapProduct(p, p.restaurants ? { name: p.restaurants.name, deliveryFee: p.restaurants.delivery_fee } : undefined);
      });

      setRestaurants(mappedRestaurants);
      setProducts(mappedProducts);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteRestaurantIds.join(","), favoriteProductIds.join(",")]);

  const isEmpty = !loading && restaurants.length === 0 && products.length === 0;

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

      {restaurants.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-base font-bold text-brand-navy">Restaurants</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-base font-bold text-brand-navy">Items</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {products.map((p) => (
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
