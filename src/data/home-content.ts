export interface PartnerLogo {
  name: string;
  logo: string;
  bg: "on-white" | "on-navy" | "on-black";
}

export const PARTNER_LOGOS: PartnerLogo[] = [
  { name: "Prudential", logo: "/3thegear-photos/logos/prudential.png", bg: "on-white" },
  { name: "Yokogawa", logo: "/3thegear-photos/logos/yokogawa.svg", bg: "on-white" },
  { name: "Medtronic", logo: "/3thegear-photos/logos/medtronic.svg", bg: "on-white" },
  { name: "PGA of America Golf Shop Vietnam", logo: "/3thegear-photos/logos/pga-golf.png", bg: "on-white" },
  { name: "OUCRU", logo: "/3thegear-photos/logos/oucru.png", bg: "on-navy" },
  { name: "AZ Architects", logo: "/3thegear-photos/logos/az-architects.png", bg: "on-white" },
  { name: "SOS Group", logo: "/3thegear-photos/logos/sos-group.png", bg: "on-black" },
  { name: "Bamboo Village Resort & Spa", logo: "/3thegear-photos/logos/bamboo-village.png", bg: "on-white" },
];

export interface ReviewFallback {
  customerName: string;
  quote: string;
  rating: number;
  eventType: string | null;
}

// Demo reviews shown until the band collects real customer testimonials via Admin → Đánh Giá.
export const DEMO_REVIEWS: ReviewFallback[] = [
  {
    customerName: "Minh Anh & Gia Bảo",
    quote:
      "Dear Band và Bo, cám ơn mọi người đã đến và chơi những bản nhạc thật hay cho tiệc cưới của tụi mình. Cám ơn Band thật nhiều.",
    rating: 5,
    eventType: "Tiệc cưới",
  },
  {
    customerName: "Chị Thu Hà",
    quote:
      "Ban nhạc chuyên nghiệp, đúng giờ, âm thanh ánh sáng setup rất đẹp. Khách dự tiệc ai cũng khen chương trình sôi động.",
    rating: 5,
    eventType: "Sự kiện doanh nghiệp",
  },
  {
    customerName: "Anh Quốc Huy",
    quote:
      "Đội ngũ 3TG hỗ trợ tư vấn nhiệt tình từ khâu chọn setlist đến lắp đặt sân khấu. Chắc chắn sẽ hợp tác lại cho các sự kiện sau.",
    rating: 5,
    eventType: "Tiệc VIP",
  },
];
