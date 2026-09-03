import { offers } from "@/data/offers";
import { OfferCard } from "@/components/marketplace/offers-section";

export default function OffersPage() {
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
