"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import styles from "./search-input.module.css";

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
  fieldSize?: "sm" | "md";
  wrapperClassName?: string;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, wrapperClassName, fieldSize = "sm", ...props }, ref) => (
    <div className={cn(styles.wrapper, wrapperClassName)}>
      <Icon name="search" size={16} className={styles.icon} />
      <input
        ref={ref}
        type="search"
        className={cn(
          styles.input,
          fieldSize === "md" ? styles.inputMd : styles.inputSm,
          className,
        )}
        {...props}
      />
    </div>
  ),
);

SearchInput.displayName = "SearchInput";
