"use client";

interface Props {
  eventCount: number;
  pendingBookingCount: number;
  scheduleCount: number;
}

export default function DashboardTab({ eventCount, pendingBookingCount, scheduleCount }: Props) {
  return (
    <div className="space-y-6">
      <h1 className="font-jost text-2xl font-bold text-ink">Dashboard</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Dịch vụ" value={eventCount} />
        <StatCard label="Đặt lịch chờ xử lý" value={pendingBookingCount} />
        <StatCard label="Lịch show" value={scheduleCount} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-border p-5">
      <div className="font-jost text-3xl font-bold text-ink">{value}</div>
      <div className="text-xs uppercase tracking-wide text-red font-bold mt-2">{label}</div>
    </div>
  );
}
