"use client";

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
import type { MenuItem } from "@/lib/data/mock-data";
import { Icon } from "@/components/ui/icon";
import { CartItemAction } from "@/components/places/cart-item-action";
import {
  CutoutCardImage,
  CutoutCardInsetLabel,
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
import { WishlistDishButton } from "@/components/wishlist/wishlist-save-button";
import styles from "./menu-item-popover.module.css";

type MenuItemPayload = {
  item: MenuItem;
  categoryRank: number;
};

type MenuItemPopoverContextValue = {
  openMenuItem: (payload: MenuItemPayload, rect: DOMRect | null) => void;
};

const MenuItemPopoverContext = createContext<MenuItemPopoverContextValue | null>(null);

export function useMenuItemPopover() {
  const context = useContext(MenuItemPopoverContext);
  if (!context) {
    throw new Error("useMenuItemPopover must be used within MenuItemPopoverProvider");
  }
  return context;
}

function MenuItemPanel({
  payload,
  placeId,
  placeName,
  onAddToCart,
}: {
  payload: MenuItemPayload;
  placeId: string;
  placeName: string;
  onAddToCart?: (item: MenuItem) => void;
}) {
  const titleId = useId();
  const [activeIdx, setActiveIdx] = useState(0);
  const images = payload.item.images?.length ? payload.item.images : [payload.item.image];

  useEffect(() => {
    setActiveIdx(0);
  }, [payload.item.id]);

  const currentImage = images[activeIdx] ?? payload.item.image;

  const prevImage = () =>
    setActiveIdx((idx) => (idx === 0 ? images.length - 1 : idx - 1));
  const nextImage = () =>
    setActiveIdx((idx) => (idx === images.length - 1 ? 0 : idx + 1));

  return (
    <FloatingPanelContent
      header={
        <div className={styles.hero}>
          <CutoutCardMedia className={styles.heroMedia} style={{ height: "14rem" }}>
            <CutoutCardImage alt={payload.item.name} sizes="340px" src={currentImage} />
            <CutoutCardOverlay />

            <CutoutCardInsetLabel className={cutoutStyles.insetLabelRating}>
              <span className={cutoutStyles.insetEyebrow}>Rating</span>
              <span className={cutoutStyles.insetValue}>
                {payload.item.rating.toFixed(1)}
                <Icon name="star" size={16} />
              </span>
              <CutoutCorner className={cutoutStyles.insetCornerRight} />
              <CutoutCorner className={cutoutStyles.insetCornerTop} />
            </CutoutCardInsetLabel>

            <CutoutCardPin className={cutoutStyles.pinOpen}>
              #{payload.categoryRank}
              <CutoutCorner className={cutoutStyles.pinCornerLeftOpen} size={28} />
              <CutoutCorner className={cutoutStyles.pinCornerBottomOpen} size={28} />
            </CutoutCardPin>

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  className={`${styles.heroNavButton} ${styles.heroNavPrev}`}
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <Icon name="chevronLeft" size={16} />
                </button>
                <button
                  type="button"
                  className={`${styles.heroNavButton} ${styles.heroNavNext}`}
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <Icon name="chevronLeft" size={16} className="rotate-180" />
                </button>
              </>
            ) : null}
          </CutoutCardMedia>
        </div>
      }
      titleId={titleId}
    >
      <div className={panelStyles.panelLayout}>
        <div className={panelStyles.panelBodyScroll}>
          <div className={styles.titleBlock}>
            <h2 id={titleId} className={styles.itemName}>
              {payload.item.name}
            </h2>
            <WishlistDishButton
              placeId={placeId}
              placeName={placeName}
              itemId={payload.item.id}
              itemName={payload.item.name}
              itemImage={payload.item.image}
              itemPrice={payload.item.price}
              itemPriceRaw={payload.item.priceRaw}
              size="md"
              className={styles.titleWishlistButton}
            />
          </div>
          <FloatingPanelHeader>Item details</FloatingPanelHeader>
          <FloatingPanelBody className="space-y-3">
            <div className={styles.metaChips}>
              <span className={styles.chip}>
                #{payload.categoryRank} in {payload.item.category}
              </span>
              <span className={styles.chip}>
                <Icon name="star" size={12} className="text-hano-primary-600" />
                {payload.item.rating.toFixed(1)}
              </span>
            </div>
            <p className={styles.description}>{payload.item.desc}</p>
            {images.length > 1 ? (
              <div className={styles.dots}>
                {images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    className={`${styles.dot} ${idx === activeIdx ? styles.dotActive : ""}`}
                    onClick={() => setActiveIdx(idx)}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </FloatingPanelBody>
        </div>
        <FloatingPanelFooter className={`${panelStyles.panelFooterFixed} ${styles.footer}`}>
          <span className={styles.price}>{payload.item.price}</span>
          <div className={styles.footerActions}>
            <CartItemAction
              cartItemId={`${placeId}-${payload.item.id}`}
              size="md"
              compact={false}
              onAdd={() => onAddToCart?.(payload.item)}
            />
            <FloatingPanelCloseButton />
          </div>
        </FloatingPanelFooter>
      </div>
    </FloatingPanelContent>
  );
}

function MenuItemPopoverInner({
  children,
  placeId,
  placeName,
  onAddToCart,
}: {
  children: ReactNode;
  placeId: string;
  placeName: string;
  onAddToCart?: (item: MenuItem) => void;
}) {
  const [selected, setSelected] = useState<MenuItemPayload | null>(null);
  const { openFloatingPanel, isOpen } = useFloatingPanel();

  const openMenuItem = useCallback(
    (payload: MenuItemPayload, rect: DOMRect | null) => {
      setSelected(payload);
      openFloatingPanel(rect, payload.item.name, "centered");
    },
    [openFloatingPanel],
  );

  useEffect(() => {
    if (!isOpen) {
      const timer = window.setTimeout(() => setSelected(null), 320);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  const value = useMemo(() => ({ openMenuItem }), [openMenuItem]);

  return (
    <MenuItemPopoverContext.Provider value={value}>
      {children}
      {selected ? (
        <MenuItemPanel
          payload={selected}
          placeId={placeId}
          placeName={placeName}
          onAddToCart={onAddToCart}
        />
      ) : null}
    </MenuItemPopoverContext.Provider>
  );
}

export function MenuItemPopoverProvider({
  children,
  placeId,
  placeName,
  onAddToCart,
}: {
  children: ReactNode;
  placeId: string;
  placeName: string;
  onAddToCart?: (item: MenuItem) => void;
}) {
  return (
    <FloatingPanelRoot>
      <MenuItemPopoverInner placeId={placeId} placeName={placeName} onAddToCart={onAddToCart}>
        {children}
      </MenuItemPopoverInner>
    </FloatingPanelRoot>
  );
}

