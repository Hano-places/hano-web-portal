import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function OrderSuccessPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <div className="text-5xl">✓</div>
        <h1 className="mt-4 text-2xl font-bold">Order placed!</h1>
        <p className="mt-2 text-hano-muted">Your order has been submitted successfully.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/orders">
            <Button variant="outline">View orders</Button>
          </Link>
          <Link href="/home">
            <Button>Go home</Button>
          </Link>
        </div>
      </div>
    </AuthGuard>
  );
}
