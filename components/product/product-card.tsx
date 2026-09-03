"use client";

import Image from "next/image";
import { Heart, Plus } from "lucide-react";
import { Product } from "@/types/marketplace";
import { useFavorites } from "@/context/favorites-context";
import { useCart } from "@/context/cart-context";
import { formatRwf } from "@/lib/format";

export function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen?: (product: Product) => void;
}) {
  const { isFavoriteProduct, toggleFavoriteProduct } = useFavorites();
  const { addItem } = useCart();
  const favorite = isFavoriteProduct(product.id);

  return (
    <div className="group shrink-0 overflow-hidden rounded-2xl bg-white shadow-card transition-shadow hover:shadow-panel">
      <button
        type="button"
        onClick={() => onOpen?.(product)}
        className="relative block h-32 w-full overflow-hidden text-left"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="220px"
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
            !product.available ? "grayscale" : ""
          }`}
        />
        {product.isBestSeller && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-warn px-2.5 py-1 text-[11px] font-semibold text-white shadow-card">
            Bestseller
          </span>
        )}
        {!product.available && (
          <span className="absolute inset-0 flex items-center justify-center bg-brand-navy/50">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-navy">
              Sold out
            </span>
          </span>
        )}
        <span
          role="button"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteProduct(product.id);
          }}
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-brand-navy shadow-card hover:text-red-500"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={13} className={favorite ? "fill-red-500 text-red-500" : ""} />
        </span>
      </button>

      <div className="p-3.5">
        <button type="button" onClick={() => onOpen?.(product)} className="block w-full text-left">
          <h3 className="truncate text-sm font-semibold text-brand-navy">
            {product.name}
          </h3>
        </button>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-sm font-bold text-brand-navy">
            {formatRwf(product.price)}
          </span>
          <button
            type="button"
            disabled={!product.available}
            onClick={() => addItem(product)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
