import { Card, CardTitle } from "@/components/ui/card";

export default function BusinessFinancePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Finance</h1>
      <p className="text-sm text-hano-muted">Revenue, payouts, and financial reports</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardTitle>Monthly Revenue</CardTitle>
          <p className="mt-2 text-2xl font-bold">RWF 2,450,000</p>
        </Card>
        <Card>
          <CardTitle>Pending Payouts</CardTitle>
          <p className="mt-2 text-2xl font-bold">RWF 340,000</p>
        </Card>
      </div>
    </div>
  );
}
