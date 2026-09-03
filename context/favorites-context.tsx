"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const FAVORITES_STORAGE_KEY = "umucuruzi:favorites";

interface FavoritesContextValue {
  favoriteRestaurantIds: string[];
  favoriteProductIds: string[];
  toggleFavoriteRestaurant: (id: string) => void;
  toggleFavoriteProduct: (id: string) => void;
  isFavoriteRestaurant: (id: string) => boolean;
  isFavoriteProduct: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<string[]>(
    []
  );
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setFavoriteRestaurantIds(parsed.restaurants ?? []);
        setFavoriteProductIds(parsed.products ?? []);
      }
    } catch {
      // ignore malformed storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify({
          restaurants: favoriteRestaurantIds,
          products: favoriteProductIds,
        })
      );
    } catch {
      // ignore write errors
    }
  }, [favoriteRestaurantIds, favoriteProductIds, hydrated]);

  const toggleFavoriteRestaurant = (id: string) => {
    setFavoriteRestaurantIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleFavoriteProduct = (id: string) => {
    setFavoriteProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const isFavoriteRestaurant = (id: string) =>
    favoriteRestaurantIds.includes(id);
  const isFavoriteProduct = (id: string) => favoriteProductIds.includes(id);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteRestaurantIds,
        favoriteProductIds,
        toggleFavoriteRestaurant,
        toggleFavoriteProduct,
        isFavoriteRestaurant,
        isFavoriteProduct,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
}
