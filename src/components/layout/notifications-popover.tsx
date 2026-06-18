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
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/lib/icons";
import { NOTIFICATIONS, PROMOS, type FeedNotification } from "@/lib/data/feed-data";
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
import styles from "./notifications-popover.module.css";

type NotificationsPopoverContextValue = {
  openNotificationsPopover: (rect: DOMRect | null) => void;
};

const NotificationsPopoverContext = createContext<NotificationsPopoverContextValue | null>(null);

export function useNotificationsPopover() {
  const context = useContext(NotificationsPopoverContext);
  if (!context) {
    throw new Error("useNotificationsPopover must be used within NotificationsPopoverProvider");
  }
  return context;
}

const NOTIFICATION_ICONS: Record<FeedNotification["type"], IconName> = {
  order: "cart",
  review: "star",
  promo: "sparkles",
  system: "message",
};

function NotificationsPanel() {
  const titleId = useId();
  const { closeFloatingPanel } = useFloatingPanel();

  return (
    <FloatingPanelContent
      titleId={titleId}
      header={<FloatingPanelA11yTitle titleId={titleId}>Notifications & updates</FloatingPanelA11yTitle>}
    >
      <div className={styles.panelLayout}>
        <FloatingPanelHeader className={styles.panelHeader}>
          Notifications & updates
        </FloatingPanelHeader>

        <div className={styles.panelBodyScroll}>
          <FloatingPanelBody className={styles.panelBody}>
            <section>
              <p className={styles.sectionTitle}>Notifications</p>
              <ul className={styles.list}>
                {NOTIFICATIONS.map((notification) => (
                  <li key={notification.id} className={styles.notificationItem}>
                    <span className={styles.notificationIcon} aria-hidden>
                      <Icon name={NOTIFICATION_ICONS[notification.type]} size={16} />
                    </span>
                    <div className={styles.notificationMeta}>
                      <p className={styles.notificationTitle}>{notification.title}</p>
                      <p className={styles.notificationBody}>{notification.body}</p>
                      <p className={styles.notificationTime}>{notification.timeAgo}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.updatesSection}>
              <p className={styles.sectionTitle}>Updates</p>
              <ul className={styles.list}>
                {PROMOS.slice(0, 4).map((promo) => (
                  <li key={promo.id}>
                    <Link
                      href="/places"
                      className={styles.promoItem}
                      onClick={closeFloatingPanel}
                    >
                      <div className={styles.promoImageWrap}>
                        <Image src={promo.image} alt="" fill className="object-cover" sizes="48px" />
                      </div>
                      <div className={styles.promoMeta}>
                        <p className={styles.promoTitle}>{promo.title}</p>
                        <p className={styles.promoSub}>{promo.location}</p>
                        <p className={styles.promoPoints}>+{promo.points} pts</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </FloatingPanelBody>
        </div>

        <FloatingPanelFooter className={styles.panelFooter}>
          <Link href="/places" className={styles.footerLink} onClick={closeFloatingPanel}>
            View all promos
          </Link>
          <FloatingPanelCloseButton />
        </FloatingPanelFooter>
      </div>
    </FloatingPanelContent>
  );
}

function NotificationsPopoverInner({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { openFloatingPanel, isOpen } = useFloatingPanel();

  const openNotificationsPopover = useCallback(
    (rect: DOMRect | null) => {
      setOpen(true);
      openFloatingPanel(rect, "Notifications & updates", "centered");
    },
    [openFloatingPanel],
  );

  useEffect(() => {
    if (!isOpen) {
      const timer = window.setTimeout(() => setOpen(false), 320);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  const value = useMemo(() => ({ openNotificationsPopover }), [openNotificationsPopover]);

  return (
    <NotificationsPopoverContext.Provider value={value}>
      {children}
      {open ? <NotificationsPanel /> : null}
    </NotificationsPopoverContext.Provider>
  );
}

export function NotificationsPopoverProvider({ children }: { children: ReactNode }) {
  return (
    <FloatingPanelRoot>
      <NotificationsPopoverInner>{children}</NotificationsPopoverInner>
    </FloatingPanelRoot>
  );
}

export function NotificationsTriggerButton() {
  const { openNotificationsPopover } = useNotificationsPopover();
  const unreadCount = NOTIFICATIONS.length;

  return (
    <button
      type="button"
      className="relative inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-hano-border px-3 text-sm font-medium text-hano-green-500 transition-colors hover:border-hano-primary-500 hover:bg-hano-primary-50"
      aria-label="Notifications and updates"
      onClick={(event) =>
        openNotificationsPopover(event.currentTarget.getBoundingClientRect())
      }
    >
      <Icon name="notification" size={18} />
      <span className="hidden sm:inline">Updates</span>
      {unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-hano-primary-500 px-1 text-xs font-bold text-hano-green-500">
          {unreadCount}
        </span>
      ) : null}
    </button>
  );
}
