"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { BRAND } from "@/content/images";

export function AppHeader() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <header className="flex h-[var(--shell-header-height)] shrink-0 items-center gap-4 border-b border-hano-border bg-white px-4 md:px-6">
      <Link
        href="/"
        className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-hano-primary-50 md:hidden"
      >
        <Image src={BRAND.logo} alt="Hano" width={24} height={24} />
        <span className="font-bold text-hano-green-500">Hano</span>
      </Link>

      <SearchInput
        placeholder="Search places, dishes..."
        wrapperClassName="flex-1 max-w-xl"
      />

      <div className="flex items-center gap-2">
        <Link
          href="/cart"
          className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-hano-border text-hano-green-500 transition-colors hover:border-hano-primary-500 hover:bg-hano-primary-50"
          aria-label="Cart"
        >
          <Icon name="cart" size={18} />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-hano-primary-500 text-xs font-bold text-hano-green-500">
              {itemCount}
            </span>
          )}
        </Link>

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
      </div>
    </header>
  );
}
