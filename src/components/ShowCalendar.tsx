"use client";

import { useState } from "react";
import Link from "next/link";

export type CalView = "year" | "month" | "week";

export interface CalendarSlot {
  id: string;
  date: string; // "YYYY-MM-DD"
  startTime: string | null;
  status: string;
  location: string | null;
  event: { id: string; title: string; slug?: string } | null;
}

const STATUS_COLOR: Record<string, string> = {
  available: "bg-green-600",
  booked: "bg-red-600",
  pending: "bg-amber-600",
  cancelled: "bg-gray-500",
};

// Day-cell fill only — kept at 70% opacity so the date/title text stays legible.
// Written as literal class strings (not `${STATUS_COLOR[x]}/70`) so Tailwind's
// JIT scanner actually picks them up.
const STATUS_CELL_BG: Record<string, string> = {
  available: "bg-green-600/70",
  booked: "bg-red-600/70",
  pending: "bg-amber-600/70",
  cancelled: "bg-gray-500/70",
};

export interface ShowCalendarLabels {
  statusAvailable: string;
  statusBooked: string;
  statusPending: string;
  statusCancelled: string;
  months: string[];
  days: string[];
  viewYear: string;
  viewMonth: string;
  viewWeek: string;
  unassignedSlot: string;
  bookThisDate: string;
  dateLocale: string;
}

// Admin's ScheduleTab renders this component with no LangProvider in scope,
// so labels can't come from useLang() here — callers (the public /calendar
// page) pass translated labels via the `labels` prop instead; admin gets
// these Vietnamese defaults unchanged.
const DEFAULT_LABELS: ShowCalendarLabels = {
  statusAvailable: "Còn trống",
  statusBooked: "Đã đặt",
  statusPending: "Đang chờ",
  statusCancelled: "Đã huỷ",
  months: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
  days: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
  viewYear: "Năm",
  viewMonth: "Tháng",
  viewWeek: "Tuần",
  unassignedSlot: "Chưa gán dịch vụ",
  bookThisDate: "Đặt Lịch Ngày Này →",
  dateLocale: "vi-VN",
};

function fmtTime(t: string | null) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")}${h >= 12 ? "pm" : "am"}`;
}

function slotsOnDate(slots: CalendarSlot[], y: number, m: number, d: number) {
  const key = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  return slots.filter((s) => s.date === key);
}

const STATUS_PRIORITY = ["booked", "pending", "available", "cancelled"];

function dominantStatus(daySlots: CalendarSlot[]): string | null {
  if (daySlots.length === 0) return null;
  for (const status of STATUS_PRIORITY) {
    if (daySlots.some((s) => s.status === status)) return status;
  }
  return daySlots[0].status;
}

interface Props {
  slots: CalendarSlot[];
  onSelectSlot?: (slot: CalendarSlot) => void;
  hideCancelled?: boolean;
  /** Public mode: show a "Đặt Lịch Ngay" link on available slots instead of admin edit behavior. */
  bookable?: boolean;
  /** Translated labels for public use; omit to keep the Vietnamese defaults (used by admin). */
  labels?: Partial<ShowCalendarLabels>;
}

export default function ShowCalendar({ slots, onSelectSlot, hideCancelled, bookable, labels }: Props) {
  const L = { ...DEFAULT_LABELS, ...labels };
  const STATUS_LABEL: Record<string, string> = {
    available: L.statusAvailable,
    booked: L.statusBooked,
    pending: L.statusPending,
    cancelled: L.statusCancelled,
  };
  const MONTHS = L.months;
  const DAYS = L.days;
  const today = new Date();
  const [view, setView] = useState<CalView>("month");
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(today);
    const dow = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - dow);
    return d;
  });
  const [selected, setSelected] = useState<CalendarSlot[] | null>(null);
  const [selectedLabel, setSelectedLabel] = useState("");

  const visibleSlots = hideCancelled ? slots.filter((s) => s.status !== "cancelled") : slots;

  function dateKey(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  function selectDay(y: number, mo: number, d: number) {
    const s = slotsOnDate(visibleSlots, y, mo, d);
    const label = new Date(y, mo, d).toLocaleDateString(L.dateLocale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    setSelectedLabel(label);
    setSelected(s.length > 0 ? s : null);
  }

  function navigate(dir: -1 | 1) {
    if (view === "year") setYear((y) => y + dir);
    else if (view === "month") {
      let m = month + dir;
      let y = year;
      if (m < 0) { m = 11; y -= 1; }
      if (m > 11) { m = 0; y += 1; }
      setMonth(m);
      setYear(y);
    } else {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + dir * 7);
      setWeekStart(d);
    }
  }

  function YearView() {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MONTHS.map((mName, mi) => {
          const firstDay = new Date(year, mi, 1);
          const daysInMonth = new Date(year, mi + 1, 0).getDate();
          const startDow = (firstDay.getDay() + 6) % 7;
          const count = visibleSlots.filter((s) => {
            const [y2, m2] = s.date.split("-").map(Number);
            return y2 === year && m2 - 1 === mi;
          }).length;
          return (
            <div key={mi} className="bg-white border border-border rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => { setMonth(mi); setView("month"); }}
                  className="font-bold text-ink text-lg hover:text-red"
                >
                  {mName} {year}
                </button>
                {count > 0 && <span className="bg-red text-white text-base px-1.5 py-0.5 rounded-full">{count}</span>}
              </div>
              <div className="grid grid-cols-7 gap-px text-[12px] text-text/40 mb-1">
                {DAYS.map((d, i) => <span key={i} className="text-center">{d[0]}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-px">
                {Array.from({ length: startDow }).map((_, i) => <span key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d = i + 1;
                  const hasSlot = slotsOnDate(visibleSlots, year, mi, d).length > 0;
                  const isToday = today.getFullYear() === year && today.getMonth() === mi && today.getDate() === d;
                  return (
                    <span key={d} className={`text-center text-[12px] rounded-sm ${isToday ? "bg-red text-white font-bold" : hasSlot ? "bg-ink/10 text-ink font-semibold" : "text-text/40"}`}>
                      {d}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function MonthView() {
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDaysInMonth = new Date(year, month, 0).getDate();
    const startDow = (firstDay.getDay() + 6) % 7;

    type Cell = { d: number; mo: number };
    const cells: Cell[] = [
      ...Array.from({ length: startDow }, (_, i) => ({ d: prevDaysInMonth - startDow + 1 + i, mo: -1 })),
      ...Array.from({ length: daysInMonth }, (_, i) => ({ d: i + 1, mo: 0 })),
    ];
    let trailing = 1;
    while (cells.length % 7 !== 0) cells.push({ d: trailing++, mo: 1 });
    const weeks: Cell[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    return (
      <div className="flex flex-col gap-px">
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-base font-semibold text-text/50 py-1">{d}</div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-px">
            {week.map((cell, di) => {
              const { d, mo } = cell;
              const cellYear = mo === -1 ? (month === 0 ? year - 1 : year) : mo === 1 ? (month === 11 ? year + 1 : year) : year;
              const cellMonth = mo === -1 ? (month === 0 ? 11 : month - 1) : mo === 1 ? (month === 11 ? 0 : month + 1) : month;
              const daySlots = slotsOnDate(visibleSlots, cellYear, cellMonth, d);
              const isToday = today.toDateString() === new Date(cellYear, cellMonth, d).toDateString();
              const isAdjacent = mo !== 0;
              const dominant = dominantStatus(daySlots);

              let cellBg = "bg-white hover:bg-cream";
              if (isAdjacent) cellBg = "bg-cream/40";
              else if (dominant) cellBg = `${STATUS_CELL_BG[dominant] ?? "bg-gray-300/70"} hover:brightness-95`;
              else if (isToday) cellBg = "bg-amber-50 hover:bg-cream";

              const dayNumClass = dominant && !isAdjacent ? "text-white" : isToday ? "text-red" : "text-ink/70";
              const titleClass = dominant && !isAdjacent ? "text-white" : "text-ink";
              const overflowClass = dominant && !isAdjacent ? "text-white/80" : "text-text/50";

              return (
                <button
                  key={`${mo}-${d}-${di}`}
                  onClick={() => selectDay(cellYear, cellMonth, d)}
                  className={`min-h-[64px] p-1 text-left border rounded-lg transition-colors ${isAdjacent ? "border-border/40 opacity-40" : isToday ? "border-red" : "border-border"} ${cellBg}`}
                >
                  <span className={`text-base font-semibold block mb-0.5 ${dayNumClass}`}>{d}</span>
                  <div className="space-y-0.5">
                    {daySlots.slice(0, 2).map((s) => (
                      <span key={s.id} className="flex items-center gap-1">
                        {daySlots.length > 1 && dominant && s.status !== dominant && (
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ring-2 ring-white/70 ${STATUS_COLOR[s.status] ?? "bg-gray-300"}`} />
                        )}
                        <span className={`text-[13px] truncate leading-tight ${titleClass}`}>{s.event?.title ?? "-"}</span>
                      </span>
                    ))}
                    {daySlots.length > 2 && <span className={`text-[13px] ${overflowClass}`}>+{daySlots.length - 2}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  function WeekView() {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });

    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => {
          const daySlots = slotsOnDate(visibleSlots, d.getFullYear(), d.getMonth(), d.getDate());
          const isToday = today.toDateString() === d.toDateString();
          return (
            <button
              key={i}
              onClick={() => selectDay(d.getFullYear(), d.getMonth(), d.getDate())}
              className={`border rounded-lg overflow-hidden text-left ${isToday ? "border-red bg-amber-50" : "border-border bg-white"}`}
            >
              <div className={`text-center py-2 border-b ${isToday ? "bg-red text-white border-red" : "bg-ink/5 border-border text-ink"}`}>
                <div className="text-base font-semibold">{DAYS[i]}</div>
                <div className="text-lg font-bold">{d.getDate()}</div>
              </div>
              <div className="p-2 space-y-1 min-h-[100px]">
                {daySlots.length === 0 && <span className="text-base text-text/30">-</span>}
                {daySlots.map((s) => (
                  <div key={s.id} className="text-[14px] px-1.5 py-0.5 rounded-md bg-ink/5 flex items-center gap-1 truncate">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_COLOR[s.status] ?? "bg-gray-300"}`} />
                    <span className="truncate">{s.event?.title ?? "-"}</span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1">
          {(["year", "month", "week"] as CalView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-base font-semibold uppercase tracking-wide rounded-full ${view === v ? "bg-ink text-white" : "bg-white border border-border text-text"}`}
            >
              {v === "year" ? L.viewYear : v === "month" ? L.viewMonth : L.viewWeek}
            </button>
          ))}
        </div>
        {view !== "year" && (
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text hover:border-red hover:text-red">‹</button>
            <span className="text-lg font-semibold text-ink min-w-[120px] text-center">
              {view === "month" ? `${MONTHS[month]} ${year}` : `${weekStart.toLocaleDateString(L.dateLocale, { day: "numeric", month: "short" })}`}
            </span>
            <button onClick={() => navigate(1)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text hover:border-red hover:text-red">›</button>
          </div>
        )}
        <div className="flex gap-4 text-lg font-bold text-ink">
          {Object.entries(STATUS_LABEL)
            .filter(([status]) => !(hideCancelled && status === "cancelled"))
            .map(([status, label]) => (
            <span key={status} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLOR[status]}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {view === "year" && <YearView />}
      {view === "month" && <MonthView />}
      {view === "week" && <WeekView />}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div className="bg-white border border-border w-full max-w-md shadow-xl rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-ink text-white px-4 py-3 flex items-center justify-between">
              <span className="font-bold text-lg">{selectedLabel}</span>
              <button onClick={() => setSelected(null)} className="text-white/70 hover:text-white text-lg leading-none">×</button>
            </div>
            <div className="p-4 space-y-3">
              {selected.map((s) => {
                const canBook = bookable && s.status === "available" && s.event?.slug;
                return (
                  <div key={s.id}>
                    <button
                      onClick={() => onSelectSlot?.(s)}
                      className={`w-full text-left border border-border rounded-xl p-3 ${onSelectSlot ? "hover:border-red" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-ink text-lg">{s.event?.title ?? L.unassignedSlot}</p>
                          {s.startTime && <p className="text-base text-text/60">{fmtTime(s.startTime)}</p>}
                          {s.location && <p className="text-base text-text/60">{s.location}</p>}
                        </div>
                        <span className={`text-lg px-2.5 py-1 rounded-full font-bold text-white ${STATUS_COLOR[s.status]}`}>
                          {STATUS_LABEL[s.status] ?? s.status}
                        </span>
                      </div>
                    </button>
                    {canBook && (
                      <Link
                        href={`/events/${s.event!.slug}`}
                        className="block text-center mt-1.5 px-3 py-2 text-base font-bold uppercase tracking-wide bg-ink text-white rounded-full hover:bg-red transition-colors"
                      >
                        {L.bookThisDate}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
