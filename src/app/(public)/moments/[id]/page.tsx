"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function MomentDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="mx-auto max-w-lg">
      <Link href="/moments" className="text-sm text-hano-muted hover:underline">
        ← Back to moments
      </Link>
      <div className="mt-4 rounded-2xl border border-hano-border p-6 text-center">
        <p className="text-hano-muted">Moment {id}</p>
        <p className="mt-2 text-sm">Photo details loaded from API when available.</p>
      </div>
    </div>
  );
}
