"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ClipboardList, LogIn } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { formatRwf } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";
import type { Order } from "@/types/marketplace";

export default function OrdersPage() {
  const { user, session, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !session?.access_token) {
      setOrders([]);
      return;
    }

    let mounted = true;
    setLoading(true);
    fetch("/api/account/orders", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load orders.");
        return (await response.json()) as { orders: Order[] };
      })
      .then((data) => {
        if (mounted) setOrders(data.orders);
      })
      .catch(() => {
        if (mounted) setOrders([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [session?.access_token, user]);

  if (authLoading) {
    return <div className="px-5 py-10 text-sm text-slate-500 sm:px-8 lg:px-10">Checking your account...</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-5 py-12 text-center sm:px-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <LogIn size={25} />
        </div>
        <h1 className="mt-4 text-xl font-bold text-brand-navy sm:text-2xl">Log in to see your orders</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          You can order as a guest, but an account lets you keep your order history in one place.
        </p>
        <Link
          href="/account"
          className="mt-5 inline-flex rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Log in or create an account
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <ClipboardList size={21} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">Your orders</h1>
          <p className="mt-0.5 text-sm text-slate-500">Your order history and live tracking.</p>
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-slate-500">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-card">
          <p className="text-base font-semibold text-brand-navy">No orders yet</p>
          <p className="mt-1 text-sm text-slate-400">Your placed orders will show up here.</p>
          <Link
            href="/restaurants"
            className="mt-4 inline-block rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Browse restaurants
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((order) => {
            const statusInfo = ORDER_STATUS_LABELS[order.status];
            return (
              <Link
                key={order.id}
                href={`/orders/${order.orderNumber}`}
                className="flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-card hover:shadow-panel"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-brand-navy">{order.restaurantName ?? "Restaurant"}</p>
                  <p className="mt-0.5 text-sm text-slate-400">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""} · {new Date(order.placedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-bold text-brand-navy">{formatRwf(order.total)}</p>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusInfo.badgeClass}`}>
                    {statusInfo.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
