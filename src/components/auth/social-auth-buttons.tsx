"use client";

import { Button } from "@/components/ui/button";

type OAuthProvider = "google" | "apple";

interface SocialAuthButtonsProps {
  disabled?: boolean;
}

export function SocialAuthButtons({ disabled }: SocialAuthButtonsProps) {
  const handleSocial = (provider: OAuthProvider) => {
    // OAuth callback will exchange token via API when endpoints ship
    window.location.href = `/auth/callback/${provider}?pending=true`;
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-hano-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-hano-muted">Or continue with</span>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={disabled}
        onClick={() => handleSocial("google")}
      >
        Continue with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={disabled}
        onClick={() => handleSocial("apple")}
      >
        Continue with Apple
      </Button>
    </div>
  );
}
