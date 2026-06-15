import { Card, CardTitle } from "@/components/ui/card";

export default function BusinessSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="mt-6 space-y-4">
        <Card>
          <CardTitle>Notifications</CardTitle>
          <p className="mt-2 text-sm text-hano-muted">Manage order and reservation alerts.</p>
        </Card>
        <Card>
          <CardTitle>Team access</CardTitle>
          <p className="mt-2 text-sm text-hano-muted">Invite staff members to your business portal.</p>
        </Card>
      </div>
    </div>
  );
}
