import type { Order } from "@/store/cart";

export const PREP_TIME_MINUTES = 30;
export const PRE_ORDER_MAX_HOURS = 24;

export type OrderStatusTone = "pending" | "active" | "completed" | "cancelled";

export function getOrderStatusMeta(status: Order["status"]): {
  label: string;
  tone: OrderStatusTone;
} {
  switch (status) {
    case "Pending":
      return { label: "Pending", tone: "pending" };
    case "Dine-in":
      return { label: "Dine-in", tone: "active" };
    case "Served":
      return { label: "Served", tone: "completed" };
    case "Cancelled":
      return { label: "Cancelled", tone: "cancelled" };
  }
}

const ACTIVE_STATUSES = new Set(["Pending", "Dine-in"]);
const PREVIOUS_STATUSES = new Set(["Served", "Cancelled"]);

export function isActiveOrderStatus(status: string) {
  return ACTIVE_STATUSES.has(status);
}

export function isPreviousOrderStatus(status: string) {
  return PREVIOUS_STATUSES.has(status);
}

export function getReadyByTime(from = new Date(), prepMinutes = PREP_TIME_MINUTES): Date {
  return new Date(from.getTime() + prepMinutes * 60_000);
}

export function getPreOrderMinTime(from = new Date()): Date {
  return getReadyByTime(from);
}

export function getPreOrderMaxTime(from = new Date()): Date {
  return new Date(from.getTime() + PRE_ORDER_MAX_HOURS * 60 * 60_000);
}

export function formatOrderDateTime(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return value.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toDateTimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function validatePreOrderTime(value: string): { valid: boolean; error?: string } {
  if (!value) {
    return { valid: false, error: "Choose a pickup time." };
  }

  const selected = new Date(value);
  if (Number.isNaN(selected.getTime())) {
    return { valid: false, error: "Invalid pickup time." };
  }

  const min = getPreOrderMinTime();
  const max = getPreOrderMaxTime();

  if (selected < min) {
    return {
      valid: false,
      error: `Pickup must be at least ${PREP_TIME_MINUTES} minutes from now.`,
    };
  }

  if (selected > max) {
    return {
      valid: false,
      error: `Pickup must be within ${PRE_ORDER_MAX_HOURS} hours.`,
    };
  }

  return { valid: true };
}
