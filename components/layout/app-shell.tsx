"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { CartPanel } from "./cart-panel";
import { MobileCartBar } from "./mobile-cart-bar";

const HIDE_CART_PANEL_ROUTES = ["/cart", "/checkout"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const showCartPanel = !HIDE_CART_PANEL_ROUTES.some((r) => pathname.startsWith(r));

  return (
    <div className="min-h-screen bg-surface-muted">
      <Header onMenuClick={() => setMobileNavOpen(true)} />

      <div className="mx-auto flex max-w-[1600px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-[260px] shrink-0 border-r border-surface-border bg-white lg:block">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 pb-24 lg:pb-8">{children}</main>

        {/* Desktop cart panel */}
        {showCartPanel && (
          <aside className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-[360px] shrink-0 border-l border-surface-border xl:block">
            <CartPanel />
          </aside>
        )}
      </div>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-brand-navy/40"
          />
          <div className="absolute inset-y-0 left-0 w-[280px] overflow-y-auto bg-white shadow-panel">
            <div className="flex items-center justify-between border-b border-surface-border p-4">
              <span className="text-lg font-bold text-brand-navy">Menu</span>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-muted"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <MobileCartBar />
    </div>
  );
}
