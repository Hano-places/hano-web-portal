"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useCartStore } from "@/store/cart";
import { formatOrderDateTime } from "@/lib/order-rules";
import { formatRwf, formatRelativeTime } from "@/lib/utils";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  FloatingPanelBody,
  FloatingPanelCloseButton,
  FloatingPanelContent,
  FloatingPanelFooter,
  FloatingPanelHeader,
  FloatingPanelRoot,
  useFloatingPanel,
} from "@/components/ui/floating-panel";
import panelStyles from "@/components/ui/floating-panel.module.css";
import styles from "./order-popover.module.css";

type OrderPopoverContextValue = {
  openOrderPopover: (rect: DOMRect | null) => void;
};

const OrderPopoverContext = createContext<OrderPopoverContextValue | null>(null);

export function useOrderPopover() {
  const context = useContext(OrderPopoverContext);
  if (!context) {
    throw new Error("useOrderPopover must be used within OrderPopoverProvider");
  }
  return context;
}

function OrderPanel() {
  const titleId = useId();
  const router = useRouter();
  const requireAuth = useRequireAuth();
  const { closeFloatingPanel } = useFloatingPanel();
  const items = useCartStore((s) => s.items);
  const drafts = useCartStore((s) => s.drafts);
  const currentPlaceName = useCartStore((s) => s.currentPlaceName);
  const currentPlaceImage = useCartStore((s) => s.currentPlaceImage);
  const updateQty = useCartStore((s) => s.updateQty);
  const loadDraft = useCartStore((s) => s.loadDraft);
  const getTotal = useCartStore((s) => s.getTotal);
  const getActiveOrders = useCartStore((s) => s.getActiveOrders);
  const getPreviousOrders = useCartStore((s) => s.getPreviousOrders);
  const reorder = useCartStore((s) => s.reorder);
  const clearPreviousOrders = useCartStore((s) => s.clearPreviousOrders);

  const activeOrders = getActiveOrders();
  const previousOrders = getPreviousOrders();

  const handlePlaceOrder = () => {
    if (!items.length) return;
    if (!requireAuth("checkout")) return;
    closeFloatingPanel();
    router.push("/checkout/preview");
  };

  const handleReorder = (orderId: string) => {
    reorder(orderId);
    closeFloatingPanel();
  };

  return (
    <FloatingPanelContent titleId={titleId}>
      <div className={panelStyles.panelScroll}>
        <FloatingPanelHeader>Your orders</FloatingPanelHeader>

        <FloatingPanelBody className={styles.sectionStack}>
          {items.length > 0 ? (
            <section>
              <p className={styles.sectionTitle}>Current draft</p>
              <div className={styles.placeHeader}>
                {currentPlaceImage ? (
                  <Image
                    src={currentPlaceImage}
                    alt=""
                    width={44}
                    height={44}
                    className={styles.placeImage}
                  />
                ) : null}
                <div>
                  <p className={styles.placeName}>{currentPlaceName}</p>
                  <p className={styles.placeSub}>
                    {items.length} item{items.length === 1 ? "" : "s"} · not placed yet
                  </p>
                </div>
              </div>
              <div className="px-1">
                {items.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <Image
                      src={item.image}
                      alt=""
                      width={44}
                      height={44}
                      className={styles.itemImage}
                    />
                    <div className={styles.itemMeta}>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemPrice}>{item.price}</p>
                    </div>
                    <div className={styles.qtyControls}>
                      <button
                        type="button"
                        className={styles.qtyButton}
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="text-sm">{item.qty}</span>
                      <button
                        type="button"
                        className={styles.qtyButton}
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span>{formatRwf(getTotal())}</span>
                </div>
                <Button className="mt-3 w-full" variant="secondary" onClick={handlePlaceOrder}>
                  Place order
                </Button>
              </div>
            </section>
          ) : null}

          {drafts.length > 0 ? (
            <section className={styles.sectionBlock}>
              <p className={styles.sectionTitle}>Saved drafts</p>
              <div className={styles.sectionStack}>
                {drafts.map((draft) => (
                  <div key={draft.placeId} className={styles.draftRow}>
                    <div className="flex min-w-0 items-center gap-2">
                      {draft.placeImage ? (
                        <Image
                          src={draft.placeImage}
                          alt=""
                          width={36}
                          height={36}
                          className={styles.placeImage}
                        />
                      ) : null}
                      <div className="min-w-0">
                        <p className={styles.orderTitle}>{draft.placeName}</p>
                        <p className={styles.orderSub}>
                          {draft.items.length} items · saved {formatRelativeTime(draft.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => loadDraft(draft.placeId)}>
                      Resume
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className={styles.sectionBlock}>
            <p className={styles.sectionTitle}>Active orders</p>
            {activeOrders.length === 0 ? (
              <p className={styles.empty}>No active orders right now.</p>
            ) : (
              <div className={styles.sectionStack}>
                {activeOrders.map((order) => (
                  <div key={order.id} className={styles.orderRow}>
                    {order.placeImage ? (
                      <Image
                        src={order.placeImage}
                        alt=""
                        width={44}
                        height={44}
                        className={styles.placeImage}
                      />
                    ) : null}
                    <div className={styles.orderMeta}>
                      <p className={styles.orderTitle}>{order.placeName}</p>
                      <p className={styles.orderSub}>
                        {order.items.length} items · {formatRwf(order.total)}
                      </p>
                      <p className={styles.orderSub}>
                        {order.orderType === "pre-order" && order.pickupTime
                          ? `Pickup ${formatOrderDateTime(order.pickupTime)}`
                          : order.readyBy
                            ? `Ready by ${formatOrderDateTime(order.readyBy)}`
                            : formatRelativeTime(order.date)}
                      </p>
                      <span className={styles.statusBadge}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className={styles.sectionBlock}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className={styles.sectionTitle}>Previous orders</p>
              {previousOrders.length > 0 ? (
                <button
                  type="button"
                  className="text-xs font-medium text-hano-muted transition-colors hover:text-hano-green-500"
                  onClick={clearPreviousOrders}
                >
                  Clear
                </button>
              ) : null}
            </div>
            {previousOrders.length === 0 ? (
              <p className={styles.empty}>No previous orders yet.</p>
            ) : (
              <div className={styles.sectionStack}>
                {previousOrders.map((order) => (
                  <div key={order.id} className={styles.orderRow}>
                    {order.placeImage ? (
                      <Image
                        src={order.placeImage}
                        alt=""
                        width={44}
                        height={44}
                        className={styles.placeImage}
                      />
                    ) : null}
                    <div className={styles.orderMeta}>
                      <p className={styles.orderTitle}>{order.placeName}</p>
                      <p className={styles.orderSub}>
                        {formatRelativeTime(order.date)} · {formatRwf(order.total)}
                      </p>
                      <span className={styles.statusBadge}>{order.status}</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleReorder(order.id)}>
                      Reorder
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </FloatingPanelBody>

        <FloatingPanelFooter>
          <Link href="/orders" className={styles.footerLink} onClick={closeFloatingPanel}>
            View full orders
          </Link>
          <FloatingPanelCloseButton />
        </FloatingPanelFooter>
      </div>
    </FloatingPanelContent>
  );
}

function OrderPopoverInner({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { openFloatingPanel, isOpen } = useFloatingPanel();

  const openOrderPopover = useCallback(
    (rect: DOMRect | null) => {
      setOpen(true);
      openFloatingPanel(rect, "Your orders", "anchored");
    },
    [openFloatingPanel],
  );

  useEffect(() => {
    if (!isOpen) {
      const timer = window.setTimeout(() => setOpen(false), 320);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  const value = useMemo(() => ({ openOrderPopover }), [openOrderPopover]);

  return (
    <OrderPopoverContext.Provider value={value}>
      {children}
      {open ? <OrderPanel /> : null}
    </OrderPopoverContext.Provider>
  );
}

export function OrderPopoverProvider({ children }: { children: ReactNode }) {
  return (
    <FloatingPanelRoot>
      <OrderPopoverInner>{children}</OrderPopoverInner>
    </FloatingPanelRoot>
  );
}

export function OrderTriggerButton({ itemCount }: { itemCount: number }) {
  const { openOrderPopover } = useOrderPopover();

  return (
    <button
      type="button"
      className="relative inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-hano-border px-3 text-sm font-medium text-hano-green-500 transition-colors hover:border-hano-primary-500 hover:bg-hano-primary-50"
      aria-label="Orders"
      onClick={(event) => openOrderPopover(event.currentTarget.getBoundingClientRect())}
    >
      <Icon name="cart" size={18} />
      <span>Orders</span>
      {itemCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-hano-primary-500 px-1 text-xs font-bold text-hano-green-500">
          {itemCount}
        </span>
      ) : null}
    </button>
  );
}
