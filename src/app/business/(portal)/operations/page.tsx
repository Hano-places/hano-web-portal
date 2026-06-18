"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useBusinessStore } from "@/store/business";
import { businessApi } from "@/lib/business/api-adapter";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parsePriceRawFromLabel } from "@/lib/promo-pricing";
import { formatRwf } from "@/lib/utils";
import type { OperationOrder } from "@/lib/business/mock-data";

export default function BusinessOperationsPage() {
  const profile = useBusinessStore((s) => s.profile);
  const addMenuItem = useBusinessStore((s) => s.addMenuItem);
  const removeMenuItem = useBusinessStore((s) => s.removeMenuItem);
  const [orders, setOrders] = useState<OperationOrder[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Mains");
  const [image, setImage] = useState("");

  useEffect(() => {
    businessApi.getOperations().then(setOrders);
  }, []);

  const handleAddMenuItem = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !price.trim()) return;

    const priceRaw = parsePriceRawFromLabel(price);
    addMenuItem({
      name: name.trim(),
      desc: desc.trim(),
      price: price.includes("RWF") ? price.trim() : `${price.trim()} RWF`,
      priceRaw,
      image: image.trim() || profile?.bannerUrl || "",
      category: category.trim() || "Mains",
    });

    setName("");
    setDesc("");
    setPrice("");
    setImage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Operations</h1>
        <p className="text-sm text-hano-muted">
          Menu items customers browse on{" "}
          {profile?.placeSlug ? (
            <Link
              href={`/places/${profile.placeSlug}`}
              className="text-hano-green-500 hover:underline"
            >
              your place page
            </Link>
          ) : (
            "your place page"
          )}
        </p>
      </div>

      <Card>
        <CardTitle>Menu items</CardTitle>
        <p className="mt-1 text-sm text-hano-muted">
          Dishes customers can browse, add to cart, and include in promotions
        </p>
        <form onSubmit={handleAddMenuItem} className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input
            placeholder="Dish name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <Input
            placeholder="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />
          <Input
            placeholder="Price (e.g. 2500)"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
          <Input
            placeholder="Image URL (optional)"
            value={image}
            onChange={(event) => setImage(event.target.value)}
          />
          <textarea
            placeholder="Description"
            value={desc}
            onChange={(event) => setDesc(event.target.value)}
            className="h-20 rounded-xl border border-hano-border p-3 text-sm sm:col-span-2"
          />
          <Button type="submit" variant="secondary" className="sm:col-span-2 sm:w-fit">
            Add menu item
          </Button>
        </form>

        {profile?.menuItems.length ? (
          <ul className="mt-4 space-y-2">
            {profile.menuItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-hano-border px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-hano-green-500">{item.name}</p>
                  <p className="text-xs text-hano-muted">
                    {item.category} · {formatRwf(item.priceRaw)}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => removeMenuItem(item.id)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-hano-muted">No menu items yet.</p>
        )}
      </Card>

      <Card>
        <CardTitle>Orders queue</CardTitle>
        <div className="mt-4 overflow-x-auto">
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
      </Card>
    </div>
  );
}
