import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cleanServices } from "@/lib/schedule-helpers";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { services, ...data } = await req.json();

  // Nếu có gửi services -> thay toàn bộ danh sách dịch vụ của slot.
  if (services !== undefined) {
    const svc = cleanServices(services);
    await prisma.showScheduleService.deleteMany({ where: { scheduleId: params.id } });
    await prisma.showScheduleService.createMany({
      data: svc.map((s) => ({ ...s, scheduleId: params.id })),
    });
    // đồng bộ "dịch vụ chính"
    if (data.eventId === undefined) data.eventId = svc[0]?.eventId ?? null;
  }

  const slot = await prisma.showSchedule.update({ where: { id: params.id }, data });
  return NextResponse.json(slot);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.showSchedule.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
