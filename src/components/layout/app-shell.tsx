"use client";

import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { AppHeader } from "@/components/layout/app-header";
import { NotificationsRail } from "@/components/layout/notifications-rail";
import { OrderPopoverProvider } from "@/components/layout/order-popover";
import { UserSidebar } from "@/components/layout/user-sidebar";

type AppShellProps = {
  children: React.ReactNode;
  showRail?: boolean;
};

function isHomePath(pathname: string) {
  return pathname === "/" || pathname === "/home";
}

export function AppShell({ children, showRail }: AppShellProps) {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const railVisible = showRail ?? isHomePath(pathname);

  return (
    <OrderPopoverProvider>
      <div className="flex h-screen bg-hano-surface">
        <UserSidebar isAuthenticated={isAuthenticated} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader />
          <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto bg-hano-white-200 p-4 md:p-6">{children}</main>
            {railVisible ? <NotificationsRail /> : null}
          </div>
        </div>
      </div>
    </OrderPopoverProvider>
  );
}
