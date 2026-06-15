export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type WeeklyHours = Record<DayOfWeek, string>;

const DAY_ORDER: DayOfWeek[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

function getKigaliDay(): DayOfWeek {
  const dayIndex = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Kigali",
    weekday: "long",
  })
    .format(new Date())
    .toLowerCase() as DayOfWeek;

  return dayIndex;
}

function getKigaliMinutesNow(): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Kigali",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);

  return hour * 60 + minute;
}

function parseTimeToken(token: string): number | null {
  const cleaned = token.trim().replace(/\u2013|\u2014/g, "-");
  const match = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);

  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2] ?? 0);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem) {
    if (meridiem === "AM" && hour === 12) hour = 0;
    if (meridiem === "PM" && hour !== 12) hour += 12;
  } else if (hour <= 11 && cleaned.includes("PM")) {
    hour += 12;
  }

  return hour * 60 + minute;
}

function parseRange(range: string): { open: number; close: number } | null {
  const [openRaw, closeRaw] = range.split(/\s*[-–—]\s*/);
  if (!openRaw || !closeRaw) {
    return null;
  }

  const openMeridiem = closeRaw.match(/(AM|PM)/i)?.[1];
  let openToken = openRaw.trim();
  let closeToken = closeRaw.trim();

  if (!/(AM|PM)/i.test(openToken) && openMeridiem) {
    openToken = `${openToken} ${openMeridiem}`;
  }

  const open = parseTimeToken(openToken);
  const close = parseTimeToken(closeToken);

  if (open === null || close === null) {
    return null;
  }

  let closeMinutes = close;
  if (closeMinutes <= open) {
    closeMinutes += 24 * 60;
  }

  return { open, close: closeMinutes };
}

function isWithinRange(now: number, range: string): boolean {
  const parsed = parseRange(range);
  if (!parsed) {
    return false;
  }

  let adjustedNow = now;
  if (parsed.close > 24 * 60 && now < parsed.open) {
    adjustedNow += 24 * 60;
  }

  return adjustedNow >= parsed.open && adjustedNow < parsed.close;
}

export function getTodayHoursLabel(hours: WeeklyHours): string {
  const today = getKigaliDay();
  return hours[today];
}

export function isPlaceOpenNow(hours: WeeklyHours): boolean {
  const todayLabel = getTodayHoursLabel(hours);

  if (!todayLabel || todayLabel.toLowerCase() === "closed") {
    return false;
  }

  const now = getKigaliMinutesNow();

  return todayLabel
    .split(",")
    .map((segment) => segment.trim())
    .some((segment) => isWithinRange(now, segment));
}

export function getOpenStatus(hours: WeeklyHours): {
  isOpen: boolean;
  todayHours: string;
} {
  const todayHours = getTodayHoursLabel(hours);

  return {
    isOpen: isPlaceOpenNow(hours),
    todayHours,
  };
}

export function formatWeeklyHours(hours: WeeklyHours): { day: string; hours: string }[] {
  return DAY_ORDER.slice(1).concat(DAY_ORDER[0]).map((day) => ({
    day: DAY_LABELS[day],
    hours: hours[day],
  }));
}
