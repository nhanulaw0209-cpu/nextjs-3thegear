import { Manrope, Montserrat } from "next/font/google";
import localFont from "next/font/local";

// Jost/Josefin Sans have no "cyrillic" subset; Raleway has it but its digit
// glyphs (e.g. "3" in "3TG Band") are stylistically inconsistent with its
// letters at bold weight. Manrope covers vietnamese + cyrillic and its digits
// match its letterforms cleanly.
export const jost = Manrope({
  subsets: ["latin", "latin-ext", "vietnamese", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
});

export const montserrat = Montserrat({
  subsets: ["latin", "latin-ext", "vietnamese", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

// Be Vietnam Pro has no cyrillic/CJK glyphs, so it only replaces the base
// fonts for the "vi" locale (see globals.css `html[data-lang="vi"]` override)
// — en/ru/zh/ko keep Manrope/Montserrat above.
export const beVietnamHeading = localFont({
  src: [
    { path: "./fonts/be-vietnam-pro/BeVietnamPro-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/be-vietnam-pro/BeVietnamPro-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-be-vietnam-heading",
  display: "swap",
});

export const beVietnamBody = localFont({
  src: [{ path: "./fonts/be-vietnam-pro/BeVietnamPro-Regular.ttf", weight: "400", style: "normal" }],
  variable: "--font-be-vietnam-body",
  display: "swap",
});
