import { useEffect, useState, type MouseEventHandler } from "react";
import { AddToCartButton } from "@/components/places/add-to-cart-button";
import { Icon } from "@/components/ui/icon";
import { useCartStore } from "@/store/cart";
import styles from "./cart-item-action.module.css";

type CartItemActionProps = {
  cartItemId: string;
  onAdd: () => void;
  size?: "sm" | "md" | "lg";
  compact?: boolean;
  iconOnly?: boolean;
  className?: string;
};

export function CartItemAction({
  cartItemId,
  onAdd,
  size = "sm",
  compact = true,
  iconOnly = false,
  className = "",
}: CartItemActionProps) {
  const qty = useCartItemQty(cartItemId);
  const updateQty = useCartStore((s) => s.updateQty);

  const stopPropagation: MouseEventHandler = (event) => {
    event.stopPropagation();
  };

  if (qty === 0) {
    return (
      <AddToCartButton
        size={size}
        compact={compact}
        iconOnly={iconOnly || compact}
        className={className}
        onClick={(event) => {
          event.stopPropagation();
          onAdd();
        }}
      />
    );
  }

  return (
    <div
      className={`${styles.stepper} ${size === "sm" ? styles.stepperSm : ""} ${className}`.trim()}
      onClick={stopPropagation}
      role="group"
      aria-label={`Quantity: ${qty}`}
    >
      <button
        type="button"
        className={styles.stepperButton}
        onClick={() => updateQty(cartItemId, qty - 1)}
        aria-label="Decrease quantity"
      >
        <span aria-hidden>−</span>
      </button>
      <span className={styles.stepperValue}>{qty}</span>
      <button
        type="button"
        className={styles.stepperButton}
        onClick={() => updateQty(cartItemId, qty + 1)}
        aria-label="Increase quantity"
      >
        <span aria-hidden>+</span>
      </button>
    </div>
  );
}

export function useCartItemQty(cartItemId: string) {
  const qty = useCartStore(
    (s) => s.items.find((item) => item.id === cartItemId)?.qty ?? 0,
  );
  const hydrated = useHydrated();
  return hydrated ? qty : 0;
}

export function InCartBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex h-6 w-6 items-center justify-center rounded-full bg-hano-primary-500 text-hano-green-500 shadow-sm ${className}`.trim()}
      aria-label="Added to cart"
    >
      <Icon name="tickDouble" size={14} strokeWidth={2} />
    </span>
  );
}

function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
