"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/content/images";

export function AppHeader() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-hano-border bg-white px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2 md:hidden">
        <Image src={BRAND.logo} alt="Hano" width={24} height={24} />
        <span className="font-bold text-hano-green-500">Hano</span>
      </Link>

      <div className="relative flex-1">
        <Icon
          name="search"
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-hano-muted"
        />
        <input
          type="search"
          placeholder="Search places, dishes..."
          className="h-10 w-full max-w-xl rounded-full border border-hano-border bg-hano-surface pl-9 pr-4 text-sm outline-none focus:border-hano-green-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/cart"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-hano-border hover:bg-hano-surface"
        >
          <Icon name="cart" size={18} />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-hano-primary-500 text-xs font-bold text-hano-green-500">
              {itemCount}
            </span>
          )}
        </Link>

        {isAuthenticated ? (
          <>
            <Link href="/business/overview">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                Business
              </Button>
            </Link>
            <Link href="/profile">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-hano-primary-200 text-sm font-bold text-hano-green-500">
                U
              </div>
            </Link>
          </>
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
      </div>
    </header>
  );
}
