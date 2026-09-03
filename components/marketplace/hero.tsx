import Image from "next/image";
import { MapPin } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-8 sm:px-8 lg:px-10">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight text-brand-navy sm:text-4xl lg:text-[2.75rem]">
            Good food, delivered
            <br />
            fast to <span className="text-brand-500">your door</span>
          </h1>
          <p className="mt-3 max-w-md text-[15px] text-slate-500">
            Order from the best restaurants and shops around you.
          </p>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-600"
          >
            <MapPin size={15} className="text-success" />
            Delivering to: <span className="font-semibold">Musanze, Rwanda</span>
          </button>
        </div>

        <div className="relative mx-auto h-[220px] w-[280px] shrink-0 sm:h-[260px] sm:w-[340px]">
          <Image
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"
            alt="Beef burger with fries"
            fill
            sizes="340px"
            className="object-contain drop-shadow-xl"
            priority
          />
          <div className="absolute -right-2 top-2 rounded-2xl bg-white px-4 py-3 text-center shadow-panel sm:right-2">
            <p className="text-lg font-extrabold leading-none text-brand-500">
              20&ndash;30
              <br />
              min
            </p>
            <p className="mt-1.5 text-[11px] leading-tight text-slate-400">
              Avg. delivery
              <br />
              time
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
