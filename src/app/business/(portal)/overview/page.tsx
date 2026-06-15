"use client";

import { useEffect, useState } from "react";
import { businessApi } from "@/lib/business/api-adapter";
import { KpiCard } from "@/components/business/kpi-card";
import {
  OrdersCategoryChart,
  RevenueTrendChart,
  SatisfactionChart,
} from "@/components/business/charts";
import { RecentOrdersPanel } from "@/components/places/place-card";
import { Button } from "@/components/ui/button";
import type { BusinessDashboardData } from "@/lib/business/api-adapter";

export default function BusinessOverviewPage() {
  const [data, setData] = useState<BusinessDashboardData | null>(null);

  useEffect(() => {
    businessApi.getDashboard().then(setData);
  }, []);

  if (!data) {
    return <div className="py-12 text-center text-hano-muted">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Restaurant Overview</h1>
          <p className="text-sm text-hano-muted">
            Track revenue, orders, and customer satisfaction
          </p>
        </div>
        <Button size="sm">Today&apos;s Status</Button>
      </div>

      <div className="mb-4 flex gap-2">
        {["Custom", "Today", "7d", "30d", "1M", "6M", "1Y"].map((period, i) => (
          <button
            key={period}
            type="button"
            className={`rounded-lg px-3 py-1.5 text-sm ${
              i === 3 ? "border-2 border-hano-green-500 font-medium" : "border border-hano-border"
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {data.kpis.map((kpi) => (
              <KpiCard key={kpi.label} kpi={kpi} />
            ))}
          </div>

          <RevenueTrendChart data={data.revenueChart} />

          <div className="grid gap-4 sm:grid-cols-2">
            <SatisfactionChart data={data.satisfactionChart} />
            <OrdersCategoryChart data={data.ordersByCategory} />
          </div>
        </div>

        <RecentOrdersPanel orders={data.recentOrders} />
      </div>
    </div>
  );
}
