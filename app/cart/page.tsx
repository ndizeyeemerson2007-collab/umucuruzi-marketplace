"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { getRestaurantById } from "@/data/restaurants";
import { formatRwf } from "@/lib/format";

export default function CartPage() {
  const { lines, subtotal, deliveryFee, total, increment, decrement, removeItem, clearCart, itemCount } =
    useCart();

  return (
    <div className="mx-auto max-w-2xl px-5 py-6 sm:px-8">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-muted"
          aria-label="Back"
        >
          <ArrowLeft size={20} className="text-brand-navy" />
        </Link>
        <h1 className="text-xl font-bold text-brand-navy">Your Cart ({itemCount})</h1>
        {lines.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="ml-auto text-sm font-medium text-brand-500"
          >
            Clear
          </button>
        )}
      </div>

      {lines.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl bg-white p-10 text-center shadow-card">
          <p className="text-base font-semibold text-brand-navy">Your cart is empty</p>
          <p className="text-sm text-slate-400">
            Browse restaurants and add items to get started.
          </p>
          <Link
            href="/restaurants"
            className="mt-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Browse restaurants
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-3">
            {lines.map(({ item, product }) => {
              const restaurant = getRestaurantById(product.restaurantId);
              return (
                <div key={product.id} className="flex gap-3 rounded-2xl bg-white p-4 shadow-card">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                    <Image src={product.image} alt={product.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-brand-navy">{product.name}</p>
                        <p className="truncate text-sm text-slate-400">{restaurant?.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="shrink-0 text-slate-300 hover:text-red-500"
                        aria-label={`Remove ${product.name}`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-full border border-surface-border px-2 py-1.5">
                        <button
                          type="button"
                          onClick={() => decrement(product.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-brand-navy hover:bg-surface-muted"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-4 text-center text-sm font-semibold text-brand-navy">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increment(product.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-brand-navy hover:bg-surface-muted"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-semibold text-brand-navy">
                        {formatRwf(product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl bg-white p-5 shadow-card">
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-brand-navy">{formatRwf(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Delivery Fee</span>
                <span className="font-medium text-brand-navy">{formatRwf(deliveryFee)}</span>
              </div>
            </div>
            <div className="my-3 border-t border-surface-border" />
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-brand-navy">Total</span>
              <span className="text-base font-bold text-brand-navy">{formatRwf(total)}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-brand-500 py-3.5 text-sm font-semibold text-white shadow-card hover:bg-brand-600"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
