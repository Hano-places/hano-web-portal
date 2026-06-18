import Image from "next/image";
import { formatOrderDateTime } from "@/lib/order-rules";
import { formatRwf, formatRelativeTime } from "@/lib/utils";
import type { Order } from "@/store/cart";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Button } from "@/components/ui/button";
import styles from "@/components/layout/order-popover.module.css";
import { cn } from "@/lib/utils";

type OrderListProps = {
  activeOrders: Order[];
  previousOrders: Order[];
  onOrderClick: (orderId: string, rect: DOMRect | null) => void;
  onReorder: (orderId: string) => void;
  onClearPrevious?: () => void;
  variant?: "popover" | "page";
};

function OrderRow({
  order,
  onOrderClick,
  onReorder,
  showReorder,
}: {
  order: Order;
  onOrderClick: (orderId: string, rect: DOMRect | null) => void;
  onReorder?: (orderId: string) => void;
  showReorder?: boolean;
}) {
  return (
    <div className={styles.orderRowWrap}>
      <button
        type="button"
        className={cn(styles.orderRow, styles.orderRowInteractive)}
        onClick={(event) => onOrderClick(order.id, event.currentTarget.getBoundingClientRect())}
      >
        {order.placeImage ? (
          <Image
            src={order.placeImage}
            alt=""
            width={44}
            height={44}
            className={styles.placeImage}
          />
        ) : null}
        <div className={styles.orderMeta}>
          <div className={styles.orderTitleRow}>
            <p className={styles.orderTitle}>{order.placeName}</p>
            <OrderStatusBadge status={order.status} className={styles.statusBadgeInline} />
          </div>
          <p className={styles.orderSub}>
            {order.items.length} items · {formatRwf(order.total)}
          </p>
          <p className={styles.orderSub}>
            {order.orderType === "pre-order" && order.pickupTime
              ? `Pickup ${formatOrderDateTime(order.pickupTime)}`
              : order.readyBy
                ? `Ready by ${formatOrderDateTime(order.readyBy)}`
                : formatRelativeTime(order.date)}
          </p>
        </div>
      </button>
      {showReorder && onReorder ? (
        <Button
          size="sm"
          variant="outline"
          className={styles.orderRowAction}
          onClick={(event) => {
            event.stopPropagation();
            onReorder(order.id);
          }}
        >
          Reorder
        </Button>
      ) : null}
    </div>
  );
}

export function OrderList({
  activeOrders,
  previousOrders,
  onOrderClick,
  onReorder,
  onClearPrevious,
  variant = "page",
}: OrderListProps) {
  const emptyClass = variant === "popover" ? styles.empty : "text-sm text-hano-muted";

  return (
    <div className={styles.sectionStack}>
      <section className={styles.sectionBlock}>
        <p className={styles.sectionTitle}>Active orders</p>
        {activeOrders.length === 0 ? (
          <p className={emptyClass}>No active orders right now.</p>
        ) : (
          <div className={styles.sectionStack}>
            {activeOrders.map((order) => (
              <OrderRow key={order.id} order={order} onOrderClick={onOrderClick} />
            ))}
          </div>
        )}
      </section>

      <section className={styles.sectionBlock}>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className={styles.sectionTitle}>Previous orders</p>
          {previousOrders.length > 0 && onClearPrevious ? (
            <button
              type="button"
              className="text-xs font-medium text-hano-muted transition-colors hover:text-hano-green-500"
              onClick={onClearPrevious}
            >
              Clear
            </button>
          ) : null}
        </div>
        {previousOrders.length === 0 ? (
          <p className={emptyClass}>No previous orders yet.</p>
        ) : (
          <div className={styles.sectionStack}>
            {previousOrders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                onOrderClick={onOrderClick}
                onReorder={onReorder}
                showReorder
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
