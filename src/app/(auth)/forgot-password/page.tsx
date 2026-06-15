"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="rounded-2xl border border-hano-border bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold">Forgot password</h1>
      <p className="mt-1 text-sm text-hano-muted">
        Enter your email and we&apos;ll send a reset link when OTP is available via API.
      </p>
      {sent ? (
        <p className="mt-6 text-sm text-hano-success">
          If an account exists, reset instructions will be sent to {email}.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
      )}
      <Link href="/login" className="mt-4 block text-center text-sm underline">
        Back to login
      </Link>
    </div>
  );
}
