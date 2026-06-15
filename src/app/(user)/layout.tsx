import { AuthGuard } from "@/components/auth/auth-guard";
import { UserNav } from "@/components/layout/user-nav";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen pb-20 md:pb-8">
        <UserNav />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
