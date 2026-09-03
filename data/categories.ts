import { Category } from "@/types/marketplace";

// Mock category data. Replace with a `categories` table fetch later —
// keep the slug values stable since restaurants/products reference them.
export const categories: Category[] = [
  { id: "cat-all", slug: "all", name: "All", icon: "LayoutGrid" },
  { id: "cat-fast-food", slug: "fast-food", name: "Fast Food", icon: "Beef" },
  { id: "cat-pizza", slug: "pizza", name: "Pizza", icon: "Pizza" },
  { id: "cat-chicken", slug: "chicken", name: "Chicken", icon: "Drumstick" },
  { id: "cat-local-food", slug: "local-food", name: "Local Food", icon: "Soup" },
  { id: "cat-drinks", slug: "drinks", name: "Drinks", icon: "CupSoda" },
  { id: "cat-cafe", slug: "cafe", name: "Café", icon: "Coffee" },
  { id: "cat-bakery", slug: "bakery", name: "Bakery", icon: "Cake" },
  { id: "cat-bars", slug: "bars", name: "Bars", icon: "Beer" },
  { id: "cat-more", slug: "more", name: "More", icon: "MoreHorizontal" },
];
