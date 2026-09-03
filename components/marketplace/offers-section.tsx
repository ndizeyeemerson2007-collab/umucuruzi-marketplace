import Link from "next/link";
import { Offer } from "@/types/marketplace";
import { getIcon } from "@/lib/icons";

const COLOR_STYLES: Record<Offer["color"], { bg: string; fg: string; iconBg: string }> = {
  blue: { bg: "bg-brand-50", fg: "text-brand-600", iconBg: "bg-brand-500" },
  green: { bg: "bg-success-bg", fg: "text-success", iconBg: "bg-success" },
  yellow: { bg: "bg-warn-bg", fg: "text-warn", iconBg: "bg-warn" },
  navy: { bg: "bg-slate-100", fg: "text-brand-navy", iconBg: "bg-brand-navy" },
};

export function OfferCard({ offer }: { offer: Offer }) {
  const Icon = getIcon(offer.icon);
  const styles = COLOR_STYLES[offer.color];
  return (
    <div className={`flex items-start gap-3 rounded-2xl p-4 shadow-card ${styles.bg}`}>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${styles.iconBg}`}>
        <Icon size={18} />
      </span>
      <div>
        <p className={`text-sm font-bold ${styles.fg}`}>{offer.title}</p>
        <p className="mt-0.5 text-xs text-slate-500">{offer.subtitle}</p>
      </div>
    </div>
  );
}

export function OffersSection({ offers }: { offers: Offer[] }) {
  return (
    <section className="px-5 py-2 sm:px-8 lg:px-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-brand-navy sm:text-xl">Offers</h2>
        <Link href="/offers" className="text-sm font-semibold text-brand-500">
          See all
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}
