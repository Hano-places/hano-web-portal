"use client";

import { Card, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartPoint } from "@/lib/business/mock-data";

export function RevenueTrendChart({ data }: { data: ChartPoint[] }) {
  return (
    <Card className="col-span-2">
      <CardTitle>Orders & Revenue Trend</CardTitle>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dce2ea" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [`RWF ${Number(value).toLocaleString()}`, "Revenue"]} />
            <Bar dataKey="revenue" fill="#001814" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function SatisfactionChart({
  data,
}: {
  data: { month: string; score: number }[];
}) {
  return (
    <Card>
      <CardTitle>Customer Satisfaction</CardTitle>
      <p className="mt-1 text-2xl font-bold text-hano-green-500">4.7/5</p>
      <div className="mt-4 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={entry.month}
                  fill={index === data.length - 1 ? "#c8ff62" : "#001814"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function OrdersCategoryChart({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  return (
    <Card>
      <CardTitle>Orders by Category</CardTitle>
      <div className="mt-4 flex items-center gap-4">
        <div className="h-36 w-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={40} outerRadius={60}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <span className="h-3 w-3 rounded-full" style={{ background: item.color }} />
              {item.name} — {item.value}%
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
