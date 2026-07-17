import type { Metadata, Viewport } from "next";
import "./globals.css";
import { jost, montserrat, beVietnamHeading, beVietnamBody } from "./fonts";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const SITE_NAME = "ProStage - Event";
const SITE_DESCRIPTION = "Live band và sản xuất sự kiện trọn gói tại Mũi Né, phục vụ toàn miền Nam.";

export const metadata: Metadata = {
  metadataBase: new URL("https://prostage3tg.com"),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    url: "https://prostage3tg.com/",
    images: [{ url: "/logo/3tg-og-square.png", width: 800, height: 800, alt: SITE_NAME }],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/logo/3tg-og-square.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" data-lang="vi">
      <body
        className={`${jost.variable} ${montserrat.variable} ${beVietnamHeading.variable} ${beVietnamBody.variable} font-montserrat antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
