import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseCsv } from "@/lib/csv";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const VALID_STATUSES = ["available", "pending", "booked", "cancelled"];

interface ParsedRow {
  line: number;
  date: string;
  startTime: string | null;
  status: string;
  eventSlug: string | null;
  eventId: string | null;
  eventTitle: string | null;
  location: string | null;
  notes: string | null;
  error: string | null;
}

async function parseRows(csv: string): Promise<ParsedRow[]> {
  const rows = parseCsv(csv.trim());
  if (rows.length === 0) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const col = (name: string) => header.indexOf(name);
  const dateCol = col("date");
  const timeCol = col("time");
  const slugCol = col("event_slug");
  const statusCol = col("status");
  const locationCol = col("location");
  const notesCol = col("notes");

  if (dateCol === -1) {
    throw new Error("CSV phải có cột 'date' (định dạng YYYY-MM-DD)");
  }

  const events = await prisma.event.findMany({ select: { id: true, slug: true, title: true } });
  const eventBySlug = new Map(events.map((e) => [e.slug, e]));

  const dataRows = rows.slice(1);
  const parsed: ParsedRow[] = [];

  for (let i = 0; i < dataRows.length; i++) {
    const r = dataRows[i];
    const line = i + 2; // +1 for header, +1 for 1-indexing
    const date = (r[dateCol] ?? "").trim();
    const time = timeCol !== -1 ? (r[timeCol] ?? "").trim() : "";
    const slug = slugCol !== -1 ? (r[slugCol] ?? "").trim() : "";
    const status = statusCol !== -1 ? (r[statusCol] ?? "").trim().toLowerCase() || "available" : "available";
    const location = locationCol !== -1 ? (r[locationCol] ?? "").trim() : "";
    const notes = notesCol !== -1 ? (r[notesCol] ?? "").trim() : "";

    let error: string | null = null;
    let eventId: string | null = null;
    let eventTitle: string | null = null;

    if (!DATE_RE.test(date)) {
      error = `Ngày không hợp lệ: "${date}" (cần định dạng YYYY-MM-DD)`;
    } else if (time && !TIME_RE.test(time)) {
      error = `Giờ không hợp lệ: "${time}" (cần định dạng HH:MM)`;
    } else if (!VALID_STATUSES.includes(status)) {
      error = `Trạng thái không hợp lệ: "${status}" (chỉ chấp nhận: ${VALID_STATUSES.join(", ")})`;
    } else if (slug) {
      const ev = eventBySlug.get(slug);
      if (!ev) {
        error = `Không tìm thấy sự kiện với slug "${slug}"`;
      } else {
        eventId = ev.id;
        eventTitle = ev.title;
      }
    }

    parsed.push({
      line,
      date,
      startTime: time || null,
      status,
      eventSlug: slug || null,
      eventId,
      eventTitle,
      location: location || null,
      notes: notes || null,
      error,
    });
  }

  return parsed;
}

export async function POST(req: Request) {
  const { csv, commit } = await req.json();

  if (!csv || typeof csv !== "string") {
    return NextResponse.json({ error: "csv is required" }, { status: 400 });
  }

  let rows: ParsedRow[];
  try {
    rows = await parseRows(csv);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Không thể đọc CSV" }, { status: 400 });
  }

  const validRows = rows.filter((r) => !r.error);
  const errorRows = rows.filter((r) => r.error);

  if (!commit) {
    return NextResponse.json({ rows, validCount: validRows.length, errorCount: errorRows.length });
  }

  const created = await prisma.$transaction(
    validRows.map((r) =>
      prisma.showSchedule.create({
        data: {
          date: r.date,
          startTime: r.startTime,
          status: r.status,
          eventId: r.eventId,
          location: r.location,
          notes: r.notes,
        },
      })
    )
  );

  return NextResponse.json({ committed: created.length, errorCount: errorRows.length, rows });
}
