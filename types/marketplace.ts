// ---------------------------------------------------------------------------
// Shared marketplace types — this is the contract between the Supabase
// schema (see /lib/supabase and the migrations run against the
// `umucuruziltd` project) and the UI. Query functions in /lib/queries map
// raw DB rows onto these interfaces, so components never see snake_case
// column names directly.
// ---------------------------------------------------------------------------

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string; // lucide-react icon name, resolved in a small lookup map
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface Restaurant {
  id: string;
  slug: string;
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
  location: string; // display string, e.g. "Musanze, Rwanda"
  addressLine?: string | null;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  minOrder?: number | null;
  phone?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[];
  // Present once a restaurant is subscribed via the POS API sync.
  posRestaurantId?: string | null;
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
  // Denormalized convenience fields, populated by queries that join the
  // parent restaurant in (home best sellers, favorites, cart) so the UI
  // never needs a second lookup by id.
  restaurantName?: string;
  restaurantDeliveryFee?: number;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  code?: string | null;
  color: "blue" | "green" | "yellow" | "navy";
  icon: string;
  restaurantId?: string | null;
}

// Cart items snapshot the product's display fields at the moment they're
// added, rather than storing just a productId + quantity. That way the
// cart (and its totals) never needs a synchronous client-side lookup back
// into the catalog, and a later menu price change on the POS never quietly
// rewrites an item already sitting in someone's cart.
export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  restaurantId: string;
  restaurantName: string;
  deliveryFee: number;
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus =
  | "confirmed"
  | "preparing"
  | "driver_assigned"
  | "on_the_way"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string | null;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  restaurantId: string;
  restaurantName?: string;
  items: OrderItem[];
  status: OrderStatus;
  placedAt: string; // ISO date
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  paymentMethod: PaymentMethod | null;
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
