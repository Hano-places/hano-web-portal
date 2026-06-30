import { apiRequest, buildQuery } from "./client";
import type {
  CreateOrderPayload,
  Order,
  OrdersListResponse,
  OrderStatus,
  ReorderResponse,
  TimeSlotsResponse,
} from "./types";

interface OrdersQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

export const ordersApi = {
  createOrder: (payload: CreateOrderPayload) =>
    apiRequest<Order>("/v1/orders/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getOrders: (query: OrdersQuery = {}) =>
    apiRequest<OrdersListResponse>(
      `/v1/orders/${buildQuery(query as Record<string, unknown>)}`,
    ),

  getOrder: (id: string) => apiRequest<Order>(`/v1/orders/${id}`),

  reorder: (id: string) =>
    apiRequest<ReorderResponse>(`/v1/orders/${id}/reorder`, {
      method: "POST",
    }),

  getTimeSlots: (placeId: string) =>
    apiRequest<TimeSlotsResponse>(`/v1/orders/time-slots/${placeId}`),
};
