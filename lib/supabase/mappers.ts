import type { Database } from "./database.types";
import type { Category, Offer, Order, Product, Restaurant } from "@/types/marketplace";
import { DEFAULT_LOCATION, distanceKm } from "@/lib/geo";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type RestaurantRow = Database["public"]["Tables"]["restaurants"]["Row"];
type MenuItemRow = Database["public"]["Tables"]["menu_items"]["Row"];
type OfferRow = Database["public"]["Tables"]["offers"]["Row"];
type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    icon: row.icon ?? "MoreHorizontal",
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  };
}

/**
 * Maps a restaurant row. `categorySlugs` comes from the joined
 * restaurant_categories -> categories relation (fetched separately or via
 * a nested select, depending on the query).
 */
export function mapRestaurant(
  row: RestaurantRow,
  categorySlugs: string[] = []
): Restaurant {
  const hasCoords = row.latitude != null && row.longitude != null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    image: row.cover_image_url ?? "",
    logo: row.logo_url ?? "",
    categories: categorySlugs,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    distanceKm: hasCoords
      ? distanceKm(
          DEFAULT_LOCATION.latitude,
          DEFAULT_LOCATION.longitude,
          row.latitude as number,
          row.longitude as number
        )
      : 0,
    deliveryTimeMin: row.delivery_time_min ?? 20,
    deliveryTimeMax: row.delivery_time_max ?? 40,
    deliveryFee: row.delivery_fee,
    isOpen: row.is_open,
    isFeatured: row.is_featured,
    verified: row.is_verified,
    location: `${row.city}, ${row.country}`,
    addressLine: row.address_line,
    city: row.city,
    latitude: row.latitude,
    longitude: row.longitude,
    minOrder: row.min_order,
    phone: row.phone,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    seoKeywords: row.seo_keywords ?? [],
    posRestaurantId: row.pos_restaurant_id,
  };
}

export function mapProduct(
  row: MenuItemRow,
  restaurant?: { name: string; deliveryFee: number }
): Product {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    name: row.name,
    description: row.description ?? "",
    price: row.price,
    image: row.image_url ?? "",
    category: row.menu_category,
    isBestSeller: row.is_bestseller,
    isFeatured: row.is_featured,
    available: row.available,
    rating: Number(row.rating),
    restaurantName: restaurant?.name,
    restaurantDeliveryFee: restaurant?.deliveryFee,
  };
}

export function mapOffer(row: OfferRow): Offer {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? "",
    code: row.code,
    color: row.color,
    icon: row.icon ?? "Tag",
    restaurantId: row.restaurant_id,
  };
}

export function mapOrder(
  row: OrderRow,
  items: OrderItemRow[],
  restaurantName?: string
): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    restaurantId: row.restaurant_id,
    restaurantName,
    items: items.map((item) => ({
      productId: item.product_id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    status: row.status,
    placedAt: row.placed_at,
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee,
    total: row.total,
    deliveryAddress: row.delivery_address ?? "",
    paymentMethod: row.payment_method,
  };
}
