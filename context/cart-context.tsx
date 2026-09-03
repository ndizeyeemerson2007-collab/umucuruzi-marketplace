"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { CartItem, Product } from "@/types/marketplace";
import { getProductById } from "@/data/products";
import { getRestaurantById } from "@/data/restaurants";

const CART_STORAGE_KEY = "umucuruzi:cart";

export interface CartLine {
  item: CartItem;
  product: Product;
}

interface CartContextValue {
  items: CartItem[];
  lines: CartLine[];
  restaurantId: string | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (client-only).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch {
      // ignore malformed storage
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist on change.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore write errors (e.g. private browsing quota)
    }
  }, [items, hydrated]);

  const addItem = (product: Product, quantity = 1) => {
    if (!product.available) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { productId: product.id, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const increment = (productId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decrement = (productId: string) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const lines: CartLine[] = useMemo(
    () =>
      items
        .map((item) => {
          const product = getProductById(item.productId);
          return product ? { item, product } : null;
        })
        .filter((l): l is CartLine => l !== null),
    [items]
  );

  const restaurantId = lines.length > 0 ? lines[0].product.restaurantId : null;

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.product.price * l.item.quantity, 0),
    [lines]
  );

  const deliveryFee = useMemo(() => {
    if (!restaurantId) return 0;
    const restaurant = getRestaurantById(restaurantId);
    return restaurant?.deliveryFee ?? 0;
  }, [restaurantId]);

  const total = subtotal + deliveryFee;

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        lines,
        restaurantId,
        addItem,
        removeItem,
        increment,
        decrement,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
