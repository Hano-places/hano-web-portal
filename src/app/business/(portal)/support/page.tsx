import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BusinessSupportPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Support</h1>
      <Card className="mt-6">
        <CardTitle>Need help?</CardTitle>
        <p className="mt-2 text-sm text-hano-muted">
          Contact the Hano team at hello@hano.rw for onboarding, listing updates, or technical support.
        </p>
        <Button className="mt-4" variant="secondary">
          Contact support
        </Button>
      </Card>
    </div>
  );
}
