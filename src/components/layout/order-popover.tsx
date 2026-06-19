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
import {
  formatOrderDateTime,
  getPreOrderMaxTime,
  getPreOrderMinTime,
  getReadyByTime,
  PREP_TIME_MINUTES,
  toDateTimeLocalValue,
  validatePreOrderTime,
} from "@/lib/order-rules";
import { formatRwf, formatRelativeTime } from "@/lib/utils";
import { PAYMENT_METHODS, type PaymentMethodId } from "@/lib/data/mock-data";
import {
  formatCardCvv,
  formatCardExpiry,
  formatCardNumber,
  formatRwandaPhone,
  isCardPaymentValid,
  isValidRwandaPhone,
} from "@/lib/payment-input";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  FloatingPanelA11yTitle,
  FloatingPanelBody,
  FloatingPanelCloseButton,
  FloatingPanelContent,
  FloatingPanelFooter,
  FloatingPanelHeader,
  FloatingPanelRoot,
  useFloatingPanel,
} from "@/components/ui/floating-panel";
import { OrderDetailContent } from "@/components/orders/order-detail-content";
import { OrderList } from "@/components/orders/order-list";
import panelStyles from "@/components/ui/floating-panel.module.css";
import { Price } from "@/components/ui/price";
import styles from "./order-popover.module.css";

type CheckoutView =
  | "orders"
  | "order-detail"
  | "preview"
  | "order-type"
  | "pickup-time"
  | "payment"
  | "success";

type CheckoutDraft = {
  orderType: "direct" | "pre-order";
  pickupTime?: string;
};

type PlacedOrderSummary = {
  orderType: "direct" | "pre-order";
  pickupTime?: string;
  readyBy?: string;
  amountPaid: number;
  paymentMethod: PaymentMethodId;
};

type OrderPopoverContextValue = {
  openOrderPopover: (rect: DOMRect | null) => void;
  openCheckoutPreview: (rect: DOMRect | null) => void;
  openOrderDetail: (
    orderId: string,
    rect?: DOMRect | null,
    options?: { returnTo?: "orders" | "close" },
  ) => void;
};

const OrderPopoverContext = createContext<OrderPopoverContextValue | null>(null);

export function useOrderPopover() {
  const context = useContext(OrderPopoverContext);
  if (!context) {
    throw new Error("useOrderPopover must be used within OrderPopoverProvider");
  }
  return context;
}

function CurrentDraftSection({
  onPlaceOrder,
}: {
  onPlaceOrder: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const items = useCartStore((s) => s.items);
  const currentPlaceName = useCartStore((s) => s.currentPlaceName);
  const currentPlaceImage = useCartStore((s) => s.currentPlaceImage);
  const updateQty = useCartStore((s) => s.updateQty);
  const getTotal = useCartStore((s) => s.getTotal);

  if (!items.length) return null;

  return (
    <section>
      <p className={styles.sectionTitle}>Current draft</p>
      <div className={styles.draftCard}>
        <button
          type="button"
          className={`${styles.placeHeader} ${expanded ? styles.placeHeaderExpanded : ""}`}
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse current draft" : "Expand current draft"}
        >
          {currentPlaceImage ? (
            <Image
              src={currentPlaceImage}
              alt=""
              width={44}
              height={44}
              className={styles.placeImage}
            />
          ) : null}
          <div className={styles.placeHeaderMeta}>
            <p className={styles.placeName}>{currentPlaceName}</p>
            <p className={styles.placeSub}>
              {items.length} item{items.length === 1 ? "" : "s"}
              {expanded ? " · not placed yet" : ` · ${formatRwf(getTotal())}`}
            </p>
          </div>
          <span className={styles.collapseButton} aria-hidden>
            <Icon name={expanded ? "trendingUp" : "trendingDown"} size={16} />
          </span>
        </button>

        {expanded ? (
          <div className={styles.draftCardBody}>
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
              <Price>{formatRwf(getTotal())}</Price>
            </div>
          </div>
        ) : null}

        <div
          className={`${styles.draftCardFooter} ${expanded ? "" : styles.draftCardFooterCollapsed}`}
        >
          {!expanded ? (
            <div className={`${styles.totalRow} pb-3`}>
              <span>Total</span>
              <Price>{formatRwf(getTotal())}</Price>
            </div>
          ) : null}
          <Button className="w-full" variant="secondary" onClick={onPlaceOrder}>
            Place order
          </Button>
        </div>
      </div>
    </section>
  );
}

function OrderPanel({
  onCheckoutPreview,
  onOrderClick,
  onReorder,
}: {
  onCheckoutPreview: () => void;
  onOrderClick: (orderId: string, rect: DOMRect | null) => void;
  onReorder: (orderId: string) => void;
}) {
  const titleId = useId();
  const requireAuth = useRequireAuth();
  const { closeFloatingPanel } = useFloatingPanel();
  const items = useCartStore((s) => s.items);
  const drafts = useCartStore((s) => s.drafts);
  const loadDraft = useCartStore((s) => s.loadDraft);
  const getActiveOrders = useCartStore((s) => s.getActiveOrders);
  const getPreviousOrders = useCartStore((s) => s.getPreviousOrders);
  const clearPreviousOrders = useCartStore((s) => s.clearPreviousOrders);

  const activeOrders = getActiveOrders();
  const previousOrders = getPreviousOrders();

  const handlePlaceOrder = () => {
    if (!items.length) return;
    if (!requireAuth("checkout")) return;
    onCheckoutPreview();
  };

  return (
    <FloatingPanelContent
      titleId={titleId}
      header={<FloatingPanelA11yTitle titleId={titleId}>Your orders</FloatingPanelA11yTitle>}
    >
      <div className={panelStyles.panelLayout}>
        <FloatingPanelHeader className={panelStyles.panelHeaderFixed}>
          Your orders
        </FloatingPanelHeader>
        <div className={panelStyles.panelBodyScroll}>
          <FloatingPanelBody className={styles.sectionStack}>
            <CurrentDraftSection onPlaceOrder={handlePlaceOrder} />

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

            <OrderList
              activeOrders={activeOrders}
              previousOrders={previousOrders}
              onOrderClick={onOrderClick}
              onReorder={onReorder}
              onClearPrevious={clearPreviousOrders}
              variant="popover"
            />
          </FloatingPanelBody>
        </div>

        <FloatingPanelFooter className={panelStyles.panelFooterFixed}>
          <Link href="/orders" className={styles.footerLink} onClick={closeFloatingPanel}>
            View full orders
          </Link>
          <FloatingPanelCloseButton />
        </FloatingPanelFooter>
      </div>
    </FloatingPanelContent>
  );
}

function CheckoutPreviewPanel({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const titleId = useId();
  const router = useRouter();
  const { closeFloatingPanel } = useFloatingPanel();
  const items = useCartStore((s) => s.items);
  const currentPlaceName = useCartStore((s) => s.currentPlaceName);
  const currentPlaceImage = useCartStore((s) => s.currentPlaceImage);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const handleEdit = () => {
    closeFloatingPanel();
    router.push("/cart");
  };

  const handleDiscard = () => {
    clearCart();
    closeFloatingPanel();
    router.push("/places");
  };

  return (
    <FloatingPanelContent
      titleId={titleId}
      header={<FloatingPanelA11yTitle titleId={titleId}>Order preview</FloatingPanelA11yTitle>}
    >
      <div className={panelStyles.panelLayout}>
        <FloatingPanelHeader className={panelStyles.panelHeaderFixed}>
          Order preview
        </FloatingPanelHeader>
        <div className={panelStyles.panelBodyScroll}>
          <FloatingPanelBody className="space-y-3">
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
                <p className={styles.placeSub}>Single-place order</p>
              </div>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate">
                    {item.qty}x {item.name}
                  </span>
                  <Price>{formatRwf(item.priceRaw * item.qty)}</Price>
                </div>
              ))}
            </div>

            <div className={styles.totalRow}>
              <span>Total</span>
              <Price>{formatRwf(getTotal())}</Price>
            </div>

            {confirmDiscard ? (
              <div className="rounded-xl border border-hano-danger-500/30 bg-red-50 px-3 py-2">
                <p className="text-sm font-medium text-hano-green-500">
                  Discard this order draft?
                </p>
                <p className="mt-0.5 text-xs text-hano-muted">
                  This will remove all items currently in your cart.
                </p>
                <div className="mt-2 flex flex-wrap justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setConfirmDiscard(false)}>
                    Keep editing
                  </Button>
                  <Button size="sm" variant="danger" onClick={handleDiscard}>
                    Yes, discard
                  </Button>
                </div>
              </div>
            ) : null}
          </FloatingPanelBody>
        </div>

        <FloatingPanelFooter className={panelStyles.panelFooterFixed}>
          <Button variant="ghost" onClick={() => setConfirmDiscard(true)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            Edit order
          </Button>
          <Button variant="secondary" onClick={onContinue}>
            Continue checkout
          </Button>
          <button
            type="button"
            className={panelStyles.closeButton}
            onClick={onBack}
            aria-label="Back to orders"
          >
            <Icon name="chevronLeft" size={16} />
          </button>
        </FloatingPanelFooter>
      </div>
    </FloatingPanelContent>
  );
}

function OrderTypePanel({
  onBack,
  onDirect,
  onPreOrder,
}: {
  onBack: () => void;
  onDirect: () => void;
  onPreOrder: () => void;
}) {
  const titleId = useId();
  const readyBy = formatOrderDateTime(getReadyByTime());

  return (
    <FloatingPanelContent
      titleId={titleId}
      header={<FloatingPanelA11yTitle titleId={titleId}>Order type</FloatingPanelA11yTitle>}
    >
      <div className={panelStyles.panelLayout}>
        <FloatingPanelHeader className={panelStyles.panelHeaderFixed}>
          How would you like to order?
        </FloatingPanelHeader>
        <div className={panelStyles.panelBodyScroll}>
          <FloatingPanelBody className="space-y-3">
            <button type="button" className={styles.optionCard} onClick={onDirect}>
              <div>
                <p className={styles.optionTitle}>Direct order</p>
                <p className={styles.optionDesc}>
                  We&apos;ll start preparing now. Estimated ready by {readyBy} ({PREP_TIME_MINUTES}{" "}
                  min prep).
                </p>
              </div>
            </button>
            <button type="button" className={styles.optionCard} onClick={onPreOrder}>
              <div>
                <p className={styles.optionTitle}>Pre-order</p>
                <p className={styles.optionDesc}>
                  Pick a time at least {PREP_TIME_MINUTES} minutes from now and within 24 hours.
                </p>
              </div>
            </button>
          </FloatingPanelBody>
        </div>
        <FloatingPanelFooter className={panelStyles.panelFooterFixed}>
          <button
            type="button"
            className={panelStyles.closeButton}
            onClick={onBack}
            aria-label="Back to preview"
          >
            <Icon name="chevronLeft" size={16} />
          </button>
        </FloatingPanelFooter>
      </div>
    </FloatingPanelContent>
  );
}

function PickupTimePanel({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: (pickupTime: string) => void;
}) {
  const titleId = useId();
  const minValue = useMemo(() => toDateTimeLocalValue(getPreOrderMinTime()), []);
  const maxValue = useMemo(() => toDateTimeLocalValue(getPreOrderMaxTime()), []);
  const [value, setValue] = useState(minValue);
  const validation = validatePreOrderTime(value);

  return (
    <FloatingPanelContent
      titleId={titleId}
      header={<FloatingPanelA11yTitle titleId={titleId}>Pickup time</FloatingPanelA11yTitle>}
    >
      <div className={panelStyles.panelLayout}>
        <FloatingPanelHeader className={panelStyles.panelHeaderFixed}>
          Pickup time
        </FloatingPanelHeader>
        <div className={panelStyles.panelBodyScroll}>
          <FloatingPanelBody className="space-y-3">
            <p className="text-sm text-hano-muted">
              Choose when you want to pick up. Must be at least {PREP_TIME_MINUTES} minutes from now
              and within 24 hours.
            </p>
            <input
              type="datetime-local"
              value={value}
              min={minValue}
              max={maxValue}
              onChange={(event) => setValue(event.target.value)}
              className="h-11 w-full rounded-xl border border-hano-border bg-white px-4 text-sm outline-none transition focus:border-hano-green-500 focus:ring-2 focus:ring-hano-primary-200"
            />
            {!validation.valid ? (
              <p className="text-sm text-hano-danger-500">{validation.error}</p>
            ) : null}
          </FloatingPanelBody>
        </div>
        <FloatingPanelFooter className={panelStyles.panelFooterFixed}>
          <Button
            variant="secondary"
            disabled={!validation.valid}
            onClick={() => onContinue(new Date(value).toISOString())}
          >
            Continue to payment
          </Button>
          <button
            type="button"
            className={panelStyles.closeButton}
            onClick={onBack}
            aria-label="Back to order type"
          >
            <Icon name="chevronLeft" size={16} />
          </button>
        </FloatingPanelFooter>
      </div>
    </FloatingPanelContent>
  );
}

function PaymentPanel({
  checkout,
  onBack,
  onSuccess,
}: {
  checkout: CheckoutDraft;
  onBack: () => void;
  onSuccess: (summary: PlacedOrderSummary) => void;
}) {
  const titleId = useId();
  const { getTotal, placeOrder } = useCartStore();
  const [method, setMethod] = useState<PaymentMethodId>("momo");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const total = getTotal();

  const pickupLabel =
    checkout.orderType === "pre-order" && checkout.pickupTime
      ? formatOrderDateTime(checkout.pickupTime)
      : undefined;

  const canPay =
    method === "card"
      ? isCardPaymentValid({ cardNumber, cardExpiry, cardCvv })
      : isValidRwandaPhone(phone);

  const handlePay = () => {
    const amountPaid = getTotal();
    const readyByIso =
      checkout.orderType === "direct" ? getReadyByTime().toISOString() : undefined;

    placeOrder(checkout.orderType, checkout.pickupTime);
    onSuccess({
      orderType: checkout.orderType,
      pickupTime: checkout.pickupTime,
      readyBy: readyByIso,
      amountPaid,
      paymentMethod: method,
    });
  };

  return (
    <FloatingPanelContent
      titleId={titleId}
      header={<FloatingPanelA11yTitle titleId={titleId}>Payment</FloatingPanelA11yTitle>}
    >
      <div className={panelStyles.panelLayout}>
        <FloatingPanelHeader className={panelStyles.panelHeaderFixed}>Payment</FloatingPanelHeader>
        <div className={panelStyles.panelBodyScroll}>
          <FloatingPanelBody className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-hano-muted">Amount due</span>
              <Price className="text-lg font-bold">{formatRwf(total)}</Price>
            </div>

            {checkout.orderType === "direct" ? (
              <p className={styles.infoBanner}>
                Direct order · estimated prep time: <strong>{PREP_TIME_MINUTES} minutes</strong>
              </p>
            ) : (
              <p className={styles.infoBanner}>
                Pre-order · pickup at <strong>{pickupLabel}</strong>
              </p>
            )}

            <div className={styles.paymentList} role="radiogroup" aria-label="Payment method">
              {PAYMENT_METHODS.map((paymentMethod) => {
                const selected = method === paymentMethod.id;

                return (
                  <button
                    key={paymentMethod.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setMethod(paymentMethod.id)}
                    className={`${styles.paymentMethod} ${
                      selected ? styles.paymentMethodActive : ""
                    }`}
                  >
                    <span className={styles.paymentIcon} aria-hidden>
                      <Image
                        src={paymentMethod.logo}
                        alt=""
                        width={36}
                        height={36}
                        className={styles.paymentLogo}
                      />
                    </span>
                    <span className={styles.paymentMethodLabel}>{paymentMethod.name}</span>
                    <span
                      className={`${styles.paymentRadio} ${
                        selected ? styles.paymentRadioActive : ""
                      }`}
                      aria-hidden
                    >
                      <span className={styles.paymentRadioDot} />
                    </span>
                  </button>
                );
              })}
            </div>

            {(method === "momo" || method === "airtel") && (
              <Input
                placeholder="Phone number (7XXXXXXXX)"
                value={phone}
                onChange={(event) => setPhone(formatRwandaPhone(event.target.value))}
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                pattern="0?7[0-9]{8}"
              />
            )}

            {method === "card" && (
              <div className="space-y-3">
                <Input
                  placeholder="Card number"
                  value={cardNumber}
                  onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  maxLength={19}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(event) => setCardExpiry(formatCardExpiry(event.target.value))}
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    maxLength={5}
                  />
                  <Input
                    placeholder="CVV"
                    value={cardCvv}
                    onChange={(event) => setCardCvv(formatCardCvv(event.target.value))}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    maxLength={4}
                  />
                </div>
              </div>
            )}

            <p className="text-center text-xs text-hano-muted">
              Payment processing is UI-only until backend integration.
            </p>
          </FloatingPanelBody>
        </div>
        <FloatingPanelFooter className={panelStyles.panelFooterFixed}>
          <Button variant="secondary" disabled={!canPay} onClick={handlePay}>
            Pay {formatRwf(total)}
          </Button>
          <button
            type="button"
            className={panelStyles.closeButton}
            onClick={onBack}
            aria-label="Back"
          >
            <Icon name="chevronLeft" size={16} />
          </button>
        </FloatingPanelFooter>
      </div>
    </FloatingPanelContent>
  );
}

function CheckoutSuccessPanel({
  summary,
  onClose,
}: {
  summary: PlacedOrderSummary;
  onClose: () => void;
}) {
  const titleId = useId();
  const router = useRouter();
  const { closeFloatingPanel } = useFloatingPanel();
  const paymentLabel =
    PAYMENT_METHODS.find((item) => item.id === summary.paymentMethod)?.name ?? "Payment";

  return (
    <FloatingPanelContent
      titleId={titleId}
      header={<FloatingPanelA11yTitle titleId={titleId}>Order placed</FloatingPanelA11yTitle>}
    >
      <div className={panelStyles.panelLayout}>
        <div className={panelStyles.panelBodyScroll}>
          <FloatingPanelBody className="py-4">
            <div className={styles.successIcon}>✓</div>
            <p className={styles.successTitle}>Order placed!</p>
            <p className={styles.successText}>Your order has been submitted successfully.</p>
            <div className={styles.successSummary}>
              <div className={styles.successRow}>
                <span className={styles.successRowLabel}>Amount paid</span>
                <Price className="font-semibold">{formatRwf(summary.amountPaid)}</Price>
              </div>
              <div className={styles.successRow}>
                <span className={styles.successRowLabel}>Payment</span>
                <span>{paymentLabel}</span>
              </div>
              {summary.orderType === "direct" && summary.readyBy ? (
                <div className={styles.successRow}>
                  <span className={styles.successRowLabel}>Ready by</span>
                  <span>{formatOrderDateTime(summary.readyBy)}</span>
                </div>
              ) : null}
              {summary.orderType === "pre-order" && summary.pickupTime ? (
                <div className={styles.successRow}>
                  <span className={styles.successRowLabel}>Pickup</span>
                  <span>{formatOrderDateTime(summary.pickupTime)}</span>
                </div>
              ) : null}
            </div>
          </FloatingPanelBody>
        </div>
        <FloatingPanelFooter className={panelStyles.panelFooterFixed}>
          <Button
            variant="outline"
            onClick={() => {
              closeFloatingPanel();
              onClose();
              router.push("/orders");
            }}
          >
            View orders
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              closeFloatingPanel();
              onClose();
              router.push("/");
            }}
          >
            Go home
          </Button>
        </FloatingPanelFooter>
      </div>
    </FloatingPanelContent>
  );
}

function OrderDetailPanel({
  orderId,
  returnTo,
  onBack,
  onReorder,
}: {
  orderId: string;
  returnTo: "orders" | "close";
  onBack: () => void;
  onReorder: (orderId: string) => void;
}) {
  const titleId = useId();
  const { closeFloatingPanel } = useFloatingPanel();
  const orders = useCartStore((s) => s.orders);
  const order = orders.find((item) => item.id === orderId);

  if (!order) {
    return (
      <FloatingPanelContent
        titleId={titleId}
        header={<FloatingPanelA11yTitle titleId={titleId}>Order details</FloatingPanelA11yTitle>}
      >
        <div className={panelStyles.panelLayout}>
          <FloatingPanelHeader className={panelStyles.panelHeaderFixed}>
            Order details
          </FloatingPanelHeader>
          <div className={panelStyles.panelBodyScroll}>
            <FloatingPanelBody>
              <p className={styles.empty}>Order not found.</p>
            </FloatingPanelBody>
          </div>
          <FloatingPanelFooter className={panelStyles.panelFooterFixed}>
            <Button
              variant="outline"
              onClick={() => {
                if (returnTo === "close") closeFloatingPanel();
                onBack();
              }}
            >
              Close
            </Button>
          </FloatingPanelFooter>
        </div>
      </FloatingPanelContent>
    );
  }

  return (
    <FloatingPanelContent
      titleId={titleId}
      header={<FloatingPanelA11yTitle titleId={titleId}>Order details</FloatingPanelA11yTitle>}
    >
      <div className={panelStyles.panelLayout}>
        <FloatingPanelHeader className={panelStyles.panelHeaderFixed}>
          Order details
        </FloatingPanelHeader>
        <div className={panelStyles.panelBodyScroll}>
          <FloatingPanelBody>
            <OrderDetailContent order={order} />
          </FloatingPanelBody>
        </div>
        <FloatingPanelFooter className={panelStyles.panelFooterFixed}>
          <Button
            variant="outline"
            onClick={() => {
              if (returnTo === "close") closeFloatingPanel();
              onBack();
            }}
          >
            <Icon name="chevronLeft" size={16} />
            {returnTo === "orders" ? "Back" : "Close"}
          </Button>
          <Button variant="secondary" onClick={() => onReorder(order.id)}>
            Reorder
          </Button>
          <FloatingPanelCloseButton />
        </FloatingPanelFooter>
      </div>
    </FloatingPanelContent>
  );
}

function OrderPopoverInner({ children }: { children: ReactNode }) {
  const [view, setView] = useState<CheckoutView | null>(null);
  const [checkout, setCheckout] = useState<CheckoutDraft>({ orderType: "direct" });
  const [placedOrder, setPlacedOrder] = useState<PlacedOrderSummary | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [detailReturnTo, setDetailReturnTo] = useState<"orders" | "close">("orders");
  const reorder = useCartStore((s) => s.reorder);
  const { openFloatingPanel, isOpen } = useFloatingPanel();

  const panelTitles: Record<CheckoutView, string> = {
    orders: "Your orders",
    "order-detail": "Order details",
    preview: "Order preview",
    "order-type": "Order type",
    "pickup-time": "Pickup time",
    payment: "Payment",
    success: "Order placed",
  };

  const openOrderPopover = useCallback(
    (rect: DOMRect | null) => {
      setView("orders");
      setPlacedOrder(null);
      openFloatingPanel(rect, panelTitles.orders, "centered");
    },
    [openFloatingPanel],
  );

  const openCheckoutPreview = useCallback(
    (rect: DOMRect | null) => {
      setView("preview");
      setPlacedOrder(null);
      setSelectedOrderId(null);
      openFloatingPanel(rect, panelTitles.preview, "centered");
    },
    [openFloatingPanel],
  );

  const openOrderDetail = useCallback(
    (
      orderId: string,
      rect: DOMRect | null = null,
      options?: { returnTo?: "orders" | "close" },
    ) => {
      setSelectedOrderId(orderId);
      setDetailReturnTo(options?.returnTo ?? "orders");
      setView("order-detail");
      setPlacedOrder(null);
      openFloatingPanel(rect, panelTitles["order-detail"], "centered");
    },
    [openFloatingPanel],
  );

  const handleReorder = useCallback(
    (orderId: string, rect: DOMRect | null = null) => {
      reorder(orderId);
      openCheckoutPreview(rect);
    },
    [openCheckoutPreview, reorder],
  );

  const handleOrderClick = useCallback(
    (orderId: string, rect: DOMRect | null) => {
      openOrderDetail(orderId, rect, { returnTo: "orders" });
    },
    [openOrderDetail],
  );

  useEffect(() => {
    if (!isOpen) {
      const timer = window.setTimeout(() => {
        setView(null);
        setCheckout({ orderType: "direct" });
        setPlacedOrder(null);
        setSelectedOrderId(null);
        setDetailReturnTo("orders");
      }, 320);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  const value = useMemo(
    () => ({ openOrderPopover, openCheckoutPreview, openOrderDetail }),
    [openCheckoutPreview, openOrderDetail, openOrderPopover],
  );

  return (
    <OrderPopoverContext.Provider value={value}>
      {children}
      {view === "orders" ? (
        <OrderPanel
          onCheckoutPreview={() => setView("preview")}
          onOrderClick={handleOrderClick}
          onReorder={handleReorder}
        />
      ) : null}
      {view === "order-detail" && selectedOrderId ? (
        <OrderDetailPanel
          orderId={selectedOrderId}
          returnTo={detailReturnTo}
          onBack={() => {
            if (detailReturnTo === "orders") {
              setView("orders");
              return;
            }
            setSelectedOrderId(null);
          }}
          onReorder={handleReorder}
        />
      ) : null}
      {view === "preview" ? (
        <CheckoutPreviewPanel
          onBack={() => setView("orders")}
          onContinue={() => setView("order-type")}
        />
      ) : null}
      {view === "order-type" ? (
        <OrderTypePanel
          onBack={() => setView("preview")}
          onDirect={() => {
            setCheckout({ orderType: "direct" });
            setView("payment");
          }}
          onPreOrder={() => {
            setCheckout({ orderType: "pre-order" });
            setView("pickup-time");
          }}
        />
      ) : null}
      {view === "pickup-time" ? (
        <PickupTimePanel
          onBack={() => setView("order-type")}
          onContinue={(pickupTime) => {
            setCheckout({ orderType: "pre-order", pickupTime });
            setView("payment");
          }}
        />
      ) : null}
      {view === "payment" ? (
        <PaymentPanel
          checkout={checkout}
          onBack={() =>
            setView(checkout.orderType === "pre-order" ? "pickup-time" : "order-type")
          }
          onSuccess={(summary) => {
            setPlacedOrder(summary);
            setView("success");
          }}
        />
      ) : null}
      {view === "success" && placedOrder ? (
        <CheckoutSuccessPanel
          summary={placedOrder}
          onClose={() => {
            setPlacedOrder(null);
            setCheckout({ orderType: "direct" });
          }}
        />
      ) : null}
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
  const hydrated = useHydrated();

  return (
    <button
      type="button"
      className="relative inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-hano-border px-3 text-sm font-medium text-hano-green-500 transition-colors hover:border-hano-primary-500 hover:bg-hano-primary-50"
      aria-label="Orders"
      onClick={(event) => openOrderPopover(event.currentTarget.getBoundingClientRect())}
    >
      <Icon name="cart" size={18} />
      <span>Orders</span>
      {hydrated && itemCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-hano-primary-500 px-1 text-xs font-bold text-hano-green-500">
          {itemCount}
        </span>
      ) : null}
    </button>
  );
}

export function OrderStickyBar({ placeId }: { placeId: string }) {
  const itemCount = useCartStore((s) => s.getItemCount());
  const total = useCartStore((s) => s.getTotal());
  const currentPlaceId = useCartStore((s) => s.currentPlaceId);
  const { openOrderPopover } = useOrderPopover();
  const hydrated = useHydrated();

  if (!hydrated || itemCount <= 0 || currentPlaceId !== placeId) return null;

  return (
    <div className={styles.stickyBar}>
      <div className={styles.stickySummary}>
        <span className={styles.stickyCount}>
          {itemCount} item{itemCount !== 1 ? "s" : ""} in cart
        </span>
        <Price className={styles.stickyTotal}>{formatRwf(total)}</Price>
      </div>
      <Button
        size="sm"
        className={styles.stickyAction}
        onClick={(event) => openOrderPopover(event.currentTarget.getBoundingClientRect())}
      >
        View orders
      </Button>
    </div>
  );
}

function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
