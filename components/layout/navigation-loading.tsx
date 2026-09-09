"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { usePathname } from "next/navigation";

function isModifiedClick(event: MouseEvent) {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export function NavigationLoading() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (isModifiedClick(event)) return;

      const target = event.target as HTMLElement | null;
      const link = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      setLoading(true);
    };

    const handlePopState = () => setLoading(true);
    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100]" role="status" aria-live="polite" aria-label="Loading page">
      <div className="h-0.5 w-full overflow-hidden bg-brand-100">
        <div className="h-full w-2/5 animate-loading-bar rounded-full bg-brand-500" />
      </div>
      <div className="absolute right-4 top-3 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-navy shadow-panel sm:right-6">
        <LoaderCircle size={14} className="animate-spin text-brand-500" />
        Loading...
      </div>
    </div>
  );
}
