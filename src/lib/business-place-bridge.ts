import { IMG } from "@/content/images";
import type { PlaceSeed } from "@/content/places";
import type { MenuItem, PromoItem } from "@/lib/data/mock-data";
import { businessHoursToWeeklyHours } from "@/lib/business-hours";
import type { WeeklyHours } from "@/lib/place-hours";
import {
  useBusinessStore,
  type BusinessMenuItem,
  type BusinessProfile,
  type BusinessPromo,
} from "@/store/business";

export function slugifyBusinessName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeProfile(profile: BusinessProfile): BusinessProfile {
  return {
    ...profile,
    placeSlug: profile.placeSlug ?? slugifyBusinessName(profile.name),
    sameAs: profile.sameAs ?? [],
    menuItems: profile.menuItems ?? [],
    promos: profile.promos ?? [],
  };
}

export function businessMenuItemToMenuItem(item: BusinessMenuItem): MenuItem {
  return {
    id: item.id,
    name: item.name,
    desc: item.desc,
    price: item.price,
    priceRaw: item.priceRaw,
    orders: 0,
    rating: 0,
    image: item.image || IMG.modernCafe,
    category: item.category,
  };
}

export function businessPromosToPlacePromos(
  promos: BusinessPromo[],
  menuItems: BusinessMenuItem[],
  placeName: string,
  fallbackImage: string,
): PromoItem[] {
  return promos.map((promo) => ({
    id: promo.id,
    title: promo.title,
    location: placeName,
    points: 0,
    image: promo.image || fallbackImage,
    type: promo.promoType,
    description: promo.description,
    includedItems: promo.includedItemIds.map((itemId) => {
      const item = menuItems.find((entry) => entry.id === itemId);
      if (!item) {
        return { id: itemId, name: "Menu item" };
      }
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        priceRaw: item.priceRaw,
        image: item.image,
      };
    }),
  }));
}

export function businessProfileToPlaceSeed(profile: BusinessProfile): PlaceSeed {
  const normalized = normalizeProfile(profile);
  return {
    id: normalized.placeSlug,
    slug: normalized.placeSlug,
    name: normalized.name,
    category: normalized.category,
    type: "restaurant",
    location: normalized.address,
    rating: 0,
    priceRange: "$$",
    description: normalized.description,
    image: (normalized.bannerUrl ||
      normalized.logoUrl ||
      IMG.modernCafe) as PlaceSeed["image"],
    tags: normalized.category ? [normalized.category] : [],
    hours: businessHoursToWeeklyHours(normalized.hours),
    website: normalized.website,
    sameAs: normalized.sameAs,
    phone: normalized.phone,
  };
}

export type BusinessPlaceOverrides = {
  profile: BusinessProfile;
  placeSeed: PlaceSeed;
  weeklyHours: WeeklyHours;
  socialLinks: string[];
  menuItems: MenuItem[];
  promos: PromoItem[];
};

export function getBusinessPlaceOverrides(
  placeId: string,
  profile: BusinessProfile | null,
): BusinessPlaceOverrides | null {
  if (!profile) return null;

  const normalized = normalizeProfile(profile);
  if (normalized.placeSlug !== placeId) return null;

  const placeSeed = businessProfileToPlaceSeed(normalized);
  const menuItems = normalized.menuItems.map(businessMenuItemToMenuItem);
  const promos = businessPromosToPlacePromos(
    normalized.promos,
    normalized.menuItems,
    normalized.name,
    placeSeed.image,
  );

  const socialLinks = [
    ...normalized.sameAs,
    ...(normalized.website ? [normalized.website] : []),
  ].filter(Boolean);

  return {
    profile: normalized,
    placeSeed,
    weeklyHours: placeSeed.hours,
    socialLinks,
    menuItems,
    promos,
  };
}

export function useBusinessPlaceOverrides(placeId: string): BusinessPlaceOverrides | null {
  const profile = useBusinessStore((state) => state.profile);
  return getBusinessPlaceOverrides(placeId, profile);
}
