import type { ButtonHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import styles from "./add-to-cart-button.module.css";

type AddToCartButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md" | "lg";
  compact?: boolean;
  iconOnly?: boolean;
};

export function AddToCartButton({
  size = "md",
  compact = false,
  iconOnly = false,
  className = "",
  ...props
}: AddToCartButtonProps) {
  const iconSize = size === "lg" ? 20 : size === "sm" ? 16 : 18;

  return (
    <Button
      variant="secondary"
      size={size}
      className={`${iconOnly ? styles.iconOnly : compact ? styles.compact : styles.button} ${className}`.trim()}
      aria-label={iconOnly ? "Add to cart" : undefined}
      {...props}
    >
      <Icon name="addToCart" size={iconSize} className={styles.icon} />
      {iconOnly ? null : compact ? "Add" : "Add to cart"}
    </Button>
  );
}
