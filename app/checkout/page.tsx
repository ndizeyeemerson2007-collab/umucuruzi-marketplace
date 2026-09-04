"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Smartphone, Banknote, Wallet } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatRwf } from "@/lib/format";
import { PaymentMethod } from "@/types/marketplace";

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: typeof Smartphone }[] = [
  { id: "mtn_momo", label: "MTN Mobile Money", icon: Smartphone },
  { id: "airtel_money", label: "Airtel Money", icon: Wallet },
  { id: "cash_on_delivery", label: "Cash on Delivery", icon: Banknote },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, deliveryFee, total, restaurantId, clearCart } = useCart();
  const [location, setLocation] = useState("Musanze, Rwanda");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("mtn_momo");
  const [placing, setPlacing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (items.length === 0 || !restaurantId) return;
    setPlacing(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            specialInstructions: item.specialInstructions,
          })),
          deliveryAddress: location,
          customerPhone: phone || undefined,
          paymentMethod: payment,
          notes: notes || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not place order.");
      }

      clearCart();
      router.push(`/orders/${data.orderNumber}`);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong placing your order."
      );
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-10 text-center sm:px-8">
        <p className="text-base font-semibold text-brand-navy">Your cart is empty</p>
        <p className="mt-1 text-sm text-slate-400">Add items before checking out.</p>
        <Link
          href="/restaurants"
          className="mt-4 inline-block rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Browse restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-6 sm:px-8">
      <div className="flex items-center gap-3">
        <Link
          href="/cart"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-muted"
          aria-label="Back to cart"
        >
          <ArrowLeft size={20} className="text-brand-navy" />
        </Link>
        <h1 className="text-xl font-bold text-brand-navy">Checkout</h1>
      </div>

      {/* Order summary */}
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-card">
        <h2 className="text-sm font-bold text-brand-navy">Order summary</h2>
        <div className="mt-3 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-brand-navy">
                  {item.quantity}x {item.name}
                </p>
                <p className="truncate text-xs text-slate-400">{item.restaurantName}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-brand-navy">
                {formatRwf(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery address */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-card">
        <h2 className="text-sm font-bold text-brand-navy">Delivery address</h2>
        <div className="mt-3 space-y-3">
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <MapPin size={13} /> Location
            </span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-surface-muted px-3.5 py-2.5 text-sm text-brand-navy focus:border-brand-400 focus:bg-white focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Phone size={13} /> Phone number
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+250 7XX XXX XXX"
              className="w-full rounded-xl border border-surface-border bg-surface-muted px-3.5 py-2.5 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none"
            />
          </label>
        </div>
      </div>

      {/* Payment method */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-card">
        <h2 className="text-sm font-bold text-brand-navy">Payment method</h2>
        <div className="mt-3 space-y-2">
          {PAYMENT_OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPayment(id)}
              className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition-colors ${
                payment === id
                  ? "border-brand-500 bg-brand-50 text-brand-600"
                  : "border-surface-border text-brand-navy hover:border-brand-200"
              }`}
            >
              <Icon size={17} className={payment === id ? "text-brand-500" : "text-slate-400"} />
              {label}
              <span
                className={`ml-auto flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                  payment === id ? "border-brand-500" : "border-slate-300"
                }`}
              >
                {payment === id && <span className="h-2 w-2 rounded-full bg-brand-500" />}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Payment is simulated for now — no real transaction will be made.
        </p>
      </div>

      {/* Order notes */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-card">
        <h2 className="text-sm font-bold text-brand-navy">Order notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Add any notes for your delivery..."
          className="mt-3 w-full resize-none rounded-xl border border-surface-border bg-surface-muted p-3 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none"
        />
      </div>

      {/* Total + place order */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-card">
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

        {errorMessage && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-500">
            {errorMessage}
          </p>
        )}

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={placing}
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-brand-500 py-3.5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-600 disabled:opacity-70"
        >
          {placing ? "Placing order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
