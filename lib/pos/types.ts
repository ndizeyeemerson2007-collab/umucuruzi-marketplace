// ---------------------------------------------------------------------------
// Shape of the data the POS is expected to provide when a restaurant
// subscribes. Deliberately limited to the restaurant's public profile and
// its menu — nothing about accounts, staff, payouts, or other internal POS
// business data belongs in this payload or in the sync logic that reads it.
// ---------------------------------------------------------------------------

export interface PosMenuItemPayload {
  pos_product_id: string;
  name: string;
  description?: string;
  price: number; // RWF, integer
  image_url?: string;
  menu_category?: string; // e.g. "Meals", "Drinks" — free text, shown as a menu tab
  available?: boolean;
  is_bestseller?: boolean;
}

export interface PosRestaurantPayload {
  pos_restaurant_id: string; // stable external id owned by the POS
  name: string;
  description?: string;
  phone?: string;
  address_line?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  cover_image_url?: string;
  logo_url?: string;
  /** Must match existing `categories.slug` values (fast-food, pizza, ...). */
  category_slugs?: string[];
  opening_hours?: { days: string[]; opens: string; closes: string }[];
  menu: PosMenuItemPayload[];
}

export interface PosSyncResult {
  restaurantId: string;
  restaurantSlug: string;
  menuItemsUpserted: number;
}
