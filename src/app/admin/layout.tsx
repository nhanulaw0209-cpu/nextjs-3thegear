import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | 3TG Event",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="admin-layout">{children}</div>;
}
