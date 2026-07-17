// Fixed daily show slots, 3 hours apart — the band can only play one show per slot,
// regardless of which service category (Event) it's booked under.
export const SHOW_SLOT_START = "09:00";
export const SHOW_SLOT_END = "21:00";
export const SHOW_SLOT_STEP_MINUTES = 180;

export function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function generateShowSlots(): string[] {
  const start = timeToMinutes(SHOW_SLOT_START);
  const end = timeToMinutes(SHOW_SLOT_END);
  const out: string[] = [];
  for (let t = start; t <= end; t += SHOW_SLOT_STEP_MINUTES) out.push(minutesToTime(t));
  return out;
}

export function isValidShowSlot(time: string): boolean {
  return generateShowSlots().includes(time);
}
