import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./button.module.css";

type ButtonVariant = "solid" | "outline" | "secondary" | "ghost" | "danger" | "primary";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
};

const variantMap: Record<ButtonVariant, string> = {
  solid: styles.solid,
  primary: styles.solid,
  outline: styles.outline,
  secondary: styles.secondary,
  ghost: styles.ghost,
  danger: styles.danger,
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "solid",
      size = "md",
      fullWidth = false,
      className = "",
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const sizeClass = size === "sm" ? styles.sm : size === "lg" ? styles.lg : "";
    return (
      <button
        ref={ref}
        type={type}
        className={`${styles.button} ${variantMap[variant]} ${sizeClass} ${fullWidth ? styles.fullWidth : ""} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
