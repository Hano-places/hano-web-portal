import { SocialBrandIcon } from "@/components/places/social-brand-icon";
import { TruncateTooltip } from "@/components/ui/truncate-tooltip";
import { cn } from "@/lib/utils";
import { parseSocialProfiles } from "@/lib/social-profiles";

type PlaceSocialLinksProps = {
  links: string[];
  className?: string;
};

export function PlaceSocialLinks({ links, className }: PlaceSocialLinksProps) {
  const socialProfiles = parseSocialProfiles(links);

  if (socialProfiles.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        "rounded-[var(--radius-card)] border border-hano-border bg-white p-5",
        className,
      )}
    >
      <p className="mb-3 text-xs font-semibold tracking-wide text-hano-muted">
        Stalk us here :)
      </p>
      <div className="flex flex-wrap gap-2">
        {socialProfiles.map((profile) => (
          <a
            key={profile.url}
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 max-w-full shrink-0 cursor-pointer items-center gap-2.5 rounded-xl border border-hano-border bg-[#fffdfb] px-3 transition-colors hover:border-(--foundation-primary-primary-200) hover:bg-hano-primary-100"
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-hano-border bg-white p-1">
              <SocialBrandIcon
                brandDomain={profile.brandDomain}
                platform={profile.platform}
              />
            </span>
            <div className="min-w-0 pr-1">
              <p className="truncate text-xs font-medium leading-tight text-hano-green-500">
                {profile.platform}
              </p>
              <TruncateTooltip className="truncate text-xs leading-tight text-hano-muted">
                {profile.username}
              </TruncateTooltip>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
