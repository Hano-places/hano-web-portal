"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { BRAND } from "@/content/images";
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

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-hano-border bg-white md:flex lg:w-64">
      <div className="border-b border-hano-border p-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src={BRAND.logo} alt="Hano" width={28} height={28} />
          <span className="text-lg font-bold text-hano-green-500">Hano</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
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
            (href === "/home" &&
              (pathname === "/" || pathname === "/home"));

          return (
            <Link
              key={href}
              href={targetHref}
              className={cn(
                "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-hano-primary-500 text-hano-green-500"
                  : "text-hano-green-400 hover:bg-hano-surface",
              )}
            >
              <Icon name={icon} size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
