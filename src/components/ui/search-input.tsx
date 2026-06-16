"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import styles from "./search-input.module.css";

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
  fieldSize?: "sm" | "md";
  wrapperClassName?: string;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, wrapperClassName, fieldSize = "sm", onChange, value, defaultValue, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [internalValue, setInternalValue] = useState(defaultValue?.toString() ?? "");
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value?.toString() ?? "" : internalValue;

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(event.target.value);
      }
      onChange?.(event);
    };

    const handleClear = () => {
      if (!inputRef.current) return;

      if (!isControlled) {
        setInternalValue("");
      }
      const syntheticEvent = {
        target: { value: "" },
        currentTarget: { value: "" },
      } as ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
      inputRef.current.focus();
    };

    return (
      <div className={cn(styles.wrapper, wrapperClassName)}>
        <Icon name="search" size={16} className={styles.icon} />
        <input
          ref={inputRef}
          type="search"
          value={isControlled ? value : internalValue}
          onChange={handleChange}
          className={cn(
            styles.input,
            fieldSize === "md" ? styles.inputMd : styles.inputSm,
            className,
          )}
          {...props}
        />
        {currentValue ? (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear search"
          >
            <Icon name="close" size={16} />
          </button>
        ) : null}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
