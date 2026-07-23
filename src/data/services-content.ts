import { Lang } from "@/lib/lang-context";

export type T = Record<Lang, string>;
export type TList = Record<Lang, string[]>;

export interface PricingPackage {
  name: T;
  price: T;
  includes: TList;
  suited: T;
}

export interface PriceListRow {
  label: T;
  price: T;
}

export interface ServicePage {
  slug: string;
  label: string;
  heroImage: string;
  tagline: T;
  intro: T;
  // Specific bookable sub-services shown in the "Loại Dịch Vụ" selector on
  // /calendar (QuickInquiryForm) — kept separate from `sections` below since
  // those are free-form marketing content, not a fixed option list.
  subServices: T[];
  // Slug of the DB Event this group page books through (real priced packages
  // + calendar booking form), if any. When set, /dich-vu/[slug]/page.tsx
  // fetches that Event and renders its live packages + BookingForm directly
  // on this page instead of the Event needing its own separate /events/[slug]
  // listing under the "3TG Event" group.
  bookableEventSlug?: string;
  // Other DB Event slugs that redirect to this group page too but don't have
  // their own priced packages to book — only their description gets folded
  // into the page (after the bookableEventSlug event's description, if any),
  // so real written content isn't lost when their /events/[slug] page goes away.
  mergedEventSlugs?: string[];
  sections: {
    heading: T;
    body?: T;
    items?: TList;
    packages?: PricingPackage[];
    priceList?: PriceListRow[];
    note?: T;
  }[];
  testimonial?: { quote: T; author: T };
}

// Items whose wording is identical across languages (genre names, proper
// nouns/people names) — replicated per-language so callers never need to
// branch on "is this translated or not".
function sameForAllLangs(items: string[]): TList {
  return { vi: items, en: items, ru: items, zh: items, ko: items };
}

// "3TG Event" isn't in SERVICE_PAGES (its content is DB-driven — see
// src/app/dich-vu/[slug]/page.tsx), but the homepage group-card grid and the
// event detail page's hero both need its label/image/tagline, so it lives
// here as the shared source of truth for that summary info.
export const EVENT_GROUP = {
  slug: "event",
  label: "3TG Event",
  heroImage: "/3thegear-photos/img/photo-74.jpg",
  tagline: {
    vi: "Tổ Chức Sự Kiện Trọn Gói",
    en: "Full-Service Event Organization",
    ru: "Полная организация мероприятий",
    zh: "全方位活动策划",
    ko: "토탈 이벤트 기획",
  } as T,
  intro: {
    vi: "Âm thanh, ánh sáng, sân khấu, đội ngũ tổ chức - 3TG Event đứng sau các loại tiệc dưới đây, từ tiệc cá nhân đến gala doanh nghiệp quy mô lớn. Khởi điểm chỉ từ 2.500.000đ cho các buổi tiệc quy mô nhỏ - liên hệ hotline/Zalo để được tư vấn báo giá theo từng sự kiện.",
    en: "Sound, lighting, staging, and a full organizing team - 3TG Event is behind every event type below, from private parties to large-scale corporate galas. Starting from just 2,500,000 VND for small-scale parties - contact us via hotline/Zalo for a quote per event.",
    ru: "Звук, свет, сцена и команда организаторов - 3TG Event стоит за каждым из мероприятий ниже, от частных праздников до крупных корпоративных гала-вечеров. Всего от 2 500 000 донгов для небольших торжеств - свяжитесь с нами по горячей линии/Zalo для расчёта по вашему мероприятию.",
    zh: "音响、灯光、舞台与专业执行团队 - 3TG Event 是以下各类活动的幕后支持，从私人派对到大型企业晚宴皆可胜任。小型派对最低仅需250万越南盾起 - 请通过热线/Zalo联系获取活动报价。",
    ko: "음향, 조명, 무대, 기획팀까지 - 3TG Event가 아래의 모든 행사를 함께합니다. 소규모 파티부터 대형 기업 갈라까지. 소규모 파티는 250만 동부터 시작 - 행사별 견적은 핫라인/Zalo로 문의해 주세요.",
  } as T,
};

// Content for the 3 non-bookable service groups, pulled from the band's
// original static site (TENDER/3thegear-band-*.html) where real copy exists —
// genres, lineup, and past-partner highlights are not placeholder text.
// "3TG Event" pulls its bookable event types from the live Event table
// instead (see src/app/dich-vu/[slug]/page.tsx), so it isn't listed here.
// Proper nouns (people, brand/venue names, genre names already in English)
// are intentionally left untranslated across languages.
export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "band",
    label: "3TG Band",
    heroImage: "/3thegear-photos/img/photo-58.jpg",
    bookableEventSlug: "live-band-for-event",
    mergedEventSlugs: ["booking-acoustic-band", "band"],
    tagline: {
      vi: "Live Band Đa Phong Cách",
      en: "Multi-Genre Live Band",
      ru: "Мульти-жанровая live-группа",
      zh: "多风格现场乐队",
      ko: "다장르 라이브 밴드",
    },
    intro: {
      vi: "Ban nhạc biểu diễn trực tiếp cho mọi quy mô sự kiện - từ đêm acoustic ấm cúng đến gala dinner của các tập đoàn đa quốc gia như Prudential, Yokogawa và Medtronic.",
      en: "A live band for events of any scale - from cozy acoustic nights to gala dinners for multinational corporations like Prudential, Yokogawa, and Medtronic.",
      ru: "Live-группа для мероприятий любого масштаба - от уютных акустических вечеров до гала-ужинов транснациональных корпораций, таких как Prudential, Yokogawa и Medtronic.",
      zh: "为各种规模的活动提供现场演出 - 从温馨的原声之夜到跨国企业（如保诚、横河、美敦力）的晚宴演出，皆能胜任。",
      ko: "모든 규모의 이벤트를 위한 라이브 밴드 - 아늑한 어쿠스틱 나이트부터 Prudential, Yokogawa, Medtronic 같은 다국적 기업의 갈라 디너까지.",
    },
    subServices: [
      { vi: "Duo Acoustic", en: "Duo Acoustic", ru: "Duo Acoustic", zh: "二人木吉他组合", ko: "듀오 어쿠스틱" },
      {
        vi: "Full Band (Nhiều Thể Loại)",
        en: "Full Band (Multi-Genre)",
        ru: "Полный состав (мульти-жанр)",
        zh: "全乐队（多风格）",
        ko: "풀 밴드 (다장르)",
      },
    ],
    sections: [
      {
        heading: {
          vi: "Phong Cách Âm Nhạc",
          en: "Music Styles",
          ru: "Музыкальные стили",
          zh: "音乐风格",
          ko: "음악 스타일",
        },
        items: sameForAllLangs(["Ballad", "Rock n' Roll", "Flamenco", "Bossa Nova", "Latin", "Disco & Funk", "Soul Blues 70s–80s", "EDM with Saxophone"]),
      },
      {
        heading: {
          vi: "Đội Hình",
          en: "Lineup",
          ru: "Состав",
          zh: "阵容",
          ko: "라인업",
        },
        items: sameForAllLangs([
          "Guitarist",
          "Bassist",
          "Vocalist",
          "Keyboard",
          "Drummer",
        ]),
      },
    ],
    testimonial: {
      quote: {
        vi: "Dear Band và Bo, cám ơn mọi người đã đến và chơi những bản nhạc thật hay cho tiệc cưới của tụi mình. Cám ơn Band thật nhiều.",
        en: "Dear Band and Bo, thank you all for coming and playing such wonderful music at our wedding. Thank you so much, Band.",
        ru: "Дорогая группа и Бо, спасибо всем, что пришли и сыграли такую прекрасную музыку на нашей свадьбе. Большое спасибо, группа.",
        zh: "亲爱的乐队和Bo，谢谢你们在我们婚礼上演奏了如此动听的音乐。非常感谢乐队。",
        ko: "밴드와 Bo에게, 저희 결혼식에 와서 정말 멋진 음악을 연주해 주셔서 감사합니다. 밴드 여러분 정말 고맙습니다.",
      },
      author: {
        vi: "Quốc Thông & Lan Thảo - Đám cưới tại Mia Saigon",
        en: "Quốc Thông & Lan Thảo - Wedding at Mia Saigon",
        ru: "Куок Тхонг и Лан Тхао - свадьба в Mia Saigon",
        zh: "Quốc Thông & Lan Thảo - 婚礼于Mia Saigon举行",
        ko: "Quốc Thông & Lan Thảo - Mia Saigon에서의 결혼식",
      },
    },
  },
  {
    slug: "sound-lighting",
    label: "3TG Sound & Lighting",
    heroImage: "/3thegear-photos/img/photo-64.jpg",
    bookableEventSlug: "cung-cap-am-thanh-anh-sang",
    tagline: {
      vi: "Hệ Thống Âm Thanh & Ánh Sáng Chuyên Nghiệp",
      en: "Professional Sound & Lighting Systems",
      ru: "Профессиональные звуковые и световые системы",
      zh: "专业音响与灯光系统",
      ko: "전문 음향 & 조명 시스템",
    },
    intro: {
      vi: "Hệ thống âm thanh, ánh sáng sân khấu vận hành chuyên nghiệp, đứng sau mỗi đêm diễn của 3TG - từ gala doanh nghiệp đến sân khấu ngoài trời quy mô lớn.",
      en: "Professionally operated sound and stage lighting systems behind every 3TG show - from corporate galas to large-scale outdoor stages.",
      ru: "Профессионально управляемые звуковые и световые системы сцены, стоящие за каждым выступлением 3TG - от корпоративных гала-вечеров до масштабных открытых сцен.",
      zh: "专业运营的音响与舞台灯光系统，支持每一场3TG演出 - 从企业晚宴到大型户外舞台皆能胜任。",
      ko: "모든 3TG 공연을 뒷받침하는 전문 음향·무대 조명 시스템 - 기업 갈라부터 대형 야외 무대까지.",
    },
    subServices: [
      { vi: "Hệ thống âm thanh sân khấu", en: "Stage sound system", ru: "Звуковая система сцены", zh: "舞台音响系统", ko: "무대 음향 시스템" },
      {
        vi: "Ánh sáng sân khấu & hiệu ứng",
        en: "Stage lighting & effects",
        ru: "Сценическое освещение и эффекты",
        zh: "舞台灯光与特效",
        ko: "무대 조명 & 이펙트",
      },
      { vi: "Màn hình LED", en: "LED screens", ru: "LED-экраны", zh: "LED屏幕", ko: "LED 스크린" },
      {
        vi: "Thiết bị cho hội nghị / gala",
        en: "Conference / gala equipment",
        ru: "Оборудование для конференций / гала",
        zh: "会议/晚宴设备",
        ko: "컨퍼런스/갈라 장비",
      },
    ],
    sections: [
      {
        heading: { vi: "Hạng Mục", en: "Categories", ru: "Категории", zh: "服务项目", ko: "항목" },
        items: {
          vi: ["Hệ thống âm thanh sân khấu", "Ánh sáng sân khấu & hiệu ứng", "Màn hình LED", "Thiết bị cho hội nghị / gala"],
          en: ["Stage sound system", "Stage lighting & effects", "LED screens", "Conference / gala equipment"],
          ru: ["Звуковая система сцены", "Сценическое освещение и эффекты", "LED-экраны", "Оборудование для конференций / гала"],
          zh: ["舞台音响系统", "舞台灯光与特效", "LED屏幕", "会议/晚宴设备"],
          ko: ["무대 음향 시스템", "무대 조명 & 이펙트", "LED 스크린", "컨퍼런스/갈라 장비"],
        },
      },
      {
        heading: { vi: "Dự Án Tiêu Biểu", en: "Featured Projects", ru: "Избранные проекты", zh: "代表项目", ko: "대표 프로젝트" },
        items: {
          vi: [
            "Sân khấu LED tunnel - đêm countdown chào năm mới 2026",
            "Sân khấu hình thuyền buồm - Bamboo Village Resort",
            "Gala Dinner Medtronic & Yokogawa - hệ thống LED sân khấu toàn phần",
          ],
          en: [
            "LED tunnel stage - 2026 New Year countdown night",
            "Sailboat-shaped stage - Bamboo Village Resort",
            "Medtronic & Yokogawa Gala Dinner - full LED stage system",
          ],
          ru: [
            "LED-туннель сцены - новогодняя ночь обратного отсчёта 2026",
            "Сцена в форме парусника - Bamboo Village Resort",
            "Гала-ужин Medtronic & Yokogawa - полная LED-система сцены",
          ],
          zh: [
            "LED隧道舞台 - 2026跨年倒数之夜",
            "帆船造型舞台 - Bamboo Village Resort",
            "美敦力与横河晚宴 - 全场LED舞台系统",
          ],
          ko: [
            "LED 터널 무대 - 2026 새해 카운트다운 나이트",
            "범선 모양 무대 - Bamboo Village Resort",
            "Medtronic & Yokogawa 갈라 디너 - 풀 LED 무대 시스템",
          ],
        },
      },
      {
        heading: { vi: "Bảng Giá Ánh Sáng", en: "Lighting Pricing", ru: "Цены на освещение", zh: "灯光报价", ko: "조명 가격" },
        priceList: [
          {
            label: {
              vi: "Sân khấu gỗ Pallet (đã bao gồm thảm lót)",
              en: "Wooden pallet stage (mat included)",
              ru: "Сцена из деревянных паллет (с ковровым покрытием)",
              zh: "木栈板舞台（含地毯）",
              ko: "우드 팔레트 무대 (카펫 포함)",
            },
            price: { vi: "240.000đ/m²", en: "240,000 VND/m²", ru: "240 000 донгов/м²", zh: "240,000越南盾/m²", ko: "240,000동/m²" },
          },
          {
            label: {
              vi: "Parled đa màu",
              en: "Multi-color PAR LED",
              ru: "Мульти-цветные PAR LED",
              zh: "多彩帕灯",
              ko: "멀티컬러 파라이트",
            },
            price: { vi: "550.000đ/trụ (4 đèn)", en: "550,000 VND/stand (4 lights)", ru: "550 000 донгов/стойка (4 лампы)", zh: "550,000越南盾/组（4灯）", ko: "550,000동/세트 (조명 4개)" },
          },
          {
            label: { vi: "Beam hiệu ứng", en: "Beam moving head", ru: "Луч-прожектор (Beam)", zh: "光束摇头灯", ko: "빔 무빙헤드" },
            price: { vi: "500.000đ/cây", en: "500,000 VND/unit", ru: "500 000 донгов/шт", zh: "500,000越南盾/支", ko: "500,000동/대" },
          },
          {
            label: { vi: "Backdrop sân khấu", en: "Stage backdrop", ru: "Задник сцены", zh: "舞台背景幕布", ko: "무대 백드롭" },
            price: { vi: "270.000đ/m²", en: "270,000 VND/m²", ru: "270 000 донгов/м²", zh: "270,000越南盾/m²", ko: "270,000동/m²" },
          },
          {
            label: { vi: "Máy tạo khói hiệu ứng", en: "Fog/smoke machine", ru: "Дым-машина", zh: "烟雾特效机", ko: "연기 효과 머신" },
            price: { vi: "500.000đ/máy", en: "500,000 VND/unit", ru: "500 000 донгов/шт", zh: "500,000越南盾/台", ko: "500,000동/대" },
          },
        ],
        note: {
          vi: "* Đã bao gồm công setup.",
          en: "* Setup labor included.",
          ru: "* Включая монтаж.",
          zh: "* 已含安装费。",
          ko: "* 설치비 포함.",
        },
      },
    ],
  },
  {
    slug: "production",
    label: "3TG Production",
    heroImage: "/3thegear-photos/img/photo-72.jpg",
    bookableEventSlug: "san-xuat-noi-dung",
    tagline: {
      vi: "Media · Recap · Livestream",
      en: "Media · Recap · Livestream",
      ru: "Медиа · Репортаж · Прямой эфир",
      zh: "媒体 · 回顾 · 直播",
      ko: "미디어 · 리캡 · 라이브 스트리밍",
    },
    intro: {
      vi: "Ghi hình và sản xuất nội dung cho sự kiện của bạn - từ media hiện trường, video recap sau sự kiện, đến livestream trực tiếp.",
      en: "Filming and content production for your event - from on-site media to post-event recap videos and live streaming.",
      ru: "Съёмка и продакшн контента для вашего мероприятия - от медиа на месте до пост-репортажей и прямых трансляций.",
      zh: "为您的活动进行拍摄与内容制作 - 涵盖现场纪实、活动后回顾视频及直播。",
      ko: "이벤트를 위한 촬영 및 콘텐츠 제작 - 현장 미디어부터 행사 후 리캡 영상, 라이브 스트리밍까지.",
    },
    subServices: [
      {
        vi: "Media / quay chụp sự kiện",
        en: "Event media / photography",
        ru: "Медиа / фотосъёмка мероприятия",
        zh: "活动媒体/摄影",
        ko: "이벤트 미디어/촬영",
      },
      { vi: "Recap sau sự kiện", en: "Post-event recap", ru: "Пост-репортаж", zh: "活动后回顾", ko: "행사 후 리캡" },
      { vi: "Livestream trực tiếp", en: "Live streaming", ru: "Прямая трансляция", zh: "直播", ko: "라이브 스트리밍" },
    ],
    sections: [
      {
        heading: { vi: "Hạng Mục", en: "Categories", ru: "Категории", zh: "服务项目", ko: "항목" },
        items: {
          vi: ["Media / quay chụp sự kiện", "Recap sau sự kiện", "Livestream trực tiếp"],
          en: ["Event media / photography", "Post-event recap", "Live streaming"],
          ru: ["Медиа / фотосъёмка мероприятия", "Пост-репортаж", "Прямая трансляция"],
          zh: ["活动媒体/摄影", "活动后回顾", "直播"],
          ko: ["이벤트 미디어/촬영", "행사 후 리캡", "라이브 스트리밍"],
        },
      },
      {
        heading: {
          vi: "Thể Loại Nội Dung Đã Sản Xuất",
          en: "Content We've Produced",
          ru: "Созданный контент",
          zh: "已制作内容类型",
          ko: "제작한 콘텐츠 유형",
        },
        items: {
          vi: ["Gala Dinner & Sự Kiện Doanh Nghiệp", "Latin & Disco Night", "Guitar Duo Special Night", "Acoustic Vibes"],
          en: ["Gala Dinner & Corporate Events", "Latin & Disco Night", "Guitar Duo Special Night", "Acoustic Vibes"],
          ru: ["Гала-ужины и корпоративные мероприятия", "Latin & Disco Night", "Guitar Duo Special Night", "Acoustic Vibes"],
          zh: ["晚宴与企业活动", "Latin & Disco Night", "Guitar Duo Special Night", "Acoustic Vibes"],
          ko: ["갈라 디너 & 기업 행사", "Latin & Disco Night", "Guitar Duo Special Night", "Acoustic Vibes"],
        },
      },
    ],
  },
];
