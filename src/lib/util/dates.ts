export const MINUTE = 60_000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

/** Local-calendar day key, e.g. "2026-10-06". */
export function dateKey(ms: number): string {
  const d = new Date(ms);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Parse a day key back to local noon (DST-safe for ±1 day arithmetic). */
export function parseDateKey(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d, 12).getTime();
}

export function addDaysToKey(key: string, days: number): string {
  return dateKey(parseDateKey(key) + days * DAY);
}

/** Whole calendar days from `a` to `b` (b − a). */
export function daysBetweenKeys(a: string, b: string): number {
  return Math.round((parseDateKey(b) - parseDateKey(a)) / DAY);
}

/** The last `n` day keys ending at `endKey`, oldest first. */
export function lastNDayKeys(endKey: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => addDaysToKey(endKey, i - (n - 1)));
}

/** Monday-based week containing `key`, Monday first. */
export function weekKeys(key: string): string[] {
  const dow = (new Date(parseDateKey(key)).getDay() + 6) % 7; // Mon = 0
  const monday = addDaysToKey(key, -dow);
  return Array.from({ length: 7 }, (_, i) => addDaysToKey(monday, i));
}

export function formatRelative(ms: number | null, now: number): string {
  if (ms === null) return "Never";
  const diff = now - ms;
  if (diff < MINUTE) return "Just now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} min ago`;
  const today = dateKey(now);
  const that = dateKey(ms);
  if (that === today) return "Today";
  const days = daysBetweenKeys(that, today);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} wk ago`;
  return `${Math.floor(days / 30)} mo ago`;
}

export function formatDue(ms: number, now: number): string {
  if (ms <= now) return "Ready now";
  const that = dateKey(ms);
  const today = dateKey(now);
  const days = daysBetweenKeys(today, that);
  if (days <= 0) return "Later today";
  if (days === 1) return "Tomorrow";
  if (days < 14) return `In ${days} days`;
  return `In ${Math.round(days / 7)} weeks`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
