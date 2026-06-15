import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  priceRaw: number;
  image: string;
  qty: number;
  placeId: string;
  placeName: string;
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
}

interface CartState {
  items: CartItem[];
  orders: Order[];
  currentPlaceId: string | null;
  currentPlaceName: string | null;
  currentPlaceImage: string | null;

  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: (type: "direct" | "pre-order", pickupTime?: string) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orders: [],
      currentPlaceId: null,
      currentPlaceName: null,
      currentPlaceImage: null,

      addItem: (item) => {
        const { items } = get();
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
            ),
          });
        } else {
          set({
            items: [...items, { ...item, qty: 1 }],
            currentPlaceId: item.placeId,
            currentPlaceName: item.placeName,
            currentPlaceImage: item.image,
          });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
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
        const { items, orders, currentPlaceId, currentPlaceName, currentPlaceImage } =
          get();
        if (!items.length || !currentPlaceId) return;

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
          pickupTime,
        };

        set({ orders: [order, ...orders] });
        get().clearCart();
      },

      getTotal: () => get().items.reduce((sum, i) => sum + i.priceRaw * i.qty, 0),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: "@hano/cart" },
  ),
);
