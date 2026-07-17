"use client";

import { useState } from "react";

interface PreviewRow {
  line: number;
  date: string;
  startTime: string | null;
  status: string;
  eventSlug: string | null;
  eventTitle: string | null;
  location: string | null;
  error: string | null;
}

interface Props {
  onImported: () => void;
}

export default function ScheduleImportPanel({ onImported }: Props) {
  const [open, setOpen] = useState(false);
  const [csv, setCsv] = useState("");
  const [rows, setRows] = useState<PreviewRow[] | null>(null);
  const [validCount, setValidCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [topError, setTopError] = useState("");
  const [committed, setCommitted] = useState<number | null>(null);

  async function handleFile(file: File) {
    const text = await file.text();
    setCsv(text);
    setRows(null);
    setCommitted(null);
  }

  async function preview() {
    setBusy(true);
    setTopError("");
    setCommitted(null);
    try {
      const res = await fetch("/api/admin/schedule/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv, commit: false }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTopError(data.error || "Không thể đọc CSV");
        setRows(null);
        return;
      }
      setRows(data.rows);
      setValidCount(data.validCount);
      setErrorCount(data.errorCount);
    } finally {
      setBusy(false);
    }
  }

  async function commitImport() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/schedule/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv, commit: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setCommitted(data.committed);
        onImported();
      } else {
        setTopError(data.error || "Không thể nhập lịch");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-white border border-border p-5 space-y-4 max-w-2xl">
      <button onClick={() => setOpen((v) => !v)} className="font-jost text-sm font-bold uppercase tracking-wide text-red">
        {open ? "− " : "+ "}Nhập lịch hàng loạt (CSV)
      </button>

      {open && (
        <div className="space-y-4">
          <p className="text-xs text-text">
            File CSV cần cột <code className="font-mono">date</code> (YYYY-MM-DD), và tuỳ chọn{" "}
            <code className="font-mono">time</code> (HH:MM), <code className="font-mono">event_slug</code>,{" "}
            <code className="font-mono">status</code> (available/pending/booked/cancelled), <code className="font-mono">location</code>,{" "}
            <code className="font-mono">notes</code>.
          </p>

          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="text-sm"
          />

          {topError && <p className="text-xs text-red-600">{topError}</p>}

          {csv && (
            <button
              onClick={preview}
              disabled={busy}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wide border border-border text-text hover:border-red hover:text-red transition-colors disabled:opacity-60"
            >
              Xem trước
            </button>
          )}

          {rows && (
            <div className="space-y-3">
              <p className="text-xs text-text">
                {validCount} dòng hợp lệ, {errorCount} dòng lỗi.
              </p>
              <div className="max-h-64 overflow-y-auto border border-border">
                <table className="w-full text-xs">
                  <thead className="bg-cream sticky top-0">
                    <tr>
                      <th className="text-left p-2">Dòng</th>
                      <th className="text-left p-2">Ngày</th>
                      <th className="text-left p-2">Giờ</th>
                      <th className="text-left p-2">Dịch vụ</th>
                      <th className="text-left p-2">Trạng thái</th>
                      <th className="text-left p-2">Lỗi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.line} className={r.error ? "bg-red-50" : ""}>
                        <td className="p-2">{r.line}</td>
                        <td className="p-2">{r.date}</td>
                        <td className="p-2">{r.startTime ?? "-"}</td>
                        <td className="p-2">{r.eventTitle ?? r.eventSlug ?? "-"}</td>
                        <td className="p-2">{r.status}</td>
                        <td className="p-2 text-red-600">{r.error ?? ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {validCount > 0 && committed === null && (
                <button
                  onClick={commitImport}
                  disabled={busy}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-ink text-white hover:bg-red transition-colors disabled:opacity-60"
                >
                  Xác nhận nhập {validCount} dòng
                </button>
              )}
              {committed !== null && (
                <p className="text-xs text-green-700 font-semibold">Đã nhập thành công {committed} lịch show.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
