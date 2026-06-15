"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { BRAND } from "@/content/images";
import { useAuthStore } from "@/store/auth";
import type { IconName } from "@/lib/icons";

const navItems: { href: string; label: string; icon: IconName; auth?: boolean; publicHref?: string }[] = [
  { href: "/home", label: "Home", icon: "home", publicHref: "/" },
  { href: "/places", label: "Places", icon: "places" },
  { href: "/activity", label: "My Activity", icon: "activity", auth: true },
  { href: "/moments", label: "Moments", icon: "moments" },
  { href: "/settings", label: "Settings", icon: "settings", auth: true },
  { href: "/profile", label: "Profile", icon: "profile", auth: true },
];

type UserSidebarProps = {
  isAuthenticated: boolean;
};

export function UserSidebar({ isAuthenticated }: UserSidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-hano-border bg-white md:flex lg:w-64">
      <div className="flex h-[var(--shell-header-height)] items-center border-b border-hano-border px-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-hano-primary-50"
        >
          <Image src={BRAND.logo} alt="Hano" width={28} height={28} />
          <span className="text-lg font-bold text-hano-green-500">Hano</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map(({ href, label, icon, auth, publicHref }) => {
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
              className={cn(
                "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-hano-primary-500 text-hano-green-500 shadow-sm"
                  : "text-hano-green-400 hover:bg-hano-primary-50 hover:text-hano-green-500",
              )}
            >
              <Icon name={icon} size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-hano-border p-4">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hano-primary-200 text-sm font-bold text-hano-green-500 transition-colors hover:bg-hano-primary-500"
            >
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href="/profile"
                className="block truncate text-sm font-medium text-hano-green-500 transition-colors hover:text-hano-green-400"
              >
                {user.name ?? "User"}
              </Link>
              <p className="truncate text-xs text-hano-muted">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-lg p-2 text-hano-muted transition-colors hover:bg-hano-primary-50 hover:text-hano-green-500"
              aria-label="Log out"
            >
              <Icon name="logout" size={18} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-hano-muted">Sign in to order and save places</p>
            <div className="flex gap-2">
              <Link
                href="/login"
                className="flex-1 rounded-full border border-hano-border px-3 py-2 text-center text-xs font-medium transition-colors hover:border-hano-green-400 hover:bg-hano-primary-50"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="flex-1 rounded-full bg-hano-primary-500 px-3 py-2 text-center text-xs font-medium text-hano-green-500 transition-colors hover:bg-hano-primary-400"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
