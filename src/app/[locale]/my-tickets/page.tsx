"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientOrb from "@/components/ui/GradientOrb";
import { FadeInUp } from "@/components/ui/AnimatedText";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/lib/auth-context";
import { QRCodeSVG } from "qrcode.react";
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Download,
  Send,
  XCircle,
  QrCode,
  ChevronDown,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Music,
  Hash,
  CreditCard,
  Users,
  Lock,
} from "lucide-react";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

interface StoredTicket {
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
   QR CODE WITH AUTO-REFRESH
   ============================================ */
function SecureQR({ ticket }: { ticket: StoredTicket }) {
  const t = useTranslations("MyTicketsPage");
  const [qrValue, setQrValue] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const generateQRValue = useCallback(() => {
    const timestamp = Date.now();
    const token = btoa(
      JSON.stringify({
        tid: ticket.id,
        eid: ticket.eventId,
        ts: timestamp,
        seed: ticket.qrSeed,
        hash: `${ticket.id}-${timestamp}-${ticket.qrSeed}`
          .split("")
          .reduce((a, b) => {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
          }, 0)
          .toString(36),
      }),
    );
    return `PORTAL-TICKET://${token}`;
  }, [ticket]);

  useEffect(() => {
    const newVal = generateQRValue();
    const t = setTimeout(() => {
      setQrValue(newVal);
      setTimeLeft(30);
    }, 0);
    return () => clearTimeout(t);
  }, [refreshCounter, generateQRValue]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setRefreshCounter((c) => c + 1);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* QR */}
      <motion.div
        key={refreshCounter}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-4 rounded-2xl"
      >
        <QRCodeSVG
          value={qrValue}
          size={180}
          level="H"
          includeMargin={false}
          bgColor="#FFFFFF"
          fgColor="#000000"
        />
      </motion.div>

      {/* Countdown */}
      <div className="flex items-center gap-2 text-xs text-muted">
        <RefreshCw
          size={11}
          className={timeLeft <= 5 ? "text-primary animate-spin" : ""}
        />
        <span>{t("qrRefresh", { seconds: timeLeft })}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-[180px] h-1 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
          initial={{ width: "100%" }}
          animate={{ width: `${(timeLeft / 30) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-green-400">
        <ShieldCheck size={10} />
        {t("qrSecure")}
      </div>
    </div>
  );
}

/* ============================================
   TICKET CARD COMPONENT
   ============================================ */
function TicketCard({
  ticket,
  isExpanded,
  onToggle,
}: {
  ticket: StoredTicket;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations("MyTicketsPage");

  // Parse date for past/upcoming
  const statusColor =
    ticket.status === "active"
      ? "text-green-400 bg-green-500/10"
      : ticket.status === "used"
        ? "text-muted bg-white/5"
        : "text-red-400 bg-red-500/10";

  const statusLabel =
    ticket.status === "active"
      ? t("statusActive")
      : ticket.status === "used"
        ? t("statusUsed")
        : t("statusCancelled");

  return (
    <motion.div layout className="glass rounded-2xl overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-start gap-4 text-left hover:bg-white/[0.02] transition-colors"
        data-cursor-hover
      >
        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={ticket.image}
            alt={ticket.eventTitle}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-sm truncate">{ticket.eventTitle}</h3>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${statusColor}`}
            >
              {statusLabel}
            </span>
          </div>
          <p className="text-xs text-primary mb-1.5">{ticket.artist}</p>
          <div className="flex flex-wrap gap-3 text-[10px] text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              {ticket.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {ticket.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={10} />
              {ticket.venue}
            </span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted mt-1"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Dashed separator */}
            <div className="mx-5 border-t border-dashed border-white/10" />

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Ticket info */}
              <div className="space-y-4">
                {/* Ticket details grid */}
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow
                    icon={Hash}
                    label={t("ticketId")}
                    value={ticket.id}
                  />
                  <InfoRow
                    icon={Ticket}
                    label={t("ticketType")}
                    value={ticket.ticketType}
                  />
                  <InfoRow
                    icon={Users}
                    label={t("quantity")}
                    value={`${ticket.quantity}x`}
                  />
                  <InfoRow
                    icon={CreditCard}
                    label={t("totalPaid")}
                    value={ticket.totalPaid}
                  />
                  <InfoRow
                    icon={Calendar}
                    label={t("purchaseDate")}
                    value={ticket.purchaseDate}
                  />
                  <InfoRow
                    icon={Music}
                    label={t("genre")}
                    value={ticket.genre}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {ticket.status === "active" && (
                    <>
                      <ActionButton
                        icon={Download}
                        label={t("download")}
                        variant="glass"
                      />
                      <ActionButton
                        icon={Send}
                        label={t("transfer")}
                        variant="glass"
                      />
                      <ActionButton
                        icon={XCircle}
                        label={t("cancel")}
                        variant="danger"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Right: QR code */}
              {ticket.status === "active" && (
                <div className="flex flex-col items-center justify-center">
                  <SecureQR ticket={ticket} />
                </div>
              )}
              {ticket.status !== "active" && (
                <div className="flex flex-col items-center justify-center opacity-40">
                  <QrCode size={80} className="text-muted" />
                  <p className="text-xs text-muted mt-3">
                    {ticket.status === "used" ? t("qrUsed") : t("qrCancelled")}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] text-muted mb-0.5">
        <Icon size={10} />
        {label}
      </div>
      <p className="text-xs font-medium truncate">{value}</p>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  variant,
}: {
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
  variant: "glass" | "danger";
}) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-medium transition-all ${
        variant === "danger"
          ? "text-red-400 bg-red-500/10 hover:bg-red-500/20"
          : "glass text-muted hover:text-foreground hover:bg-white/5"
      }`}
      data-cursor-hover
    >
      <Icon size={12} />
      {label}
    </button>
  );
}

/* ============================================
   MAIN MY TICKETS PAGE
   ============================================ */
export default function MyTicketsPage() {
  const t = useTranslations("MyTicketsPage");
  const { user, isAuthenticated, isLoading, openAuthModal } = useAuth();
  const [tickets, setTickets] = useState<StoredTicket[]>([]);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Open auth modal if not logged in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openAuthModal();
    }
  }, [isLoading, isAuthenticated, openAuthModal]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const stored = JSON.parse(localStorage.getItem("pulse_tickets") || "[]");
    // Defer state update to avoid sync setState in effect warning
    const timer = setTimeout(() => {
      setTickets(stored);
      setIsLoaded(true);
      if (stored.length > 0) setExpandedId(stored[0].id);
    }, 0);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  // Filter tickets (simplified: all active = upcoming, used/cancelled = past)
  const upcomingTickets = tickets.filter((t) => t.status === "active");
  const pastTickets = tickets.filter((t) => t.status !== "active");
  const displayTickets = tab === "upcoming" ? upcomingTickets : pastTickets;

  // Loading state
  if (isLoading) {
    return (
      <>
        <SmoothScroll />
        <CustomCursor />
        <NoiseOverlay />
        <Navbar />
        <main className="min-h-screen pt-32 pb-20 flex items-center justify-center">
          <motion.div
            className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </main>
        <Footer />
      </>
    );
  }

  // Not authenticated - show login prompt
  if (!user) {
    return (
      <>
        <SmoothScroll />
        <CustomCursor />
        <NoiseOverlay />
        <Navbar />
        <main className="min-h-screen pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6 text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full glass flex items-center justify-center">
              <Lock size={32} className="text-primary" />
            </div>
            <h1 className="display-md mb-4">{t("loginRequired")}</h1>
            <p className="text-muted text-sm mb-8">{t("loginRequiredDesc")}</p>
            <button
              onClick={openAuthModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(123,97,255,0.2)]"
              data-cursor-hover
            >
              {t("loginButton")}
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen pt-28 pb-20">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <GradientOrb color="secondary" size={400} top="10%" right="-10%" />
          <GradientOrb
            color="primary"
            size={300}
            bottom="20%"
            left="-5%"
            delay={2}
          />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          {/* Header */}
          <FadeInUp>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="display-md mb-2">{t("title")}</h1>
                <p className="text-sm text-muted">{t("subtitle")}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Ticket size={18} className="text-primary" />
                </div>
                <span className="text-2xl font-bold">
                  {upcomingTickets.length}
                </span>
              </div>
            </div>
          </FadeInUp>

          {/* Tabs */}
          <FadeInUp delay={0.1}>
            <div className="flex gap-2 mb-8">
              {(["upcoming", "past"] as const).map((t2) => (
                <button
                  key={t2}
                  onClick={() => setTab(t2)}
                  className={`px-6 py-2.5 rounded-full text-xs font-medium transition-all ${
                    tab === t2
                      ? "bg-primary text-white shadow-[0_0_20px_rgba(123,97,255,0.3)]"
                      : "glass text-muted hover:text-foreground"
                  }`}
                  data-cursor-hover
                >
                  {t(t2 === "upcoming" ? "tabUpcoming" : "tabPast")}
                  <span className="ml-1.5 opacity-60">
                    (
                    {t2 === "upcoming"
                      ? upcomingTickets.length
                      : pastTickets.length}
                    )
                  </span>
                </button>
              ))}
            </div>
          </FadeInUp>

          {/* Ticket list */}
          {isLoaded && displayTickets.length === 0 && (
            <FadeInUp delay={0.2}>
              <div className="glass rounded-2xl p-16 text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <Ticket size={32} className="text-muted" />
                </div>
                <h2 className="text-lg font-bold mb-2">
                  {tab === "upcoming" ? t("noUpcoming") : t("noPast")}
                </h2>
                <p className="text-sm text-muted mb-6">{t("noTicketsDesc")}</p>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-[0_0_30px_rgba(123,97,255,0.2)]"
                  data-cursor-hover
                >
                  {t("browseEvents")}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </FadeInUp>
          )}

          <div className="space-y-4">
            {displayTickets.map((ticket, i) => (
              <FadeInUp key={ticket.id} delay={0.1 + i * 0.05}>
                <TicketCard
                  ticket={ticket}
                  isExpanded={expandedId === ticket.id}
                  onToggle={() =>
                    setExpandedId(expandedId === ticket.id ? null : ticket.id)
                  }
                />
              </FadeInUp>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
