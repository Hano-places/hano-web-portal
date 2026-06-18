"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCartStore } from "@/store/cart";
import { OrderList } from "@/components/orders/order-list";
import { useOrderPopover } from "@/components/layout/order-popover";
import { Icon } from "@/components/ui/icon";
import { SearchInput } from "@/components/ui/search-input";

function filterOrdersByQuery<T extends { placeName: string }>(orders: T[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return orders;
  return orders.filter((order) => order.placeName.toLowerCase().includes(normalized));
}

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const { openOrderDetail, openCheckoutPreview } = useOrderPopover();
  const getActiveOrders = useCartStore((s) => s.getActiveOrders);
  const getPreviousOrders = useCartStore((s) => s.getPreviousOrders);
  const clearPreviousOrders = useCartStore((s) => s.clearPreviousOrders);
  const reorder = useCartStore((s) => s.reorder);

  const activeOrders = useMemo(
    () => filterOrdersByQuery(getActiveOrders(), query),
    [getActiveOrders, query],
  );
  const previousOrders = useMemo(
    () => filterOrdersByQuery(getPreviousOrders(), query),
    [getPreviousOrders, query],
  );
  const totalCount = getActiveOrders().length + getPreviousOrders().length;

  const handleOrderClick = (orderId: string, rect: DOMRect | null) => {
    openOrderDetail(orderId, rect, { returnTo: "close" });
  };

  const handleReorder = (orderId: string) => {
    reorder(orderId);
    openCheckoutPreview(null);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/home"
        className="inline-flex cursor-pointer items-center gap-1 text-sm text-hano-muted transition-colors hover:text-hano-green-500"
      >
        <Icon name="chevronLeft" size={16} />
        Back to home
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-hano-green-500">Your orders</h1>
        <p className="text-sm text-hano-muted">
          {totalCount === 0
            ? "No orders yet — explore places and place your first order"
            : `${totalCount} order${totalCount === 1 ? "" : "s"} across your places`}
        </p>
      </div>

      {totalCount > 0 ? (
        <SearchInput
          fieldSize="md"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by place name…"
          aria-label="Search orders"
        />
      ) : null}

      {totalCount === 0 ? (
        <div className="rounded-xl border border-hano-border bg-white p-8 text-center">
          <p className="text-hano-muted">You have not placed any orders yet.</p>
          <Link
            href="/places"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-hano-green-500 underline underline-offset-2"
          >
            Explore places
          </Link>
        </div>
      ) : activeOrders.length === 0 && previousOrders.length === 0 ? (
        <p className="text-sm text-hano-muted">No orders match your search.</p>
      ) : (
        <OrderList
          activeOrders={activeOrders}
          previousOrders={previousOrders}
          onOrderClick={handleOrderClick}
          onReorder={handleReorder}
          onClearPrevious={clearPreviousOrders}
          variant="page"
        />
      )}
    </div>
  );
}
