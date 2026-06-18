import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  formatWeeklyHours,
  getOpenStatus,
  type WeeklyHours,
} from "@/lib/place-hours";

type PlaceWeeklyHoursProps = {
  hours: WeeklyHours;
  className?: string;
};

export function PlaceWeeklyHours({ hours, className }: PlaceWeeklyHoursProps) {
  const { isOpen } = getOpenStatus(hours);
  const weeklyHours = formatWeeklyHours(hours);

  return (
    <Card className={cn("p-0", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-hano-border px-5 py-4">
        <p className="text-sm font-medium text-hano-green-500">Weekly schedule</p>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
            isOpen
              ? "bg-hano-primary-100 text-hano-green-500"
              : "bg-hano-surface text-hano-muted",
          )}
        >
          <span
            className={cn(
              "h-2 w-2 shrink-0 rounded-full",
              isOpen ? "bg-hano-primary-500" : "bg-hano-muted",
            )}
          />
          {isOpen ? "Open now" : "Closed today"}
        </span>
      </div>

      <ul className="divide-y divide-hano-border/70 px-3 py-2">
        {weeklyHours.map(({ day, segments, isToday, isClosed }) => (
          <li
            key={day}
            className={cn(
              "flex items-start justify-between gap-4 rounded-xl px-2 py-3 text-sm",
              isToday && "bg-hano-primary-50 px-3 ring-1 ring-inset ring-hano-primary-200",
            )}
          >
            <div className="flex min-w-[4.5rem] items-center gap-2">
              <span
                className={cn(
                  "w-8 font-semibold tracking-wide",
                  isToday ? "text-hano-green-500" : "text-hano-muted",
                )}
              >
                {day}
              </span>
              {isToday ? (
                <span className="rounded-full bg-hano-primary-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-hano-green-500">
                  Today
                </span>
              ) : null}
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-end gap-0.5 text-right">
              {isClosed ? (
                <span className="text-hano-muted">Closed</span>
              ) : (
                segments.map((segment) => (
                  <span
                    key={`${day}-${segment}`}
                    className={cn(
                      "tabular-nums leading-snug",
                      isToday
                        ? "font-medium text-hano-green-500"
                        : "text-hano-green-300",
                    )}
                  >
                    {segment}
                  </span>
                ))
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
