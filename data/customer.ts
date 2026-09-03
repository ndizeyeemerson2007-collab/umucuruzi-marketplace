import { Customer } from "@/types/marketplace";

// Mock signed-in customer. Will be replaced by real auth/session data later.
export const currentCustomer: Customer = {
  id: "cust-1",
  name: "Emerson",
  role: "Customer",
  avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80",
  phone: "+250 788 000 000",
  email: "emerson@example.com",
};
