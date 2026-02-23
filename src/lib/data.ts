export interface EventAttendee {
  id: string;
  avatar: string;
  name: string;
  showName: boolean;
}

export interface EventDetail {
  description: string;
  endDate: string;
  endTime: string;
  address: string;
  lat: number;
  lng: number;
  media: { type: "image" | "video"; url: string; thumbnail?: string }[];
  rules: string[];
  cancellationPolicy: string[];
  attendees: EventAttendee[];
  organizerId: string;
  organizerName: string;
  organizerLogo: string;
  organizerDescription: string;
  ticketTypes: {
    name: string;
    price: string;
    description: string;
    available: boolean;
  }[];
}

export interface Event {
  id: string;
  title: string;
  artist: string;
  venue: string;
  date: string;
  time: string;
  city: string;
  image: string;
  genre: string;
  price: string;
  trending: boolean;
  detail?: EventDetail;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  coverImage?: string;
  followers: string;
  upcoming: number;
  bio: string;
  longBio?: string;
  country?: string;
  city?: string;
  activeYears?: string;
  labels?: string[];
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
    soundcloud?: string;
    youtube?: string;
    website?: string;
  };
  monthlyListeners?: string;
  tags?: string[];
}

export interface VenueDetail {
  description: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  website: string;
  social: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    spotify?: string;
  };
  openingHours: {
    day: string;
    hours: string;
    isOpen: boolean;
  }[];
  gallery: string[];
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  capacity: string;
  image: string;
  type: string;
  rating: number;
  detail?: VenueDetail;
}

export interface CommunityPost {
  id: string;
  user: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  image?: string;
}

/* ============================================
   ORGANIZER PANEL TYPES
   ============================================ */

export type EventStatus = "draft" | "pending_approval" | "approved" | "rejected" | "cancelled";

export interface DopingPackage {
  id: string;
  type: "homepage_featured" | "explore_popular" | "events_editor_pick";
  name: string;
  description: string;
  price: string;
  duration: string;
  durationDays: number;
  features: string[];
}

export interface ActiveDoping {
  packageId: string;
  type: DopingPackage["type"];
  startDate: string;
  endDate: string;
  status: "active" | "expired";
}

export interface OrganizerEvent extends Event {
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
  artistIds: string[];
  missingArtists: string[];
  dopings: ActiveDoping[];
  rejectionReason?: string;
}

export interface ArtistTicket {
  id: string;
  organizerId: string;
  artistName: string;
  genre: string;
  description: string;
  status: "open" | "resolved";
  createdAt: string;
}

export interface TicketValidationLog {
  id: string;
  ticketId: string;
  eventId: string;
  eventTitle: string;
  ticketHolderName: string;
  ticketHolderEmail: string;
  ticketType: string;
  action: "approved" | "cancelled" | "refunded";
  validatedBy: string;
  validatedAt: string;
  notes?: string;
}

export interface OrganizerVenue extends Venue {
  organizerId: string;
  venueStatus: "active" | "pending" | "inactive";
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  eventId?: string; // undefined = all events
  maxUsage: number;
  usedCount: number;
  expiresAt: string;
  createdAt: string;
  status: "active" | "expired" | "depleted";
}

export interface OrganizerNotification {
  id: string;
  type: "event_approved" | "event_rejected" | "ticket_sold" | "ticket_cancelled" | "ticket_refunded" | "doping_expiring" | "artist_request_update";
  title: string;
  message: string;
  eventId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  eventId: string;
  eventTitle: string;
  title: string;
  message: string;
  targetTicketType?: string; // undefined = all
  createdAt: string;
}

export interface StoredTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  artist: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  image: string;
  genre: string;
  ticketType: string;
  ticketPrice: string;
  quantity: number;
  totalPaid: string;
  purchaseDate: string;
  buyerName: string;
  buyerEmail: string;
  status: "active" | "used" | "cancelled";
  qrSeed: string;
}

/* ============================================
   DOPING PACKAGES
   ============================================ */

export const dopingPackages: DopingPackage[] = [
  {
    id: "doping-home-7",
    type: "homepage_featured",
    name: "Anasayfa Dopingi",
    description: "Etkinliğiniz anasayfada 'Öne Çıkan Etkinlikler' bölümünde gösterilir",
    price: "₺500",
    duration: "7 gün",
    durationDays: 7,
    features: ["Öne çıkan badge", "Gradient border tasarım", "Anasayfa üst sıra görünürlük"],
  },
  {
    id: "doping-home-14",
    type: "homepage_featured",
    name: "Anasayfa Dopingi",
    description: "Etkinliğiniz anasayfada 'Öne Çıkan Etkinlikler' bölümünde gösterilir",
    price: "₺850",
    duration: "14 gün",
    durationDays: 14,
    features: ["Öne çıkan badge", "Gradient border tasarım", "Anasayfa üst sıra görünürlük"],
  },
  {
    id: "doping-home-30",
    type: "homepage_featured",
    name: "Anasayfa Dopingi",
    description: "Etkinliğiniz anasayfada 'Öne Çıkan Etkinlikler' bölümünde gösterilir",
    price: "₺1.500",
    duration: "30 gün",
    durationDays: 30,
    features: ["Öne çıkan badge", "Gradient border tasarım", "Anasayfa üst sıra görünürlük"],
  },
  {
    id: "doping-explore-7",
    type: "explore_popular",
    name: "Keşfet Dopingi",
    description: "Etkinliğiniz keşfet sayfasında 'Popüler Etkinlikler' bölümünde gösterilir",
    price: "₺500",
    duration: "7 gün",
    durationDays: 7,
    features: ["Trending icon", "Popüler badge", "Keşfet sayfası üst sıra"],
  },
  {
    id: "doping-explore-14",
    type: "explore_popular",
    name: "Keşfet Dopingi",
    description: "Etkinliğiniz keşfet sayfasında 'Popüler Etkinlikler' bölümünde gösterilir",
    price: "₺850",
    duration: "14 gün",
    durationDays: 14,
    features: ["Trending icon", "Popüler badge", "Keşfet sayfası üst sıra"],
  },
  {
    id: "doping-explore-30",
    type: "explore_popular",
    name: "Keşfet Dopingi",
    description: "Etkinliğiniz keşfet sayfasında 'Popüler Etkinlikler' bölümünde gösterilir",
    price: "₺1.500",
    duration: "30 gün",
    durationDays: 30,
    features: ["Trending icon", "Popüler badge", "Keşfet sayfası üst sıra"],
  },
  {
    id: "doping-editor-7",
    type: "events_editor_pick",
    name: "Etkinlikler Dopingi",
    description: "Etkinliğiniz etkinlikler sayfasında 'Editörün Seçimi' bölümünde gösterilir",
    price: "₺500",
    duration: "7 gün",
    durationDays: 7,
    features: ["Editörün seçimi badge", "Etkinlikler sayfası üst sıra", "Özel kart tasarımı"],
  },
  {
    id: "doping-editor-14",
    type: "events_editor_pick",
    name: "Etkinlikler Dopingi",
    description: "Etkinliğiniz etkinlikler sayfasında 'Editörün Seçimi' bölümünde gösterilir",
    price: "₺850",
    duration: "14 gün",
    durationDays: 14,
    features: ["Editörün seçimi badge", "Etkinlikler sayfası üst sıra", "Özel kart tasarımı"],
  },
  {
    id: "doping-editor-30",
    type: "events_editor_pick",
    name: "Etkinlikler Dopingi",
    description: "Etkinliğiniz etkinlikler sayfasında 'Editörün Seçimi' bölümünde gösterilir",
    price: "₺1.500",
    duration: "30 gün",
    durationDays: 30,
    features: ["Editörün seçimi badge", "Etkinlikler sayfası üst sıra", "Özel kart tasarımı"],
  },
];

/* ============================================
   MOCK DATA
   ============================================ */

export const events: Event[] = [
  {
    id: "1",
    title: "Neon Pulse Festival",
    artist: "deadmau5",
    venue: "Zorlu PSM",
    date: "15 Mar 2026",
    time: "21:00",
    city: "İstanbul",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
    genre: "Electronic",
    price: "₺450",
    trending: true,
    detail: {
      description:
        "İstanbul'un kalbinde, Zorlu PSM'nin muhteşem sahnesinde gerçekleşecek Neon Pulse Festival, electronic müzik dünyasının en büyük isimlerinden deadmau5'u ağırlıyor. Işık gösterileri, immersive ses sistemi ve unutulmaz bir gece sizi bekliyor.",
      endDate: "16 Mar 2026",
      endTime: "03:00",
      address:
        "Zorlu Center, Levazım Mah. Koru Sok. No:2, 34340 Beşiktaş/İstanbul",
      lat: 41.0672,
      lng: 29.0168,
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&fit=crop",
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=800&fit=crop",
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=1200&h=800&fit=crop",
        },
        {
          type: "video",
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          thumbnail:
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
        },
      ],
      rules: [
        "ruleAge",
        "ruleId",
        "ruleReentry",
        "ruleRecording",
        "ruleSubstance",
        "ruleDressCode",
      ],
      cancellationPolicy: [
        "cancel7Days",
        "cancel3Days",
        "cancelNoRefund",
        "cancelTransfer",
      ],
      attendees: [
        {
          id: "a1",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
          name: "Elif K.",
          showName: true,
        },
        {
          id: "a2",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
          name: "Cem A.",
          showName: true,
        },
        {
          id: "a3",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
          name: "Zeynep M.",
          showName: false,
        },
        {
          id: "a4",
          avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
          name: "Barış T.",
          showName: true,
        },
        {
          id: "a5",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
          name: "Selin D.",
          showName: false,
        },
        {
          id: "a6",
          avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
          name: "Kaan Y.",
          showName: true,
        },
        {
          id: "a7",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
          name: "Ayşe B.",
          showName: false,
        },
        {
          id: "a8",
          avatar:
            "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
          name: "Mert Ö.",
          showName: true,
        },
        {
          id: "a9",
          avatar:
            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
          name: "Deniz A.",
          showName: true,
        },
        {
          id: "a10",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
          name: "Ozan K.",
          showName: false,
        },
        {
          id: "a11",
          avatar:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
          name: "İrem S.",
          showName: true,
        },
        {
          id: "a12",
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
          name: "Burak C.",
          showName: false,
        },
      ],
      organizerId: "org1",
      organizerName: "Pulse Events",
      organizerLogo:
        "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=200&fit=crop",
      organizerDescription:
        "Türkiye'nin önde gelen elektronik müzik organizatörü. 2018'den bu yana 500+ etkinlik düzenledik.",
      ticketTypes: [
        {
          name: "Early Bird",
          price: "₺450",
          description: "earlyBirdDesc",
          available: true,
        },
        {
          name: "General Admission",
          price: "₺650",
          description: "generalDesc",
          available: true,
        },
        {
          name: "VIP",
          price: "₺1,200",
          description: "vipDesc",
          available: true,
        },
        {
          name: "Backstage",
          price: "₺2,500",
          description: "backstageDesc",
          available: false,
        },
      ],
    },
  },
  {
    id: "2",
    title: "Jazz Under Stars",
    artist: "Kamasi Washington",
    venue: "Babylon",
    date: "22 Mar 2026",
    time: "20:00",
    city: "İstanbul",
    image:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
    genre: "Jazz",
    price: "₺380",
    trending: true,
    detail: {
      description:
        "Caz müziğin modern efsanesi Kamasi Washington, Babylon'un efsanevi sahnesinde yıldızlar altında müthiş bir performans sunacak. Saksafonun büyüleyici sesleri ve Washington'ın benzersiz enerjisi ile unutulmaz bir gece.",
      endDate: "22 Mar 2026",
      endTime: "23:30",
      address: "Şehbender Sok. No:3, 34421 Beyoğlu/İstanbul",
      lat: 41.0314,
      lng: 28.9743,
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=800&fit=crop",
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1200&h=800&fit=crop",
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&h=800&fit=crop",
        },
      ],
      rules: ["ruleAge", "ruleId", "ruleReentry", "ruleRecording"],
      cancellationPolicy: ["cancel7Days", "cancel3Days", "cancelNoRefund"],
      attendees: [
        {
          id: "a1",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
          name: "Elif K.",
          showName: true,
        },
        {
          id: "a2",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
          name: "Cem A.",
          showName: false,
        },
        {
          id: "a3",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
          name: "Selin D.",
          showName: true,
        },
        {
          id: "a4",
          avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
          name: "Kaan Y.",
          showName: true,
        },
        {
          id: "a5",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
          name: "Ayşe B.",
          showName: false,
        },
        {
          id: "a6",
          avatar:
            "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
          name: "Mert Ö.",
          showName: true,
        },
      ],
      organizerId: "org2",
      organizerName: "Babylon Presents",
      organizerLogo:
        "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=200&h=200&fit=crop",
      organizerDescription:
        "Babylon, 1999'dan beri İstanbul'un müzik ve kültür sahnesinin merkezinde yer almaktadır.",
      ticketTypes: [
        {
          name: "Standard",
          price: "₺380",
          description: "generalDesc",
          available: true,
        },
        {
          name: "VIP Table",
          price: "₺950",
          description: "vipDesc",
          available: true,
        },
      ],
    },
  },
  {
    id: "3",
    title: "Bass Cathedral",
    artist: "Bonobo",
    venue: "Volkswagen Arena",
    date: "5 Apr 2026",
    time: "22:00",
    city: "İstanbul",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    genre: "Electronic",
    price: "₺520",
    trending: false,
    detail: {
      description:
        "Downtempo ve organic electronic müziğin ustası Bonobo, Volkswagen Arena'da 'Bass Cathedral' konseptiyle sahne alıyor. Görsel enstalasyonlar ve surround ses sistemi ile tamamen imersif bir deneyim.",
      endDate: "6 Apr 2026",
      endTime: "02:00",
      address: "Huzur Mah. Maslak Ayazağa Cad. No:4, 34396 Sarıyer/İstanbul",
      lat: 41.1069,
      lng: 29.0207,
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop",
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=800&fit=crop",
        },
        {
          type: "video",
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          thumbnail:
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=600&fit=crop",
        },
      ],
      rules: [
        "ruleAge",
        "ruleId",
        "ruleReentry",
        "ruleRecording",
        "ruleDressCode",
      ],
      cancellationPolicy: [
        "cancel7Days",
        "cancel3Days",
        "cancelNoRefund",
        "cancelTransfer",
      ],
      attendees: [
        {
          id: "a1",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
          name: "Zeynep M.",
          showName: true,
        },
        {
          id: "a2",
          avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
          name: "Barış T.",
          showName: false,
        },
        {
          id: "a3",
          avatar:
            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
          name: "Deniz A.",
          showName: true,
        },
        {
          id: "a4",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
          name: "Ozan K.",
          showName: true,
        },
        {
          id: "a5",
          avatar:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
          name: "İrem S.",
          showName: false,
        },
        {
          id: "a6",
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
          name: "Burak C.",
          showName: true,
        },
        {
          id: "a7",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
          name: "Elif K.",
          showName: true,
        },
        {
          id: "a8",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
          name: "Cem A.",
          showName: false,
        },
      ],
      organizerId: "org1",
      organizerName: "Pulse Events",
      organizerLogo:
        "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=200&fit=crop",
      organizerDescription:
        "Türkiye'nin önde gelen elektronik müzik organizatörü. 2018'den bu yana 500+ etkinlik düzenledik.",
      ticketTypes: [
        {
          name: "General Admission",
          price: "₺520",
          description: "generalDesc",
          available: true,
        },
        {
          name: "VIP",
          price: "₺1,100",
          description: "vipDesc",
          available: true,
        },
        {
          name: "Ultra VIP",
          price: "₺2,000",
          description: "backstageDesc",
          available: true,
        },
      ],
    },
  },
  {
    id: "4",
    title: "Anatolian Echoes",
    artist: "Jakuzi",
    venue: "IF Performance Hall",
    date: "12 Apr 2026",
    time: "21:30",
    city: "Ankara",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=600&fit=crop",
    genre: "Indie",
    price: "₺250",
    trending: true,
    detail: {
      description:
        "Türk indie sahnesinin en önemli isimlerinden Jakuzi, 'Anatolian Echoes' konseptiyle IF Performance Hall'da sahne alıyor. Post-punk ve synth-pop karışımı müzikleriyle Anadolu'nun ruhunu modern seslerle buluşturacaklar.",
      endDate: "12 Apr 2026",
      endTime: "23:30",
      address: "Tunalı Hilmi Cad. No:114, 06700 Çankaya/Ankara",
      lat: 39.9097,
      lng: 32.8603,
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&h=800&fit=crop",
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=1200&h=800&fit=crop",
        },
      ],
      rules: ["ruleAge", "ruleId", "ruleReentry"],
      cancellationPolicy: ["cancel7Days", "cancel3Days", "cancelNoRefund"],
      attendees: [
        {
          id: "a1",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
          name: "Selin D.",
          showName: true,
        },
        {
          id: "a2",
          avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
          name: "Kaan Y.",
          showName: false,
        },
        {
          id: "a3",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
          name: "Ayşe B.",
          showName: true,
        },
        {
          id: "a4",
          avatar:
            "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
          name: "Mert Ö.",
          showName: false,
        },
      ],
      organizerId: "org3",
      organizerName: "IF Productions",
      organizerLogo:
        "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=200&h=200&fit=crop",
      organizerDescription:
        "Ankara'nın en aktif bağımsız müzik organizatörü. Indie ve alternatif müzik etkinlikleri.",
      ticketTypes: [
        {
          name: "General Admission",
          price: "₺250",
          description: "generalDesc",
          available: true,
        },
        {
          name: "Balcony",
          price: "₺400",
          description: "vipDesc",
          available: true,
        },
      ],
    },
  },
  {
    id: "5",
    title: "Sonic Bloom",
    artist: "Moderat",
    venue: "KüçükÇiftlik Park",
    date: "20 Apr 2026",
    time: "20:00",
    city: "İstanbul",
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop",
    genre: "Electronic",
    price: "₺600",
    trending: false,
    detail: {
      description:
        "Apparat ve Modeselektor'un süper grubu Moderat, KüçükÇiftlik Park'ın açık hava sahnesinde 'Sonic Bloom' ile muhteşem bir gece yaşatacak. Live electronic performans ve görsel şölen bir arada.",
      endDate: "21 Apr 2026",
      endTime: "01:00",
      address: "Harbiye Mah. Taşkışla Cad. No:1, 34367 Şişli/İstanbul",
      lat: 41.0461,
      lng: 28.9933,
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=800&fit=crop",
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1200&h=800&fit=crop",
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=800&fit=crop",
        },
        {
          type: "video",
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          thumbnail:
            "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=600&fit=crop",
        },
      ],
      rules: [
        "ruleAge",
        "ruleId",
        "ruleReentry",
        "ruleRecording",
        "ruleSubstance",
      ],
      cancellationPolicy: [
        "cancel7Days",
        "cancel3Days",
        "cancelNoRefund",
        "cancelTransfer",
      ],
      attendees: [
        {
          id: "a1",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
          name: "Elif K.",
          showName: false,
        },
        {
          id: "a2",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
          name: "Zeynep M.",
          showName: true,
        },
        {
          id: "a3",
          avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
          name: "Barış T.",
          showName: true,
        },
        {
          id: "a4",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
          name: "Selin D.",
          showName: false,
        },
        {
          id: "a5",
          avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
          name: "Kaan Y.",
          showName: true,
        },
        {
          id: "a6",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
          name: "Ayşe B.",
          showName: true,
        },
        {
          id: "a7",
          avatar:
            "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
          name: "Mert Ö.",
          showName: false,
        },
        {
          id: "a8",
          avatar:
            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
          name: "Deniz A.",
          showName: true,
        },
        {
          id: "a9",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
          name: "Ozan K.",
          showName: false,
        },
        {
          id: "a10",
          avatar:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
          name: "İrem S.",
          showName: true,
        },
      ],
      organizerId: "org1",
      organizerName: "Pulse Events",
      organizerLogo:
        "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=200&fit=crop",
      organizerDescription:
        "Türkiye'nin önde gelen elektronik müzik organizatörü. 2018'den bu yana 500+ etkinlik düzenledik.",
      ticketTypes: [
        {
          name: "Early Bird",
          price: "₺600",
          description: "earlyBirdDesc",
          available: false,
        },
        {
          name: "General Admission",
          price: "₺800",
          description: "generalDesc",
          available: true,
        },
        {
          name: "VIP",
          price: "₺1,500",
          description: "vipDesc",
          available: true,
        },
      ],
    },
  },
  {
    id: "6",
    title: "Midnight Frequency",
    artist: "Amelie Lens",
    venue: "Klein",
    date: "28 Apr 2026",
    time: "23:00",
    city: "İstanbul",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop",
    genre: "Techno",
    price: "₺350",
    trending: true,
    detail: {
      description:
        "Modern techno sahnesinin yükselen yıldızı Amelie Lens, Klein'ın efsanevi underground atmosferinde 'Midnight Frequency' ile hafızalara kazınacak bir gece sunuyor. Karanlık, hipnotik ve tamamen kaybolacağınız bir deneyim.",
      endDate: "29 Apr 2026",
      endTime: "06:00",
      address: "İstiklal Cad. Mis Sok. No:18, 34433 Beyoğlu/İstanbul",
      lat: 41.0338,
      lng: 28.9779,
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop",
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=1200&h=800&fit=crop",
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=1200&h=800&fit=crop",
        },
      ],
      rules: [
        "ruleAge",
        "ruleId",
        "ruleReentry",
        "ruleRecording",
        "ruleSubstance",
        "ruleDressCode",
      ],
      cancellationPolicy: ["cancel7Days", "cancel3Days", "cancelNoRefund"],
      attendees: [
        {
          id: "a1",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
          name: "Cem A.",
          showName: true,
        },
        {
          id: "a2",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
          name: "Elif K.",
          showName: false,
        },
        {
          id: "a3",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
          name: "Zeynep M.",
          showName: true,
        },
        {
          id: "a4",
          avatar:
            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
          name: "Deniz A.",
          showName: true,
        },
        {
          id: "a5",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
          name: "Ozan K.",
          showName: false,
        },
        {
          id: "a6",
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
          name: "Burak C.",
          showName: true,
        },
        {
          id: "a7",
          avatar:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
          name: "İrem S.",
          showName: false,
        },
      ],
      organizerId: "org4",
      organizerName: "Klein Collective",
      organizerLogo:
        "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=200&h=200&fit=crop",
      organizerDescription:
        "İstanbul'un underground techno sahnesinin kalbi. Dünya çapında DJ'lerle unutulmaz geceler.",
      ticketTypes: [
        {
          name: "Door",
          price: "₺350",
          description: "generalDesc",
          available: true,
        },
        {
          name: "Pre-sale",
          price: "₺280",
          description: "earlyBirdDesc",
          available: true,
        },
      ],
    },
  },
];

export const artists: Artist[] = [
  {
    id: "1",
    name: "deadmau5",
    genre: "Progressive House",
    image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=600&h=600&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1400&h=600&fit=crop",
    followers: "24.5M",
    upcoming: 3,
    bio: "Canadian electronic music producer known for his progressive house and electronica.",
    longBio: "Joel Thomas Zimmerman, daha çok deadmau5 olarak bilinen Kanadalı elektronik müzik prodüktörü, DJ ve müzisyen. Progressive house, electro house ve çeşitli elektronik müzik türlerinde eserler üretmektedir. İkonik fare başlığı ile tanınan sanatçı, Grammy ödülüne aday gösterilmiş ve dünya genelinde milyonlarca hayranına ulaşmıştır. Strobe, Ghosts 'n' Stuff ve I Remember gibi parçaları elektronik müziğin klasikleri arasındadır.",
    country: "Kanada",
    city: "Toronto",
    activeYears: "1998 - Günümüz",
    labels: ["mau5trap", "Ultra Records", "Astralwerks"],
    socialMedia: {
      instagram: "https://instagram.com/deadmau5",
      twitter: "https://twitter.com/deadmau5",
      spotify: "https://open.spotify.com/artist/2CIMQHirSU0MQqyYHq0eOx",
      soundcloud: "https://soundcloud.com/deadmau5",
      youtube: "https://youtube.com/@deadmau5",
      website: "https://deadmau5.com",
    },
    monthlyListeners: "8.2M",
    tags: ["Progressive House", "Electro House", "EDM", "Electronica"],
  },
  {
    id: "2",
    name: "Amelie Lens",
    genre: "Techno",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=600&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=1400&h=600&fit=crop",
    followers: "3.2M",
    upcoming: 5,
    bio: "Belgian DJ and producer, one of the leading figures in modern techno.",
    longBio: "Amelie Lens, Belçikalı DJ ve prodüktör olarak modern tekno sahnesinin en dikkat çekici isimlerinden biridir. 2015 yılında profesyonel kariyerine başlayan Lens, kısa sürede Awakenings, Tomorrowland ve Time Warp gibi dünyanın en prestijli festivallerinde sahne almayı başarmıştır. Hipnotik ve enerjik setleriyle tanınan sanatçı, kendi plak şirketi LENSKE Records'u kurarak yeni nesil tekno sanatçılarına da platform sağlamaktadır.",
    country: "Belçika",
    city: "Antwerp",
    activeYears: "2015 - Günümüz",
    labels: ["LENSKE Records", "Drumcode", "Second State"],
    socialMedia: {
      instagram: "https://instagram.com/amelielens",
      twitter: "https://twitter.com/AmelieLens",
      spotify: "https://open.spotify.com/artist/7sFhq2YYMFlfeeSpaMTEEr",
      soundcloud: "https://soundcloud.com/amelielens",
      website: "https://amelielens.com",
    },
    monthlyListeners: "1.8M",
    tags: ["Techno", "Hard Techno", "Acid Techno", "Peak Time"],
  },
  {
    id: "3",
    name: "Bonobo",
    genre: "Downtempo",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1400&h=600&fit=crop",
    followers: "2.8M",
    upcoming: 2,
    bio: "British musician, producer and DJ, known for his eclectic electronic compositions.",
    longBio: "Simon Green, sanatçı adıyla Bonobo, İngiliz müzisyen, prodüktör ve DJ'dir. Downtempo, trip hop ve organik elektronik müzik türlerinde eserler üreten sanatçı, doğal enstrümanları elektronik prodüksiyon teknikleriyle harmanlayan benzersiz tarzıyla tanınır. Black Sands, Migration ve Fragments albümleri eleştirmenlerce büyük beğeni toplamıştır. Canlı performanslarında band formatında sahne alarak elektronik müziği orkestral bir deneyime dönüştürmektedir.",
    country: "İngiltere",
    city: "Londra",
    activeYears: "1999 - Günümüz",
    labels: ["Ninja Tune", "Outlier"],
    socialMedia: {
      instagram: "https://instagram.com/si_bonobo",
      twitter: "https://twitter.com/si_bonobo",
      spotify: "https://open.spotify.com/artist/0cmWgDlu9CwTgxPhf403hb",
      soundcloud: "https://soundcloud.com/bonobo",
      youtube: "https://youtube.com/@Bonobo",
      website: "https://bonobomusic.com",
    },
    monthlyListeners: "4.5M",
    tags: ["Downtempo", "Trip Hop", "Organic Electronic", "Electronica"],
  },
  {
    id: "4",
    name: "Kamasi Washington",
    genre: "Jazz",
    image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&h=600&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1400&h=600&fit=crop",
    followers: "850K",
    upcoming: 4,
    bio: "American jazz saxophonist who has redefined modern jazz for a new generation.",
    longBio: "Kamasi Washington, Amerikalı caz saksafoncu, besteci ve orkestra lideridir. Los Angeles doğumlu sanatçı, modern cazı yeni bir nesle tanıtan çığır açıcı müzisyenlerden biri olarak kabul edilmektedir. 2015 yılında yayımlanan üç disklik The Epic albümü, caz dünyasında bir dönüm noktası olmuştur. Kendrick Lamar, Herbie Hancock ve Thundercat gibi isimlerle çalışmış olan Washington, cazı hip-hop, funk ve R&B ile harmanlayarak türün sınırlarını genişletmektedir.",
    country: "ABD",
    city: "Los Angeles",
    activeYears: "2004 - Günümüz",
    labels: ["Young", "Brainfeeder"],
    socialMedia: {
      instagram: "https://instagram.com/kamasiwashington",
      twitter: "https://twitter.com/KamasiW",
      spotify: "https://open.spotify.com/artist/6HQYnRM4OzToCYPpVBInuU",
      youtube: "https://youtube.com/@KamasiWashington",
      website: "https://www.kamasiwashington.com",
    },
    monthlyListeners: "1.2M",
    tags: ["Jazz", "Spiritual Jazz", "Avant-garde", "Fusion"],
  },
  {
    id: "5",
    name: "Moderat",
    genre: "Electronic",
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&h=600&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1400&h=600&fit=crop",
    followers: "1.5M",
    upcoming: 2,
    bio: "German electronic supergroup formed by Apparat and Modeselektor.",
    longBio: "Moderat, Alman elektronik müzik süpergrubudur ve Apparat (Sascha Ring) ile Modeselektor (Gernot Bronsert & Sebastian Szary) iş birliğinden doğmuştur. Berlin merkezli üçlü, IDM, techno ve ambient türlerini harmanladığı üç stüdyo albümüyle eleştirmenlerin beğenisini kazanmıştır. Bad Kingdom, A New Error ve Reminder gibi parçaları elektronik müzik sahnesinin önemli eserleri arasında yer almaktadır. Canlı performansları, görsel sanatlarla müziği bir araya getiren sürükleyici deneyimler sunar.",
    country: "Almanya",
    city: "Berlin",
    activeYears: "2002 - Günümüz",
    labels: ["Monkeytown Records", "BPitch Control"],
    socialMedia: {
      instagram: "https://instagram.com/modaborat",
      spotify: "https://open.spotify.com/artist/3oKRxpszQKUjjaHz1wqnH2",
      soundcloud: "https://soundcloud.com/moderat-official",
      youtube: "https://youtube.com/@Moderat",
      website: "https://moderat.fm",
    },
    monthlyListeners: "2.1M",
    tags: ["IDM", "Techno", "Ambient", "Electronica"],
  },
  {
    id: "6",
    name: "Jakuzi",
    genre: "Indie / Post-punk",
    image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&h=600&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1400&h=600&fit=crop",
    followers: "420K",
    upcoming: 6,
    bio: "Turkish indie band blending post-punk, synth-pop and new wave influences.",
    longBio: "Jakuzi, 2013 yılında İstanbul'da kurulan Türk indie müzik grubudur. Kutay Soyocak ve Tanju Gürel tarafından kurulan grup, post-punk, synth-pop ve new wave etkilerini Türkçe sözlerle harmanlayarak özgün bir tarz yaratmıştır. Fantezi Müzik ve Hata Payı albümleri ulusal ve uluslararası basında geniş yankı uyandırmıştır. Primavera Sound, Eurosonic ve Le Guess Who? gibi uluslararası festivallerde sahne alan grup, Türk bağımsız müzik sahnesinin en önemli temsilcilerinden biridir.",
    country: "Türkiye",
    city: "İstanbul",
    activeYears: "2013 - Günümüz",
    labels: ["Glitterbeat Records", "Bağımsız"],
    socialMedia: {
      instagram: "https://instagram.com/jakuzimusic",
      twitter: "https://twitter.com/jakuzimusic",
      spotify: "https://open.spotify.com/artist/0ys4N0JOJJEayMOYqnjHTx",
      youtube: "https://youtube.com/@jakuzimusic",
      website: "https://jakuzi.net",
    },
    monthlyListeners: "380K",
    tags: ["Post-punk", "Synth-pop", "New Wave", "Türkçe Indie"],
  },
];

export const venues: Venue[] = [
  {
    id: "1",
    name: "Zorlu PSM",
    city: "İstanbul",
    capacity: "3,000",
    image:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=500&fit=crop",
    type: "Concert Hall",
    rating: 4.8,
    detail: {
      description:
        "Zorlu PSM, İstanbul'un kalbinde yer alan, dünya standartlarında bir performans sanatları merkezi. 2013 yılında açılan mekan, konser salonları, tiyatro sahneleri ve açık hava alanlarıyla yılda 1.000'den fazla etkinliğe ev sahipliği yapıyor. Akustik tasarımı ve son teknoloji ses-ışık sistemleriyle Türkiye'nin en prestijli sahnelerinden biri.",
      address:
        "Zorlu Center, Levazım Mah. Koru Sok. No:2, 34340 Beşiktaş/İstanbul",
      lat: 41.0672,
      lng: 29.0168,
      phone: "+90 212 924 0 444",
      email: "info@zorlupsm.com",
      website: "https://www.zorlupsm.com",
      social: {
        instagram: "https://instagram.com/zorlupsm",
        twitter: "https://twitter.com/zorlupsm",
        youtube: "https://youtube.com/zorlupsm",
      },
      openingHours: [
        { day: "monday", hours: "10:00 - 22:00", isOpen: true },
        { day: "tuesday", hours: "10:00 - 22:00", isOpen: true },
        { day: "wednesday", hours: "10:00 - 22:00", isOpen: true },
        { day: "thursday", hours: "10:00 - 23:00", isOpen: true },
        { day: "friday", hours: "10:00 - 00:00", isOpen: true },
        { day: "saturday", hours: "10:00 - 00:00", isOpen: true },
        { day: "sunday", hours: "10:00 - 22:00", isOpen: true },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&h=800&fit=crop",
      ],
    },
  },
  {
    id: "2",
    name: "Babylon",
    city: "İstanbul",
    capacity: "800",
    image:
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&h=500&fit=crop",
    type: "Club",
    rating: 4.7,
    detail: {
      description:
        "1999 yılından bu yana İstanbul'un müzik ve kültür sahnesinin merkezinde yer alan Babylon, alternatif müzikten elektroniğe, cazzdan world music'e kadar geniş bir yelpazede etkinliklere ev sahipliği yapıyor. Beyoğlu'nun kalbinde konumlanan mekan, samimi atmosferi ve kaliteli ses sistemiyle müzikseverlerin buluşma noktası.",
      address: "Şehbender Sok. No:3, 34421 Beyoğlu/İstanbul",
      lat: 41.0314,
      lng: 28.9743,
      phone: "+90 212 292 73 68",
      email: "info@babylon.com.tr",
      website: "https://www.babylon.com.tr",
      social: {
        instagram: "https://instagram.com/babylonistanbul",
        twitter: "https://twitter.com/babylonistanbul",
        youtube: "https://youtube.com/babylonistanbul",
        spotify: "https://open.spotify.com/user/babylon",
      },
      openingHours: [
        { day: "monday", hours: "Kapalı", isOpen: false },
        { day: "tuesday", hours: "20:00 - 02:00", isOpen: true },
        { day: "wednesday", hours: "20:00 - 02:00", isOpen: true },
        { day: "thursday", hours: "20:00 - 03:00", isOpen: true },
        { day: "friday", hours: "20:00 - 04:00", isOpen: true },
        { day: "saturday", hours: "20:00 - 04:00", isOpen: true },
        { day: "sunday", hours: "Kapalı", isOpen: false },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&h=800&fit=crop",
      ],
    },
  },
  {
    id: "3",
    name: "Volkswagen Arena",
    city: "İstanbul",
    capacity: "5,000",
    image:
      "https://images.unsplash.com/photo-1578946956088-940c3b502864?w=800&h=500&fit=crop",
    type: "Arena",
    rating: 4.5,
    detail: {
      description:
        "Volkswagen Arena, İstanbul Maslak'ta konumlanan, 5.000 kişi kapasiteli çok amaçlı etkinlik alanı. Büyük ölçekli konserlerden kurumsal etkinliklere kadar geniş bir yelpazede organizasyonlara ev sahipliği yapıyor. Modern altyapısı, geniş sahne alanı ve üstün akustik tasarımıyla İstanbul'un en büyük kapalı etkinlik mekanlarından biri.",
      address:
        "Huzur Mah. Maslak Ayazağa Cad. No:4, 34396 Sarıyer/İstanbul",
      lat: 41.1069,
      lng: 29.0207,
      phone: "+90 212 999 09 99",
      email: "info@vwarena.com.tr",
      website: "https://www.vwarena.com.tr",
      social: {
        instagram: "https://instagram.com/vaborjiistanbul",
        twitter: "https://twitter.com/vwarena",
      },
      openingHours: [
        { day: "monday", hours: "Etkinliklere göre", isOpen: true },
        { day: "tuesday", hours: "Etkinliklere göre", isOpen: true },
        { day: "wednesday", hours: "Etkinliklere göre", isOpen: true },
        { day: "thursday", hours: "Etkinliklere göre", isOpen: true },
        { day: "friday", hours: "Etkinliklere göre", isOpen: true },
        { day: "saturday", hours: "Etkinliklere göre", isOpen: true },
        { day: "sunday", hours: "Etkinliklere göre", isOpen: true },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1578946956088-940c3b502864?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1200&h=800&fit=crop",
      ],
    },
  },
  {
    id: "4",
    name: "Klein",
    city: "İstanbul",
    capacity: "400",
    image:
      "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&h=500&fit=crop",
    type: "Underground Club",
    rating: 4.9,
    detail: {
      description:
        "Klein, Beyoğlu'nun kalbinde yer alan, İstanbul'un en saygın underground elektronik müzik kulübü. Karanlık, minimalist iç mekanı ve Funktion-One ses sistemiyle techno ve house müzik tutkunlarının buluşma noktası. 2016'dan bu yana dünya çapında DJ'leri ağırlıyor ve İstanbul'un gece hayatını şekillendiriyor.",
      address: "İstiklal Cad. Mis Sok. No:18, 34433 Beyoğlu/İstanbul",
      lat: 41.0338,
      lng: 28.9779,
      phone: "+90 212 293 00 73",
      email: "info@kleinist.com",
      website: "https://www.kleinist.com",
      social: {
        instagram: "https://instagram.com/kleinist",
        twitter: "https://twitter.com/kleinist",
        spotify: "https://open.spotify.com/user/kleinist",
      },
      openingHours: [
        { day: "monday", hours: "Kapalı", isOpen: false },
        { day: "tuesday", hours: "Kapalı", isOpen: false },
        { day: "wednesday", hours: "23:00 - 05:00", isOpen: true },
        { day: "thursday", hours: "23:00 - 05:00", isOpen: true },
        { day: "friday", hours: "23:00 - 06:00", isOpen: true },
        { day: "saturday", hours: "23:00 - 06:00", isOpen: true },
        { day: "sunday", hours: "Kapalı", isOpen: false },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=800&fit=crop",
      ],
    },
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: "1",
    user: "Elif K.",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
    content:
      "Dün geceki Amelie Lens seti hayatımda gördüğüm en iyi performanstı! Klein'in atmosferi bambaşkaydı 🔥",
    likes: 234,
    comments: 45,
    time: "2s önce",
    image:
      "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    user: "Cem A.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    content:
      "Neon Pulse Festival için bilet arayışı! İstanbul'dan gidecek var mı? Grup oluşturalım!",
    likes: 128,
    comments: 89,
    time: "15dk önce",
  },
  {
    id: "3",
    user: "Zeynep M.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    content:
      "Bonobo'nun yeni albümünü dinleyen var mı? Konser öncesi hazırlık playlistim hazır 🎵",
    likes: 456,
    comments: 67,
    time: "1s önce",
  },
  {
    id: "4",
    user: "Barış T.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    content:
      "Ankara'daki müzik sahnesinin son 2 yılda ne kadar büyüdüğüne inanamıyorum. Her hafta kaliteli bir etkinlik var!",
    likes: 312,
    comments: 34,
    time: "3s önce",
  },
];

export const genres = [
  "Tümü",
  "Electronic",
  "Techno",
  "Jazz",
  "Indie",
  "Rock",
  "Hip-Hop",
  "Classical",
];
