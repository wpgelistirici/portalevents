"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  OrganizerEvent,
  OrganizerVenue,
  ArtistTicket,
  TicketValidationLog,
  ActiveDoping,
  StoredTicket,
  EventStatus,
  Coupon,
  OrganizerNotification,
  Announcement,
} from "./data";
import { events as mockEvents, venues as mockVenues } from "./data";

/* ============================================
   STORAGE KEYS
   ============================================ */
const ORGANIZER_EVENTS_KEY = "pulse_organizer_events";
const ORGANIZER_VENUES_KEY = "pulse_organizer_venues";
const ARTIST_TICKETS_KEY = "pulse_artist_tickets";
const VALIDATION_LOGS_KEY = "pulse_validation_logs";
const STORED_TICKETS_KEY = "pulse_tickets";
const COUPONS_KEY = "pulse_coupons";
const NOTIFICATIONS_KEY = "pulse_organizer_notifications";
const ANNOUNCEMENTS_KEY = "pulse_announcements";

/* ============================================
   CONTEXT TYPE
   ============================================ */
interface OrganizerContextType {
  // Events
  organizerEvents: OrganizerEvent[];
  addEvent: (event: Omit<OrganizerEvent, "id" | "createdAt" | "updatedAt">) => OrganizerEvent;
  updateEvent: (id: string, data: Partial<OrganizerEvent>) => void;
  deleteEvent: (id: string) => void;
  submitForApproval: (id: string) => void;
  getEventsByStatus: (status: EventStatus) => OrganizerEvent[];

  // Venues
  organizerVenues: OrganizerVenue[];
  addVenue: (venue: Omit<OrganizerVenue, "id" | "createdAt">) => OrganizerVenue;
  updateVenue: (id: string, data: Partial<OrganizerVenue>) => void;
  deleteVenue: (id: string) => void;

  // Artist Tickets
  artistTickets: ArtistTicket[];
  createArtistTicket: (ticket: Omit<ArtistTicket, "id" | "createdAt" | "status">) => void;

  // Ticket Validation
  validationLogs: TicketValidationLog[];
  validateTicket: (
    ticketId: string,
    action: "approved" | "cancelled" | "refunded",
    validatedBy: string,
    notes?: string,
  ) => { success: boolean; error?: string };
  searchTickets: (query: string, eventId?: string) => StoredTicket[];
  getTicketById: (ticketId: string) => StoredTicket | undefined;

  // Doping
  purchaseDoping: (eventId: string, doping: ActiveDoping) => void;

  // All Tickets (for reports)
  getAllTickets: () => StoredTicket[];

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, "id" | "createdAt" | "usedCount" | "status">) => void;
  deleteCoupon: (id: string) => void;

  // Notifications
  notifications: OrganizerNotification[];
  addNotification: (n: Omit<OrganizerNotification, "id" | "createdAt" | "isRead">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;

  // Announcements
  announcements: Announcement[];
  addAnnouncement: (a: Omit<Announcement, "id" | "createdAt">) => void;

  // Clone event
  cloneEvent: (id: string) => OrganizerEvent | null;

  // Stats
  stats: {
    totalEvents: number;
    activeDopings: number;
    pendingApproval: number;
    totalTicketsSold: number;
  };
}

const OrganizerContext = createContext<OrganizerContextType | undefined>(undefined);

/* ============================================
   SEED DATA
   ============================================ */
function getSeedOrganizerEvents(): OrganizerEvent[] {
  return mockEvents.slice(0, 3).map((e) => ({
    ...e,
    status: "approved" as EventStatus,
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
    artistIds: [],
    missingArtists: [],
    dopings: [],
  }));
}

function getSeedOrganizerVenues(): OrganizerVenue[] {
  return mockVenues.slice(0, 2).map((v) => ({
    ...v,
    organizerId: "org1",
    venueStatus: "active" as const,
    createdAt: "2026-01-10T10:00:00Z",
  }));
}

function getSeedCoupons(): Coupon[] {
  return [
    {
      id: "coupon-seed-1",
      code: "PULSE10",
      discountType: "percent",
      discountValue: 10,
      maxUsage: 500,
      usedCount: 47,
      expiresAt: "2026-06-30",
      createdAt: "2026-01-20T10:00:00Z",
      status: "active",
    },
    {
      id: "coupon-seed-2",
      code: "YAZ50",
      discountType: "fixed",
      discountValue: 50,
      eventId: "1",
      maxUsage: 200,
      usedCount: 12,
      expiresAt: "2026-04-15",
      createdAt: "2026-02-01T10:00:00Z",
      status: "active",
    },
  ];
}

function getSeedAnnouncements(): Announcement[] {
  return [
    {
      id: "ann-seed-1",
      eventId: "1",
      eventTitle: "Neon Pulse Festival",
      title: "Sahne Saatleri Güncellendi",
      message: "Sevgili katılımcılar, festival programında küçük bir güncelleme yapıldı. deadmau5 sahne çıkış saati 22:00'dan 22:30'a alınmıştır. Kapı açılış saati değişmemiştir.",
      createdAt: "2026-02-12T14:00:00Z",
    },
    {
      id: "ann-seed-2",
      eventId: "2",
      eventTitle: "Jazz Under Stars",
      title: "Mekan Girişi Hakkında",
      message: "Etkinliğimize katılacak misafirlerimiz, Babylon ana giriş kapısından değil yan giriş kapısından alınacaktır. Lütfen biletlerinizi ve kimliklerinizi yanınızda bulundurun.",
      createdAt: "2026-02-10T11:30:00Z",
    },
  ];
}

function getSeedNotifications(): OrganizerNotification[] {
  return [
    {
      id: "notif-seed-1",
      type: "event_approved",
      title: "Etkinlik Onaylandı",
      message: "Neon Pulse Festival etkinliğiniz yönetici tarafından onaylandı ve yayına alındı.",
      eventId: "1",
      isRead: false,
      createdAt: "2026-02-11T09:00:00Z",
    },
    {
      id: "notif-seed-2",
      type: "ticket_sold",
      title: "Yeni Bilet Satışı",
      message: "Neon Pulse Festival için 1 adet VIP bilet satıldı. Alıcı: Elif Korkmaz",
      eventId: "1",
      isRead: false,
      createdAt: "2026-02-10T15:30:00Z",
    },
    {
      id: "notif-seed-3",
      type: "ticket_sold",
      title: "Yeni Bilet Satışı",
      message: "Neon Pulse Festival için 2 adet General Admission bilet satıldı. Alıcı: Cem Arslan",
      eventId: "1",
      isRead: true,
      createdAt: "2026-02-09T12:00:00Z",
    },
    {
      id: "notif-seed-4",
      type: "doping_expiring",
      title: "Doping Süresi Dolmak Üzere",
      message: "Jazz Under Stars etkinliğinizin Anasayfa Dopingi 3 gün içinde sona erecek.",
      eventId: "2",
      isRead: true,
      createdAt: "2026-02-08T10:00:00Z",
    },
  ];
}

function getSeedStoredTickets(): StoredTicket[] {
  return [
    {
      id: "ticket-1",
      eventId: "1",
      eventTitle: "Neon Pulse Festival",
      artist: "deadmau5",
      venue: "Zorlu PSM",
      city: "İstanbul",
      date: "15 Mar 2026",
      time: "21:00",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
      genre: "Electronic",
      ticketType: "VIP",
      ticketPrice: "₺1,200",
      quantity: 1,
      totalPaid: "₺1,260",
      purchaseDate: "10 Mar 2026",
      buyerName: "Elif Korkmaz",
      buyerEmail: "elif@demo.com",
      status: "active",
      qrSeed: "PULSE-TKT-1-VIP-1710500000",
    },
    {
      id: "ticket-2",
      eventId: "1",
      eventTitle: "Neon Pulse Festival",
      artist: "deadmau5",
      venue: "Zorlu PSM",
      city: "İstanbul",
      date: "15 Mar 2026",
      time: "21:00",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
      genre: "Electronic",
      ticketType: "General Admission",
      ticketPrice: "₺650",
      quantity: 2,
      totalPaid: "₺1,365",
      purchaseDate: "11 Mar 2026",
      buyerName: "Cem Arslan",
      buyerEmail: "cem@demo.com",
      status: "active",
      qrSeed: "PULSE-TKT-2-GA-1710586400",
    },
    {
      id: "ticket-3",
      eventId: "2",
      eventTitle: "Jazz Under Stars",
      artist: "Kamasi Washington",
      venue: "Babylon",
      city: "İstanbul",
      date: "22 Mar 2026",
      time: "20:00",
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
      genre: "Jazz",
      ticketType: "Standard",
      ticketPrice: "₺380",
      quantity: 1,
      totalPaid: "₺399",
      purchaseDate: "12 Mar 2026",
      buyerName: "Zeynep Mert",
      buyerEmail: "zeynep@demo.com",
      status: "active",
      qrSeed: "PULSE-TKT-3-STD-1710672800",
    },
  ];
}

/* ============================================
   HELPERS
   ============================================ */
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

/* ============================================
   PROVIDER
   ============================================ */
export function OrganizerProvider({ children }: { children: ReactNode }) {
  const [organizerEvents, setOrganizerEvents] = useState<OrganizerEvent[]>([]);
  const [organizerVenues, setOrganizerVenues] = useState<OrganizerVenue[]>([]);
  const [artistTickets, setArtistTickets] = useState<ArtistTicket[]>([]);
  const [validationLogs, setValidationLogs] = useState<TicketValidationLog[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [notifications, setNotifications] = useState<OrganizerNotification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const events = loadFromStorage<OrganizerEvent[]>(ORGANIZER_EVENTS_KEY, []);
    const venues = loadFromStorage<OrganizerVenue[]>(ORGANIZER_VENUES_KEY, []);
    const tickets = loadFromStorage<ArtistTicket[]>(ARTIST_TICKETS_KEY, []);
    const logs = loadFromStorage<TicketValidationLog[]>(VALIDATION_LOGS_KEY, []);

    // Seed if empty
    setOrganizerEvents(events.length > 0 ? events : getSeedOrganizerEvents());
    setOrganizerVenues(venues.length > 0 ? venues : getSeedOrganizerVenues());
    setArtistTickets(tickets);
    setValidationLogs(logs);

    // Seed coupons, notifications, announcements if empty
    const storedCoupons = loadFromStorage<Coupon[]>(COUPONS_KEY, []);
    setCoupons(storedCoupons.length > 0 ? storedCoupons : getSeedCoupons());

    const storedNotifs = loadFromStorage<OrganizerNotification[]>(NOTIFICATIONS_KEY, []);
    setNotifications(storedNotifs.length > 0 ? storedNotifs : getSeedNotifications());

    const storedAnns = loadFromStorage<Announcement[]>(ANNOUNCEMENTS_KEY, []);
    setAnnouncements(storedAnns.length > 0 ? storedAnns : getSeedAnnouncements());

    // Seed stored tickets if empty
    const storedTickets = loadFromStorage<StoredTicket[]>(STORED_TICKETS_KEY, []);
    if (storedTickets.length === 0) {
      saveToStorage(STORED_TICKETS_KEY, getSeedStoredTickets());
    }

    setIsInitialized(true);
  }, []);

  // Persist changes
  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage(ORGANIZER_EVENTS_KEY, organizerEvents);
  }, [organizerEvents, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage(ORGANIZER_VENUES_KEY, organizerVenues);
  }, [organizerVenues, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage(ARTIST_TICKETS_KEY, artistTickets);
  }, [artistTickets, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage(VALIDATION_LOGS_KEY, validationLogs);
  }, [validationLogs, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage(COUPONS_KEY, coupons);
  }, [coupons, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage(NOTIFICATIONS_KEY, notifications);
  }, [notifications, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage(ANNOUNCEMENTS_KEY, announcements);
  }, [announcements, isInitialized]);

  // ---- EVENT CRUD ----
  const addEvent = useCallback(
    (event: Omit<OrganizerEvent, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newEvent: OrganizerEvent = {
        ...event,
        id: `evt-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      setOrganizerEvents((prev) => [...prev, newEvent]);
      return newEvent;
    },
    [],
  );

  const updateEvent = useCallback((id: string, data: Partial<OrganizerEvent>) => {
    setOrganizerEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e,
      ),
    );
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setOrganizerEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const submitForApproval = useCallback((id: string) => {
    setOrganizerEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: "pending_approval" as EventStatus, updatedAt: new Date().toISOString() }
          : e,
      ),
    );
  }, []);

  const getEventsByStatus = useCallback(
    (status: EventStatus) => organizerEvents.filter((e) => e.status === status),
    [organizerEvents],
  );

  // ---- VENUE CRUD ----
  const addVenue = useCallback(
    (venue: Omit<OrganizerVenue, "id" | "createdAt">) => {
      const newVenue: OrganizerVenue = {
        ...venue,
        id: `venue-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setOrganizerVenues((prev) => [...prev, newVenue]);
      return newVenue;
    },
    [],
  );

  const updateVenue = useCallback((id: string, data: Partial<OrganizerVenue>) => {
    setOrganizerVenues((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...data } : v)),
    );
  }, []);

  const deleteVenue = useCallback((id: string) => {
    setOrganizerVenues((prev) => prev.filter((v) => v.id !== id));
  }, []);

  // ---- ARTIST TICKETS ----
  const createArtistTicket = useCallback(
    (ticket: Omit<ArtistTicket, "id" | "createdAt" | "status">) => {
      const newTicket: ArtistTicket = {
        ...ticket,
        id: `art-tkt-${Date.now()}`,
        status: "open",
        createdAt: new Date().toISOString(),
      };
      setArtistTickets((prev) => [...prev, newTicket]);
    },
    [],
  );

  // ---- TICKET VALIDATION ----
  const validateTicket = useCallback(
    (
      ticketId: string,
      action: "approved" | "cancelled" | "refunded",
      validatedBy: string,
      notes?: string,
    ): { success: boolean; error?: string } => {
      const storedTickets = loadFromStorage<StoredTicket[]>(STORED_TICKETS_KEY, []);
      const ticket = storedTickets.find((t) => t.id === ticketId);

      if (!ticket) return { success: false, error: "Bilet bulunamadı" };
      if (ticket.status === "used" && action === "approved")
        return { success: false, error: "Bu bilet zaten kullanılmış" };
      if (ticket.status === "cancelled")
        return { success: false, error: "Bu bilet zaten iptal edilmiş" };

      // Update ticket status
      const newStatus = action === "approved" ? "used" : "cancelled";
      const updatedTickets = storedTickets.map((t) =>
        t.id === ticketId ? { ...t, status: newStatus as StoredTicket["status"] } : t,
      );
      saveToStorage(STORED_TICKETS_KEY, updatedTickets);

      // Create log
      const log: TicketValidationLog = {
        id: `log-${Date.now()}`,
        ticketId,
        eventId: ticket.eventId,
        eventTitle: ticket.eventTitle,
        ticketHolderName: ticket.buyerName,
        ticketHolderEmail: ticket.buyerEmail,
        ticketType: ticket.ticketType,
        action,
        validatedBy,
        validatedAt: new Date().toISOString(),
        notes,
      };

      setValidationLogs((prev) => [log, ...prev]);
      return { success: true };
    },
    [],
  );

  const searchTickets = useCallback((query: string, eventId?: string): StoredTicket[] => {
    const storedTickets = loadFromStorage<StoredTicket[]>(STORED_TICKETS_KEY, []);
    const q = query.toLowerCase();
    return storedTickets.filter((t) => {
      const matchesQuery =
        !query ||
        t.buyerName.toLowerCase().includes(q) ||
        t.buyerEmail.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q);
      const matchesEvent = !eventId || t.eventId === eventId;
      return matchesQuery && matchesEvent;
    });
  }, []);

  const getTicketById = useCallback((ticketId: string): StoredTicket | undefined => {
    const storedTickets = loadFromStorage<StoredTicket[]>(STORED_TICKETS_KEY, []);
    return storedTickets.find((t) => t.id === ticketId || t.qrSeed === ticketId);
  }, []);

  // ---- GET ALL TICKETS ----
  const getAllTickets = useCallback((): StoredTicket[] => {
    return loadFromStorage<StoredTicket[]>(STORED_TICKETS_KEY, []);
  }, []);

  // ---- DOPING ----
  const purchaseDoping = useCallback((eventId: string, doping: ActiveDoping) => {
    setOrganizerEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, dopings: [...e.dopings, doping], updatedAt: new Date().toISOString() }
          : e,
      ),
    );
  }, []);

  // ---- COUPONS ----
  const addCoupon = useCallback(
    (coupon: Omit<Coupon, "id" | "createdAt" | "usedCount" | "status">) => {
      const newCoupon: Coupon = {
        ...coupon,
        id: `coupon-${Date.now()}`,
        usedCount: 0,
        status: "active",
        createdAt: new Date().toISOString(),
      };
      setCoupons((prev) => [...prev, newCoupon]);
    },
    [],
  );

  const deleteCoupon = useCallback((id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // ---- NOTIFICATIONS ----
  const addNotification = useCallback(
    (n: Omit<OrganizerNotification, "id" | "createdAt" | "isRead">) => {
      const newNotif: OrganizerNotification = {
        ...n,
        id: `notif-${Date.now()}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
    },
    [],
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ---- ANNOUNCEMENTS ----
  const addAnnouncement = useCallback(
    (a: Omit<Announcement, "id" | "createdAt">) => {
      const newAnn: Announcement = {
        ...a,
        id: `ann-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setAnnouncements((prev) => [newAnn, ...prev]);
    },
    [],
  );

  // ---- CLONE EVENT ----
  const cloneEvent = useCallback(
    (id: string): OrganizerEvent | null => {
      const source = organizerEvents.find((e) => e.id === id);
      if (!source) return null;
      const now = new Date().toISOString();
      const cloned: OrganizerEvent = {
        ...source,
        id: `evt-${Date.now()}`,
        title: `${source.title} (Kopya)`,
        status: "draft" as EventStatus,
        createdAt: now,
        updatedAt: now,
        dopings: [],
        rejectionReason: undefined,
      };
      setOrganizerEvents((prev) => [...prev, cloned]);
      return cloned;
    },
    [organizerEvents],
  );

  // ---- STATS ----
  const stats = {
    totalEvents: organizerEvents.length,
    activeDopings: organizerEvents.reduce(
      (acc, e) => acc + e.dopings.filter((d) => d.status === "active").length,
      0,
    ),
    pendingApproval: organizerEvents.filter((e) => e.status === "pending_approval").length,
    totalTicketsSold: loadFromStorage<StoredTicket[]>(STORED_TICKETS_KEY, []).reduce(
      (acc, t) => acc + t.quantity,
      0,
    ),
  };

  return (
    <OrganizerContext.Provider
      value={{
        organizerEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        submitForApproval,
        getEventsByStatus,
        organizerVenues,
        addVenue,
        updateVenue,
        deleteVenue,
        artistTickets,
        createArtistTicket,
        validationLogs,
        validateTicket,
        searchTickets,
        getTicketById,
        purchaseDoping,
        getAllTickets,
        coupons,
        addCoupon,
        deleteCoupon,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
        announcements,
        addAnnouncement,
        cloneEvent,
        stats,
      }}
    >
      {children}
    </OrganizerContext.Provider>
  );
}

/* ============================================
   HOOK
   ============================================ */
export function useOrganizer() {
  const ctx = useContext(OrganizerContext);
  if (!ctx) {
    throw new Error("useOrganizer must be used within an OrganizerProvider");
  }
  return ctx;
}
