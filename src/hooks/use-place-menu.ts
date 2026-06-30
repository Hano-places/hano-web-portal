"use client";

import { useEffect, useState } from "react";
import { placesApi } from "@/lib/api/places";
import type { ConsumerMenuItem } from "@/lib/api/types";
import { PLACE_MENU_ITEMS, type MenuItem } from "@/lib/data/mock-data";

function formatRwf(price: number): string {
  return `${price.toLocaleString("en-US")} RWF`;
}

/**
 * Server menu item IDs are seeded as `${placeId}__mi_${slug}`, where slug matches
 * the mock PLACE_MENU_ITEMS ids ("1".."6"). We map the live API menu into the
 * existing MenuItem shape so the UI keeps working, using the real server menu
 * item id (needed for cart/order) plus the mock dish image/rating for visuals.
 */
function toMenuItem(apiItem: ConsumerMenuItem): MenuItem {
  const slug = apiItem.id.split("__mi_")[1] ?? apiItem.id;
  const mock = PLACE_MENU_ITEMS.find((m) => m.id === slug);
  const name = apiItem.customName ?? apiItem.globalItem.canonicalName;
  const category = apiItem.categories[0]?.name ?? apiItem.globalItem.category;
  const image = apiItem.images[0]?.url ?? mock?.image ?? "";

  return {
    id: apiItem.id,
    name,
    desc: apiItem.shortDescription ?? mock?.desc ?? "",
    price: formatRwf(apiItem.price),
    priceRaw: apiItem.price,
    orders: mock?.orders ?? 0,
    rating: mock?.rating ?? 0,
    image,
    images: mock?.images ?? (image ? [image] : []),
    category,
  };
}

export interface PlaceMenuState {
  items: MenuItem[];
  loading: boolean;
  /** "api" once live data has loaded, otherwise "mock" (loading or empty). */
  source: "api" | "mock";
}

/**
 * Fetches a place's live menu from the API and maps it to the UI's MenuItem
 * shape. Falls back to the shared mock menu while loading or if the API has no
 * data, so the page never renders empty.
 */
export function usePlaceMenu(placeId: string): PlaceMenuState {
  const [state, setState] = useState<PlaceMenuState>({
    items: PLACE_MENU_ITEMS,
    loading: true,
    source: "mock",
  });

  useEffect(() => {
    let active = true;

    placesApi
      .getMenu(placeId)
      .then((res) => {
        if (!active) return;
        const items = res.items
          .filter((item) => item.availabilityStatus === "active")
          .map(toMenuItem);
        setState({
          items: items.length > 0 ? items : PLACE_MENU_ITEMS,
          loading: false,
          source: items.length > 0 ? "api" : "mock",
        });
      })
      .catch(() => {
        if (!active) return;
        setState({ items: PLACE_MENU_ITEMS, loading: false, source: "mock" });
      });

    return () => {
      active = false;
    };
  }, [placeId]);

  return state;
}
