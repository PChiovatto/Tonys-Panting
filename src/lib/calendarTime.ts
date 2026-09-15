const TIME_ZONE = "America/New_York";
export function newYorkDay(iso: string | Date): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((part) => part.type === type)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
export function calendarDay(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
// Reject the spring DST gap; use the first occurrence during the fall overlap.
export function newYorkTimeToISO(day: string, time: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error("Choose a valid date and time.");
  const base = Date.parse(`${day}T${time}:00Z`);
  const formatter = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  for (const offset of [4, 5]) {
    const candidate = new Date(base + offset * 3600000);
    if (newYorkDay(candidate) === day && formatter.format(candidate) === time) return candidate.toISOString();
  }
  throw new Error("This time does not exist in New York due to daylight saving time. Choose another time.");
}
