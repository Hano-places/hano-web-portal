import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-hano-border bg-white px-4 text-sm outline-none transition focus:border-hano-green-500 focus:ring-2 focus:ring-hano-primary-200",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
