"use client";

import { useState } from "react";

interface Props {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        localStorage.setItem("admin-authenticated", "true");
        onLogin();
      } else {
        setError("Sai mật khẩu");
        setPassword("");
      }
    } catch {
      setError("Không thể kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex">
      <div className="w-full max-w-md bg-ink text-white p-8 flex flex-col justify-center">
        <div className="mb-8">
          <h1 className="font-jost text-2xl font-bold uppercase text-white mb-2">
            3TG <span className="text-red">Event</span>
          </h1>
          <p className="text-white/60 text-sm">Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium" htmlFor="admin-password">
              Mật khẩu
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-red focus:outline-none"
              placeholder="Nhập mật khẩu admin"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-ink py-3 font-bold uppercase tracking-widest text-sm hover:bg-red hover:text-white transition-colors disabled:opacity-60"
          >
            {loading ? "Đang kiểm tra..." : "Truy Cập"}
          </button>
        </form>
      </div>

      <div className="hidden md:flex flex-1 items-center justify-center">
        <div className="text-center text-ink/20">
          <div className="font-jost text-6xl font-bold mb-4">3TG</div>
          <p className="text-sm uppercase tracking-widest">Admin Portal</p>
        </div>
      </div>
    </div>
  );
}
