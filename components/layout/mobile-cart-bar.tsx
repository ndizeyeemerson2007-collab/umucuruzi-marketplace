"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatRwf } from "@/lib/format";

export function MobileCartBar() {
  const { itemCount, total } = useCart();

  if (itemCount === 0) return null;

  return (
    <Link
      href="/cart"
      className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-2xl bg-brand-500 px-4 py-3.5 text-white shadow-panel lg:hidden"
    >
      <span className="flex items-center gap-2 text-sm font-semibold">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
          <ShoppingBag size={15} />
        </span>
        {itemCount} item{itemCount > 1 ? "s" : ""} in cart
      </span>
      <span className="text-sm font-bold">{formatRwf(total)}</span>
    </Link>
  );
}
