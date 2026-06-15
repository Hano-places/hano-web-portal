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
        "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition",
        active
          ? "bg-hano-primary-500 text-hano-green-500"
          : "border border-hano-border bg-white text-hano-muted hover:border-hano-green-300",
      )}
    >
      {label}
    </button>
  );
}
