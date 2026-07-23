export type AdminTab =
  | "dashboard"
  | "events"
  | "schedule"
  | "bookings"
  | "gallery"
  | "partners"
  | "reviews"
  | "feedback"
  | "content"
  | "settings";

export interface Event {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  heroImageUrl: string | null;
  showDuration: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventListBuyItem {
  id: string;
  eventId: string;
  name: string;
  description: string | null;
  price: number;
  sortOrder: number;
  isActive: boolean;
}

export interface SetlistItem {
  id: string;
  eventId: string;
  title: string;
  artist: string | null;
  sortOrder: number;
}

export interface ShowSchedule {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  status: "available" | "pending" | "booked" | "cancelled";
  eventId: string | null;
  bookingId: string | null;
  location: string | null;
  notes: string | null;
}

export interface Booking {
  id: string;
  bookingNumber: number;
  eventId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  eventDate: string;
  eventTime: string;
  guestCount: number | null;
  notes: string | null;
  status: "pending_payment" | "payment_submitted" | "confirmed" | "cancelled";
  total: number;
  createdAt: string;
}

export type GalleryCategory = "poster" | "portrait" | "performance" | "video";

export interface GalleryItem {
  id: string;
  type: "photo" | "video";
  url: string;
  caption: string | null;
  category: GalleryCategory;
  eventId: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  linkUrl: string | null;
  sinceYear: number | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  customerName: string;
  quote: string;
  rating: number;
  eventType: string | null;
  avatarUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface ConsultationRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  eventDate: string | null;
  eventTime: string | null;
  serviceTypes: string;
  budget: string | null;
  notes: string | null;
  contacted: boolean;
  createdAt: string;
}

export interface NegativeFeedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  eventType: string | null;
  resolved: boolean;
  createdAt: string;
}

export interface SiteSettings {
  id: string;
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  qrImageUrl: string | null;
  branch: string | null;
  ownerPhotoUrl: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  showSlotStart: string;
  showSlotEnd: string;
  showSlotStepMinutes: number;
}
