"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Menu } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardTab from "@/components/admin/DashboardTab";
import EventsTab from "@/components/admin/EventsTab";
import BookingsTab from "@/components/admin/BookingsTab";
import GalleryTab from "@/components/admin/GalleryTab";
import PartnersTab from "@/components/admin/PartnersTab";
import ReviewsTab from "@/components/admin/ReviewsTab";
import FeedbackTab from "@/components/admin/FeedbackTab";
import ScheduleTab from "@/components/admin/ScheduleTab";
import SettingsTab from "@/components/admin/SettingsTab";
import ContentTab from "@/components/admin/ContentTab";
import { AdminTab } from "@/types/admin";

const TAB_TITLES: Record<AdminTab, string> = {
  dashboard: "Dashboard",
  events: "Dịch Vụ",
  schedule: "Lịch Show",
  bookings: "Đặt Lịch",
  gallery: "Gallery",
  partners: "Đối Tác",
  reviews: "Đánh Giá",
  feedback: "Góp Ý Riêng",
  content: "Nội Dung",
  settings: "Cài Đặt",
};

function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  const tabFromUrl = (searchParams.get("tab") as AdminTab) || "dashboard";
  const [activeTab, setActiveTab] = useState<AdminTab>(tabFromUrl);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dashboard, setDashboard] = useState({ eventCount: 0, pendingBookingCount: 0, scheduleCount: 0 });
  const [dashboardError, setDashboardError] = useState(false);

  const setActiveTabAndUrl = useCallback(
    (tab: AdminTab) => {
      setActiveTab(tab);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.replace(`/admin?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  useEffect(() => {
    try {
      const isAuth = localStorage.getItem("admin-authenticated") === "true";
      setIsAuthenticated(isAuth);
    } finally {
      setCheckedAuth(true);
    }
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
      if (!res.ok) {
        setDashboardError(true);
        return;
      }
      setDashboardError(false);
      setDashboard(await res.json());
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
      setDashboardError(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchDashboard();
  }, [isAuthenticated, fetchDashboard]);

  if (!checkedAuth) return null;

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-cream flex">
      <AdminSidebar
        activeTab={activeTab}
        sidebarOpen={sidebarOpen}
        onSetActiveTab={setActiveTabAndUrl}
        onCloseSidebar={() => setSidebarOpen(false)}
        onLogout={() => {
          localStorage.removeItem("admin-authenticated");
          setIsAuthenticated(false);
        }}
      />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 min-w-0">
        <div className="lg:hidden bg-ink px-3 py-2 flex items-center gap-2">
          <button onClick={() => setSidebarOpen(true)} className="text-white/70 hover:text-white" aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-white">{TAB_TITLES[activeTab]}</h2>
        </div>

        <div className="p-4 md:p-6">
          {dashboardError && activeTab === "dashboard" && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
              <span>Không thể tải dữ liệu dashboard. Kiểm tra kết nối.</span>
              <button onClick={fetchDashboard} className="ml-4 underline text-red-600 hover:text-red-800">
                Thử lại
              </button>
            </div>
          )}
          {activeTab === "dashboard" && (
            <DashboardTab
              eventCount={dashboard.eventCount}
              pendingBookingCount={dashboard.pendingBookingCount}
              scheduleCount={dashboard.scheduleCount}
            />
          )}
          {activeTab === "events" && <EventsTab />}
          {activeTab === "schedule" && <ScheduleTab />}
          {activeTab === "bookings" && <BookingsTab />}
          {activeTab === "gallery" && <GalleryTab />}
          {activeTab === "partners" && <PartnersTab />}
          {activeTab === "reviews" && <ReviewsTab />}
          {activeTab === "feedback" && <FeedbackTab />}
          {activeTab === "content" && <ContentTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}

export default function AdminPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center text-text">Đang tải...</div>}>
      <AdminPage />
    </Suspense>
  );
}
