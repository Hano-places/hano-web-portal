"use client";

import { useEffect, useState } from "react";
import { businessApi } from "@/lib/business/api-adapter";
import { Card } from "@/components/ui/card";
import { formatRwf } from "@/lib/utils";
import type { OperationOrder } from "@/lib/business/mock-data";

export default function BusinessOperationsPage() {
  const [orders, setOrders] = useState<OperationOrder[]>([]);

  useEffect(() => {
    businessApi.getOperations().then(setOrders);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Operations</h1>
      <p className="text-sm text-hano-muted">Orders & reservations queue</p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-hano-border">
              <th className="pb-3 pr-4 font-medium">Order</th>
              <th className="pb-3 pr-4 font-medium">Customer</th>
              <th className="pb-3 pr-4 font-medium">Type</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 pr-4 font-medium">Total</th>
              <th className="pb-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-hano-border">
                <td className="py-3 pr-4 font-medium">{order.orderNumber}</td>
                <td className="py-3 pr-4">{order.customer}</td>
                <td className="py-3 pr-4">{order.type}</td>
                <td className="py-3 pr-4">
                  <span className="rounded-full bg-hano-primary-100 px-2 py-0.5 text-xs">
                    {order.status}
                  </span>
                </td>
                <td className="py-3 pr-4">{formatRwf(order.total)}</td>
                <td className="py-3">{order.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
