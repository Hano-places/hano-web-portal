import { BusinessGuard } from "@/components/auth/auth-guard";
import { BusinessHeader, BusinessSidebar } from "@/components/business/business-sidebar";

export default function BusinessPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <BusinessGuard>
      <div className="flex h-screen bg-hano-surface">
        <BusinessSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <BusinessHeader />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </BusinessGuard>
  );
}
