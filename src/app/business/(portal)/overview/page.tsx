"use client";

import { useEffect, useState } from "react";
import { businessApi } from "@/lib/business/api-adapter";
import { KpiCard } from "@/components/business/kpi-card";
import {
  OrdersCategoryChart,
  RevenueTrendChart,
  SatisfactionChart,
} from "@/components/business/charts";
import { BusinessQuickActions, RecentOrdersList } from "@/components/business/recent-orders";
import { DailyGoalCard, NotificationsRail } from "@/components/layout/notifications-rail";
import { Button } from "@/components/ui/button";
import { PeriodPill } from "@/components/ui/period-pill";
import type { BusinessDashboardData } from "@/lib/business/api-adapter";

const PERIODS = ["Custom", "Today", "7d", "30d", "1M", "6M", "1Y"];

export default function BusinessOverviewPage() {
  const [data, setData] = useState<BusinessDashboardData | null>(null);
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    businessApi.getDashboard().then(setData);
  }, []);

  if (!data) {
    return <div className="py-12 text-center text-hano-muted">Loading dashboard...</div>;
  }

  return (
    <div className="flex gap-6">
      <div className="min-w-0 flex-1 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Restaurant Overview</h1>
            <p className="text-sm text-hano-muted">
              Track revenue, orders, and customer satisfaction
            </p>
          </div>
          <Button size="sm">Today&apos;s Status</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <PeriodPill key={p} label={p} active={period === p} onClick={() => setPeriod(p)} />
          ))}
        </div>

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

        <div className="grid gap-4 lg:grid-cols-2">
          <DailyGoalCard />
          <RecentOrdersList orders={data.recentOrders} />
        </div>

        <BusinessQuickActions />
      </div>

      <NotificationsRail />
    </div>
  );
}
