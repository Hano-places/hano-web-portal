import { apiRequest } from "./client";
import type {
  AddCartItemPayload,
  Cart,
  CartItem,
  UpdateCartItemPayload,
} from "./types";

/**
 * Compute a cart subtotal (in minor units) from its items. The API validates
 * cart responses against a schema that omits `subtotal`, so we derive it here.
 */
export function cartSubtotal(cart: Pick<Cart, "items">): number {
  return cart.items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0,
  );
}

export const cartsApi = {
  createCart: (placeId: string) =>
    apiRequest<Cart>("/v1/carts/", {
      method: "POST",
      body: JSON.stringify({ placeId }),
    }),

  getCart: (id: string) => apiRequest<Cart>(`/v1/carts/${id}`),

  getCartForPlace: (placeId: string) =>
    apiRequest<Cart | { data: null }>(`/v1/carts/place/${placeId}`),

  addItem: (cartId: string, payload: AddCartItemPayload) =>
    apiRequest<CartItem>(`/v1/carts/${cartId}/items`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateItem: (cartId: string, itemId: string, payload: UpdateCartItemPayload) =>
    apiRequest<CartItem>(`/v1/carts/${cartId}/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  removeItem: (cartId: string, itemId: string) =>
    apiRequest<void>(`/v1/carts/${cartId}/items/${itemId}`, {
      method: "DELETE",
    }),

  clearCart: (cartId: string) =>
    apiRequest<void>(`/v1/carts/${cartId}`, { method: "DELETE" }),
};
