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
