import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import styles from "./price.module.css";

type PriceProps = HTMLAttributes<HTMLSpanElement>;

export function Price({ className, children, ...props }: PriceProps) {
  return (
    <span className={cn(styles.price, className)} {...props}>
      {children}
    </span>
  );
}
