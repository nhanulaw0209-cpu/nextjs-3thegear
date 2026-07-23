import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const LANGS = ["vi", "en", "ru", "zh", "ko"] as const;

// Public endpoint the site itself reads on load to merge admin-edited text
// over the hardcoded defaults in src/lib/i18n.ts. Only non-null (i.e.
// actually edited) language values are included per key.
export async function GET() {
  const rows = await prisma.contentOverride.findMany();
  const map: Record<string, Partial<Record<(typeof LANGS)[number], string>>> = {};

  for (const row of rows) {
    const entry: Partial<Record<(typeof LANGS)[number], string>> = {};
    for (const lang of LANGS) {
      const val = row[lang];
      if (val) entry[lang] = val;
    }
    if (Object.keys(entry).length > 0) map[row.key] = entry;
  }

  return NextResponse.json(map, { headers: { "Cache-Control": "no-store" } });
}
