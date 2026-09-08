"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { useLocation } from "@/context/location-context";

export function Hero() {
  const { location, requestLocation } = useLocation();

  return (
    <section className="relative overflow-hidden bg-white px-5 py-6 sm:px-8 lg:px-10">
      <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
        <div>
          <h1 className="text-3xl font-extrabold leading-[0.98] text-brand-navy sm:text-4xl lg:text-[2.55rem]">
            Good food, delivered
            <br />
            fast to <span className="text-brand-500">your door</span>
          </h1>
          <p className="mt-3 max-w-md text-sm text-slate-500 sm:text-[15px]">
            Order from the best restaurants and shops around you.
          </p>
          <button
            type="button"
            onClick={requestLocation}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-600"
          >
            <MapPin size={15} className="text-success" />
            Delivering to: <span className="font-semibold">{location.label}</span>
          </button>
        </div>

        <div className="relative mx-auto h-[170px] w-[230px] shrink-0 sm:h-[205px] sm:w-[275px]">
          <Image
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"
            alt="Beef burger with fries"
            fill
            sizes="275px"
            className="object-contain drop-shadow-xl"
            priority
          />
          <div className="absolute -right-3 top-1 rounded-2xl bg-white px-3 py-2.5 text-center shadow-panel sm:right-0">
            <p className="text-base font-extrabold leading-none text-brand-500">
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
