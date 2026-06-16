import type { ButtonHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import styles from "./add-to-cart-button.module.css";

type AddToCartButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md" | "lg";
  compact?: boolean;
};

export function AddToCartButton({
  size = "md",
  compact = false,
  className = "",
  ...props
}: AddToCartButtonProps) {
  return (
    <Button
      variant="secondary"
      size={size}
      className={`${compact ? styles.compact : styles.button} ${className}`.trim()}
      {...props}
    >
      <Icon name="addToCart" size={size === "sm" ? 14 : 16} />
      {compact ? "Add" : "Add to cart"}
    </Button>
  );
}
