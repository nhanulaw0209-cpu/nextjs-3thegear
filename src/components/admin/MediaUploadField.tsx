"use client";

import { useState } from "react";

interface Props {
  label: string;
  value: string;
  mediaType: "photo" | "video";
  category: string;
  onChange: (url: string) => void;
}

export default function MediaUploadField({ label, value, mediaType, category, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload thất bại");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Upload thất bại");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wide text-ink">{label}</label>
      <div className="flex items-center gap-3">
        {value &&
          (mediaType === "video" ? (
            <video src={value} className="w-16 h-16 rounded-lg object-cover bg-black" muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-16 h-16 rounded-lg object-cover bg-white border border-border" />
          ))}
        <input
          type="file"
          accept={mediaType === "video" ? "video/*" : "image/*"}
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="text-sm"
        />
        {uploading && <span className="text-xs text-text">Đang tải...</span>}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
