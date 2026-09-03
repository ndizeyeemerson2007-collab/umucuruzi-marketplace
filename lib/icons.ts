import {
  LayoutGrid,
  Beef,
  Pizza,
  Drumstick,
  Soup,
  CupSoda,
  Coffee,
  Cake,
  Beer,
  MoreHorizontal,
  Percent,
  Truck,
  Gift,
  Sparkles,
  BadgePercent,
  PackagePlus,
  type LucideIcon,
} from "lucide-react";

// Central lookup so mock data can reference icons by string name
// (keeps `data/*.ts` free of JSX/component imports).
export const iconMap: Record<string, LucideIcon> = {
  LayoutGrid,
  Beef,
  Pizza,
  Drumstick,
  Soup,
  CupSoda,
  Coffee,
  Cake,
  Beer,
  MoreHorizontal,
  Percent,
  Truck,
  Gift,
  Sparkles,
  BadgePercent,
  PackagePlus,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? MoreHorizontal;
}
