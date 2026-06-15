"use client";

import { cn } from "@/lib/utils";

type FilterChipProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
        active
          ? "border-transparent bg-hano-primary-500 text-hano-green-500"
          : "border-hano-border bg-white text-hano-muted hover:border-hano-primary-400 hover:bg-hano-primary-50 hover:text-hano-green-500",
      )}
    >
      {label}
    </button>
  );
}
