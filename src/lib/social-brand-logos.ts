const SOCIAL_BRAND_LOGOS: Record<string, string> = {
  "instagram.com": "/brand-logos/instagram.svg",
  "facebook.com": "/brand-logos/facebook.svg",
  "x.com": "/brand-logos/x.svg",
  "twitter.com": "/brand-logos/x.svg",
  "youtube.com": "/brand-logos/youtube.svg",
  "tiktok.com": "/brand-logos/tiktok.svg",
  "linkedin.com": "/brand-logos/linkedin.svg",
  "whatsapp.com": "/brand-logos/globe.svg",
  website: "/brand-logos/globe.svg",
};

const DEFAULT_LOGO = "/brand-logos/globe.svg";

export function getSocialBrandLogo(brandDomain: string): string {
  return SOCIAL_BRAND_LOGOS[brandDomain] ?? DEFAULT_LOGO;
}
