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
      {
        heading: { vi: "Bảng Giá Tham Khảo", en: "Reference Pricing", ru: "Ориентировочные цены", zh: "参考报价", ko: "참고 견적" },
        packages: [
          {
            name: {
              vi: "Gói Duo Acoustic",
              en: "Duo Acoustic Package",
              ru: "Пакет Duo Acoustic",
              zh: "二人木吉他套餐",
              ko: "듀오 어쿠스틱 패키지",
            },
            price: {
              vi: "2.500.000đ / show",
              en: "2,500,000 VND / show",
              ru: "2 500 000 донгов / шоу",
              zh: "250万越南盾 / 场",
              ko: "250만 동 / 공연",
            },
            includes: {
              vi: ["1 guitarist", "1 ca sĩ", "Set nhạc 45-60 phút"],
              en: ["1 guitarist", "1 vocalist", "45-60 minute set"],
              ru: ["1 гитарист", "1 вокалист", "Сет 45-60 минут"],
              zh: ["1名吉他手", "1名歌手", "45-60分钟演出"],
              ko: ["기타리스트 1인", "보컬 1인", "45-60분 공연"],
            },
            suited: {
              vi: "Phù hợp tiệc gia đình, khai trương nhỏ, sự kiện thân mật dưới 50 khách.",
              en: "Suited to family gatherings, small openings, intimate events under 50 guests.",
              ru: "Подходит для семейных торжеств, небольших открытий, камерных мероприятий до 50 гостей.",
              zh: "适合家庭聚会、小型开业典礼、50人以下的私密活动。",
              ko: "가족 모임, 소규모 오픈 행사, 50명 이하의 소규모 행사에 적합.",
            },
          },
          {
            name: {
              vi: "Trio / Acoustic Band",
              en: "Trio / Acoustic Band",
              ru: "Trio / Acoustic Band",
              zh: "三人 / 木吉他乐队",
              ko: "트리오 / 어쿠스틱 밴드",
            },
            price: {
              vi: "4.500.000đ / show",
              en: "4,500,000 VND / show",
              ru: "4 500 000 донгов / шоу",
              zh: "450万越南盾 / 场",
              ko: "450만 동 / 공연",
            },
            includes: {
              vi: ["2-3 nhạc công (guitar, bass/cajon, keyboard)", "1 ca sĩ", "Set nhạc 60-90 phút, nhiều thể loại"],
              en: ["2-3 musicians (guitar, bass/cajon, keyboard)", "1 vocalist", "60-90 minute set, multiple genres"],
              ru: ["2-3 музыканта (гитара, бас/кахон, клавиши)", "1 вокалист", "Сет 60-90 минут, разные жанры"],
              zh: ["2-3名乐手（吉他、贝斯/木箱鼓、键盘）", "1名歌手", "60-90分钟演出，多种曲风"],
              ko: ["연주자 2-3인 (기타, 베이스/카혼, 키보드)", "보컬 1인", "60-90분 공연, 다양한 장르"],
            },
            suited: {
              vi: "Phù hợp tiệc cưới nhỏ, khai trương, sự kiện 50-150 khách.",
              en: "Suited to small weddings, openings, events of 50-150 guests.",
              ru: "Подходит для небольших свадеб, открытий, мероприятий на 50-150 гостей.",
              zh: "适合小型婚礼、开业典礼、50-150人活动。",
              ko: "소규모 결혼식, 오픈 행사, 50-150명 행사에 적합.",
            },
          },
          {
            name: {
              vi: "Full Band",
              en: "Full Band",
              ru: "Full Band",
              zh: "全乐队",
              ko: "풀 밴드",
            },
            price: {
              vi: "8.000.000đ / show",
              en: "8,000,000 VND / show",
              ru: "8 000 000 донгов / шоу",
              zh: "800万越南盾 / 场",
              ko: "800만 동 / 공연",
            },
            includes: {
              vi: ["Full 5 vị trí: guitar, bass, keyboard, trống, ca sĩ", "Nhiều thể loại: Latin, Pop, Rock, EDM", "Set nhạc theo yêu cầu chương trình"],
              en: ["Full 5-piece: guitar, bass, keyboard, drums, vocalist", "Multiple genres: Latin, Pop, Rock, EDM", "Setlist tailored to your program"],
              ru: ["Полный состав из 5: гитара, бас, клавиши, барабаны, вокал", "Разные жанры: Latin, Pop, Rock, EDM", "Программа под ваше мероприятие"],
              zh: ["完整5人：吉他、贝斯、键盘、鼓、歌手", "多种曲风：Latin、Pop、Rock、EDM", "根据活动定制曲目"],
              ko: ["5인 풀 구성: 기타, 베이스, 키보드, 드럼, 보컬", "다양한 장르: Latin, Pop, Rock, EDM", "행사 맞춤 셋리스트"],
            },
            suited: {
              vi: "Phù hợp tiệc cưới, gala, sự kiện doanh nghiệp 150-400 khách.",
              en: "Suited to weddings, galas, corporate events of 150-400 guests.",
              ru: "Подходит для свадеб, гала, корпоративов на 150-400 гостей.",
              zh: "适合婚礼、晚宴、150-400人企业活动。",
              ko: "결혼식, 갈라, 150-400명 기업 행사에 적합.",
            },
          },
          {
            name: {
              vi: "Full Band + Âm thanh & Ánh sáng",
              en: "Full Band + Sound & Lighting",
              ru: "Full Band + звук и свет",
              zh: "全乐队 + 音响灯光",
              ko: "풀 밴드 + 음향 & 조명",
            },
            price: {
              vi: "12.000.000đ / show",
              en: "12,000,000 VND / show",
              ru: "12 000 000 донгов / шоу",
              zh: "1200万越南盾 / 场",
              ko: "1,200만 동 / 공연",
            },
            includes: {
              vi: ["Full band 5 vị trí", "Trọn gói âm thanh - ánh sáng - sân khấu", "Soundman + vận hành kỹ thuật"],
              en: ["Full 5-piece band", "Complete sound - lighting - staging package", "Soundman + technical operation"],
              ru: ["Полный состав из 5", "Полный пакет звук - свет - сцена", "Звукооператор + техобслуживание"],
              zh: ["完整5人乐队", "音响-灯光-舞台整套", "音响师 + 技术运营"],
              ko: ["5인 풀 밴드", "음향-조명-무대 풀패키지", "사운드맨 + 기술 운영"],
            },
            suited: {
              vi: "Phù hợp sự kiện lớn, gala, liveshow ngoài trời.",
              en: "Suited to large events, galas, outdoor live shows.",
              ru: "Подходит для крупных мероприятий, гала, лайв-шоу на открытом воздухе.",
              zh: "适合大型活动、晚宴、户外演出。",
              ko: "대형 행사, 갈라, 야외 라이브쇼에 적합.",
            },
          },
        ],
        note: {
          vi: "Giá trên là tham khảo, có thể thay đổi theo chương trình & số thành viên. Yêu cầu đặc biệt: liên hệ hotline/Zalo để được báo giá riêng.",
          en: "Full band, multiple genres, larger scale: contact us via hotline/Zalo for a custom quote per event.",
          ru: "Полный состав группы, разные жанры, больший масштаб: свяжитесь с нами по горячей линии/Zalo для индивидуального расчёта.",
          zh: "多风格全乐队、更大规模：请通过热线/Zalo联系获取活动专属报价。",
          ko: "다장르 풀 밴드, 더 큰 규모: 행사별 맞춤 견적은 핫라인/Zalo로 문의해 주세요.",
        },
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
        heading: { vi: "Bảng Giá Tham Khảo", en: "Reference Pricing", ru: "Ориентировочные цены", zh: "参考报价", ko: "참고 견적" },
        packages: [
          {
            name: {
              vi: "Gói Ưu Đãi 2tr5",
              en: "2.5M VND Special Package",
              ru: "Специальный пакет 2,5 млн",
              zh: "250万特惠套餐",
              ko: "250만동 특가 패키지",
            },
            price: {
              vi: "2.500.000đ / show",
              en: "2,500,000 VND / show",
              ru: "2 500 000 донгов / шоу",
              zh: "250万越南盾 / 场",
              ko: "250만 동 / 공연",
            },
            includes: {
              vi: ["1 cặp loa Full HT-Sound 1200W", "1 loa Sub RCF 850W", "1 cặp micro Morgan MG35", "1 mixer Dynacort CMS600", "1 soundman kiêm phát nhạc"],
              en: ["1 pair HT-Sound 1200W speakers", "1 RCF 850W subwoofer", "1 pair Morgan MG35 microphones", "1 Dynacort CMS600 mixer", "1 soundman/music operator"],
              ru: ["1 пара колонок HT-Sound 1200 Вт", "1 сабвуфер RCF 850 Вт", "1 пара микрофонов Morgan MG35", "1 микшер Dynacort CMS600", "1 звукооператор"],
              zh: ["1对HT-Sound 1200W音箱", "1个RCF 850W低音炮", "1对Morgan MG35麦克风", "1台Dynacort CMS600调音台", "1名音响师兼放歌"],
              ko: ["HT-Sound 1200W 스피커 1쌍", "RCF 850W 서브우퍼 1대", "Morgan MG35 마이크 1쌍", "Dynacort CMS600 믹서 1대", "사운드맨 겸 음악 재생 1인"],
            },
            suited: {
              vi: "Phù hợp sự kiện ngoài trời tối đa 150-200 khách.",
              en: "Suited to outdoor events up to 150-200 guests.",
              ru: "Подходит для мероприятий на открытом воздухе до 150-200 гостей.",
              zh: "适合150-200人以内的户外活动。",
              ko: "150-200명 이하 야외 행사에 적합.",
            },
          },
          {
            name: { vi: "Option 2", en: "Option 2", ru: "Option 2", zh: "Option 2", ko: "Option 2" },
            price: {
              vi: "4.000.000đ / show",
              en: "4,000,000 VND / show",
              ru: "4 000 000 донгов / шоу",
              zh: "400万越南盾 / 场",
              ko: "400만 동 / 공연",
            },
            includes: {
              vi: ["1 cặp loa Full HT-Sound 1200W", "1 cặp loa Sub 50 RCF 850W", "1 cặp micro Morgan MG35", "1 mixer Midas M32R", "1 soundman + laptop phát nhạc", "1 in-ear cho ca sĩ hát beat"],
              en: ["1 pair HT-Sound 1200W full speakers", "1 pair Sub 50 RCF 850W subwoofers", "1 pair Morgan MG35 microphones", "1 Midas M32R mixer", "1 soundman + music laptop", "1 in-ear for singer"],
              ru: ["1 пара колонок HT-Sound 1200 Вт", "1 пара сабвуферов Sub 50 RCF 850 Вт", "1 пара микрофонов Morgan MG35", "1 микшер Midas M32R", "1 звукооператор + ноутбук", "1 in-ear для вокалиста"],
              zh: ["1对HT-Sound 1200W全频音箱", "1对Sub 50 RCF 850W低音炮", "1对Morgan MG35麦克风", "1台Midas M32R调音台", "1名音响师+放歌笔记本", "1个歌手返听耳机"],
              ko: ["HT-Sound 1200W 풀레인지 스피커 1쌍", "Sub 50 RCF 850W 서브우퍼 1쌍", "Morgan MG35 마이크 1쌍", "Midas M32R 믹서 1대", "사운드맨 + 음악 노트북 1인", "가수용 인이어 1개"],
            },
            suited: {
              vi: "Phù hợp sự kiện 300-500 khách.",
              en: "Suited to events of 300-500 guests.",
              ru: "Подходит для мероприятий на 300-500 гостей.",
              zh: "适合300-500人的活动。",
              ko: "300-500명 행사에 적합.",
            },
          },
          {
            name: { vi: "Option 3", en: "Option 3", ru: "Option 3", zh: "Option 3", ko: "Option 3" },
            price: {
              vi: "5.000.000đ / show",
              en: "5,000,000 VND / show",
              ru: "5 000 000 донгов / шоу",
              zh: "500万越南盾 / 场",
              ko: "500만 동 / 공연",
            },
            includes: {
              vi: ["1 cặp loa Full HT-Sound 1200W", "1 cặp loa Sub 50 RCF 850W", "1 cặp monitor sân khấu 850W", "1 cặp micro Morgan MG35", "1 mixer Midas M32R", "1 soundman + laptop, 1 in-ear ca sĩ"],
              en: ["1 pair HT-Sound 1200W full speakers", "1 pair Sub 50 RCF 850W subwoofers", "1 pair 850W stage monitors", "1 pair Morgan MG35 microphones", "1 Midas M32R mixer", "1 soundman + laptop, 1 in-ear"],
              ru: ["1 пара колонок HT-Sound 1200 Вт", "1 пара сабвуферов Sub 50 RCF 850 Вт", "1 пара сценических мониторов 850 Вт", "1 пара микрофонов Morgan MG35", "1 микшер Midas M32R", "1 звукооператор + ноутбук, 1 in-ear"],
              zh: ["1对HT-Sound 1200W全频音箱", "1对Sub 50 RCF 850W低音炮", "1对850W舞台返听音箱", "1对Morgan MG35麦克风", "1台Midas M32R调音台", "1名音响师+笔记本，1个返听耳机"],
              ko: ["HT-Sound 1200W 풀레인지 스피커 1쌍", "Sub 50 RCF 850W 서브우퍼 1쌍", "850W 무대 모니터 1쌍", "Morgan MG35 마이크 1쌍", "Midas M32R 믹서 1대", "사운드맨 + 노트북, 인이어 1개"],
            },
            suited: {
              vi: "Phù hợp sự kiện 300-500 khách, có monitor cho ca sĩ.",
              en: "Suited to 300-500 guests, with stage monitors.",
              ru: "Подходит для 300-500 гостей, со сценическими мониторами.",
              zh: "适合300-500人，配备舞台返听。",
              ko: "300-500명, 무대 모니터 포함.",
            },
          },
          {
            name: { vi: "Option 4", en: "Option 4", ru: "Option 4", zh: "Option 4", ko: "Option 4" },
            price: {
              vi: "5.500.000đ / show",
              en: "5,500,000 VND / show",
              ru: "5 500 000 донгов / шоу",
              zh: "550万越南盾 / 场",
              ko: "550만 동 / 공연",
            },
            includes: {
              vi: ["2 cặp Line Array HT-Sound 1250W", "1 cặp loa Sub 50 RCF 850W", "1 cặp monitor sân khấu 850W", "1 mixer Midas M32R", "1 tủ nguồn cho toàn hệ thống", "1 soundman + laptop, 2 in-ear ca sĩ"],
              en: ["2 pairs HT-Sound 1250W line array", "1 pair Sub 50 RCF 850W subwoofers", "1 pair 850W stage monitors", "1 Midas M32R mixer", "1 power distribution rack", "1 soundman + laptop, 2 in-ears"],
              ru: ["2 пары линейного массива HT-Sound 1250 Вт", "1 пара сабвуферов Sub 50 RCF 850 Вт", "1 пара сценических мониторов 850 Вт", "1 микшер Midas M32R", "1 стойка электропитания", "1 звукооператор + ноутбук, 2 in-ear"],
              zh: ["2对HT-Sound 1250W线阵音箱", "1对Sub 50 RCF 850W低音炮", "1对850W舞台返听音箱", "1台Midas M32R调音台", "1个全系统供电机柜", "1名音响师+笔记本，2个返听耳机"],
              ko: ["HT-Sound 1250W 라인어레이 2쌍", "Sub 50 RCF 850W 서브우퍼 1쌍", "850W 무대 모니터 1쌍", "Midas M32R 믹서 1대", "전체 시스템 전원 랙 1대", "사운드맨 + 노트북, 인이어 2개"],
            },
            suited: {
              vi: "Phù hợp sự kiện 500-700 khách với dàn Line Array.",
              en: "Suited to 500-700 guests with a line array system.",
              ru: "Подходит для 500-700 гостей с линейным массивом.",
              zh: "适合500-700人，配备线阵系统。",
              ko: "500-700명, 라인어레이 시스템.",
            },
          },
          {
            name: { vi: "Option 5", en: "Option 5", ru: "Option 5", zh: "Option 5", ko: "Option 5" },
            price: {
              vi: "7.500.000đ / show",
              en: "7,500,000 VND / show",
              ru: "7 500 000 донгов / шоу",
              zh: "750万越南盾 / 场",
              ko: "750만 동 / 공연",
            },
            includes: {
              vi: ["4 loa Full HT-Sound 1200W", "4 loa Sub 50 RCF 850W", "4 loa monitor sân khấu 850W", "1 mixer Midas M32R", "1 tủ nguồn cho toàn hệ thống", "2 soundman + laptop, 2 in-ear ca sĩ"],
              en: ["4 HT-Sound 1200W full speakers", "4 Sub 50 RCF 850W subwoofers", "4 850W stage monitors", "1 Midas M32R mixer", "1 power distribution rack", "2 soundmen + laptop, 2 in-ears"],
              ru: ["4 колонки HT-Sound 1200 Вт", "4 сабвуфера Sub 50 RCF 850 Вт", "4 сценических монитора 850 Вт", "1 микшер Midas M32R", "1 стойка электропитания", "2 звукооператора + ноутбук, 2 in-ear"],
              zh: ["4只HT-Sound 1200W全频音箱", "4只Sub 50 RCF 850W低音炮", "4只850W舞台返听音箱", "1台Midas M32R调音台", "1个全系统供电机柜", "2名音响师+笔记本，2个返听耳机"],
              ko: ["HT-Sound 1200W 풀레인지 스피커 4대", "Sub 50 RCF 850W 서브우퍼 4대", "850W 무대 모니터 4대", "Midas M32R 믹서 1대", "전체 시스템 전원 랙 1대", "사운드맨 2인 + 노트북, 인이어 2개"],
            },
            suited: {
              vi: "Phù hợp sự kiện lớn 700-800 khách.",
              en: "Suited to large events of 700-800 guests.",
              ru: "Подходит для крупных мероприятий на 700-800 гостей.",
              zh: "适合700-800人的大型活动。",
              ko: "700-800명 대형 행사에 적합.",
            },
          },
          {
            name: { vi: "Option 6", en: "Option 6", ru: "Option 6", zh: "Option 6", ko: "Option 6" },
            price: {
              vi: "5.500.000đ / show",
              en: "5,500,000 VND / show",
              ru: "5 500 000 донгов / шоу",
              zh: "550万越南盾 / 场",
              ko: "550만 동 / 공연",
            },
            includes: {
              vi: ["1 cặp Full RCF 715 750W", "1 cặp Sub FPT 18SA 500W", "1 cặp monitor FPT XLITE112", "1 cặp micro SoundDX S800", "1 mixer Behringer Wingrack", "1 tủ nguồn, 1 soundman + laptop"],
              en: ["1 pair RCF 715 750W full speakers", "1 pair FPT 18SA 500W subwoofers", "1 pair FPT XLITE112 monitors", "1 pair SoundDX S800 microphones", "1 Behringer Wingrack mixer", "1 power rack, 1 soundman + laptop"],
              ru: ["1 пара колонок RCF 715 750 Вт", "1 пара сабвуферов FPT 18SA 500 Вт", "1 пара мониторов FPT XLITE112", "1 пара микрофонов SoundDX S800", "1 микшер Behringer Wingrack", "1 стойка питания, 1 звукооператор + ноутбук"],
              zh: ["1对RCF 715 750W全频音箱", "1对FPT 18SA 500W低音炮", "1对FPT XLITE112返听音箱", "1对SoundDX S800麦克风", "1台Behringer Wingrack调音台", "1个供电机柜，1名音响师+笔记本"],
              ko: ["RCF 715 750W 풀레인지 스피커 1쌍", "FPT 18SA 500W 서브우퍼 1쌍", "FPT XLITE112 모니터 1쌍", "SoundDX S800 마이크 1쌍", "Behringer Wingrack 믹서 1대", "전원 랙 1대, 사운드맨 + 노트북"],
            },
            suited: {
              vi: "Phù hợp sự kiện ~500 khách (dòng thiết bị RCF/FPT/Behringer).",
              en: "Suited to ~500 guests (RCF/FPT/Behringer gear line).",
              ru: "Подходит для ~500 гостей (оборудование RCF/FPT/Behringer).",
              zh: "适合约500人（RCF/FPT/Behringer设备线）。",
              ko: "약 500명 (RCF/FPT/Behringer 장비 라인).",
            },
          },
        ],
        note: {
          vi: "Giá đã bao gồm nhân sự, vận chuyển nội thành, setup & vận hành; chưa bao gồm VAT. Sự kiện trên 800 khách hoặc yêu cầu đặc biệt: liên hệ hotline/Zalo để được báo giá riêng.",
          en: "Prices include staff, in-city transport, setup & operation; VAT not included. Events over 800 guests or special requirements: contact us via hotline/Zalo for a custom quote.",
          ru: "Цены включают персонал, доставку по городу, монтаж и обслуживание; НДС не включён. Мероприятия свыше 800 гостей или особые требования: свяжитесь по горячей линии/Zalo для индивидуального расчёта.",
          zh: "价格已含人员、市内运输、安装与运营；不含增值税。800人以上活动或特殊需求：请通过热线/Zalo联系获取专属报价。",
          ko: "가격에는 인력, 시내 운송, 설치 및 운영이 포함됩니다(VAT 별도). 800명 이상 행사나 특별 요청은 핫라인/Zalo로 문의해 주세요.",
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
      {
        heading: { vi: "Bảng Giá Tham Khảo", en: "Reference Pricing", ru: "Ориентировочные цены", zh: "参考报价", ko: "참고 견적" },
        packages: [
          {
            name: {
              vi: "Gói Ghi Hình Cơ Bản",
              en: "Basic Filming Package",
              ru: "Базовый пакет съёмки",
              zh: "基础拍摄套餐",
              ko: "베이직 촬영 패키지",
            },
            price: {
              vi: "2.500.000đ / buổi",
              en: "2,500,000 VND / session",
              ru: "2 500 000 донгов / сессия",
              zh: "250万越南盾 / 场",
              ko: "250만 동 / 세션",
            },
            includes: {
              vi: ["1 quay phim + 1 chụp ảnh", "Video recap 3-5 phút", "Bàn giao trong 3 ngày"],
              en: ["1 videographer + 1 photographer", "3-5 minute recap video", "Delivered within 3 days"],
              ru: ["1 видеооператор + 1 фотограф", "Репортажное видео 3-5 минут", "Доставка в течение 3 дней"],
              zh: ["1名摄像+1名摄影师", "3-5分钟回顾视频", "3天内交付"],
              ko: ["촬영기사 1인 + 사진작가 1인", "3-5분 리캡 영상", "3일 내 전달"],
            },
            suited: {
              vi: "Phù hợp sự kiện nhỏ dưới 3 giờ.",
              en: "Suited to small events under 3 hours.",
              ru: "Подходит для небольших мероприятий до 3 часов.",
              zh: "适合3小时以内的小型活动。",
              ko: "3시간 이내의 소규모 행사에 적합.",
            },
          },
        ],
        note: {
          vi: "Livestream đa góc máy, ekip nhiều người, sự kiện quy mô lớn: liên hệ hotline/Zalo để được tư vấn báo giá riêng theo từng sự kiện.",
          en: "Multi-camera livestream, larger crew, large-scale events: contact us via hotline/Zalo for a custom quote per event.",
          ru: "Многокамерная прямая трансляция, большая команда, масштабные мероприятия: свяжитесь с нами по горячей линии/Zalo для индивидуального расчёта.",
          zh: "多机位直播、更大团队、大型活动：请通过热线/Zalo联系获取活动专属报价。",
          ko: "멀티캠 라이브 스트리밍, 대규모 인력, 대형 행사: 행사별 맞춤 견적은 핫라인/Zalo로 문의해 주세요.",
        },
      },
    ],
  },
];
