"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { OrderTriggerButton } from "@/components/layout/order-popover";
import { BRAND } from "@/content/images";

export function AppHeader() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <header className="flex h-[var(--shell-header-height)] w-full shrink-0 items-center gap-3 border-b border-hano-border bg-white px-4 md:gap-4 md:px-6">
      <Link
        href="/"
        className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-hano-primary-50 md:hidden"
      >
        <Image src={BRAND.logo} alt="Hano" width={24} height={24} />
        <span className="font-bold text-hano-green-500">Hano</span>
      </Link>

      <SearchInput placeholder="Search places, dishes..." wrapperClassName="min-w-0 flex-1" />

      <div className="ml-auto flex shrink-0 items-center gap-2">
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
      </div>
    </header>
  );
}
