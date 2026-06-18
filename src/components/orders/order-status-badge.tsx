import { getOrderStatusMeta } from "@/lib/order-rules";
import type { Order } from "@/store/cart";
import styles from "@/components/layout/order-popover.module.css";
import { cn } from "@/lib/utils";

type OrderStatusBadgeProps = {
  status: Order["status"];
  className?: string;
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const { label, tone } = getOrderStatusMeta(status);

  return (
    <span
      className={cn(
        styles.statusBadge,
        styles[`statusBadge_${tone}`],
        className,
      )}
    >
      {label}
    </span>
  );
}
