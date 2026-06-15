"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { BusinessKpi } from "@/lib/business/mock-data";

export function KpiCard({ kpi }: { kpi: BusinessKpi }) {
  const positive = kpi.trend >= 0;

  return (
    <Card>
      <p className="text-sm text-hano-muted">{kpi.label}</p>
      <p className="mt-1 text-2xl font-bold text-hano-green-500">{kpi.value}</p>
      <div className="mt-2 flex items-center gap-1">
        {positive ? (
          <TrendingUp className="h-4 w-4 text-hano-success" />
        ) : (
          <TrendingDown className="h-4 w-4 text-hano-danger-500" />
        )}
        <span
          className={cn(
            "text-sm font-medium",
            positive ? "text-hano-success" : "text-hano-danger-500",
          )}
        >
          {positive ? "+" : ""}
          {kpi.trend}%
        </span>
      </div>
      <div className="mt-4 flex gap-4 border-t border-hano-border pt-3">
        {kpi.subStats.map((stat) => (
          <div key={stat.label}>
            <p className="text-xs text-hano-muted">{stat.label}</p>
            <p className="text-sm font-medium">{stat.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
