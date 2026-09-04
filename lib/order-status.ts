import { OrderStatus } from "@/types/marketplace";

export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  "confirmed",
  "preparing",
  "driver_assigned",
  "on_the_way",
  "delivered",
];

export const ORDER_STATUS_LABELS: Record<
  OrderStatus,
  { label: string; description: string; badgeClass: string }
> = {
  confirmed: {
    label: "Order confirmed",
    description: "The restaurant has received your order.",
    badgeClass: "bg-brand-50 text-brand-600",
  },
  preparing: {
    label: "Restaurant preparing",
    description: "Your food is being prepared.",
    badgeClass: "bg-warn-bg text-warn",
  },
  driver_assigned: {
    label: "Driver assigned",
    description: "A delivery driver has been assigned to your order.",
    badgeClass: "bg-warn-bg text-warn",
  },
  on_the_way: {
    label: "On the way",
    description: "Your order is on its way to you.",
    badgeClass: "bg-brand-50 text-brand-600",
  },
  delivered: {
    label: "Delivered",
    description: "Your order has been delivered. Enjoy!",
    badgeClass: "bg-success-bg text-success",
  },
  cancelled: {
    label: "Cancelled",
    description: "This order was cancelled.",
    badgeClass: "bg-red-50 text-red-500",
  },
};
