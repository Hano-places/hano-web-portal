import { cartsApi, ordersApi } from "@/lib/api";

export interface SyncOrderItem {
  menuItemId?: string;
  qty: number;
  notes?: string;
}

export interface SyncOrderParams {
  placeId: string;
  items: SyncOrderItem[];
  orderType: "direct" | "pre-order";
  pickupTime?: string;
}

/**
 * Best-effort sync of a placed order to the API: creates a server cart, adds the
 * items, and creates the order. Skipped when no item carries a server
 * `menuItemId` (e.g. mock fallback) and swallows errors (e.g. 401 when not
 * authenticated) so the local checkout UX never breaks.
 *
 * Returns the server order number on success, otherwise null.
 */
export async function syncOrderToApi(
  params: SyncOrderParams,
): Promise<string | null> {
  const serverItems = params.items.filter(
    (item): item is SyncOrderItem & { menuItemId: string } =>
      Boolean(item.menuItemId),
  );
  if (serverItems.length === 0) return null;

  try {
    const cart = await cartsApi.createCart(params.placeId);

    for (const item of serverItems) {
      await cartsApi.addItem(cart.id, {
        menuItemId: item.menuItemId,
        quantity: item.qty,
        notes: item.notes,
      });
    }

    const type = params.orderType === "pre-order" ? "pre_order" : "direct";
    const fulfillmentType =
      params.orderType === "pre-order" ? "pre_order" : "pickup";

    const order = await ordersApi.createOrder({
      cartId: cart.id,
      type,
      fulfillmentType,
      scheduledTime:
        params.orderType === "pre-order" ? params.pickupTime : undefined,
    });

    if (process.env.NODE_ENV !== "production") {
      console.info("[hano] order synced to API:", order.orderNumber);
    }
    return order.orderNumber;
  } catch (err) {
    console.warn("[hano] order API sync failed:", err);
    return null;
  }
}
