"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Crown } from "lucide-react";
import type { Product } from "@/types/marketplace";
import { ProductCard } from "@/components/product/product-card";
import { ProductModal } from "@/components/product/product-modal";

export function BestSellers({ products }: { products: Product[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (products.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % products.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [products.length]);

  if (products.length === 0) return null;

  const activeProductForSlide = products[activeIndex] ?? products[0];
  const goTo = (index: number) => setActiveIndex((index + products.length) % products.length);

  return (
    <section className="px-5 py-2 sm:px-8 lg:px-10" aria-labelledby="best-sellers-heading">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-500">Popular right now</p>
          <h2 id="best-sellers-heading" className="mt-1 flex items-center gap-2 text-lg font-bold text-brand-navy sm:text-xl">
            <Crown size={19} className="fill-amber-400 text-amber-400" />
            Best Sellers
          </h2>
        </div>
        <Link href="/restaurants" className="text-sm font-semibold text-brand-500 hover:text-brand-600">
          See all
        </Link>
      </div>

      <div className="mx-auto max-w-md">
        <div className="relative">
          <ProductCard product={activeProductForSlide} onOpen={setActiveProduct} variant="slide" />
          {products.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand-navy shadow-panel transition hover:bg-white"
                aria-label="Show previous bestseller"
              >
                <ChevronLeft size={19} />
              </button>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand-navy shadow-panel transition hover:bg-white"
                aria-label="Show next bestseller"
              >
                <ChevronRight size={19} />
              </button>
            </>
          )}
        </div>

        {products.length > 1 && (
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-400">
              {activeIndex + 1} of {products.length} best sellers
            </span>
            <div className="flex items-center gap-1.5" aria-label="Bestseller slides">
              {products.map((product, index) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Show ${product.name}`}
                  aria-current={activeIndex === index ? "true" : undefined}
                  className={`h-1.5 rounded-full transition-all ${activeIndex === index ? "w-7 bg-brand-500" : "w-1.5 bg-slate-300 hover:bg-brand-300"}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {activeProduct && <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />}
    </section>
  );
}
