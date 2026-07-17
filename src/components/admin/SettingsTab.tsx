"use client";

import { useEffect, useState, useCallback } from "react";
import { SiteSettings } from "@/types/admin";
import ImageUploadField from "./ImageUploadField";

const EMPTY = { bankName: "", accountNumber: "", accountName: "", qrImageUrl: "", branch: "", ownerPhotoUrl: "", contactPhone: "", contactEmail: "" };

export default function SettingsTab() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/admin/settings", { cache: "no-store" });
    if (res.ok) {
      const data: SiteSettings = await res.json();
      setForm({
        bankName: data.bankName ?? "",
        accountNumber: data.accountNumber ?? "",
        accountName: data.accountName ?? "",
        qrImageUrl: data.qrImageUrl ?? "",
        branch: data.branch ?? "",
        ownerPhotoUrl: data.ownerPhotoUrl ?? "",
        contactPhone: data.contactPhone ?? "",
        contactEmail: data.contactEmail ?? "",
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
  }

  if (loading) return <p className="text-sm text-text">Đang tải...</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-jost text-2xl font-bold text-ink">Cài Đặt Thanh Toán</h1>
      <p className="text-sm text-text max-w-lg">
        Thông tin ngân hàng và mã QR hiển thị cho khách sau khi đặt lịch. Hiện là dữ liệu demo - cập nhật bằng thông tin thật khi sẵn sàng.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-border p-5 space-y-4 max-w-lg">
        <Field label="Tên ngân hàng">
          <input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Số tài khoản">
          <input value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Tên chủ tài khoản">
          <input value={form.accountName} onChange={(e) => setForm({ ...form, accountName: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Chi nhánh">
          <input value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} className={inputClass} />
        </Field>
        <ImageUploadField
          label="Ảnh mã QR"
          value={form.qrImageUrl}
          category="settings"
          onChange={(url) => setForm({ ...form, qrImageUrl: url })}
        />
        <Field label="Số điện thoại liên hệ">
          <input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Email liên hệ">
          <input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className={inputClass} />
        </Field>
        <button type="submit" className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-ink text-white hover:bg-red transition-colors">
          Lưu cài đặt
        </button>
        {saved && <span className="ml-3 text-xs text-green-700 font-semibold">Đã lưu.</span>}
      </form>

      <h2 className="font-jost text-xl font-bold text-ink pt-4">Trang Về Chúng Tôi</h2>
      <p className="text-sm text-text max-w-lg">
        Ảnh chân dung chủ hiển thị ở mục &quot;Về Chúng Tôi&quot; trên trang chủ, tạo cảm giác cá nhân hóa khi giới thiệu.
      </p>
      <form onSubmit={handleSubmit} className="bg-white border border-border p-5 space-y-4 max-w-lg">
        <ImageUploadField
          label="Ảnh chân dung chủ"
          value={form.ownerPhotoUrl}
          category="settings"
          onChange={(url) => setForm({ ...form, ownerPhotoUrl: url })}
        />
        <button type="submit" className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-ink text-white hover:bg-red transition-colors">
          Lưu cài đặt
        </button>
        {saved && <span className="ml-3 text-xs text-green-700 font-semibold">Đã lưu.</span>}
      </form>
    </div>
  );
}

const inputClass = "border border-border rounded-md px-3 py-2 text-sm w-full";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wide text-ink">{label}</label>
      {children}
    </div>
  );
}
