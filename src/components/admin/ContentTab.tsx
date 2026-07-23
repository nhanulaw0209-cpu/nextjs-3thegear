"use client";

import { useEffect, useMemo, useState } from "react";
import { UI_STRINGS } from "@/lib/i18n";

type Key = keyof typeof UI_STRINGS;
type Lang = "vi" | "en" | "ru" | "zh" | "ko";

const LANGS: { id: Lang; label: string }[] = [
  { id: "vi", label: "Tiếng Việt" },
  { id: "en", label: "English" },
  { id: "ru", label: "Русский" },
  { id: "zh", label: "中文" },
  { id: "ko", label: "한국어" },
];

const ALL_KEYS = Object.keys(UI_STRINGS) as Key[];

type OverrideRow = { key: string; vi: string | null; en: string | null; ru: string | null; zh: string | null; ko: string | null };
type DraftMap = Record<string, Record<Lang, string>>;

function defaultDraft(key: Key): Record<Lang, string> {
  const d = UI_STRINGS[key];
  return { vi: d.vi, en: d.en, ru: d.ru, zh: d.zh, ko: d.ko };
}

export default function ContentTab() {
  const [overrides, setOverrides] = useState<Record<string, OverrideRow>>({});
  const [drafts, setDrafts] = useState<DraftMap>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/content", { cache: "no-store" })
      .then((res) => res.json())
      .then((rows: OverrideRow[]) => {
        const map: Record<string, OverrideRow> = {};
        const draftMap: DraftMap = {};
        for (const row of rows) {
          map[row.key] = row;
          const base = ALL_KEYS.includes(row.key as Key) ? defaultDraft(row.key as Key) : { vi: "", en: "", ru: "", zh: "", ko: "" };
          draftMap[row.key] = {
            vi: row.vi ?? base.vi,
            en: row.en ?? base.en,
            ru: row.ru ?? base.ru,
            zh: row.zh ?? base.zh,
            ko: row.ko ?? base.ko,
          };
        }
        setOverrides(map);
        setDrafts(draftMap);
        setLoading(false);
      });
  }, []);

  const filteredKeys = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_KEYS;
    return ALL_KEYS.filter((key) => key.toLowerCase().includes(q) || UI_STRINGS[key].vi.toLowerCase().includes(q));
  }, [search]);

  function getDraft(key: Key): Record<Lang, string> {
    return drafts[key] ?? defaultDraft(key);
  }

  function updateDraft(key: Key, lang: Lang, value: string) {
    setDrafts((prev) => ({ ...prev, [key]: { ...getDraft(key), [lang]: value } }));
  }

  function isEdited(key: Key): boolean {
    return !!overrides[key];
  }

  async function handleSave(key: Key) {
    setSavingKey(key);
    const draft = getDraft(key);
    const res = await fetch(`/api/admin/content/${key}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (res.ok) {
      const row = await res.json();
      setOverrides((prev) => ({ ...prev, [key]: row }));
      setSavedKey(key);
      setTimeout(() => setSavedKey((k) => (k === key ? null : k)), 1500);
    }
    setSavingKey(null);
  }

  async function handleRevert(key: Key) {
    if (!confirm("Khôi phục về nội dung mặc định của key này?")) return;
    await fetch(`/api/admin/content/${key}`, { method: "DELETE" });
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setDrafts((prev) => ({ ...prev, [key]: defaultDraft(key) }));
  }

  if (loading) return <p className="text-sm text-text">Đang tải...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jost text-2xl font-bold text-ink">Nội Dung Trang Chủ</h1>
        <p className="text-sm text-text mt-1">
          Sửa câu chữ hiển thị trên website (tiêu đề, mô tả, nút bấm...) cho từng ngôn ngữ. Chưa sửa key nào thì trang vẫn hiển thị nội dung mặc định.
        </p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm theo tên key hoặc nội dung tiếng Việt..."
        className="border border-border rounded-md px-3 py-2 text-sm w-full max-w-lg"
      />

      <p className="text-xs text-text">
        {filteredKeys.length} / {ALL_KEYS.length} mục · {Object.keys(overrides).length} mục đã được sửa khỏi mặc định
      </p>

      <div className="space-y-2 max-w-3xl">
        {filteredKeys.map((key) => {
          const draft = getDraft(key);
          const edited = isEdited(key);
          return (
            <details key={key} className="bg-white border border-border rounded-lg group">
              <summary className="cursor-pointer select-none px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-mono text-red">{key}</span>
                  <span className="text-xs text-text ml-2 truncate">{UI_STRINGS[key].vi}</span>
                </div>
                {edited && (
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide bg-ink text-white px-2 py-0.5 rounded-full">
                    Đã sửa
                  </span>
                )}
              </summary>

              <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border">
                {LANGS.map(({ id, label }) => (
                  <div key={id} className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase tracking-wide text-ink">{label}</label>
                    <textarea
                      value={draft[id]}
                      onChange={(e) => updateDraft(key, id, e.target.value)}
                      rows={draft[id].length > 80 ? 3 : 1}
                      className="border border-border rounded-md px-3 py-2 text-sm w-full"
                    />
                  </div>
                ))}

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => handleSave(key)}
                    disabled={savingKey === key}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-ink text-white hover:bg-red transition-colors disabled:opacity-50"
                  >
                    {savingKey === key ? "Đang lưu..." : "Lưu"}
                  </button>
                  {edited && (
                    <button onClick={() => handleRevert(key)} className="text-xs text-red-600 hover:underline">
                      Khôi phục mặc định
                    </button>
                  )}
                  {savedKey === key && <span className="text-xs text-green-600">Đã lưu</span>}
                </div>
              </div>
            </details>
          );
        })}
        {filteredKeys.length === 0 && <p className="text-sm text-text">Không tìm thấy key nào.</p>}
      </div>
    </div>
  );
}
