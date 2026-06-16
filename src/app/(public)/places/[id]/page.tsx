"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getPlaceById } from "@/lib/places-data";
import { HOT_PROMOS, PLACE_MENU_ITEMS } from "@/lib/data/mock-data";
import { formatWeeklyHours, getOpenStatus } from "@/lib/place-hours";
import { AddToCartButton } from "@/components/places/add-to-cart-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { FilterChip } from "@/components/ui/filter-chip";
import { TruncateTooltip } from "@/components/ui/truncate-tooltip";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useAddToCartWithConflict } from "@/hooks/use-add-to-cart";
import { useCartStore } from "@/store/cart";
import {
  PlaceReviewProvider,
  RateReviewButton,
} from "@/components/places/place-review-popover";
import {
  MenuItemPopoverProvider,
  useMenuItemPopover,
} from "@/components/places/menu-item-popover";
import { useOrderPopover } from "@/components/layout/order-popover";

export default function PlaceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const requireAuth = useRequireAuth();
  const { requestAdd, conflictDialog } = useAddToCartWithConflict();
  const { openOrderPopover } = useOrderPopover();
  const itemCount = useCartStore((s) => s.getItemCount());
  const [menuCategory, setMenuCategory] = useState("All");
  const place = getPlaceById(id);

  if (!place) {
    return <div className="py-12 text-center text-hano-muted">Place not found</div>;
  }

  const { isOpen, todayHours } = getOpenStatus(place.hours);
  const weeklyHours = formatWeeklyHours(place.hours);
  const reviews = place.reviews ?? [];
  const socialLinks = [...(place.sameAs ?? []), ...(place.website ? [place.website] : [])];
  const socialProfiles = socialLinks.map((url) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace("www.", "").toLowerCase();
      const slug = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
      const username = slug ? `@${slug}` : host;

      if (host.includes("instagram")) {
        return { url, platform: "Instagram", icon: "IG", username };
      }
      if (host.includes("facebook")) {
        return { url, platform: "Facebook", icon: "FB", username };
      }
      if (host.includes("x.com") || host.includes("twitter")) {
        return { url, platform: "X", icon: "X", username };
      }
      if (host.includes("tiktok")) {
        return { url, platform: "TikTok", icon: "TT", username };
      }
      if (host.includes("youtube")) {
        return { url, platform: "YouTube", icon: "YT", username };
      }

      return { url, platform: "Website", icon: "WEB", username: host };
    } catch {
      return { url, platform: "Website", icon: "WEB", username: "website" };
    }
  });
  const placePromos = HOT_PROMOS.filter((promo) =>
    promo.location.toLowerCase().includes(place.name.toLowerCase()),
  ).slice(0, 2);
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
          },
          {
            id: `${place.id}-promo-2`,
            title: `Midweek special at ${place.name}`,
            location: place.location,
            points: 100,
            image: place.image,
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
    return { ...promo, status, dotClass };
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
      <div className="space-y-8">
      <Link
        href="/places"
        className="inline-flex items-center gap-1 text-sm text-hano-muted transition-colors hover:text-hano-green-500"
      >
        <Icon name="chevronLeft" size={16} />
        Back to places
      </Link>
      <div className="relative h-56 overflow-hidden rounded-[var(--radius-card)] sm:h-80">
        <Image src={place.image} alt={place.name} fill className="object-cover" priority />
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
        <div className="flex flex-wrap gap-2">
          <Link href={`/places/${id}/menu`}>
            <Button size="lg">Order now</Button>
          </Link>
          <RateReviewButton place={place} size="lg" />
        </div>
      </div>

      <section className="rounded-[var(--radius-card)] border border-hano-border bg-white p-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-hano-green-500">Restaurant Promos</h2>
          <p className="text-sm text-hano-muted">Latest offers added by this restaurant</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {promosWithStatus.map((promo) => (
            <article
              key={promo.id}
              className="group relative h-80 overflow-hidden rounded-[28px] border border-hano-border"
            >
              <Image src={promo.image} alt={promo.title} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-hano-green-500/85 via-hano-green-500/35 to-transparent" />

              <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-sm text-white backdrop-blur">
                <span className={`h-2.5 w-2.5 rounded-full ${promo.dotClass}`} />
                {promo.status}
              </div>

              <div className="absolute inset-x-4 bottom-4 text-white">
                <p className="max-w-[90%] text-3xl font-semibold leading-tight tracking-tight">
                  {promo.title}
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-3xl font-semibold">
                  +{promo.points}
                  <Icon name="star" size={24} className="text-hano-primary-500" />
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/45 backdrop-blur">
                    <Icon name="restaurant" size={20} />
                  </div>
                  <p className="text-2xl font-medium leading-tight">{promo.location}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
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

        <MenuItemPopoverProvider onAddToCart={handleAdd}>
          <MenuItemsGrid menuItems={menuItems} handleAdd={handleAdd} getCategoryRank={getCategoryRank} />
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
          <Card>
            <ul className="space-y-2 text-sm">
              {weeklyHours.map(({ day, hours }) => (
                <li key={day} className="flex justify-between">
                  <span className="text-hano-muted">{day}</span>
                  <span>{hours}</span>
                </li>
              ))}
            </ul>
          </Card>
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

      {socialProfiles.length > 0 ? (
        <section className="rounded-[var(--radius-card)] border border-hano-border bg-white p-5">
          <p className="mb-3 text-xs font-semibold tracking-wide text-hano-muted">
            Stalk us here :)
          </p>
          <div className="space-y-2">
            {socialProfiles.map((profile) => (
              <a
                key={profile.url}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-hano-border bg-[#fffdfb] px-3 py-2 transition-colors hover:border-(--foundation-primary-primary-200) hover:bg-hano-primary-100"
              >
                <span className="inline-flex min-w-10 items-center justify-center rounded-lg border border-hano-border bg-white px-2 py-1 text-[10px] font-semibold text-hano-green-500">
                  {profile.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-hano-green-500">{profile.platform}</p>
                  <TruncateTooltip className="text-xs text-hano-muted">
                    {profile.username}
                  </TruncateTooltip>
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {itemCount > 0 ? (
        <div className="sticky bottom-4 flex items-center justify-between gap-4 rounded-full border border-hano-border bg-white px-5 py-3 shadow-lg">
          <span className="text-sm font-medium">
            {itemCount} item{itemCount !== 1 ? "s" : ""} in cart
          </span>
          <Button
            size="sm"
            onClick={(event) => openOrderPopover(event.currentTarget.getBoundingClientRect())}
          >
            View orders
          </Button>
        </div>
      ) : null}
    </div>
    </PlaceReviewProvider>
  );
}

function MenuItemsGrid({
  menuItems,
  handleAdd,
  getCategoryRank,
}: {
  menuItems: (typeof PLACE_MENU_ITEMS);
  handleAdd: (item: (typeof PLACE_MENU_ITEMS)[0]) => void;
  getCategoryRank: (item: (typeof PLACE_MENU_ITEMS)[0]) => number;
}) {
  const { openMenuItem } = useMenuItemPopover();

  return (
    <div className="grid gap-2.5 sm:auto-rows-fr sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-hano-border p-2.5 transition-colors hover:border-hano-primary-500 hover:bg-hano-primary-50"
          onClick={(event) =>
            openMenuItem(
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
          </div>
          <div className="flex min-h-0 flex-1 flex-col pt-2">
            <TruncateTooltip className="text-sm font-medium text-hano-green-500">
              {item.name}
            </TruncateTooltip>
            <TruncateTooltip className="mt-0.5 min-h-6 text-xs text-hano-muted" lines={2}>
              {item.desc}
            </TruncateTooltip>
            <div className="mt-auto flex items-center justify-between gap-1.5 pt-2">
              <span className="font-semibold">{item.price}</span>
              <AddToCartButton
                size="sm"
                compact
                onClick={(event) => {
                  event.stopPropagation();
                  handleAdd(item);
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
