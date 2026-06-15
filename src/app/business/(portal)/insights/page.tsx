import { Card, CardTitle } from "@/components/ui/card";

export default function BusinessInsightsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Insights</h1>
      <p className="text-sm text-hano-muted">Analytics and performance trends</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Peak hours", value: "7–9 PM" },
          { label: "Avg. wait time", value: "12 mins" },
          { label: "Repeat customers", value: "34%" },
        ].map((item) => (
          <Card key={item.label}>
            <CardTitle>{item.label}</CardTitle>
            <p className="mt-2 text-xl font-bold">{item.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
