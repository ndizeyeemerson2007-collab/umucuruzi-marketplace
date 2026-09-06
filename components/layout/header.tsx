"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { MapPin, Search, ChevronDown, Heart, Bell, ShoppingCart, Menu, LocateFixed } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useLocation } from "@/context/location-context";
import { currentCustomer } from "@/data/customer";

type SearchSuggestion = {
  label: string;
  type: "Restaurant" | "Cuisine" | "Dish";
};

function SearchField({
  query,
  setQuery,
  mobile = false,
}: {
  query: string;
  setQuery: (value: string) => void;
  mobile?: boolean;
}) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!isOpen || trimmedQuery.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Suggestion request failed");
        const nextSuggestions = (await response.json()) as SearchSuggestion[];
        setSuggestions(nextSuggestions);
        setHighlightedIndex(-1);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 180);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query, isOpen]);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  function selectSuggestion(suggestion: SearchSuggestion) {
    setQuery(suggestion.label);
    setIsOpen(false);
    setHighlightedIndex(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((current) =>
        Math.min(current + 1, Math.max(suggestions.length - 1, 0)),
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    } else if (event.key === "Enter" && isOpen && highlightedIndex >= 0) {
      event.preventDefault();
      const suggestion = suggestions[highlightedIndex];
      if (suggestion) selectSuggestion(suggestion);
    }
  }

  const showSuggestions = isOpen && query.trim().length >= 2 && (isLoading || suggestions.length > 0);

  return (
    <div
      ref={containerRef}
      className={mobile ? "relative" : "relative hidden max-w-xl flex-1 md:block"}
    >
      <form action="/restaurants" method="get">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          name="q"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search restaurants, cuisines, or dishes..."
          aria-label="Search restaurants, cuisines, or dishes"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={showSuggestions}
          aria-activedescendant={
            highlightedIndex >= 0 ? `${listboxId}-${highlightedIndex}` : undefined
          }
          className="w-full rounded-full border border-surface-border bg-surface-muted py-2.5 pl-11 pr-4 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none"
        />
      </form>

      {showSuggestions && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-surface-border bg-white py-2 shadow-xl"
        >
          {isLoading ? (
            <p className="px-4 py-3 text-sm text-slate-500">Finding suggestions...</p>
          ) : (
            suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.label}`}
                id={`${listboxId}-${index}`}
                type="button"
                role="option"
                aria-selected={highlightedIndex === index}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                  highlightedIndex === index
                    ? "bg-brand-50 text-brand-navy"
                    : "text-slate-600 hover:bg-surface-muted"
                }`}
              >
                <Search size={16} className="shrink-0 text-slate-400" />
                <span className="min-w-0 flex-1 truncate font-medium">{suggestion.label}</span>
                <span className="shrink-0 text-xs text-slate-400">{suggestion.type}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { itemCount } = useCart();
  const { location, status, requestLocation } = useLocation();
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-white">
      <div className="flex h-[72px] items-center gap-3 px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-full text-brand-navy hover:bg-surface-muted lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-50 shadow-card">
            <Image
              src="/umucuruzi-mark.png"
              alt="UMUCURUZI"
              fill
              sizes="36px"
              className="object-contain p-0.5"
              priority
            />
          </span>
          <span className="hidden text-xl font-bold tracking-tight text-brand-navy sm:inline">
            UMUCURUZI
          </span>
        </Link>

        {/* Location selector — desktop */}
        <button
          type="button"
          onClick={requestLocation}
          title={
            status === "denied"
              ? "Location access was denied — click to try again"
              : "Click to use your current location"
          }
          className="hidden shrink-0 items-center gap-2 rounded-full border border-surface-border bg-white px-4 py-2.5 text-sm font-medium text-brand-navy hover:border-brand-300 md:flex"
        >
          {status === "loading" ? (
            <LocateFixed size={16} className="animate-pulse text-brand-500" />
          ) : (
            <MapPin size={16} className="text-brand-500" />
          )}
          <span>{status === "loading" ? "Locating..." : location.label}</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>

        {/* Search bar */}
        <SearchField query={query} setQuery={setQuery} />

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            href="/partner"
            className="hidden whitespace-nowrap px-3 py-2 text-sm font-semibold text-brand-500 hover:text-brand-600 lg:inline-block"
          >
            Become a partner
          </Link>

          <Link
            href="/favorites"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-brand-navy hover:bg-surface-muted sm:flex"
            aria-label="Favorites"
          >
            <Heart size={20} />
          </Link>

          <button
            type="button"
            className="relative hidden h-10 w-10 items-center justify-center rounded-full text-brand-navy hover:bg-surface-muted sm:flex"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
              2
            </span>
          </button>

          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-brand-navy hover:bg-surface-muted"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          <Link
            href="/profile"
            className="ml-1 hidden items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-surface-muted sm:flex"
          >
            <span className="relative h-8 w-8 overflow-hidden rounded-full bg-surface-muted">
              <Image
                src={currentCustomer.avatar}
                alt={currentCustomer.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </span>
            <span className="text-left leading-tight">
              <span className="block text-sm font-semibold text-brand-navy">
                {currentCustomer.name}
              </span>
              <span className="block text-xs text-slate-400">
                {currentCustomer.role}
              </span>
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile location + search row */}
      <div className="border-t border-surface-border px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={requestLocation}
          className="mb-2 flex items-center gap-1.5 text-sm font-medium text-brand-navy"
        >
          {status === "loading" ? (
            <LocateFixed size={14} className="animate-pulse text-brand-500" />
          ) : (
            <MapPin size={14} className="text-brand-500" />
          )}
          <span>{status === "loading" ? "Locating..." : location.label}</span>
          <ChevronDown size={12} className="text-slate-400" />
        </button>
        <SearchField query={query} setQuery={setQuery} mobile />
      </div>
    </header>
  );
}
