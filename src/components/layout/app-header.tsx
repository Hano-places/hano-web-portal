"use client";

import { useRef, useId } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SearchWithSuggestions } from "@/components/search/search-with-suggestions";
import { NotificationsTriggerButton } from "@/components/layout/notifications-popover";
import { OrderTriggerButton } from "@/components/layout/order-popover";
import { WishlistTriggerButton } from "@/components/layout/wishlist-popover";
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
import { BRAND } from "@/content/images";
import { cn } from "@/lib/utils";
import type { IconName } from "@/lib/icons";

const mobileNavItems: {
  href: string;
  label: string;
  icon: IconName;
  auth?: boolean;
  publicHref?: string;
}[] = [
  { href: "/home", label: "Home", icon: "home", publicHref: "/" },
  { href: "/places", label: "Places", icon: "places" },
  { href: "/activity", label: "My Activity", icon: "activity", auth: true },
  { href: "/moments", label: "Moments", icon: "moments" },
  { href: "/settings", label: "Settings", icon: "settings", auth: true },
  { href: "/profile", label: "Profile", icon: "profile", auth: true },
];

function MobileMenuPanel({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const titleId = useId();
  const { openFloatingPanel } = useFloatingPanel();
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        ref={triggerRef}
        variant="outline"
        size="sm"
        className="h-9 w-9 p-0! md:hidden"
        aria-label="Open navigation menu"
        onClick={() =>
          openFloatingPanel(triggerRef.current?.getBoundingClientRect() ?? null, "Menu", "centered")
        }
      >
        <Icon name="grid" size={18} />
      </Button>

      <FloatingPanelContent
        className="md:hidden"
        titleId={titleId}
        header={<FloatingPanelA11yTitle titleId={titleId}>Menu</FloatingPanelA11yTitle>}
      >
        <div className={panelStyles.panelScroll}>
          <FloatingPanelHeader>Navigation</FloatingPanelHeader>
          <FloatingPanelBody className="space-y-1 pb-3">
            <MobileMenuContent pathname={pathname} isAuthenticated={isAuthenticated} />
          </FloatingPanelBody>
        </div>
      </FloatingPanelContent>
    </>
  );
}

function MobileMenuContent({
  pathname,
  isAuthenticated,
}: {
  pathname: string;
  isAuthenticated: boolean;
}) {
  const { closeFloatingPanel } = useFloatingPanel();

  return (
    <div className="space-y-1">
      {mobileNavItems.map(({ href, label, icon, auth, publicHref }) => {
        const targetHref =
          auth && !isAuthenticated
            ? `/login?returnTo=${encodeURIComponent(href)}`
            : !isAuthenticated && publicHref
              ? publicHref
              : href;

        const active =
          pathname === targetHref ||
          (href !== "/home" && pathname.startsWith(`${href}/`)) ||
          (href === "/home" && (pathname === "/" || pathname === "/home"));

        return (
          <Link
            key={href}
            href={targetHref}
            onClick={closeFloatingPanel}
            className={cn(
              "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-hano-primary-500 text-hano-green-500"
                : "text-hano-green-400 hover:bg-hano-primary-50 hover:text-hano-green-500",
            )}
          >
            <Icon name={icon} size={18} />
            {label}
          </Link>
        );
      })}
    </div>
  );
}

function MobileSearchPanel() {
  const titleId = useId();
  const { openFloatingPanel, closeFloatingPanel } = useFloatingPanel();
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        ref={triggerRef}
        variant="outline"
        size="sm"
        className="h-9 w-9 p-0! md:hidden"
        aria-label="Open search"
        onClick={() =>
          openFloatingPanel(
            triggerRef.current?.getBoundingClientRect() ?? null,
            "Search",
            "centered",
          )
        }
      >
        <Icon name="search" size={18} />
      </Button>

      <FloatingPanelContent
        className="md:hidden"
        titleId={titleId}
        header={<FloatingPanelA11yTitle titleId={titleId}>Search</FloatingPanelA11yTitle>}
      >
        <div className={panelStyles.panelScroll}>
          <FloatingPanelHeader>Search places and dishes</FloatingPanelHeader>
          <FloatingPanelBody className="pb-3">
            <SearchWithSuggestions
              autoFocus
              variant="inline"
              placeholder="Search places, dishes..."
              onNavigate={closeFloatingPanel}
            />
          </FloatingPanelBody>
        </div>
        <div className="flex justify-end px-4 pb-3">
          <FloatingPanelCloseButton />
        </div>
      </FloatingPanelContent>
    </>
  );
}

export function AppHeader() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <header className="flex h-(--shell-header-height) w-full shrink-0 items-center gap-3 border-b border-hano-border bg-white px-4 md:gap-4 md:px-6">
      <Link
        href="/"
        className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-hano-primary-50 md:hidden"
      >
        <Image src={BRAND.logo} alt="Hano" width={24} height={24} />
        <span className="font-bold text-hano-green-500">Hano</span>
      </Link>

      <SearchWithSuggestions
        placeholder="Search places, dishes..."
        wrapperClassName="hidden min-w-0 flex-1 md:block"
      />

      <FloatingPanelRoot className="md:hidden">
        <MobileSearchPanel />
      </FloatingPanelRoot>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <NotificationsTriggerButton />
        <WishlistTriggerButton />
        <OrderTriggerButton itemCount={itemCount} />

        {isAuthenticated ? (
          <Link href="/business/overview" className="hidden cursor-pointer sm:block">
            <Button variant="secondary" size="sm">
              Business
            </Button>
          </Link>
        ) : (
          <>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Sign up</Button>
            </Link>
          </>
        )}

        <FloatingPanelRoot className="md:hidden">
          <MobileMenuPanel isAuthenticated={isAuthenticated} />
        </FloatingPanelRoot>
      </div>
    </header>
  );
}
