"use client";

import { cn } from "@/lib/utils";

type PeriodPillProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export function PeriodPill({ label, active, onClick }: PeriodPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-transparent bg-hano-primary-500 font-medium text-hano-green-500"
          : "border-hano-border bg-white text-hano-muted hover:border-hano-primary-400 hover:bg-hano-primary-50 hover:text-hano-green-500",
      )}
    >
      {label}
    </button>
  );
}
