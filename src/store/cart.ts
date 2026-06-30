import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSafePersistStorage } from "@/lib/safe-persist-storage";
import {
  getReadyByTime,
  isActiveOrderStatus,
  isPreviousOrderStatus,
  PREP_TIME_MINUTES,
} from "@/lib/order-rules";
import { syncOrderToApi } from "@/lib/commerce/sync-order";

export interface CartItem {
  id: string;
  /** Server menu item id (when added from the live API menu); enables order sync. */
  menuItemId?: string;
  name: string;
  price: string;
  priceRaw: number;
  image: string;
  qty: number;
  placeId: string;
  placeName: string;
}

export interface DraftCart {
  placeId: string;
  placeName: string;
  placeImage: string;
  items: CartItem[];
  updatedAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  placeId: string;
  placeName: string;
  placeImage: string;
  total: number;
  status: "Dine-in" | "Served" | "Cancelled" | "Pending";
  date: string;
  orderType: "direct" | "pre-order";
  pickupTime?: string;
  readyBy?: string;
}

export type PlaceMeta = {
  placeId: string;
  placeName: string;
  placeImage: string;
};

interface CartState {
  items: CartItem[];
  drafts: DraftCart[];
  orders: Order[];
  currentPlaceId: string | null;
  currentPlaceName: string | null;
  currentPlaceImage: string | null;

  getPlaceConflict: (placeId: string) => PlaceMeta | null;
  addItem: (item: Omit<CartItem, "qty">, placeImage: string) => void;
  addItemWithStrategy: (
    item: Omit<CartItem, "qty">,
    placeImage: string,
    strategy: "replace" | "save-draft",
  ) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  saveCurrentAsDraft: () => void;
  loadDraft: (placeId: string) => void;
  placeOrder: (type: "direct" | "pre-order", pickupTime?: string) => void;
  reorder: (orderId: string) => void;
  clearPreviousOrders: () => void;
  getActiveOrders: () => Order[];
  getPreviousOrders: () => Order[];
  getTotal: () => number;
  getItemCount: () => number;
}

function syncPlaceMeta(items: CartItem[], placeImage: string, item: Omit<CartItem, "qty">) {
  return {
    items,
    currentPlaceId: item.placeId,
    currentPlaceName: item.placeName,
    currentPlaceImage: placeImage,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      drafts: [],
      orders: [],
      currentPlaceId: null,
      currentPlaceName: null,
      currentPlaceImage: null,

      getPlaceConflict: (placeId) => {
        const { items, currentPlaceId, currentPlaceName, currentPlaceImage } = get();
        if (!items.length || !currentPlaceId || currentPlaceId === placeId) {
          return null;
        }
        return {
          placeId: currentPlaceId,
          placeName: currentPlaceName ?? "Current place",
          placeImage: currentPlaceImage ?? "",
        };
      },

      addItem: (item, placeImage) => {
        const { items } = get();
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
            ),
            currentPlaceImage: placeImage,
          });
          return;
        }

        set(syncPlaceMeta([...items, { ...item, qty: 1 }], placeImage, item));
      },

      addItemWithStrategy: (item, placeImage, strategy) => {
        const state = get();
        if (strategy === "save-draft" && state.items.length && state.currentPlaceId) {
          get().saveCurrentAsDraft();
        } else if (strategy === "replace") {
          get().clearCart();
        }
        get().addItem(item, placeImage);
      },

      saveCurrentAsDraft: () => {
        const { items, currentPlaceId, currentPlaceName, currentPlaceImage, drafts } = get();
        if (!items.length || !currentPlaceId) return;

        const nextDraft: DraftCart = {
          placeId: currentPlaceId,
          placeName: currentPlaceName ?? "",
          placeImage: currentPlaceImage ?? "",
          items: [...items],
          updatedAt: new Date().toISOString(),
        };

        const withoutPlace = drafts.filter((d) => d.placeId !== currentPlaceId);
        set({
          drafts: [nextDraft, ...withoutPlace],
          items: [],
          currentPlaceId: null,
          currentPlaceName: null,
          currentPlaceImage: null,
        });
      },

      loadDraft: (placeId) => {
        const { drafts } = get();
        const draft = drafts.find((d) => d.placeId === placeId);
        if (!draft) return;

        get().clearCart();
        set({
          items: draft.items,
          currentPlaceId: draft.placeId,
          currentPlaceName: draft.placeName,
          currentPlaceImage: draft.placeImage,
          drafts: drafts.filter((d) => d.placeId !== placeId),
        });
      },

      removeItem: (id) => {
        const items = get().items.filter((i) => i.id !== id);
        if (!items.length) {
          get().clearCart();
          return;
        }
        set({ items });
      },

      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, qty } : i)),
        });
      },

      clearCart: () =>
        set({
          items: [],
          currentPlaceId: null,
          currentPlaceName: null,
          currentPlaceImage: null,
        }),

      placeOrder: (type, pickupTime) => {
        const { items, orders, currentPlaceId, currentPlaceName, currentPlaceImage } = get();
        if (!items.length || !currentPlaceId) return;

        const readyBy =
          type === "direct" ? getReadyByTime().toISOString() : undefined;

        const order: Order = {
          id: Date.now().toString(),
          items: [...items],
          placeId: currentPlaceId,
          placeName: currentPlaceName ?? "",
          placeImage: currentPlaceImage ?? "",
          total: get().getTotal(),
          status: "Pending",
          date: new Date().toISOString(),
          orderType: type,
          pickupTime: type === "pre-order" ? pickupTime : undefined,
          readyBy,
        };

        set({ orders: [order, ...orders] });

        // Best-effort sync to the API (no-op for mock items or when unauthenticated).
        void syncOrderToApi({
          placeId: currentPlaceId,
          items: items.map((item) => ({
            menuItemId: item.menuItemId,
            qty: item.qty,
          })),
          orderType: type,
          pickupTime: type === "pre-order" ? pickupTime : undefined,
        });

        get().clearCart();
      },

      reorder: (orderId) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (!order) return;

        const conflict = get().getPlaceConflict(order.placeId);
        if (conflict) {
          get().saveCurrentAsDraft();
        } else {
          get().clearCart();
        }

        set({
          items: order.items.map((item) => ({ ...item })),
          currentPlaceId: order.placeId,
          currentPlaceName: order.placeName,
          currentPlaceImage: order.placeImage,
        });
      },

      clearPreviousOrders: () => {
        set({
          orders: get().orders.filter((o) => isActiveOrderStatus(o.status)),
        });
      },

      getActiveOrders: () => get().orders.filter((o) => isActiveOrderStatus(o.status)),

      getPreviousOrders: () => get().orders.filter((o) => isPreviousOrderStatus(o.status)),

      getTotal: () => get().items.reduce((sum, i) => sum + i.priceRaw * i.qty, 0),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: "@hano/cart", storage: createSafePersistStorage() },
  ),
);

export { PREP_TIME_MINUTES };
