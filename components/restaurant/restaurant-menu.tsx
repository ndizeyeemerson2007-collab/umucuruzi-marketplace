"use client";

import { useMemo, useState } from "react";
import { Product } from "@/types/marketplace";
import { ProductCard } from "@/components/product/product-card";
import { ProductModal } from "@/components/product/product-modal";

export function RestaurantMenu({ items }: { items: Product[] }) {
  const menuCategories = useMemo(() => {
    const unique = Array.from(new Set(items.map((i) => i.category)));
    return ["Popular", ...unique.filter((c) => c !== "Popular")];
  }, [items]);

  const [activeTab, setActiveTab] = useState(menuCategories[0] ?? "Popular");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const visibleItems =
    activeTab === "Popular"
      ? items.filter((i) => i.isBestSeller || i.isFeatured).concat(
          items.filter((i) => !i.isBestSeller && !i.isFeatured).slice(0, 2)
        )
      : items.filter((i) => i.category === activeTab);

  return (
    <div className="mt-6">
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-1 sm:px-8 lg:px-10">
        {menuCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveTab(cat)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === cat
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-surface-border bg-white text-slate-500 hover:border-brand-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 px-5 sm:grid-cols-3 sm:px-8 lg:grid-cols-4 lg:px-10">
        {visibleItems.length === 0 ? (
          <p className="col-span-full rounded-2xl bg-white p-6 text-center text-sm text-slate-400 shadow-card">
            No items in this menu category.
          </p>
        ) : (
          visibleItems.map((item) => (
            <ProductCard key={item.id} product={item} onOpen={setActiveProduct} />
          ))
        )}
      </div>

      {activeProduct && (
        <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
      )}
    </div>
  );
}
