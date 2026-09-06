"use client";

import Link from "next/link";
import { Crown } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types/marketplace";
import { ProductCard } from "@/components/product/product-card";
import { ProductModal } from "@/components/product/product-modal";

export function BestSellers({ products }: { products: Product[] }) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  return (
    <section className="px-5 py-2 sm:px-8 lg:px-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-brand-navy sm:text-xl">
          <Crown size={19} className="fill-amber-400 text-amber-400" />
          Best Sellers
        </h2>
        <Link href="/restaurants" className="text-sm font-semibold text-brand-500">
          See all
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 px-1 pb-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {products.map((product) => (
          <div key={product.id} className="min-w-0">
            <ProductCard product={product} onOpen={setActiveProduct} />
          </div>
        ))}
      </div>

      {activeProduct && (
        <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
      )}
    </section>
  );
}
