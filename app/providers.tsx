"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/context/cart-context";
import { FavoritesProvider } from "@/context/favorites-context";
import { LocationProvider } from "@/context/location-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LocationProvider>
      <FavoritesProvider>
        <CartProvider>{children}</CartProvider>
      </FavoritesProvider>
    </LocationProvider>
  );
}
