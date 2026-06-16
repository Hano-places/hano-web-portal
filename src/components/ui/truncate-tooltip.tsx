"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type TruncateTooltipProps = {
  children: ReactNode;
  className?: string;
  tooltipClassName?: string;
  lines?: 1 | 2 | 3;
};

export function TruncateTooltip({
  children,
  className,
  tooltipClassName,
  lines = 1,
}: TruncateTooltipProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const updateOverflow = () => {
      const horizontalOverflow = element.scrollWidth > element.clientWidth + 1;
      const verticalOverflow = element.scrollHeight > element.clientHeight + 1;
      setIsOverflowing(horizontalOverflow || verticalOverflow);
    };

    updateOverflow();
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(element);
    return () => observer.disconnect();
  }, [children, lines]);

  return (
    <span className="group/tt relative block min-w-0">
      <span
        ref={textRef}
        className={cn(
          lines === 1
            ? "block overflow-hidden text-ellipsis whitespace-nowrap"
            : "line-clamp-2 overflow-hidden",
          className,
        )}
      >
        {children}
      </span>
      {isOverflowing ? (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-0 top-full z-40 mt-1 hidden max-w-104 rounded-lg bg-hano-green-500 px-2 py-1 text-xs text-hano-white-500 shadow-lg group-hover/tt:block group-focus-within/tt:block",
            tooltipClassName,
          )}
        >
          {children}
        </span>
      ) : null}
    </span>
  );
}

