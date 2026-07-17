# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

3ThéGear Band — booking/event CMS for a live-band/event-production business in Phan Thiết, Vietnam. Public marketing site + booking flow, and an admin CMS for managing everything. Modeled after the conventions of `06-misc/nextjs-memoire-saigon` elsewhere in this workspace (flat Prisma models, client-side password-gated admin, local-disk uploads) rather than the NextAuth/R2 stack used by other sibling projects — don't introduce those without being asked.

## Commands

```bash
npm run dev          # Dev server (default port 3000; this project is usually run as PORT=3010 npm run dev)
npm run build         # Production build
npm run build:check   # type-check + lint + build — run before committing
npm run type-check    # tsc --noEmit only
npm run lint          # ESLint only
npm run db:seed       # Re-run prisma/seed.ts (idempotent — safe to re-run any time)

npx prisma migrate dev --name <name>   # create + apply a migration after editing schema.prisma
npx prisma studio                       # inspect the DB visually
```

There are no test files/framework configured in this project.

Local Postgres is a plain `psql`/`createdb` instance (no Docker), database `thegear_dev`, connected via `DATABASE_URL` in `.env`. Admin login password is `ADMIN_PASSWORD` in `.env`.

## Architecture

**Stack:** Next.js 14 App Router + TypeScript + Tailwind + Prisma/Postgres. No test runner, no NextAuth, no cloud storage — everything is deliberately minimal for a small single-operator business site.

### Public site vs. admin — two different rendering models

- **Public homepage** (`/`) is a single client component tree rooted at `src/components/site/HomeClient.tsx`. It's the original static single-page design ported to React: `activeSection` state drives which `SectionShell`-wrapped section is visible (About, Sự Kiện/Dịch Vụ, Đối Tác), toggled by clicking header nav buttons — not real routing. `src/lib/lang-context.tsx` (`LangProvider`) and `src/lib/lightbox-context.tsx` wrap the whole tree for i18n and the image lightbox. All UI copy lives in `src/lib/i18n.ts` (5 languages: vi/en/ru/zh/ko) keyed by string constants looked up via `useLang().t(key)`.
- **Real pages** (`/calendar`, `/gallery`, `/events/[slug]`, `/booking/[id]`) are separate routes outside that provider tree — they do **not** have access to `useLang()`/i18n and are plain Vietnamese-only text. Don't try to use `t()` inside them.
- **Admin** (`/admin`) is a single client page (`src/app/admin/page.tsx`) with tab state driven by a `?tab=` query param (not separate routes) rendering one of the `src/components/admin/*Tab.tsx` components. Auth is a password check against `/api/admin/login` (verifies `ADMIN_PASSWORD` server-side) that sets `localStorage["admin-authenticated"]` — **`/api/admin/*` routes are not server-side auth-checked**, they trust the client. This is an intentional simplicity trade-off carried over from the memoire-saigon pattern, not an oversight.

### Data model (`prisma/schema.prisma`)

`Event` is the central model — it represents a bookable service/event category (e.g. "Tiệc Cưới", "Tiệc VIP"), not a single occurrence. Each `Event` has:
- `EventListBuyItem[]` — purchasable combos/packages with a price (the "ListBuy")
- `SetlistItem[]` — demo/admin-editable song list with optional artist
- `GalleryItem[]` — photos/videos, either scoped to this event or global (`eventId: null`)
- `ShowSchedule[]` — calendar slots; `status` is a free-text field (`"available" | "pending" | "booked" | "cancelled"`), not an enum
- `Booking[]` — a customer's reservation, holding `BookingLineItem[]` that **snapshot** `name`/`price` from the `EventListBuyItem` at booking time (never join back to live prices for historical totals)

`ShowSchedule` is the calendar's source of truth. A `Booking` attaches to a slot via the unique `ShowSchedule.bookingId`, so a slot can only ever be claimed by one booking. When admin confirms a booking, its linked slot flips to `"booked"`; when admin cancels, the slot resets to `"available"` and `bookingId` is cleared (freeing it up again) — see `src/app/api/admin/bookings/[id]/route.ts`.

`SiteSettings` is a singleton row (`id: "singleton"`) holding bank/QR payment info shown on the post-booking payment screen.

### The `prisma/seed.ts` script is load-bearing, not throwaway

It's designed to be re-run safely any time (`npm run db:seed`) without duplicating data — every insert is guarded by a `findFirst`/`findUnique` check first. It also carries a `SLUG_RENAMES` migration table at the top: event category names/slugs have changed several times as the client's requirements evolved (e.g. `tiec-cuoi` → `tiec-cuoi-ca-nhan` → back to `tiec-cuoi`), and this table renames existing DB rows in place instead of creating orphaned duplicates. When renaming/repurposing an event again, add another entry here rather than hand-editing the DB. `SetlistItem`s are only seeded when an event currently has zero songs — re-running seed will never stomp on setlist edits made through the admin UI, unlike `EventListBuyItem`s which are fully synced (stale ones removed) on every run.

### Booking flow

Public booking (`src/components/site/BookingForm.tsx` on `/events/[slug]`) POSTs to `/api/bookings`, which: validates the event + selected `EventListBuyItem`s, checks for a conflicting `ShowSchedule` slot on that date (blocks if `"booked"` or `"pending"`), then creates the `Booking`+`BookingLineItem`s and upserts a `ShowSchedule` slot to `"pending"` in one `$transaction`. Redirects to `/booking/[id]`, a manual bank-transfer QR payment screen (no payment gateway) — customer clicks "Tôi Đã Chuyển Khoản" to mark `payment_submitted`, admin manually confirms via `BookingsTab`.

The "Đặt Lịch" nav item and `/calendar` page intentionally merge what used to be two separate features (a live show schedule + a general contact/inquiry form) into one route — see `src/components/ShowCalendar.tsx`'s `bookable` prop, which renders a direct "Đặt Lịch Ngày Này" link into an event's booking page when a slot is `available`, plus `QuickInquiryForm.tsx` below it for date-agnostic inquiries (mailto-based, no backend).

### Uploads

`src/app/api/upload/route.ts` writes files straight to `public/uploads/<category>/` on local disk (categories: `partners`, `events`, `gallery`, `settings`) — no S3/R2. This only works because the deploy target is a persistent VPS process, not serverless.

### Design system

Tailwind theme tokens in `tailwind.config.ts`: `gold` (#a8863f), `ink` (#16161a), `cream` (#faf9f6), fonts `font-jost` (headings) / `font-montserrat` (body). All UI is rounded (`rounded-full` pills for buttons/CTAs, `rounded-2xl`/`rounded-xl` for image frames and cards, `rounded-md` for form inputs) — this was a deliberate design pass, keep new components consistent with it rather than reverting to sharp corners.
