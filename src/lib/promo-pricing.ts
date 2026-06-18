import type { MenuItem, PromoIncludedItem } from "@/lib/data/mock-data";
import { PLACE_MENU_ITEMS } from "@/lib/data/mock-data";

export function parsePriceRawFromLabel(price?: string): number {
  if (!price) return 0;
  const parsed = Number(price.replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function resolvePromoItemPricing(
  item: PromoIncludedItem,
  catalog: MenuItem[] = PLACE_MENU_ITEMS,
) {
  const menuItem = catalog.find((entry) => entry.id === item.id);
  const price = item.price ?? menuItem?.price ?? "";
  const priceRaw =
    item.priceRaw ??
    menuItem?.priceRaw ??
    (parsePriceRawFromLabel(price) || 0);

  return {
    price,
    priceRaw,
    image: item.image ?? menuItem?.image ?? "",
  };
}
