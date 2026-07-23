// Helper dùng chung cho API lịch show (không đặt trong route.ts vì Next.js
// chỉ cho route file export các handler HTTP).

type ServiceInput = { eventId?: string; note?: string; price?: number | string | null };

export function cleanServices(services: unknown) {
  const arr = Array.isArray(services) ? (services as ServiceInput[]) : [];
  return arr
    .filter((s) => s && s.eventId)
    .map((s, i) => ({
      eventId: s.eventId as string,
      note: s.note ? String(s.note) : null,
      price:
        s.price === "" || s.price === null || s.price === undefined ? null : Math.round(Number(s.price)),
      sortOrder: i,
    }));
}
