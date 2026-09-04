import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { Star, BadgeCheck, MapPin } from "lucide-react";
import { getRestaurantBySlug } from "@/lib/queries/restaurants";
import { getProductsByRestaurantId } from "@/lib/queries/menu-items";
import { formatDeliveryRange, formatRwf } from "@/lib/format";
import { RestaurantMenu } from "@/components/restaurant/restaurant-menu";
import { RestaurantActions } from "@/components/restaurant/restaurant-actions";
import { RestaurantJsonLd } from "@/components/seo/restaurant-json-ld";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const restaurant = await getRestaurantBySlug(params.slug);
  if (!restaurant) return {};

  const title = restaurant.seoTitle || `${restaurant.name} — Order Delivery | UMUCURUZI`;
  const description =
    restaurant.seoDescription ||
    `Order from ${restaurant.name} in ${restaurant.location} on UMUCURUZI. ${restaurant.description}`.slice(0, 160);

  return {
    title,
    description,
    keywords: restaurant.seoKeywords,
    alternates: { canonical: `/restaurant/${restaurant.slug}` },
    openGraph: {
      title,
      description,
      images: restaurant.image ? [{ url: restaurant.image }] : undefined,
      type: "website",
    },
  };
}

export default async function RestaurantDetailPage({ params }: PageProps) {
  const restaurant = await getRestaurantBySlug(params.slug);
  if (!restaurant) notFound();

  const menuItems = await getProductsByRestaurantId(restaurant.id);

  return (
    <div className="pb-8">
      <RestaurantJsonLd restaurant={restaurant} />

      <div className="relative h-48 w-full sm:h-64">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent" />
      </div>

      <div className="px-5 sm:px-8 lg:px-10">
        <div className="-mt-10 flex items-end gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-card">
            <Image src={restaurant.logo} alt="" fill sizes="80px" className="object-cover" />
          </div>
          <RestaurantActions restaurant={restaurant} />
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">{restaurant.name}</h1>
          {restaurant.verified && (
            <BadgeCheck size={20} className="fill-brand-500 text-white" />
          )}
        </div>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">{restaurant.description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-brand-navy">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            {restaurant.rating}
            <span className="font-normal text-slate-400">({restaurant.reviewCount})</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {restaurant.distanceKm} km
          </span>
          <span>
            {restaurant.categories.map((c) => c.replace("-", " ")).join(" \u00b7 ")}
          </span>
          <span>
            {formatDeliveryRange(restaurant.deliveryTimeMin, restaurant.deliveryTimeMax)}
            {" \u00b7 "}
            {formatRwf(restaurant.deliveryFee)}
          </span>
          <span className={`font-semibold ${restaurant.isOpen ? "text-success" : "text-red-500"}`}>
            {restaurant.isOpen ? "Open" : "Closed"}
          </span>
        </div>
      </div>

      <RestaurantMenu items={menuItems} />
    </div>
  );
}
