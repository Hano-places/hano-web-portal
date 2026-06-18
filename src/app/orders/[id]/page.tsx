"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cart";
import { useOrderPopover } from "@/components/layout/order-popover";
import { Icon } from "@/components/ui/icon";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const orders = useCartStore((s) => s.orders);
  const { openOrderDetail } = useOrderPopover();
  const openedRef = useRef(false);
  const order = orders.find((item) => item.id === id);

  useEffect(() => {
    if (openedRef.current || !order) return;
    openedRef.current = true;
    openOrderDetail(id, null, { returnTo: "close" });
    router.replace("/orders");
  }, [id, openOrderDetail, order, router]);

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Link
          href="/orders"
          className="inline-flex cursor-pointer items-center gap-1 text-sm text-hano-muted transition-colors hover:text-hano-green-500"
        >
          <Icon name="chevronLeft" size={16} />
          Back to orders
        </Link>
        <p className="text-hano-muted">Order not found.</p>
      </div>
    );
  }

  return null;
}
