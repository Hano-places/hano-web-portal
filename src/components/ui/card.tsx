import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function Card({ className, interactive, onClick, ...props }: CardProps) {
  const isInteractive = interactive || typeof onClick === "function";

  return (
    <div
      className={cn(
        "rounded-2xl border border-hano-border bg-white p-5",
        isInteractive
          ? "cursor-pointer transition-colors hover:border-hano-primary-300"
          : "cursor-default",
        className,
      )}
      onClick={onClick}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold text-hano-green-500", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-hano-muted", className)} {...props} />;
}
