"use client";

import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { reviewsApi } from "@/lib/api/reviews";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

function ReviewForm() {
  const params = useParams();
  const router = useRouter();
  const placeId = params.id as string;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reviewsApi.createReview({ placeId, rating, comment: comment || undefined });
      router.push(`/places/${placeId}`);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Rate this place</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button key={i} type="button" onClick={() => setRating(i + 1)}>
              <Star
                className={`h-8 w-8 ${i < rating ? "fill-hano-primary-500 text-hano-primary-500" : "text-hano-border"}`}
              />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={275}
          placeholder="Share your experience (optional)"
          className="h-32 w-full rounded-xl border border-hano-border p-3 text-sm outline-none focus:border-hano-green-500"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit review"}
        </Button>
      </form>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen p-4">
        <ReviewForm />
      </div>
    </AuthGuard>
  );
}
