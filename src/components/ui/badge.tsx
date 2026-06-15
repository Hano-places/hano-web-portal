import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-hano-primary-500 px-2 py-0.5 text-xs font-semibold text-hano-green-500",
        className,
      )}
      {...props}
    />
  );
}
