"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Khung chat AI tư vấn (Claude) nổi góc trái dưới.
 * Gọi backend qua NEXT_PUBLIC_AI_CHAT_URL.
 * - Production: mặc định "/ai-api" (cùng domain prostage3tg.com, nginx proxy về backend).
 * - Dev local: đặt NEXT_PUBLIC_AI_CHAT_URL=http://localhost:5090/api trong .env.local.
 * Backend: Claude trả lời + tự đẩy lead về Zalo team.
 */
const API = process.env.NEXT_PUBLIC_AI_CHAT_URL || "/ai-api";

type Msg = { role: "user" | "assistant"; content: string };

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Chào bạn 👋 Mình là trợ lý của 3TG ProStage-Event. Bạn cần tư vấn ban nhạc / tổ chức sự kiện nào ạ?" },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  async function send() {
    const t = text.trim();
    if (!t || loading) return;
    const next = [...msgs, { role: "user" as const, content: t }];
    setMsgs(next);
    setText("");
    setLoading(true);
    try {
      const r = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: t, history: msgs }),
      });
      const d = await r.json();
      setMsgs((m) => [...m, { role: "assistant", content: d.reply || "Xin lỗi, hiện chưa trả lời được. Bạn để lại SĐT, team sẽ liên hệ ạ." }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Kết nối bị gián đoạn. Bạn thử lại giúp mình nhé 🙏" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Nút mở chat — góc trái dưới (không đụng nút Zalo góc phải) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Mở chat tư vấn AI"
          className="fixed bottom-5 left-5 z-50 flex h-14 items-center gap-2 rounded-full bg-red px-5 text-white shadow-lg shadow-red/30 transition-transform hover:scale-105"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-semibold">Tư vấn ngay</span>
        </button>
      )}

      {/* Khung chat */}
      {open && (
        <div className="fixed bottom-5 left-5 z-50 flex h-[70vh] max-h-[560px] w-[92vw] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-red px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo/3tg-mark-red.png" alt="3TG" className="h-7 w-7 object-contain" />
              </span>
              <div>
                <div className="text-sm font-semibold leading-tight">Tư vấn ProStage3TG</div>
                <div className="text-[11px] opacity-80">Trả lời tự động · AI</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Đóng" className="text-xl leading-none opacity-90 hover:opacity-100">×</button>
          </div>

          {/* Messages */}
          <div ref={boxRef} className="flex-1 space-y-3 overflow-y-auto bg-cream px-3 py-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm ${
                    m.role === "user" ? "bg-red text-white" : "border border-border bg-white text-ink"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-border bg-white px-3.5 py-2 text-sm text-text">Đang soạn…</div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-border bg-white p-2.5">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Nhập tin nhắn…"
              className="flex-1 rounded-full border border-border px-3.5 py-2 text-sm focus:border-red focus:outline-none"
            />
            <button
              onClick={send}
              disabled={loading}
              aria-label="Gửi"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-red text-white disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
