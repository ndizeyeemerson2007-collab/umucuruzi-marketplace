"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  UtensilsCrossed,
  Grid3x3,
  Tag,
  ClipboardList,
  Heart,
  MapPinned,
  User,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/restaurants", label: "Restaurants", icon: UtensilsCrossed },
  { href: "/categories/all", label: "Categories", icon: Grid3x3 },
  { href: "/offers", label: "Offers", icon: Tag },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/orders", label: "Track Order", icon: MapPinned },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href.split("/").slice(0, 2).join("/"));
          return (
            <Link
              key={label}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-600"
                  : "text-slate-500 hover:bg-surface-muted hover:text-brand-navy"
              }`}
            >
              <Icon size={19} className={isActive ? "text-brand-500" : "text-slate-400"} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 mb-4 rounded-2xl bg-brand-50 p-4">
        <p className="text-sm font-bold text-brand-navy">Get the app</p>
        <p className="mt-1 text-xs leading-snug text-slate-500">
          Faster, easier &amp;
          <br />
          exclusive offers!
        </p>
        <div className="my-3 flex items-center justify-center rounded-xl bg-white/70 py-4">
          <div className="flex gap-1.5">
            <span className="h-16 w-9 rounded-lg border-2 border-brand-navy/80 bg-white" />
            <span className="h-16 w-9 translate-y-1 rounded-lg border-2 border-brand-navy/80 bg-white" />
          </div>
        </div>
        <div className="space-y-2">
          <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-navy py-1.5 text-[11px] font-medium text-white">
            Google Play
          </button>
          <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-navy py-1.5 text-[11px] font-medium text-white">
            App Store
          </button>
        </div>
      </div>

      <div className="border-t border-surface-border px-4 py-4">
        <p className="text-xs text-slate-400">© 2026 UMUCURUZI</p>
        <p className="text-xs text-slate-400">All rights reserved.</p>
        <div className="mt-3 flex gap-3 text-slate-400">
          <Facebook size={16} />
          <Instagram size={16} />
          <Twitter size={16} />
          <Youtube size={16} />
        </div>
      </div>
    </div>
  );
}
