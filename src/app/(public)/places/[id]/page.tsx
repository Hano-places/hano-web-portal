"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getPlaceById } from "@/lib/places-data";
import { HOT_PROMOS, PLACE_MENU_ITEMS, type PromoType } from "@/lib/data/mock-data";
import { getOpenStatus } from "@/lib/place-hours";
import { PlaceWeeklyHours } from "@/components/places/place-weekly-hours";
import { CartItemAction, InCartBadge, useCartItemQty } from "@/components/places/cart-item-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { FilterChip } from "@/components/ui/filter-chip";
import { Price } from "@/components/ui/price";
import { TruncateTooltip } from "@/components/ui/truncate-tooltip";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useAddToCartWithConflict } from "@/hooks/use-add-to-cart";
import {
  PlaceReviewProvider,
  RateReviewButton,
} from "@/components/places/place-review-popover";
import {
  MenuItemPopoverProvider,
  useMenuItemPopover,
} from "@/components/places/menu-item-popover";
import {
  PromoPopoverProvider,
  usePromoPopover,
  type PromoDetail,
} from "@/components/places/promo-popover";
import { OrderStickyBar } from "@/components/layout/order-popover";
import { PlaceSocialLinks } from "@/components/places/place-social-links";
import { WishlistDishButton, WishlistPlaceButton } from "@/components/wishlist/wishlist-save-button";

export default function PlaceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const requireAuth = useRequireAuth();
  const { requestAdd, conflictDialog } = useAddToCartWithConflict();
  const [menuCategory, setMenuCategory] = useState("All");
  const place = getPlaceById(id);

  if (!place) {
    return <div className="py-12 text-center text-hano-muted">Place not found</div>;
  }

  const { isOpen, todayHours } = getOpenStatus(place.hours);
  const reviews = place.reviews ?? [];
  const socialLinks = [...(place.sameAs ?? []), ...(place.website ? [place.website] : [])];
  const placePromos = HOT_PROMOS.filter((promo) =>
    promo.location.toLowerCase().includes(place.name.toLowerCase()),
  ).slice(0, 2);
  const getPromoType = (title: string, explicit?: PromoType): PromoType => {
    if (explicit) return explicit;
    const normalized = title.toLowerCase();
    if (normalized.includes("free")) return "Free Item";
    if (
      normalized.includes("add-on") ||
      normalized.includes("addon") ||
      normalized.includes("extra")
    ) {
      return "Add-on";
    }
    return "Discount";
  };
  const getPromoStatus = (title: string): "Active" | "Upcoming" | "Ended" => {
    const normalized = title.toLowerCase();
    if (
      normalized.includes("soon") ||
      normalized.includes("coming") ||
      normalized.includes("upcoming") ||
      normalized.includes("next")
    ) {
      return "Upcoming";
    }
    if (
      normalized.includes("ended") ||
      normalized.includes("expired") ||
      normalized.includes("last chance")
    ) {
      return "Ended";
    }
    return "Active";
  };
  const activePromos =
    placePromos.length > 0
      ? placePromos
      : [
          {
            id: `${place.id}-promo-1`,
            title: `Earn ${place.featured ? "250" : "150"} bonus points on your next order`,
            location: place.name,
            points: place.featured ? 250 : 150,
            image: place.image,
            type: "Discount" as const,
            description: `Stack bonus points on your next order at ${place.name}. Valid while this promo is active.`,
            includedItems: PLACE_MENU_ITEMS.slice(0, 3).map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
            })),
          },
          {
            id: `${place.id}-promo-2`,
            title: `Midweek special at ${place.name}`,
            location: place.location,
            points: 100,
            image: place.image,
            type: "Add-on" as const,
            description: `Midweek add-on deals on popular dishes at ${place.name}.`,
            includedItems: PLACE_MENU_ITEMS.slice(2, 5).map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
            })),
          },
        ];
  const promosWithStatus = activePromos.map((promo) => {
    const status = getPromoStatus(promo.title);
    const dotClass =
      status === "Active"
        ? "bg-hano-primary-500"
        : status === "Upcoming"
          ? "bg-hano-white-200"
          : "bg-hano-muted";
    return {
      ...promo,
      status,
      dotClass,
      promoType: getPromoType(promo.title, promo.type),
    };
  });
  const staticMenu = place.menu?.flatMap((section) => section.items) ?? [];
  const menuCategories = ["All", ...new Set(PLACE_MENU_ITEMS.map((i) => i.category))];
  const menuItems =
    menuCategory === "All"
      ? PLACE_MENU_ITEMS.slice(0, 4)
      : PLACE_MENU_ITEMS.filter((i) => i.category === menuCategory).slice(0, 4);
  const getCategoryRank = (item: (typeof PLACE_MENU_ITEMS)[0]) =>
    PLACE_MENU_ITEMS.filter((i) => i.category === item.category)
      .sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.orders - a.orders;
      })
      .findIndex((i) => i.id === item.id) + 1;

  const handleAdd = (item: (typeof PLACE_MENU_ITEMS)[0]) => {
    if (!requireAuth("add_to_cart")) return;
    requestAdd(
      {
        id: `${id}-${item.id}`,
        name: item.name,
        price: item.price,
        priceRaw: item.priceRaw,
        image: item.image,
        placeId: id,
        placeName: place.name,
      },
      place.image,
    );
  };

  return (
    <PlaceReviewProvider>
      {conflictDialog}
      <div className="space-y-8 pb-24">
      <Link
        href="/places"
        className="inline-flex items-center gap-1 text-sm text-hano-muted transition-colors hover:text-hano-green-500"
      >
        <Icon name="chevronLeft" size={16} />
        Back to places
      </Link>
      <div className="relative h-56 overflow-hidden rounded-[var(--radius-card)] sm:h-80">
        <Image
          src={place.image}
          alt={place.name}
          fill
          sizes="(max-width: 1024px) 100vw, 896px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-hano-green-500/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex flex-wrap items-center gap-2">
            {place.featured ? (
              <span className="rounded-full bg-hano-primary-500 px-2.5 py-0.5 text-xs font-semibold text-hano-green-500">
                Featured
              </span>
            ) : null}
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium backdrop-blur ${
                isOpen ? "bg-hano-primary-100 text-hano-green-500" : "bg-white/80 text-hano-muted"
              }`}
            >
              {isOpen ? "Open now" : "Closed"} · {todayHours}
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold">{place.name}</h1>
          <p className="text-sm text-white/85">
            {place.category} · {place.location} · {place.priceRange}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <Icon name="star" size={18} className="text-hano-primary-600" />
            <span className="text-lg font-semibold">{place.rating.toFixed(1)}</span>
            <span className="text-sm text-hano-muted">· {reviews.length} reviews</span>
          </div>
          <p className="mt-3 text-hano-green-300">{place.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {place.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-hano-border bg-hano-primary-50 px-3 py-1 text-xs text-hano-green-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex w-full min-w-[min(100%,18rem)] flex-1 items-center justify-between gap-4 self-start sm:min-w-[22rem]">
          <div className="flex flex-wrap gap-2">
            <Link href={`/places/${id}/menu`}>
              <Button size="lg">Order now</Button>
            </Link>
            <RateReviewButton place={place} size="lg" />
          </div>
          <WishlistPlaceButton
            placeId={place.id}
            placeName={place.name}
            placeImage={place.image}
            category={place.category}
            rating={place.rating}
            size="md"
            className="shrink-0"
          />
        </div>
      </div>

      <section className="rounded-[var(--radius-card)] border border-hano-border bg-white p-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-hano-green-500">Restaurant Promos</h2>
          <p className="text-sm text-hano-muted">Latest offers added by this restaurant</p>
        </div>
        <PromoPopoverProvider menuHref={`/places/${id}/menu`}>
          <PlacePromosGrid
            promos={promosWithStatus}
            placeName={place.name}
          />
        </PromoPopoverProvider>
      </section>

      <section className="rounded-[var(--radius-card)] border border-hano-border bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-hano-green-500">Menu</h2>
            <p className="text-sm text-hano-muted">Popular items — add to cart and order ahead</p>
          </div>
          <Link href={`/places/${id}/menu`} className="cursor-pointer text-sm font-medium text-hano-green-500 transition-colors hover:underline">
            Full menu →
          </Link>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {menuCategories.map((cat) => (
            <FilterChip
              key={cat}
              label={cat}
              active={menuCategory === cat}
              onClick={() => setMenuCategory(cat)}
            />
          ))}
        </div>

        <MenuItemPopoverProvider placeId={id} placeName={place.name} onAddToCart={handleAdd}>
          <MenuItemsGrid
            placeId={id}
            placeName={place.name}
            menuItems={menuItems}
            handleAdd={handleAdd}
            getCategoryRank={getCategoryRank}
          />
        </MenuItemPopoverProvider>

        {staticMenu.length > 0 ? (
          <div className="mt-6 border-t border-hano-border pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-hano-muted">
              From the menu
            </p>
            <ul className="space-y-2">
              {staticMenu.slice(0, 3).map((item) => (
                <li key={item.name} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="text-hano-muted">{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-semibold text-hano-green-500">Hours</h2>
          <PlaceWeeklyHours hours={place.hours} />
        </section>

        <section>
          <h2 className="mb-3 font-semibold text-hano-green-500">Reviews</h2>
          <div className="space-y-3">
            {reviews.length > 0 ? (
              reviews.slice(0, 2).map((review, i) => (
                <Card key={`${review.author}-${i}`}>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Icon
                          key={j}
                          name="star"
                          size={14}
                          className={j < review.rating ? "text-hano-primary-600" : "text-hano-border"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-hano-muted">{review.author}</span>
                  </div>
                  <p className="mt-2 text-sm">{review.text}</p>
                </Card>
              ))
            ) : (
              <Card>
                <p className="text-sm text-hano-muted">No reviews yet. Be the first!</p>
              </Card>
            )}
          </div>
        </section>
      </div>

      {socialLinks.length > 0 ? <PlaceSocialLinks links={socialLinks} /> : null}

      <OrderStickyBar placeId={id} />
    </div>
    </PlaceReviewProvider>
  );
}

function PlacePromosGrid({
  promos,
  placeName,
}: {
  promos: {
    id: string;
    title: string;
    image: string;
    status: "Active" | "Upcoming" | "Ended";
    dotClass: string;
    promoType: PromoType;
    description?: string;
    includedItems?: PromoDetail["includedItems"];
  }[];
  placeName: string;
}) {
  const { openPromo } = usePromoPopover();

  const toDetail = (promo: (typeof promos)[0]): PromoDetail => ({
    id: promo.id,
    title: promo.title,
    description:
      promo.description ??
      `Enjoy this ${promo.promoType.toLowerCase()} at ${placeName}.`,
    image: promo.image,
    promoType: promo.promoType,
    status: promo.status,
    placeName,
    includedItems:
      promo.includedItems ??
      PLACE_MENU_ITEMS.slice(0, 3).map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      })),
  });

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {promos.map((promo) => (
        <article
          key={promo.id}
          className="group relative h-80 cursor-pointer overflow-hidden rounded-[28px] border border-hano-border transition-colors hover:border-hano-primary-500"
          onClick={(event) =>
            openPromo(toDetail(promo), event.currentTarget.getBoundingClientRect())
          }
        >
          <Image
            src={promo.image}
            alt={promo.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-hano-green-500/65 via-40% to-hano-green-500/10" />

          <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-sm text-white backdrop-blur">
            <span className={`h-2.5 w-2.5 rounded-full ${promo.dotClass}`} />
            {promo.status}
          </div>

          <div className="absolute inset-x-4 bottom-4 text-white">
            <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-medium tracking-wide text-white/95 backdrop-blur">
              {promo.promoType}
            </span>
            <p className="mt-3 max-w-[92%] text-2xl font-normal leading-snug tracking-tight text-white/90">
              {promo.title}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

function MenuItemsGrid({
  placeId,
  placeName,
  menuItems,
  handleAdd,
  getCategoryRank,
}: {
  placeId: string;
  placeName: string;
  menuItems: (typeof PLACE_MENU_ITEMS);
  handleAdd: (item: (typeof PLACE_MENU_ITEMS)[0]) => void;
  getCategoryRank: (item: (typeof PLACE_MENU_ITEMS)[0]) => number;
}) {
  const { openMenuItem } = useMenuItemPopover();

  return (
    <div className="grid gap-2.5 sm:auto-rows-fr sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
      {menuItems.map((item) => (
        <MenuItemGridCard
          key={item.id}
          placeId={placeId}
          placeName={placeName}
          item={item}
          handleAdd={handleAdd}
          getCategoryRank={getCategoryRank}
          onOpen={openMenuItem}
        />
      ))}
    </div>
  );
}

function MenuItemGridCard({
  placeId,
  placeName,
  item,
  handleAdd,
  getCategoryRank,
  onOpen,
}: {
  placeId: string;
  placeName: string;
  item: (typeof PLACE_MENU_ITEMS)[0];
  handleAdd: (item: (typeof PLACE_MENU_ITEMS)[0]) => void;
  getCategoryRank: (item: (typeof PLACE_MENU_ITEMS)[0]) => number;
  onOpen: ReturnType<typeof useMenuItemPopover>["openMenuItem"];
}) {
  const cartItemId = `${placeId}-${item.id}`;
  const qty = useCartItemQty(cartItemId);
  const inCart = qty > 0;

  return (
    <div
      className={`group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border p-2.5 transition-colors hover:border-hano-primary-500 hover:bg-hano-primary-50 ${
        inCart ? "border-hano-primary-500 bg-hano-primary-50/60" : "border-hano-border"
      }`}
      onClick={(event) =>
        onOpen(
          { item, categoryRank: getCategoryRank(item) },
          event.currentTarget.getBoundingClientRect(),
        )
      }
    >
      <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden rounded-lg bg-hano-surface">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <WishlistDishButton
          placeId={placeId}
          placeName={placeName}
          itemId={item.id}
          itemName={item.name}
          itemImage={item.image}
          itemPrice={item.price}
          itemPriceRaw={item.priceRaw}
          overlay
        />
        {inCart ? <InCartBadge className="absolute left-1.5 top-1.5" /> : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col pt-2">
        <TruncateTooltip className="text-sm font-medium text-hano-green-500">
          {item.name}
        </TruncateTooltip>
        <TruncateTooltip className="mt-0.5 min-h-6 text-xs text-hano-muted" lines={2}>
          {item.desc}
        </TruncateTooltip>
        <div className="mt-auto flex items-center justify-between gap-1.5 pt-2">
          <Price>{item.price}</Price>
          <CartItemAction
            cartItemId={cartItemId}
            size="sm"
            compact
            onAdd={() => handleAdd(item)}
          />
        </div>
      </div>
    </div>
  );
}
