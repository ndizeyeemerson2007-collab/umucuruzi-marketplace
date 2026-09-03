import Link from "next/link";
import { orders } from "@/data/orders";
import { getRestaurantById } from "@/data/restaurants";
import { formatRwf } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";

export default function OrdersPage() {
  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10">
      <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">Orders</h1>
      <p className="mt-1 text-sm text-slate-500">Your order history and live tracking.</p>

      <div className="mt-6 space-y-3">
        {orders.map((order) => {
          const restaurant = getRestaurantById(order.restaurantId);
          const statusInfo = ORDER_STATUS_LABELS[order.status];
          return (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-card hover:shadow-panel"
            >
              <div className="min-w-0">
                <p className="font-semibold text-brand-navy">{restaurant?.name ?? "Restaurant"}</p>
                <p className="mt-0.5 text-sm text-slate-400">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""} &middot;{" "}
                  {new Date(order.placedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
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
    </div>
  );
}
