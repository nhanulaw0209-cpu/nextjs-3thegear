// Daily show slots — admin-configurable via SiteSettings (showSlotStart/showSlotEnd/
// showSlotStepMinutes), not hardcoded. The band can only play one show per slot,
// regardless of which service category (Event) it's booked under.

export function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function generateShowSlots(start: string, end: string, stepMinutes: number): string[] {
  const startMins = timeToMinutes(start);
  const endMins = timeToMinutes(end);
  const out: string[] = [];
  for (let t = startMins; t <= endMins; t += stepMinutes) out.push(minutesToTime(t));
  return out;
}

export function isValidShowSlot(time: string, start: string, end: string, stepMinutes: number): boolean {
  return generateShowSlots(start, end, stepMinutes).includes(time);
}
