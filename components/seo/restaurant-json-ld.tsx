import { Restaurant } from "@/types/marketplace";

export function RestaurantJsonLd({ restaurant }: { restaurant: Restaurant }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    description: restaurant.description,
    image: restaurant.image ? [restaurant.image] : undefined,
    url: `${siteUrl}/restaurant/${restaurant.slug}`,
    telephone: restaurant.phone || undefined,
    servesCuisine: restaurant.categories,
    priceRange: restaurant.deliveryFee ? "$$" : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.addressLine || undefined,
      addressLocality: restaurant.city,
      addressCountry: "RW",
    },
    geo:
      restaurant.latitude && restaurant.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
          }
        : undefined,
    aggregateRating:
      restaurant.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: restaurant.rating,
            reviewCount: restaurant.reviewCount,
          }
        : undefined,
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
