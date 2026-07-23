"use client";

import { AdminTab } from "@/types/admin";

const TABS: { id: AdminTab; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "events", label: "Dịch Vụ" },
  { id: "schedule", label: "Lịch Show" },
  { id: "bookings", label: "Đặt Lịch" },
  { id: "gallery", label: "Gallery" },
  { id: "partners", label: "Đối Tác" },
  { id: "reviews", label: "Đánh Giá" },
  { id: "feedback", label: "Góp Ý Riêng" },
  { id: "content", label: "Nội Dung" },
  { id: "settings", label: "Cài Đặt" },
];

interface Props {
  activeTab: AdminTab;
  sidebarOpen: boolean;
  onSetActiveTab: (tab: AdminTab) => void;
  onCloseSidebar: () => void;
  onLogout: () => void;
}

export default function AdminSidebar({ activeTab, sidebarOpen, onSetActiveTab, onCloseSidebar, onLogout }: Props) {
  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-ink text-white flex flex-col transition-transform lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="px-5 py-6 border-b border-white/10 flex items-center justify-between">
        <span className="font-jost text-lg font-bold">
          3<span className="text-red">Thé</span>Gear
        </span>
        <button className="lg:hidden text-white/60" onClick={onCloseSidebar} aria-label="Close">
          ✕
        </button>
      </div>
      <nav className="flex-1 py-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              onSetActiveTab(tab.id);
              onCloseSidebar();
            }}
            className={`w-full text-left px-5 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab.id ? "bg-white/10 text-red border-l-2 border-red" : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="p-5 border-t border-white/10">
        <button onClick={onLogout} className="w-full text-left text-sm text-white/50 hover:text-white transition-colors">
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
