import { getSocialBrandLogo } from "@/lib/social-brand-logos";
import { cn } from "@/lib/utils";

type SocialBrandIconProps = {
  brandDomain: string;
  platform: string;
  className?: string;
};

export function SocialBrandIcon({ brandDomain, platform, className }: SocialBrandIconProps) {
  const src = getSocialBrandLogo(brandDomain);

  return (
    <img
      src={src}
      alt={`${platform} logo`}
      width={32}
      height={32}
      className={cn("h-8 w-8 object-contain", className)}
      loading="lazy"
      decoding="async"
    />
  );
}
