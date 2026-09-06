"use client";

import Link from "next/link";
import { Category } from "@/types/marketplace";
import { getIcon } from "@/lib/icons";

export function CategoryNav({
  categories,
  activeSlug = "all",
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 py-5 sm:px-8 lg:px-10">
      <Link
        href="/categories/all"
        className={`flex w-[76px] shrink-0 flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-center transition-colors ${
          activeSlug === "all"
            ? "border-brand-200 bg-brand-50"
            : "border-surface-border bg-white hover:border-brand-200"
        }`}
      >
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            activeSlug === "all" ? "bg-brand-500 text-white" : "bg-surface-muted text-brand-navy"
          }`}
        >
          {(() => {
            const AllIcon = getIcon("LayoutGrid");
            return <AllIcon size={18} />;
          })()}
        </span>
        <span
          className={`text-xs font-medium leading-tight ${
            activeSlug === "all" ? "text-brand-600" : "text-slate-500"
          }`}
        >
          All
        </span>
      </Link>

      {categories.map((category) => {
        const Icon = getIcon(category.icon);
        const isActive = category.slug === activeSlug;
        return (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className={`flex w-[76px] shrink-0 flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-center transition-colors ${
              isActive
                ? "border-brand-200 bg-brand-50"
                : "border-surface-border bg-white hover:border-brand-200"
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                isActive ? "bg-brand-500 text-white" : "bg-surface-muted text-brand-navy"
              }`}
            >
              <Icon size={18} />
            </span>
            <span
              className={`text-xs font-medium leading-tight ${
                isActive ? "text-brand-600" : "text-slate-500"
              }`}
            >
              {category.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
