"use client";

import Image from "next/image";
import Link from "next/link";
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
import type { PromoType, PromoIncludedItem } from "@/lib/data/mock-data";
import { Button } from "@/components/ui/button";
import { CartItemAction } from "@/components/places/cart-item-action";
import { useRequireAuth } from "@/hooks/use-require-auth";
import {
  CutoutCardImage,
  CutoutCardMedia,
  CutoutCardOverlay,
  CutoutCardPin,
  CutoutCorner,
} from "@/components/ui/cutout-card";
import cutoutStyles from "@/components/ui/cutout-card.module.css";
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
import styles from "./promo-popover.module.css";

export type PromoDetail = {
  id: string;
  title: string;
  description: string;
  image: string;
  promoType: PromoType;
  status: "Active" | "Upcoming" | "Ended";
  placeName: string;
  includedItems: {
    id: string;
    name: string;
    price?: string;
    priceRaw?: number;
    image?: string;
  }[];
};

type PromoPopoverContextValue = {
  openPromo: (promo: PromoDetail, rect: DOMRect | null) => void;
};

const PromoPopoverContext = createContext<PromoPopoverContextValue | null>(null);

export function usePromoPopover() {
  const context = useContext(PromoPopoverContext);
  if (!context) {
    throw new Error("usePromoPopover must be used within PromoPopoverProvider");
  }
  return context;
}

function PromoPanel({
  promo,
  menuHref,
  placeId,
  onAddToCart,
}: {
  promo: PromoDetail;
  menuHref: string;
  placeId: string;
  onAddToCart?: (item: PromoIncludedItem) => void;
}) {
  const titleId = useId();
  const requireAuth = useRequireAuth();
  const { closeFloatingPanel } = useFloatingPanel();
  const statusPinClass =
    promo.status === "Active"
      ? cutoutStyles.pinOpen
      : promo.status === "Upcoming"
        ? cutoutStyles.pinClosed
        : cutoutStyles.pinClosed;

  return (
    <FloatingPanelContent
      header={
        <div className={styles.hero}>
          <CutoutCardMedia className={styles.heroMedia} style={{ height: "14rem" }}>
            <CutoutCardImage alt={promo.title} sizes="340px" src={promo.image} />
            <CutoutCardOverlay />
            <CutoutCardPin className={statusPinClass}>
              {promo.status}
              <CutoutCorner
                className={
                  promo.status === "Active"
                    ? cutoutStyles.pinCornerLeftOpen
                    : cutoutStyles.pinCornerLeftClosed
                }
                size={28}
              />
              <CutoutCorner
                className={
                  promo.status === "Active"
                    ? cutoutStyles.pinCornerBottomOpen
                    : cutoutStyles.pinCornerBottomClosed
                }
                size={28}
              />
            </CutoutCardPin>
          </CutoutCardMedia>
        </div>
      }
      titleId={titleId}
    >
      <div className={panelStyles.panelLayout}>
        <div className={panelStyles.panelBodyScroll}>
          <div className={styles.titleBlock}>
            <h2 id={titleId} className={styles.promoTitle}>
              {promo.title}
            </h2>
            <p className={styles.promoSub}>{promo.placeName}</p>
          </div>

          <FloatingPanelHeader>Promo details</FloatingPanelHeader>
          <FloatingPanelBody className="space-y-3">
            <div className={styles.metaChips}>
              <span className={`${styles.chip} ${styles.chipType}`}>{promo.promoType}</span>
              <span className={`${styles.chip} ${styles.chipActive}`}>{promo.status}</span>
            </div>
            <p className={styles.description}>{promo.description}</p>
          </FloatingPanelBody>

          <FloatingPanelHeader>Items included</FloatingPanelHeader>
          <FloatingPanelBody>
            <div className={styles.itemList}>
              {promo.includedItems.map((item) => {
                const cartItemId = `${placeId}-${item.id}`;

                return (
                  <div key={item.id} className={styles.itemRow}>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        width={44}
                        height={44}
                        className={styles.itemImage}
                      />
                    ) : (
                      <div className={`${styles.itemImage} bg-hano-surface`} />
                    )}
                    <div className={styles.itemMeta}>
                      <p className={styles.itemName}>{item.name}</p>
                      {item.price ? <p className={styles.itemPrice}>{item.price}</p> : null}
                    </div>
                    <CartItemAction
                      cartItemId={cartItemId}
                      size="sm"
                      iconOnly
                      className={styles.itemOrderAction}
                      onAdd={() => {
                        if (!requireAuth("add_to_cart")) return;
                        onAddToCart?.(item);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </FloatingPanelBody>
        </div>

        <FloatingPanelFooter className={panelStyles.panelFooterFixed}>
          <Link href={menuHref} onClick={() => closeFloatingPanel()}>
            <Button className={styles.orderButton} variant="secondary">
              Order now
            </Button>
          </Link>
          <FloatingPanelCloseButton />
        </FloatingPanelFooter>
      </div>
    </FloatingPanelContent>
  );
}

function PromoPopoverInner({
  children,
  menuHref,
  placeId,
  onAddToCart,
}: {
  children: ReactNode;
  menuHref: string;
  placeId: string;
  onAddToCart?: (item: PromoIncludedItem) => void;
}) {
  const [selected, setSelected] = useState<PromoDetail | null>(null);
  const { openFloatingPanel, isOpen } = useFloatingPanel();

  const openPromo = useCallback(
    (promo: PromoDetail, rect: DOMRect | null) => {
      setSelected(promo);
      openFloatingPanel(rect, promo.title, "centered");
    },
    [openFloatingPanel],
  );

  useEffect(() => {
    if (!isOpen) {
      const timer = window.setTimeout(() => setSelected(null), 320);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  const value = useMemo(() => ({ openPromo }), [openPromo]);

  return (
    <PromoPopoverContext.Provider value={value}>
      {children}
      {selected ? (
        <PromoPanel
          promo={selected}
          menuHref={menuHref}
          placeId={placeId}
          onAddToCart={onAddToCart}
        />
      ) : null}
    </PromoPopoverContext.Provider>
  );
}

export function PromoPopoverProvider({
  children,
  menuHref,
  placeId,
  onAddToCart,
}: {
  children: ReactNode;
  menuHref: string;
  placeId: string;
  onAddToCart?: (item: PromoIncludedItem) => void;
}) {
  return (
    <FloatingPanelRoot>
      <PromoPopoverInner menuHref={menuHref} placeId={placeId} onAddToCart={onAddToCart}>
        {children}
      </PromoPopoverInner>
    </FloatingPanelRoot>
  );
}
