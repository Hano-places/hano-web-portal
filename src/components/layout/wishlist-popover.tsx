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
import { useWishlistStore, sortWishlist } from "@/store/wishlist";
import type { WishlistDish, WishlistPlace } from "@/store/wishlist";
import { formatRwf, formatRelativeTime } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
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
import panelStyles from "@/components/ui/floating-panel.module.css";
import styles from "./wishlist-popover.module.css";

type WishlistPopoverContextValue = {
  openWishlistPopover: (rect: DOMRect | null) => void;
};

const WishlistPopoverContext = createContext<WishlistPopoverContextValue | null>(null);

export function useWishlistPopover() {
  const context = useContext(WishlistPopoverContext);
  if (!context) {
    throw new Error("useWishlistPopover must be used within WishlistPopoverProvider");
  }
  return context;
}

function WishlistItemRow({
  image,
  title,
  subtitle,
  pinned,
  onTogglePin,
  onRemove,
  href,
}: {
  image: string;
  title: string;
  subtitle: string;
  pinned: boolean;
  onTogglePin: () => void;
  onRemove: () => void;
  href: string;
}) {
  const { closeFloatingPanel } = useFloatingPanel();

  return (
    <div className={styles.itemRow}>
      {image ? (
        <Image src={image} alt="" width={44} height={44} className={styles.itemImage} />
      ) : null}
      <div className={styles.itemMeta}>
        <Link href={href} className={styles.itemTitle} onClick={closeFloatingPanel}>
          {title}
        </Link>
        <p className={styles.itemSub}>{subtitle}</p>
        {pinned ? <span className={styles.pinnedBadge}>Pinned</span> : null}
      </div>
      <div className={styles.itemActions}>
        <button
          type="button"
          className={`${styles.iconButton} ${pinned ? styles.iconButtonPinned : ""}`}
          onClick={onTogglePin}
          aria-label={pinned ? "Unpin" : "Pin to top"}
        >
          <Icon name="trendingUp" size={14} />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onRemove}
          aria-label="Remove from saved"
        >
          <Icon name="close" size={14} />
        </button>
      </div>
    </div>
  );
}

function PlaceRows({
  places,
  onTogglePin,
  onRemove,
}: {
  places: WishlistPlace[];
  onTogglePin: (placeId: string) => void;
  onRemove: (placeId: string) => void;
}) {
  return (
    <>
      {places.map((place) => (
        <WishlistItemRow
          key={place.placeId}
          image={place.placeImage}
          title={place.placeName}
          subtitle={
            place.category
              ? `${place.category}${place.rating ? ` · ${place.rating.toFixed(1)}` : ""}`
              : `Saved ${formatRelativeTime(place.savedAt)}`
          }
          pinned={place.pinned}
          href={`/places/${place.placeId}`}
          onTogglePin={() => onTogglePin(place.placeId)}
          onRemove={() => onRemove(place.placeId)}
        />
      ))}
    </>
  );
}

function DishRows({
  dishes,
  onTogglePin,
  onRemove,
}: {
  dishes: WishlistDish[];
  onTogglePin: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <>
      {dishes.map((dish) => (
        <WishlistItemRow
          key={dish.id}
          image={dish.image}
          title={dish.name}
          subtitle={`${dish.placeName} · ${formatRwf(dish.priceRaw)}`}
          pinned={dish.pinned}
          href={`/places/${dish.placeId}/menu`}
          onTogglePin={() => onTogglePin(dish.id)}
          onRemove={() => onRemove(dish.id)}
        />
      ))}
    </>
  );
}

function WishlistPanel() {
  const titleId = useId();
  const { closeFloatingPanel } = useFloatingPanel();
  const places = useWishlistStore((s) => s.places);
  const dishes = useWishlistStore((s) => s.dishes);
  const togglePinPlace = useWishlistStore((s) => s.togglePinPlace);
  const togglePinDish = useWishlistStore((s) => s.togglePinDish);
  const removePlace = useWishlistStore((s) => s.removePlace);
  const removeDish = useWishlistStore((s) => s.removeDish);

  const savedPlaces = useMemo(() => sortWishlist(places), [places]);
  const savedDishes = useMemo(() => sortWishlist(dishes), [dishes]);
  const totalCount = places.length + dishes.length;

  const pinnedPlaces = savedPlaces.filter((place) => place.pinned);
  const pinnedDishes = savedDishes.filter((dish) => dish.pinned);
  const unpinnedPlaces = savedPlaces.filter((place) => !place.pinned);
  const unpinnedDishes = savedDishes.filter((dish) => !dish.pinned);
  const hasPinned = pinnedPlaces.length > 0 || pinnedDishes.length > 0;

  return (
    <FloatingPanelContent
      titleId={titleId}
      header={<FloatingPanelA11yTitle titleId={titleId}>Saved</FloatingPanelA11yTitle>}
    >
      <div className={panelStyles.panelScroll}>
        <FloatingPanelHeader>Saved</FloatingPanelHeader>
        <FloatingPanelBody className={styles.sectionStack}>
          {totalCount === 0 ? (
            <p className={styles.empty}>
              Save places and dishes you love — tap the heart on any place or menu item.
            </p>
          ) : (
            <>
              {hasPinned ? (
                <section className={styles.sectionBlock}>
                  <p className={styles.sectionTitle}>Pinned</p>
                  <div className={styles.sectionStack}>
                    <PlaceRows
                      places={pinnedPlaces}
                      onTogglePin={togglePinPlace}
                      onRemove={removePlace}
                    />
                    <DishRows
                      dishes={pinnedDishes}
                      onTogglePin={togglePinDish}
                      onRemove={removeDish}
                    />
                  </div>
                </section>
              ) : null}

              {unpinnedPlaces.length > 0 ? (
                <section className={styles.sectionBlock}>
                  <p className={styles.sectionTitle}>Saved places</p>
                  <div className={styles.sectionStack}>
                    <PlaceRows
                      places={unpinnedPlaces}
                      onTogglePin={togglePinPlace}
                      onRemove={removePlace}
                    />
                  </div>
                </section>
              ) : null}

              {unpinnedDishes.length > 0 ? (
                <section className={styles.sectionBlock}>
                  <p className={styles.sectionTitle}>Saved dishes</p>
                  <div className={styles.sectionStack}>
                    <DishRows
                      dishes={unpinnedDishes}
                      onTogglePin={togglePinDish}
                      onRemove={removeDish}
                    />
                  </div>
                </section>
              ) : null}
            </>
          )}
        </FloatingPanelBody>
        <FloatingPanelFooter>
          <Link href="/places" className={styles.footerLink} onClick={closeFloatingPanel}>
            Explore places
          </Link>
          <FloatingPanelCloseButton />
        </FloatingPanelFooter>
      </div>
    </FloatingPanelContent>
  );
}

function WishlistPopoverInner({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { openFloatingPanel, isOpen } = useFloatingPanel();

  const openWishlistPopover = useCallback(
    (rect: DOMRect | null) => {
      setOpen(true);
      openFloatingPanel(rect, "Saved", "centered");
    },
    [openFloatingPanel],
  );

  useEffect(() => {
    if (!isOpen) {
      const timer = window.setTimeout(() => setOpen(false), 320);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  const value = useMemo(() => ({ openWishlistPopover }), [openWishlistPopover]);

  return (
    <WishlistPopoverContext.Provider value={value}>
      {children}
      {open ? <WishlistPanel /> : null}
    </WishlistPopoverContext.Provider>
  );
}

export function WishlistPopoverProvider({ children }: { children: ReactNode }) {
  return (
    <FloatingPanelRoot>
      <WishlistPopoverInner>{children}</WishlistPopoverInner>
    </FloatingPanelRoot>
  );
}

export function WishlistTriggerButton() {
  const { openWishlistPopover } = useWishlistPopover();
  const placeCount = useWishlistStore((s) => s.places.length);
  const dishCount = useWishlistStore((s) => s.dishes.length);
  const totalCount = placeCount + dishCount;
  const hydrated = useHydrated();

  return (
    <button
      type="button"
      className="relative inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-hano-border px-3 text-sm font-medium text-hano-green-500 transition-colors hover:border-hano-primary-500 hover:bg-hano-primary-50"
      aria-label="Saved places and dishes"
      onClick={(event) => openWishlistPopover(event.currentTarget.getBoundingClientRect())}
    >
      <Icon name="heart" size={18} />
      <span className="hidden sm:inline">Saved</span>
      {hydrated && totalCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f0b8c8] px-1 text-xs font-bold text-[#9a2d4d]">
          {totalCount}
        </span>
      ) : null}
    </button>
  );
}

function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
