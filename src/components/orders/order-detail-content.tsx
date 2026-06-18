import Image from "next/image";
import { formatOrderDateTime } from "@/lib/order-rules";
import { formatRwf } from "@/lib/utils";
import type { Order } from "@/store/cart";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Price } from "@/components/ui/price";
import styles from "@/components/layout/order-popover.module.css";

type OrderDetailContentProps = {
  order: Order;
};

export function OrderDetailContent({ order }: OrderDetailContentProps) {
  return (
    <div className={styles.orderDetail}>
      <div className={styles.orderDetailHeader}>
        {order.placeImage ? (
          <Image
            src={order.placeImage}
            alt=""
            width={56}
            height={56}
            className={styles.orderDetailImage}
          />
        ) : null}
        <div className={styles.orderDetailHeaderMeta}>
          <p className={styles.orderDetailTitle}>{order.placeName}</p>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className={styles.successSummary}>
        <div className={styles.successRow}>
          <span className={styles.successRowLabel}>Order type</span>
          <span>{order.orderType === "pre-order" ? "Pre-order" : "Direct order"}</span>
        </div>
        {order.orderType === "pre-order" && order.pickupTime ? (
          <div className={styles.successRow}>
            <span className={styles.successRowLabel}>Pickup</span>
            <span>{formatOrderDateTime(order.pickupTime)}</span>
          </div>
        ) : null}
        {order.orderType === "direct" && order.readyBy ? (
          <div className={styles.successRow}>
            <span className={styles.successRowLabel}>Ready by</span>
            <span>{formatOrderDateTime(order.readyBy)}</span>
          </div>
        ) : null}
        <div className={styles.successRow}>
          <span className={styles.successRowLabel}>Placed</span>
          <span>{formatOrderDateTime(order.date)}</span>
        </div>
      </div>

      <div className={styles.orderDetailItems}>
        {order.items.map((item) => (
          <div key={item.id} className={styles.orderDetailItem}>
            <div className={styles.orderDetailItemMeta}>
              {item.image ? (
                <Image
                  src={item.image}
                  alt=""
                  width={40}
                  height={40}
                  className={styles.itemImage}
                />
              ) : null}
              <span className={styles.itemName}>
                {item.qty}x {item.name}
              </span>
            </div>
            <span className={styles.itemPrice}>{formatRwf(item.priceRaw * item.qty)}</span>
          </div>
        ))}
      </div>

      <div className={styles.totalRow}>
        <span>Total</span>
        <Price>{formatRwf(order.total)}</Price>
      </div>
    </div>
  );
}
