import { places, type PlaceSeed } from "@/content/places";

export type WebPlaceCard = {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  location: string;
  verified: boolean;
  category: string;
  type: string;
  priceRange: string;
  tags: readonly string[];
};

function toCard(place: PlaceSeed): WebPlaceCard {
  return {
    id: place.id,
    name: place.name,
    description: place.description,
    image: place.image,
    rating: place.rating,
    location: place.location,
    verified: Boolean(place.featured),
    category: place.category,
    type: place.type,
    priceRange: place.priceRange,
    tags: place.tags,
  };
}

export function getPlaces(): WebPlaceCard[] {
  return places.map(toCard);
}

export function getPlaceById(id: string): PlaceSeed | undefined {
  return places.find((p) => p.id === id);
}

export function getFeaturedPlaces(): WebPlaceCard[] {
  return places.filter((p) => p.featured).map(toCard);
}

export function getPlacesByType(type: string): WebPlaceCard[] {
  if (type === "all") return getPlaces();
  const normalized = type.toLowerCase();
  return places
    .filter((p) => {
      if (normalized === "restaurants") return p.type === "restaurant" || p.type === "fine-dining" || p.type === "bistro";
      if (normalized === "cafés" || normalized === "cafes") return p.type === "cafe" || p.type === "bakery";
      if (normalized === "lounges") return p.type === "lounge";
      if (normalized === "bars") return p.type === "bar";
      return p.type === normalized;
    })
    .map(toCard);
}

export function searchPlaces(query: string): WebPlaceCard[] {
  const q = query.trim().toLowerCase();
  if (!q) return getPlaces();
  return places
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
    .map(toCard);
}
