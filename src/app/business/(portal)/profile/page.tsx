"use client";

import { useBusinessStore } from "@/store/business";
import { Card, CardTitle } from "@/components/ui/card";

export default function BusinessProfilePage() {
  const profile = useBusinessStore((s) => s.profile);

  if (!profile) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold">Business Profile</h1>
      <Card className="mt-6 space-y-3">
        <CardTitle>{profile.name}</CardTitle>
        <p className="text-sm"><strong>Category:</strong> {profile.category}</p>
        <p className="text-sm"><strong>Address:</strong> {profile.address}</p>
        <p className="text-sm"><strong>Phone:</strong> {profile.phone}</p>
        <p className="text-sm"><strong>Website:</strong> {profile.website || "—"}</p>
        <p className="text-sm text-hano-muted">{profile.description}</p>
      </Card>
    </div>
  );
}
