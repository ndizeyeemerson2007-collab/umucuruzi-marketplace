import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { getOrderById } from "@/data/orders";
import { getRestaurantById } from "@/data/restaurants";
import { formatRwf } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_SEQUENCE } from "@/lib/order-status";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = getOrderById(params.id);
  if (!order) notFound();

  const restaurant = getRestaurantById(order.restaurantId);
  const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(order.status);

  return (
    <div className="mx-auto max-w-2xl px-5 py-6 sm:px-8">
      <div className="flex items-center gap-3">
        <Link
          href="/orders"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-muted"
          aria-label="Back to orders"
        >
          <ArrowLeft size={20} className="text-brand-navy" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-brand-navy">Order {order.id}</h1>
          <p className="text-sm text-slate-400">{restaurant?.name}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-card">
        <ol className="space-y-0">
          {ORDER_STATUS_SEQUENCE.map((status, idx) => {
            const info = ORDER_STATUS_LABELS[status];
            const isComplete = idx <= currentIndex;
            const isLast = idx === ORDER_STATUS_SEQUENCE.length - 1;
            return (
              <li key={status} className="relative flex gap-4 pb-8 last:pb-0">
                {!isLast && (
                  <span
                    className={`absolute left-[11px] top-6 h-full w-0.5 ${
                      idx < currentIndex ? "bg-brand-500" : "bg-surface-border"
                    }`}
                  />
                )}
                <span className="z-10 shrink-0">
                  {isComplete ? (
                    <CheckCircle2 size={24} className="fill-brand-500 text-white" />
                  ) : (
                    <Circle size={24} className="text-surface-border" />
                  )}
                </span>
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      isComplete ? "text-brand-navy" : "text-slate-400"
                    }`}
                  >
                    {info.label}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">{info.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Order items */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-card">
        <h2 className="text-sm font-bold text-brand-navy">Items</h2>
        <div className="mt-3 space-y-2">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between text-sm">
              <span className="text-slate-500">
                {item.quantity}x {item.name}
              </span>
              <span className="font-medium text-brand-navy">
                {formatRwf(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="my-3 border-t border-surface-border" />
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="font-medium text-brand-navy">{formatRwf(order.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Delivery Fee</span>
            <span className="font-medium text-brand-navy">{formatRwf(order.deliveryFee)}</span>
          </div>
          <div className="flex items-center justify-between pt-1 text-base font-bold text-brand-navy">
            <span>Total</span>
            <span>{formatRwf(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-card">
        <h2 className="text-sm font-bold text-brand-navy">Delivery details</h2>
        <p className="mt-2 text-sm text-slate-500">{order.deliveryAddress}</p>
        <p className="mt-1 text-sm capitalize text-slate-500">
          Payment: {order.paymentMethod.replace(/_/g, " ")}
        </p>
      </div>
    </div>
  );
}
