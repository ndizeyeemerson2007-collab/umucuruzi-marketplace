// ---------------------------------------------------------------------------
// Shared marketplace types.
//
// These types describe the shape of data the marketplace consumes. Right now
// every value implementing these interfaces comes from local mock data in
// /data. When the POS/shared database is ready, the same interfaces should be
// satisfied by data fetched from Supabase/API routes — the UI layer should
// not need to change.
// ---------------------------------------------------------------------------

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string; // lucide-react icon name, resolved in a small lookup map
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  logo: string;
  categories: string[]; // category slugs
  rating: number;
  reviewCount: number;
  distanceKm: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number; // RWF
  isOpen: boolean;
  isFeatured: boolean;
  verified: boolean;
  location: string;
  // Below fields will eventually be owned/updated by the POS.
  minOrder?: number;
}

export interface Product {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number; // RWF
  image: string;
  category: string; // menu category label within the restaurant, e.g. "Meals"
  isBestSeller: boolean;
  isFeatured: boolean;
  available: boolean; // controlled by POS stock in the future
  rating: number;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  code?: string;
  color: "blue" | "green" | "yellow" | "navy";
  icon: string;
  restaurantId?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus =
  | "confirmed"
  | "preparing"
  | "driver_assigned"
  | "on_the_way"
  | "delivered";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  items: OrderItem[];
  status: OrderStatus;
  placedAt: string; // ISO date
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
}

export type PaymentMethod = "mtn_momo" | "airtel_money" | "cash_on_delivery";

export interface Customer {
  id: string;
  name: string;
  role: "Customer";
  avatar: string;
  phone: string;
  email: string;
}

export interface DeliveryAddress {
  label: string;
  location: string;
  phone: string;
  notes?: string;
}
