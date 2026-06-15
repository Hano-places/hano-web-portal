import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BusinessMarketingPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Marketing</h1>
      <p className="text-sm text-hano-muted">Promotions and customer engagement</p>
      <Card className="mt-6">
        <CardTitle>Active Promotions</CardTitle>
        <p className="mt-2 text-sm text-hano-muted">No active promotions yet.</p>
        <Button className="mt-4" variant="secondary">
          Create promotion
        </Button>
      </Card>
    </div>
  );
}
