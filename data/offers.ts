import { Offer } from "@/types/marketplace";

export const offers: Offer[] = [
  {
    id: "o1",
    title: "Up to 30% OFF",
    subtitle: "On selected restaurants this week",
    color: "blue",
    icon: "Percent",
  },
  {
    id: "o2",
    title: "Free delivery",
    subtitle: "On orders above 10,000 RWF",
    color: "green",
    icon: "Truck",
  },
  {
    id: "o3",
    title: "Buy 1 Get 1",
    subtitle: "On all pizzas at Pizza Point Musanze",
    color: "yellow",
    icon: "Gift",
    restaurantId: "r6",
  },
  {
    id: "o4",
    title: "Weekend specials",
    subtitle: "Discounted combos every Sat & Sun",
    color: "navy",
    icon: "Sparkles",
  },
  {
    id: "o5",
    title: "20% OFF drinks",
    subtitle: "At Juice Hub, all day",
    color: "blue",
    icon: "CupSoda",
    restaurantId: "r10",
  },
  {
    id: "o6",
    title: "Free dessert",
    subtitle: "On orders above 8,000 RWF at Inzozi Café",
    color: "yellow",
    icon: "Gift",
    restaurantId: "r2",
  },
  {
    id: "o7",
    title: "First order discount",
    subtitle: "1,500 RWF off your first UMUCURUZI order",
    color: "green",
    icon: "BadgePercent",
  },
  {
    id: "o8",
    title: "Bundle & save",
    subtitle: "Combo meals from 5,000 RWF at Kigali Bites",
    color: "navy",
    icon: "PackagePlus",
    restaurantId: "r5",
  },
];
