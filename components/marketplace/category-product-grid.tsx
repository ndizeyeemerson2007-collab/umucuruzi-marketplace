"use client";

import { useState } from "react";
import { Product } from "@/types/marketplace";
import { ProductCard } from "@/components/product/product-card";
import { ProductModal } from "@/components/product/product-modal";

export function CategoryProductGrid({ products }: { products: Product[] }) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onOpen={setActiveProduct} />
        ))}
      </div>
      {activeProduct && (
        <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
      )}
    </>
  );
}
