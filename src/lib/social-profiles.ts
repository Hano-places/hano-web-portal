export type SocialProfile = {
  url: string;
  platform: string;
  username: string;
  brandDomain: string;
};

const PLATFORM_BRAND_DOMAINS: Record<string, string> = {
  instagram: "instagram.com",
  facebook: "facebook.com",
  twitter: "x.com",
  tiktok: "tiktok.com",
  youtube: "youtube.com",
  linkedin: "linkedin.com",
  whatsapp: "whatsapp.com",
};

function resolveBrandDomain(host: string): string {
  for (const [needle, domain] of Object.entries(PLATFORM_BRAND_DOMAINS)) {
    if (host.includes(needle)) {
      return domain;
    }
  }

  if (host.includes("x.com")) {
    return "x.com";
  }

  return host;
}

export function parseSocialProfiles(links: string[]): SocialProfile[] {
  return links.map((url) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
      const slug = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
      const username = slug ? `@${slug}` : host;
      const brandDomain = resolveBrandDomain(host);

      if (host.includes("instagram")) {
        return { url, platform: "Instagram", username, brandDomain };
      }
      if (host.includes("facebook")) {
        return { url, platform: "Facebook", username, brandDomain };
      }
      if (host.includes("x.com") || host.includes("twitter")) {
        return { url, platform: "X", username, brandDomain: "x.com" };
      }
      if (host.includes("tiktok")) {
        return { url, platform: "TikTok", username, brandDomain };
      }
      if (host.includes("youtube")) {
        return { url, platform: "YouTube", username, brandDomain };
      }
      if (host.includes("linkedin")) {
        return { url, platform: "LinkedIn", username, brandDomain };
      }

      return { url, platform: "Website", username: host, brandDomain };
    } catch {
      return {
        url,
        platform: "Website",
        username: "website",
        brandDomain: "website",
      };
    }
  });
}
