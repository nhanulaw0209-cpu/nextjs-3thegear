import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface EventSeed {
  slug: string;
  title: string;
  summary: string;
  description: string;
  heroImageUrl: string;
  showDuration: string;
  listBuyItems: { name: string; description: string; price: number; sortOrder: number }[];
  // Demo placeholder setlist — no real song list from the client yet. Uses a mix of
  // well-known Vietnamese wedding/event live-band repertoire until admin edits it.
  setlistItems: { title: string; artist: string; sortOrder: number }[];
}

const EVENT_SEEDS: EventSeed[] = [
  {
    slug: "tiec-cuoi",
    title: "Tiệc Cưới",
    summary: "Live band cho lễ cưới, mang âm nhạc tinh tế đồng hành cùng khoảnh khắc quan trọng nhất.",
    description:
      "Đội hình nhạc công và ca sĩ biểu diễn đa dạng thể loại: Ballad, Acoustic, Latin... Linh hoạt điều chỉnh setlist theo không khí và yêu cầu của từng lễ cưới.",
    heroImageUrl: "/3thegear-photos/img/photo-24.jpg",
    showDuration: "120 phút (19:00 - 21:00)",
    listBuyItems: [],
    setlistItems: [
      { title: "Ngày Đầu Tiên", artist: "Bùi Anh Tuấn", sortOrder: 1 },
      { title: "Có Chàng Trai Viết Lên Cây", artist: "Phan Mạnh Quỳnh", sortOrder: 2 },
      { title: "Cưới Thôi", artist: "Wren Evans", sortOrder: 3 },
      { title: "Hơn Cả Yêu", artist: "Đức Phúc", sortOrder: 4 },
    ],
  },
  {
    slug: "tiec-ca-nhan",
    title: "Tiệc Cá Nhân",
    summary: "Không gian âm nhạc ấm cúng cho sinh nhật, kỷ niệm, họp mặt gia đình và bạn bè.",
    description:
      "Ban nhạc rút gọn với nhạc cụ mộc: guitar thùng, cajon, phù hợp không gian sân vườn, tại gia hoặc quán riêng, quy mô nhỏ và linh hoạt theo yêu cầu.",
    heroImageUrl: "/3thegear-photos/img/photo-17.jpg",
    showDuration: "60 phút (tuỳ chỉnh theo yêu cầu)",
    listBuyItems: [],
    setlistItems: [
      { title: "Waiting For You", artist: "MONO", sortOrder: 1 },
      { title: "See Tình", artist: "Hoàng Thuỳ Linh", sortOrder: 2 },
      { title: "Chạy Ngay Đi", artist: "Sơn Tùng M-TP", sortOrder: 3 },
    ],
  },
  {
    slug: "su-kien-doanh-nghiep",
    title: "Sự Kiện Doanh Nghiệp",
    summary: "Trình diễn chuyên nghiệp cho hội nghị, gala doanh nghiệp, khai trương, tri ân khách hàng.",
    description:
      "Đội ngũ dày dạn kinh nghiệm tổ chức chương trình cho các tập đoàn đa quốc gia như Yokogawa, Prudential, Medtronic. Âm thanh ánh sáng chuyên nghiệp, MC song ngữ, tiết mục phù hợp văn hoá doanh nghiệp.",
    heroImageUrl: "/3thegear-photos/img/photo-32.jpg",
    showDuration: "90 phút (18:30 - 20:00)",
    listBuyItems: [],
    setlistItems: [
      { title: "Perfect", artist: "Ed Sheeran", sortOrder: 1 },
      { title: "Ngày Đầu Tiên", artist: "Bùi Anh Tuấn", sortOrder: 2 },
      { title: "Uptown Funk", artist: "Bruno Mars", sortOrder: 3 },
    ],
  },
  {
    slug: "tiec-vip",
    title: "Tiệc VIP",
    summary: "Không gian âm nhạc riêng tư, sang trọng dành cho tiệc VIP, tiệc doanh nhân.",
    description:
      "1-2 nhạc công và ca sĩ được tuyển chọn kỹ lưỡng, biểu diễn tinh tế, kín đáo, phù hợp phòng riêng quy mô nhỏ.",
    heroImageUrl: "/3thegear-photos/img/photo-55.jpg",
    showDuration: "60 phút (20:00 - 21:00)",
    listBuyItems: [],
    setlistItems: [
      { title: "Chỉ Là Không Cùng Nhau", artist: "JustaTee", sortOrder: 1 },
      { title: "Hơn Cả Yêu", artist: "Đức Phúc", sortOrder: 2 },
      { title: "Waiting For You (Acoustic)", artist: "MONO", sortOrder: 3 },
    ],
  },
  {
    slug: "cac-loai-dich-vu-khac",
    title: "Các Loại Event Khác",
    summary: "Cho thuê nhạc cụ, DJ, trang phục biểu diễn và các dịch vụ hỗ trợ sự kiện khác.",
    description:
      "Ngoài các gói chính, 3TG Event còn cung cấp dịch vụ cho thuê nhạc cụ & phụ kiện, DJ chuyên nghiệp, trang phục biểu diễn và tư vấn kỹ thuật âm thanh miễn phí.",
    heroImageUrl: "/3thegear-photos/img/photo-71.jpg",
    showDuration: "Linh hoạt theo yêu cầu chương trình",
    listBuyItems: [],
    setlistItems: [
      { title: "Vì Yêu Cứ Đâm Đầu", artist: "Tăng Duy Tân", sortOrder: 1 },
      { title: "Chạy Ngay Đi", artist: "Sơn Tùng M-TP", sortOrder: 2 },
    ],
  },
];

// One-time slug migrations as the event category naming evolved. Safe to run
// repeatedly — no-ops once each rename has already happened.
const SLUG_RENAMES: [string, string][] = [
  ["tiec-cuoi", "tiec-cuoi-ca-nhan"], // first pass: merged into one wedding+personal category
  ["tiec-cuoi-ca-nhan", "tiec-cuoi"], // split back out: "Tiệc Cưới" alone
  ["tiec-hoi-mon", "cac-loai-dich-vu-khac"],
];

async function renameLegacySlugs() {
  for (const [oldSlug, newSlug] of SLUG_RENAMES) {
    const old = await prisma.event.findUnique({ where: { slug: oldSlug } });
    const alreadyRenamed = await prisma.event.findUnique({ where: { slug: newSlug } });
    if (old && !alreadyRenamed) {
      await prisma.event.update({ where: { id: old.id }, data: { slug: newSlug } });
    }
  }
}

async function main() {
  await renameLegacySlugs();

  const eventIds: Record<string, string> = {};

  for (const seed of EVENT_SEEDS) {
    const existing = await prisma.event.findUnique({ where: { slug: seed.slug } });
    if (existing) {
      await prisma.event.update({
        where: { id: existing.id },
        data: {
          title: seed.title,
          summary: seed.summary,
          description: seed.description,
          heroImageUrl: seed.heroImageUrl,
          showDuration: seed.showDuration,
          isPublished: true,
        },
      });
      eventIds[seed.slug] = existing.id;
    } else {
      const created = await prisma.event.create({
        data: {
          slug: seed.slug,
          title: seed.title,
          summary: seed.summary,
          description: seed.description,
          heroImageUrl: seed.heroImageUrl,
          showDuration: seed.showDuration,
          isPublished: true,
          listBuyItems: { create: seed.listBuyItems },
          setlistItems: { create: seed.setlistItems },
        },
      });
      eventIds[seed.slug] = created.id;
      continue;
    }

    // Event already existed — sync its ListBuy items individually (idempotent by name),
    // and drop any stale items left over from a renamed/repurposed event (e.g. the old
    // "Tiệc Hồi Môn" combos that don't belong to "Các Loại Dịch Vụ Khác").
    const seedNames = new Set(seed.listBuyItems.map((i) => i.name));
    const currentItems = await prisma.eventListBuyItem.findMany({ where: { eventId: eventIds[seed.slug] } });
    for (const stale of currentItems.filter((i) => !seedNames.has(i.name))) {
      await prisma.eventListBuyItem.delete({ where: { id: stale.id } }).catch(() => {
        // Ignore FK errors (item referenced by an existing booking) — leave it in place.
      });
    }
    for (const item of seed.listBuyItems) {
      const existingItem = await prisma.eventListBuyItem.findFirst({
        where: { eventId: eventIds[seed.slug], name: item.name },
      });
      if (existingItem) {
        await prisma.eventListBuyItem.update({ where: { id: existingItem.id }, data: item });
      } else {
        await prisma.eventListBuyItem.create({ data: { ...item, eventId: eventIds[seed.slug] } });
      }
    }

    // Sync demo setlist the same way (idempotent by title) — only seeded once;
    // once the admin has edited a song, re-running seed just leaves their edits alone
    // unless the title still matches a seed entry exactly.
    const currentSongs = await prisma.setlistItem.findMany({ where: { eventId: eventIds[seed.slug] } });
    if (currentSongs.length === 0) {
      for (const song of seed.setlistItems) {
        await prisma.setlistItem.create({ data: { ...song, eventId: eventIds[seed.slug] } });
      }
    }
  }

  // Rename from an earlier seed pass so it matches by name below instead of duplicating.
  const oldPga = await prisma.partner.findFirst({ where: { name: "PGA Golf Vietnam" } });
  if (oldPga) {
    await prisma.partner.update({ where: { id: oldPga.id }, data: { name: "PGA of America Golf Shop Vietnam" } });
  }

  // Matches the partner list on the live site (3thegear.chartedconsultants.com).
  const seedPartners = [
    { name: "Prudential", logoUrl: "/3thegear-photos/logos/prudential.png", sortOrder: 1 },
    { name: "Yokogawa", logoUrl: "/3thegear-photos/logos/yokogawa.svg", sortOrder: 2 },
    { name: "Medtronic", logoUrl: "/3thegear-photos/logos/medtronic.svg", sortOrder: 3 },
    { name: "PGA of America Golf Shop Vietnam", logoUrl: "/3thegear-photos/logos/pga-golf.png", sortOrder: 4 },
    { name: "OUCRU", logoUrl: "/3thegear-photos/logos/oucru.png", sortOrder: 5 },
    { name: "AZ Architects", logoUrl: "/3thegear-photos/logos/az-architects.png", sortOrder: 6 },
    { name: "SOS Group", logoUrl: "/3thegear-photos/logos/sos-group.png", sortOrder: 7 },
    { name: "Bamboo Village Resort & Spa", logoUrl: "/3thegear-photos/logos/bamboo-village.png", sortOrder: 8 },
  ];
  for (const p of seedPartners) {
    const existing = await prisma.partner.findFirst({ where: { name: p.name } });
    if (existing) {
      await prisma.partner.update({ where: { id: existing.id }, data: p });
    } else {
      await prisma.partner.create({ data: p });
    }
  }

  // Populate the Gallery with real photos already on hand from the original photo shoot.
  const seedGalleryPhotos = [
    "photo-26.jpg", "photo-30.jpg", "photo-34.jpg", "photo-36.jpg", "photo-37.jpg",
    "photo-38.jpg", "photo-40.jpg", "photo-41.jpg", "photo-43.jpg", "photo-45.jpg",
    "photo-47.jpg", "photo-49.jpg", "photo-50.jpg", "photo-53.jpg", "photo-57.jpg",
    "photo-58.jpg", "photo-64.jpg", "photo-66.jpg", "photo-67.jpg", "photo-68.jpg",
  ];
  for (let i = 0; i < seedGalleryPhotos.length; i++) {
    const url = `/3thegear-photos/img/${seedGalleryPhotos[i]}`;
    const existing = await prisma.galleryItem.findFirst({ where: { url } });
    if (!existing) {
      await prisma.galleryItem.create({ data: { type: "photo", url, sortOrder: i } });
    }
  }

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      bankName: "Vietcombank (Demo)",
      accountNumber: "0000000000",
      accountName: "3THEGEAR BAND",
      contactPhone: "0965528281",
      contactEmail: "3thegear.pt@gmail.com",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
