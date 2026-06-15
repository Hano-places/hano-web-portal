"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Camera, User, Wallet, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";

const navItems = [
  { href: "/home", label: "Home", icon: Home, auth: false },
  { href: "/wallet", label: "Wallet", icon: Wallet, auth: true },
  { href: "/location", label: "Location", icon: MapPin, auth: false },
  { href: "/moments", label: "Moments", icon: Camera, auth: false },
  { href: "/profile", label: "Profile", icon: User, auth: true },
];

export function UserNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-hano-border bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-hano-green-500">
            Hano
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative rounded-lg p-2 hover:bg-hano-surface">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-hano-primary-500 text-xs font-bold text-hano-green-500">
                  {itemCount}
                </span>
              )}
            </Link>
            {!isAuthenticated && (
              <Link href="/login" className="text-sm font-medium text-hano-green-500">
                Log in
              </Link>
            )}
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-hano-border bg-white md:hidden">
        <div className="flex justify-around py-2">
          {navItems.map(({ href, label, icon: Icon, auth }) => {
            if (auth && !isAuthenticated) {
              return (
                <Link
                  key={href}
                  href={`/login?returnTo=${encodeURIComponent(href)}`}
                  className="flex flex-col items-center gap-1 px-3 py-1 text-hano-muted"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{label}</span>
                </Link>
              );
            }
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1",
                  active ? "text-hano-green-500" : "text-hano-muted",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export function PublicHeader() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <header className="sticky top-0 z-40 border-b border-hano-border bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-hano-green-500">
          Hano
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/explore" className="text-sm hover:text-hano-green-500">
            Explore
          </Link>
          <Link href="/moments" className="text-sm hover:text-hano-green-500">
            Moments
          </Link>
          <Link href="/cart" className="relative rounded-lg p-2 hover:bg-hano-surface">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-hano-primary-500 text-xs font-bold">
                {itemCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <Link href="/home" className="text-sm font-medium text-hano-green-500">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-hano-primary-500 px-4 py-2 text-sm font-medium text-hano-green-500"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
