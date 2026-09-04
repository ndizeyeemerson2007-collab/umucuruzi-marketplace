"use client";

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Product } from "@/types/marketplace";
import { useCart } from "@/context/cart-context";
import { formatRwf } from "@/lib/format";

export function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(
      {
        ...product,
        restaurantName: product.restaurantName ?? "",
        restaurantDeliveryFee: product.restaurantDeliveryFee ?? 0,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => onClose(), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-brand-navy/40 sm:items-center sm:p-4">
      <div className="w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-panel sm:rounded-3xl">
        <div className="relative h-56 w-full">
          <Image src={product.image} alt={product.name} fill sizes="480px" className="object-cover" />
          {product.isBestSeller && (
            <span className="absolute left-4 top-4 rounded-full bg-warn px-3 py-1 text-xs font-semibold text-white shadow-card">
              Bestseller
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-brand-navy shadow-card"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold text-brand-navy">{product.name}</h3>
            <span className="shrink-0 text-lg font-bold text-brand-navy">
              {formatRwf(product.price)}
            </span>
          </div>
          {product.restaurantName && (
            <p className="mt-0.5 text-sm text-slate-400">{product.restaurantName}</p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            {product.description}
          </p>

          {!product.available && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-500">
              Sold out — this item is currently unavailable.
            </p>
          )}

          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm font-semibold text-brand-navy">Quantity</span>
            <div className="flex items-center gap-3 rounded-full border border-surface-border px-2 py-1.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full text-brand-navy hover:bg-surface-muted"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-4 text-center text-sm font-semibold text-brand-navy">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-brand-navy hover:bg-surface-muted"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="notes" className="text-sm font-semibold text-brand-navy">
              Special instructions
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g. no onions, extra spicy..."
              rows={2}
              className="mt-2 w-full resize-none rounded-xl border border-surface-border bg-surface-muted p-3 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="border-t border-surface-border p-4">
          <button
            type="button"
            disabled={!product.available}
            onClick={handleAdd}
            className="flex w-full items-center justify-center rounded-xl bg-brand-500 py-3.5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {added
              ? "Added!"
              : product.available
              ? `Add to Cart \u00b7 ${formatRwf(product.price * quantity)}`
              : "Sold out"}
          </button>
        </div>
      </div>
    </div>
  );
}
