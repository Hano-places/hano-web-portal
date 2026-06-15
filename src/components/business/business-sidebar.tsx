"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useBusinessStore } from "@/store/business";
import type { IconName } from "@/lib/icons";

const navItems: { href: string; label: string; icon: IconName; badge?: number }[] = [
  { href: "/business/overview", label: "Overview", icon: "dashboard" },
  { href: "/business/operations", label: "Operations", icon: "clipboard", badge: 12 },
  { href: "/business/finance", label: "Finance", icon: "finance" },
  { href: "/business/insights", label: "Insights", icon: "insights" },
  { href: "/business/marketing", label: "Marketing", icon: "marketing" },
];

const configItems: { href: string; label: string; icon: IconName }[] = [
  { href: "/business/profile", label: "Business Profile", icon: "building" },
  { href: "/business/settings", label: "Settings", icon: "settings" },
  { href: "/business/support", label: "Support", icon: "headphones" },
];

export function BusinessSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const profile = useBusinessStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className="flex h-full w-64 flex-col border-r border-hano-border bg-white">
      <div className="flex items-center justify-between border-b border-hano-border p-4">
        <Link href="/business/overview" className="text-xl font-bold text-hano-green-500">
          Hano
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <p className="mb-2 px-3 text-xs font-semibold uppercase text-hano-muted">
          Management
        </p>
        <nav className="space-y-1">
          {navItems.map(({ href, label, icon, badge }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-hano-primary-500 text-hano-green-500"
                    : "text-hano-green-400 hover:bg-hano-surface",
                )}
              >
                <Icon name={icon} size={16} />
                {label}
                {badge && (
                  <span className="ml-auto rounded-full bg-hano-primary-500 px-2 py-0.5 text-xs font-bold">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase text-hano-muted">
          Configurations
        </p>
        <nav className="space-y-1">
          {configItems.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-hano-primary-500 text-hano-green-500"
                    : "text-hano-green-400 hover:bg-hano-surface",
                )}
              >
                <Icon name={icon} size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-hano-border p-4">
        <Link
          href="/home"
          className="mb-3 flex items-center gap-2 text-sm text-hano-muted hover:text-hano-green-500"
        >
          <Icon name="chevronLeft" size={16} />
          User Portal
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-hano-primary-200 text-sm font-bold">
            {user?.name?.[0] ?? "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{user?.name ?? "User"}</p>
            <p className="truncate text-xs text-hano-muted">
              {profile?.name ?? user?.email}
            </p>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="rounded-lg p-1.5 hover:bg-hano-surface"
            aria-label="Log out"
          >
            <Icon name="logout" size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export function BusinessHeader() {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-hano-border bg-white px-6">
      <div className="relative flex-1">
        <Icon
          name="search"
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-hano-muted"
        />
        <input
          type="search"
          placeholder="Search here..."
          className="h-10 w-full max-w-xl rounded-full border border-hano-border bg-hano-surface pl-9 pr-4 text-sm outline-none focus:border-hano-green-500"
        />
      </div>
      <button type="button" className="relative rounded-full border border-hano-border px-4 py-2 text-sm">
        Orders & Reservations
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-hano-primary-500 text-xs font-bold">
          12
        </span>
      </button>
      <button type="button" className="relative rounded-full border border-hano-border px-4 py-2 text-sm">
        Notifications
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-hano-primary-500 text-xs font-bold">
          12
        </span>
      </button>
    </header>
  );
}
