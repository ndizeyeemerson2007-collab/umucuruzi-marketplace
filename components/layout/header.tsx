"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MapPin, Search, ChevronDown, Heart, Bell, ShoppingCart, Menu } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { currentCustomer } from "@/data/customer";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { itemCount } = useCart();
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-white">
      <div className="flex h-[72px] items-center gap-3 px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-full text-brand-navy hover:bg-surface-muted lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-50 shadow-card">
            <Image
              src="/umucuruzi-mark.png"
              alt="UMUCURUZI"
              fill
              sizes="36px"
              className="object-contain p-0.5"
              priority
            />
          </span>
          <span className="hidden text-xl font-bold tracking-tight text-brand-navy sm:inline">
            UMUCURUZI
          </span>
        </Link>

        {/* Location selector — desktop */}
        <button
          type="button"
          className="hidden shrink-0 items-center gap-2 rounded-full border border-surface-border bg-white px-4 py-2.5 text-sm font-medium text-brand-navy hover:border-brand-300 md:flex"
        >
          <MapPin size={16} className="text-brand-500" />
          <span>Musanze, Rwanda</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>

        {/* Search bar */}
        <div className="relative hidden flex-1 max-w-xl md:block">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants, food, drinks..."
            className="w-full rounded-full border border-surface-border bg-surface-muted py-2.5 pl-11 pr-4 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            href="/partner"
            className="hidden whitespace-nowrap px-3 py-2 text-sm font-semibold text-brand-500 hover:text-brand-600 lg:inline-block"
          >
            Become a partner
          </Link>

          <Link
            href="/favorites"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-brand-navy hover:bg-surface-muted sm:flex"
            aria-label="Favorites"
          >
            <Heart size={20} />
          </Link>

          <button
            type="button"
            className="relative hidden h-10 w-10 items-center justify-center rounded-full text-brand-navy hover:bg-surface-muted sm:flex"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
              2
            </span>
          </button>

          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-brand-navy hover:bg-surface-muted"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          <Link
            href="/profile"
            className="ml-1 hidden items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-surface-muted sm:flex"
          >
            <span className="relative h-8 w-8 overflow-hidden rounded-full bg-surface-muted">
              <Image
                src={currentCustomer.avatar}
                alt={currentCustomer.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </span>
            <span className="text-left leading-tight">
              <span className="block text-sm font-semibold text-brand-navy">
                {currentCustomer.name}
              </span>
              <span className="block text-xs text-slate-400">
                {currentCustomer.role}
              </span>
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile search row */}
      <div className="border-t border-surface-border px-4 py-3 md:hidden">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants, food, drinks..."
            className="w-full rounded-full border border-surface-border bg-surface-muted py-2.5 pl-11 pr-4 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
}
