"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

function OAuthCallbackContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const provider = params.provider as string;
  const pending = searchParams.get("pending");

  return (
    <div className="rounded-2xl border border-hano-border bg-white p-8 text-center shadow-sm">
      <h1 className="text-xl font-bold capitalize">{provider} sign-in</h1>
      {pending ? (
        <>
          <p className="mt-4 text-sm text-hano-muted">
            Social authentication via {provider} will connect to the Hano API when OAuth endpoints
            are available.
          </p>
          <Link href="/login" className="mt-6 inline-block">
            <Button>Back to login</Button>
          </Link>
        </>
      ) : (
        <p className="mt-4 text-sm">Processing authentication...</p>
      )}
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense>
      <OAuthCallbackContent />
    </Suspense>
  );
}
