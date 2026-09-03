"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, Truck, Tag, MapPin } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { getRestaurantById } from "@/data/restaurants";
import { formatRwf } from "@/lib/format";

export function CartPanel() {
  const { lines, subtotal, deliveryFee, total, increment, decrement, removeItem, clearCart, itemCount } =
    useCart();

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-5">
      <div className="rounded-2xl bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-brand-navy">
            Your Cart ({itemCount})
          </h2>
          {lines.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              Clear
            </button>
          )}
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <p className="text-sm font-medium text-brand-navy">Your cart is empty</p>
            <p className="text-xs text-slate-400">
              Add items from a restaurant to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {lines.map(({ item, product }) => {
              const restaurant = getRestaurantById(product.restaurantId);
              return (
                <div key={product.id} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-brand-navy">
                          {product.name}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {restaurant?.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="shrink-0 text-slate-300 hover:text-red-500"
                        aria-label={`Remove ${product.name}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-surface-border px-1.5 py-1">
                        <button
                          type="button"
                          onClick={() => decrement(product.id)}
                          className="flex h-5 w-5 items-center justify-center rounded-full text-brand-navy hover:bg-surface-muted"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="min-w-[14px] text-center text-xs font-semibold text-brand-navy">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increment(product.id)}
                          className="flex h-5 w-5 items-center justify-center rounded-full text-brand-navy hover:bg-surface-muted"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-brand-navy">
                        {formatRwf(product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {lines.length > 0 && (
          <>
            <div className="my-4 border-t border-dashed border-surface-border" />
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
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-600"
            >
              Proceed to Checkout
            </Link>
          </>
        )}
      </div>

      <div className="rounded-2xl bg-success-bg p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-success">
            <Truck size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-success">Free delivery</p>
            <p className="text-xs text-emerald-700/80">On orders above 10,000 RWF</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-warn-bg p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-warn">
            <Tag size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-warn">Today&apos;s Offers</p>
            <p className="text-xs text-amber-700/80">
              Up to 30% off on selected restaurants
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-brand-navy">Near you</p>
          <Link href="/restaurants" className="text-xs font-medium text-brand-500">
            See more
          </Link>
        </div>
        <div className="relative h-32 overflow-hidden rounded-xl bg-surface-muted">
          <svg viewBox="0 0 280 130" className="h-full w-full" aria-hidden="true">
            <rect width="280" height="130" fill="#e9eef8" />
            {[
              [40, 60],
              [90, 30],
              [150, 80],
              [200, 40],
              [230, 95],
            ].map(([x, y], idx) => (
              <path
                key={idx}
                d={`M${x} ${y} c0 -12 -10 -12 -10 0 c0 8 10 20 10 20 c0 0 10 -12 10 -20 c0 -12 -10 -12 -10 0z`}
                fill="#2f5dff"
              />
            ))}
          </svg>
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-medium text-brand-navy">
            <MapPin size={10} className="text-brand-500" />
            Musanze, Rwanda
          </div>
        </div>
      </div>
    </div>
  );
}
