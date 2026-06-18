import { places } from "@/content/places";
import { PLACE_MENU_ITEMS, TOP_DISHES } from "@/lib/data/mock-data";
import { searchPlaceSeeds } from "@/lib/places-data";

export type SearchSuggestion = {
  id: string;
  type: "place" | "dish";
  title: string;
  subtitle: string;
  image: string;
  href: string;
};

function resolvePlaceIdForLocation(location: string): string {
  const normalized = location.trim().toLowerCase();
  const match = places.find(
    (place) =>
      place.name.toLowerCase().includes(normalized) ||
      place.location.toLowerCase().includes(normalized) ||
      normalized.includes(place.name.toLowerCase()),
  );
  return match?.id ?? places[0]?.id ?? "";
}

function searchDishes(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const menuMatches = PLACE_MENU_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q),
  ).map((item) => ({
    id: `menu-${item.id}`,
    type: "dish" as const,
    title: item.name,
    subtitle: `${item.category} · ${item.price}`,
    image: item.image,
    href: `/places/${resolvePlaceIdForLocation(places[0]?.name ?? "")}`,
  }));

  const topMatches = TOP_DISHES.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q),
  ).map((item) => ({
    id: `dish-${item.id}`,
    type: "dish" as const,
    title: item.name,
    subtitle: `${item.location} · ${item.price}`,
    image: item.image,
    href: `/places/${resolvePlaceIdForLocation(item.location)}`,
  }));

  const seen = new Set<string>();
  return [...menuMatches, ...topMatches].filter((item) => {
    const key = item.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getSearchSuggestions(query: string, limit = 8): SearchSuggestion[] {
  const q = query.trim();
  if (q.length < 2) return [];

  const placeResults: SearchSuggestion[] = searchPlaceSeeds(q).slice(0, 5).map((place) => ({
    id: `place-${place.id}`,
    type: "place",
    title: place.name,
    subtitle: `${place.location} · ${place.category}`,
    image: place.image,
    href: `/places/${place.id}`,
  }));

  const dishResults = searchDishes(q).slice(0, 5);
  const combined = [...placeResults, ...dishResults];

  return combined.slice(0, limit);
}
