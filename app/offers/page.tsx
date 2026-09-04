import type { Metadata } from "next";
import { getActiveOffers } from "@/lib/queries/offers";
import { OfferCard } from "@/components/marketplace/offers-section";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Today's Offers & Discounts | UMUCURUZI",
  description:
    "See today's delivery discounts and restaurant offers in Musanze, Rwanda on UMUCURUZI.",
  alternates: { canonical: "/offers" },
};

export default async function OffersPage() {
  const offers = await getActiveOffers();

  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10">
      <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">Offers</h1>
      <p className="mt-1 text-sm text-slate-500">
        Deals and discounts available right now.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}
