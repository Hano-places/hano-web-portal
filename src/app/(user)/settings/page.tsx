"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-hano-muted">Manage your account and preferences</p>
      </div>

      <Card>
        <h2 className="font-semibold">Account</h2>
        <p className="mt-1 text-sm text-hano-muted">{user?.email}</p>
        <div className="mt-4 flex gap-2">
          <Link href="/profile">
            <Button variant="outline" size="sm">
              Edit profile
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => logout()}>
            Log out
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold">Notifications</h2>
        <div className="mt-4 space-y-3">
          {["Order updates", "New promos", "Moment likes", "Review replies"].map((label) => (
            <label key={label} className="flex items-center justify-between text-sm">
              <span>{label}</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-hano-green-500" />
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold">Preferences</h2>
        <div className="mt-4 space-y-3 text-sm">
          <label className="flex items-center justify-between">
            <span>Email notifications</span>
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-hano-green-500" />
          </label>
          <label className="flex items-center justify-between">
            <span>Push notifications</span>
            <input type="checkbox" className="h-4 w-4 accent-hano-green-500" />
          </label>
        </div>
      </Card>
    </div>
  );
}
