import type { WeeklyHours, DayOfWeek } from "@/lib/place-hours";

const DAY_ORDER: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function formatHourLabel(value: string): string {
  const [hourPart, minutePart = "00"] = value.split(":");
  let hour = Number(hourPart);
  const minute = Number(minutePart);
  const meridiem = hour >= 12 ? "PM" : "AM";
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return minute === 0 ? `${hour} ${meridiem}` : `${hour}:${minutePart} ${meridiem}`;
}

export function businessHoursToWeeklyHours(
  hours: Record<string, { open: string; close: string; closed?: boolean }>,
): WeeklyHours {
  const weekly = {} as WeeklyHours;

  for (const day of DAY_ORDER) {
    const entry = hours[day];
    if (!entry || entry.closed) {
      weekly[day] = "Closed";
      continue;
    }

    weekly[day] = `${formatHourLabel(entry.open)} – ${formatHourLabel(entry.close)}`;
  }

  return weekly;
}
