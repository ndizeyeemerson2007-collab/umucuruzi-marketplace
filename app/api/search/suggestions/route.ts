import { NextRequest, NextResponse } from "next/server";
import { getCategories } from "@/lib/queries/categories";
import { getBestSellers } from "@/lib/queries/menu-items";
import { getAllRestaurants } from "@/lib/queries/restaurants";

type SuggestionType = "Restaurant" | "Cuisine" | "Dish";

type Suggestion = {
  label: string;
  type: SuggestionType;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const normalizedQuery = normalize(query);
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  const [restaurants, categories, bestSellers] = await Promise.all([
    getAllRestaurants(),
    getCategories(),
    getBestSellers(24),
  ]);

  const restaurantSuggestions: Suggestion[] = restaurants.map((restaurant) => ({
    label: restaurant.name,
    type: "Restaurant",
  }));
  const cuisineSuggestions: Suggestion[] = categories.map((category) => ({
    label: category.name,
    type: "Cuisine",
  }));
  const dishSuggestions: Suggestion[] = bestSellers.map((product) => ({
    label: product.name,
    type: "Dish",
  }));

  const candidates = [...restaurantSuggestions, ...cuisineSuggestions, ...dishSuggestions];
  const seen = new Set<string>();
  const suggestions = candidates.filter((suggestion) => {
    const key = `${suggestion.type}:${normalize(suggestion.label)}`;
    if (seen.has(key)) return false;
    seen.add(key);

    if (terms.length === 0) return true;
    const searchableText = normalize(suggestion.label);
    return terms.every((term) => searchableText.includes(term));
  });

  suggestions.sort((a, b) => {
    if (!normalizedQuery) return 0;
    const aStartsWith = normalize(a.label).startsWith(normalizedQuery);
    const bStartsWith = normalize(b.label).startsWith(normalizedQuery);
    if (aStartsWith !== bStartsWith) return aStartsWith ? -1 : 1;
    return a.label.localeCompare(b.label);
  });

  return NextResponse.json(suggestions.slice(0, 8), {
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" },
  });
}
