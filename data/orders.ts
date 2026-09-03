import { Order } from "@/types/marketplace";

export const orders: Order[] = [
  {
    id: "ord-1001",
    restaurantId: "r1",
    items: [
      { productId: "p1", name: "Beef Burger", quantity: 1, price: 4500 },
      { productId: "p3", name: "Coca Cola 500ml", quantity: 2, price: 1000 },
    ],
    status: "delivered",
    placedAt: "2026-08-28T18:20:00.000Z",
    subtotal: 6500,
    deliveryFee: 1000,
    total: 7500,
    deliveryAddress: "Musanze, Rwanda",
    paymentMethod: "mtn_momo",
  },
  {
    id: "ord-1002",
    restaurantId: "r2",
    items: [
      { productId: "p5", name: "Chocolate Cake", quantity: 1, price: 3000 },
      { productId: "p6", name: "Cappuccino", quantity: 1, price: 2000 },
    ],
    status: "on_the_way",
    placedAt: "2026-09-02T15:10:00.000Z",
    subtotal: 5000,
    deliveryFee: 800,
    total: 5800,
    deliveryAddress: "Musanze, Rwanda",
    paymentMethod: "airtel_money",
  },
  {
    id: "ord-1003",
    restaurantId: "r4",
    items: [
      { productId: "p13", name: "BBQ Chicken Pizza", quantity: 1, price: 8000 },
      { productId: "p16", name: "Fresh Juice", quantity: 2, price: 2500 },
    ],
    status: "driver_assigned",
    placedAt: "2026-09-02T14:40:00.000Z",
    subtotal: 13000,
    deliveryFee: 1200,
    total: 14200,
    deliveryAddress: "Musanze, Rwanda",
    paymentMethod: "cash_on_delivery",
  },
  {
    id: "ord-1004",
    restaurantId: "r5",
    items: [{ productId: "p18", name: "Family Combo Bucket", quantity: 1, price: 15000 }],
    status: "preparing",
    placedAt: "2026-09-02T16:05:00.000Z",
    subtotal: 15000,
    deliveryFee: 900,
    total: 15900,
    deliveryAddress: "Musanze, Rwanda",
    paymentMethod: "mtn_momo",
  },
  {
    id: "ord-1005",
    restaurantId: "r3",
    items: [
      { productId: "p9", name: "Ubugali n'Isombe", quantity: 2, price: 3500 },
      { productId: "p12", name: "Passion Fruit Juice", quantity: 2, price: 1500 },
    ],
    status: "confirmed",
    placedAt: "2026-09-02T16:30:00.000Z",
    subtotal: 10000,
    deliveryFee: 1000,
    total: 11000,
    deliveryAddress: "Musanze, Rwanda",
    paymentMethod: "cash_on_delivery",
  },
];

export function getOrderById(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}
