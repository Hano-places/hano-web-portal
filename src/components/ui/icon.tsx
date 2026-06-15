import { HugeiconsIcon } from "@hugeicons/react";
import { iconMap, type IconName } from "@/lib/icons";

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
};

export function Icon({
  name,
  size = 20,
  className,
  strokeWidth = 1.5,
}: IconProps) {
  const icon = iconMap[name];
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color="currentColor"
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}
