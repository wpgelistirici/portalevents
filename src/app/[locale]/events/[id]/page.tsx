"use client";

import { use, useState, useRef, useEffect } from "react";
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
import { events, artists, venues } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import { useSaved } from "@/lib/saved-context";
import SaveToast from "@/components/ui/SaveToast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Share2,
  Bookmark,
  ChevronRight,
  Play,
  Users,
  Star,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Ticket,
  QrCode,
  CheckCircle2,
  Music,
  Building2,
  User,
  X,
  ChevronLeft,
  Flag,
} from "lucide-react";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("EventDetailPage");
  const event = events.find((e) => e.id === id);

  if (!event || !event.detail) {
    return (
      <>
        <SmoothScroll />
        <CustomCursor />
        <NoiseOverlay />
        <Navbar />
        <main className="min-h-screen pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-32"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full glass flex items-center justify-center">
                <AlertCircle size={32} className="text-primary" />
              </div>
              <h1 className="display-md mb-4">{t("notFound")}</h1>
              <p className="text-muted text-sm mb-8 max-w-md mx-auto">
                {t("notFoundDesc")}
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <ArrowLeft size={16} />
                {t("backToEvents")}
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const detail = event.detail;
  const artist = artists.find((a) => a.name === event.artist);
  const venue = venues.find((v) => v.name === event.venue);

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen pt-24 pb-20">
        {/* Background orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <GradientOrb color="primary" size={500} top="-5%" right="-10%" />
          <GradientOrb
            color="secondary"
            size={350}
            bottom="10%"
            left="-8%"
            delay={3}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Back button */}
          <FadeInUp>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
              data-cursor-hover
            >
              <ArrowLeft size={14} />
              {t("backToEvents")}
            </Link>
          </FadeInUp>

          {/* Hero section */}
          <FadeInUp delay={0.1}>
            <HeroSection event={event} t={t} />
          </FadeInUp>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
            {/* Left column - main content */}
            <div className="lg:col-span-2 space-y-8">
              <FadeInUp delay={0.2}>
                <AboutSection description={detail.description} t={t} />
              </FadeInUp>

              <FadeInUp delay={0.25}>
                <MediaGallery media={detail.media} t={t} />
              </FadeInUp>

              <FadeInUp delay={0.3}>
                <DateTimeSection event={event} detail={detail} t={t} />
              </FadeInUp>

              <FadeInUp delay={0.35}>
                <LocationSection
                  detail={detail}
                  venueName={event.venue}
                  t={t}
                />
              </FadeInUp>

              <FadeInUp delay={0.4}>
                <RulesSection rules={detail.rules} t={t} />
              </FadeInUp>

              <FadeInUp delay={0.45}>
                <CancellationSection
                  policies={detail.cancellationPolicy}
                  t={t}
                />
              </FadeInUp>

              <FadeInUp delay={0.5}>
                <AttendeesSection attendees={detail.attendees} t={t} />
              </FadeInUp>
            </div>

            {/* Right column - sidebar */}
            <div className="space-y-6">
              <FadeInUp delay={0.2}>
                <TicketsSection
                  tickets={detail.ticketTypes}
                  eventId={id}
                  t={t}
                />
              </FadeInUp>

              {artist && (
                <FadeInUp delay={0.3}>
                  <ArtistCard artist={artist} t={t} />
                </FadeInUp>
              )}

              {venue && (
                <FadeInUp delay={0.35}>
                  <VenueCard venue={venue} t={t} />
                </FadeInUp>
              )}

              <FadeInUp delay={0.4}>
                <OrganizerCard detail={detail} t={t} />
              </FadeInUp>

              <FadeInUp delay={0.45}>
                <ActionsCard eventId={event.id} t={t} />
              </FadeInUp>
            </div>
          </div>

          {/* Similar Events */}
          <FadeInUp delay={0.5}>
            <SimilarEvents currentEvent={event} t={t} />
          </FadeInUp>
        </div>
      </main>

      <Footer />
      <SaveToast />
    </>
  );
}

/* ============================================
   EVENT SAVE BUTTON (Hero)
   ============================================ */
function EventSaveButton({ eventId }: { eventId: string }) {
  const { isSaved, toggleSave } = useSaved();
  const { isAuthenticated, openAuthModal } = useAuth();
  const saved = isSaved(eventId, "event");

  return (
    <motion.button
      onClick={() => {
        if (!isAuthenticated) { openAuthModal(); return; }
        toggleSave(eventId, "event");
      }}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
        saved ? "glass-strong text-gold" : "glass-strong text-white/70 hover:text-white"
      }`}
      whileTap={{ scale: 0.9 }}
      data-cursor-hover
    >
      <Bookmark size={14} className={saved ? "fill-gold" : ""} />
    </motion.button>
  );
}

/* ============================================
   HERO SECTION
   ============================================ */
function HeroSection({
  event,
  t,
}: {
  event: (typeof events)[0];
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="relative rounded-3xl overflow-hidden group">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
      </div>

      {/* Badges & actions */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          {event.trending && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-bold"
            >
              <TrendingUp size={12} />
              {t("trending")}
            </motion.div>
          )}
          <div className="glass-strong px-4 py-1.5 rounded-full text-xs font-medium">
            {event.genre}
          </div>
        </div>
        <EventSaveButton eventId={event.id} />
      </div>

      {/* Content - part of the flow so it grows with text */}
      <div className="relative z-10 flex flex-col justify-end min-h-[40vh] md:min-h-[50vh] p-8 md:p-12 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="text-primary text-sm font-semibold mb-2 tracking-wide">
            {event.artist}
          </p>
          <h1 className="display-md md:display-lg mb-3">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" />
              {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-primary" />
              {event.time}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-primary" />
              {event.venue}, {event.city}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ============================================
   ABOUT SECTION
   ============================================ */
function AboutSection({
  description,
  t,
}: {
  description: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="glass rounded-2xl p-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Music size={16} className="text-primary" />
        </div>
        {t("about")}
      </h2>
      <p className="text-white/70 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

/* ============================================
   MEDIA GALLERY
   ============================================ */
function MediaGallery({
  media,
  t,
}: {
  media: { type: "image" | "video"; url: string; thumbnail?: string }[];
  t: ReturnType<typeof useTranslations>;
}) {
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="glass rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Play size={16} className="text-secondary" />
          </div>
          {t("mediaGallery")}
        </h2>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        >
          {media.map((item, i) => (
            <motion.div
              key={i}
              className="relative flex-shrink-0 w-64 h-44 rounded-xl overflow-hidden cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedMedia(i)}
              data-cursor-hover
            >
              <Image
                src={
                  item.type === "video" ? item.thumbnail || item.url : item.url
                }
                alt={`Media ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Play
                      size={20}
                      className="text-white ml-0.5"
                      fill="white"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedMedia !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setSelectedMedia(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-primary transition-colors z-10"
              onClick={() => setSelectedMedia(null)}
            >
              <X size={20} />
            </button>

            {selectedMedia > 0 && (
              <button
                className="absolute left-6 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-primary transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMedia(selectedMedia - 1);
                }}
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {selectedMedia < media.length - 1 && (
              <button
                className="absolute right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-primary transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMedia(selectedMedia + 1);
                }}
              >
                <ChevronRight size={20} />
              </button>
            )}

            <motion.div
              key={selectedMedia}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {media[selectedMedia].type === "video" ? (
                <iframe
                  src={media[selectedMedia].url}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              ) : (
                <Image
                  src={media[selectedMedia].url}
                  alt={`Media ${selectedMedia + 1}`}
                  fill
                  className="object-contain"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ============================================
   DATE TIME SECTION
   ============================================ */
function DateTimeSection({
  event,
  detail,
  t,
}: {
  event: (typeof events)[0];
  detail: NonNullable<(typeof events)[0]["detail"]>;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="glass rounded-2xl p-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Calendar size={16} className="text-accent" />
        </div>
        {t("dateTime")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Calendar size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              {t("starts")}
            </p>
            <p className="font-semibold">{event.date}</p>
            <p className="text-sm text-white/60">
              {event.time} — {t("doorsOpen")}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-secondary" />
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              {t("ends")}
            </p>
            <p className="font-semibold">{detail.endDate}</p>
            <p className="text-sm text-white/60">{detail.endTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   LOCATION SECTION (with map)
   ============================================ */
function LocationSection({
  detail,
  venueName,
  t,
}: {
  detail: NonNullable<(typeof events)[0]["detail"]>;
  venueName: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${detail.lat},${detail.lng}`;
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${detail.lat},${detail.lng}&zoom=15&size=800x300&scale=2&style=element:geometry%7Ccolor:0x212121&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x757575&style=element:labels.text.stroke%7Ccolor:0x212121&style=feature:road%7Celement:geometry.fill%7Ccolor:0x2c2c2c&markers=color:red%7C${detail.lat},${detail.lng}`;

  return (
    <div className="glass rounded-2xl p-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <MapPin size={16} className="text-primary" />
        </div>
        {t("location")}
      </h2>

      {/* Map */}
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative w-full h-48 rounded-xl overflow-hidden mb-6 group"
        data-cursor-hover
      >
        <div className="absolute inset-0 bg-surface rounded-xl flex items-center justify-center">
          {/* Dark themed map placeholder with interactive styling */}
          <div className="w-full h-full relative bg-surface-light rounded-xl overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                `,
                  backgroundSize: "40px 40px",
                }}
              />
            </div>
            {/* Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(123,97,255,0.4)]">
                  <MapPin size={16} className="text-white" />
                </div>
              </motion.div>
              <div className="w-3 h-1.5 bg-black/30 rounded-full mt-1 blur-[1px]" />
            </div>
            {/* Streets simulation */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/3 w-px h-full bg-white/5" />
              <div className="absolute top-0 left-2/3 w-px h-full bg-white/5" />
              <div className="absolute top-1/3 left-0 w-full h-px bg-white/5" />
              <div className="absolute top-2/3 left-0 w-full h-px bg-white/5" />
              <div className="absolute top-[45%] left-[20%] w-[30%] h-px bg-white/8 rotate-12" />
              <div className="absolute top-[55%] left-[50%] w-[25%] h-px bg-white/8 -rotate-6" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity glass-strong px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2">
            <ExternalLink size={12} />
            {t("openInMaps")}
          </div>
        </div>
      </a>

      <div className="flex items-start gap-4">
        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold mb-1">{venueName}</p>
          <p className="text-sm text-white/60 leading-relaxed">
            {detail.address}
          </p>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-xs text-primary hover:bg-primary/10 transition-colors flex-shrink-0"
          data-cursor-hover
        >
          <ExternalLink size={12} />
          {t("getDirections")}
        </a>
      </div>
    </div>
  );
}

/* ============================================
   RULES SECTION
   ============================================ */
function RulesSection({
  rules,
  t,
}: {
  rules: string[];
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="glass rounded-2xl p-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
          <ShieldCheck size={16} className="text-gold" />
        </div>
        {t("eventRules")}
      </h2>

      <div className="space-y-3">
        {rules.map((rule, i) => (
          <motion.div
            key={rule}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 text-sm"
          >
            <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[10px] text-white/40 font-mono">
                {i + 1}
              </span>
            </div>
            <p className="text-white/70">{t(`rules.${rule}`)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   CANCELLATION SECTION
   ============================================ */
function CancellationSection({
  policies,
  t,
}: {
  policies: string[];
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="glass rounded-2xl p-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <AlertCircle size={16} className="text-primary" />
        </div>
        {t("cancellation")}
      </h2>

      <div className="space-y-3">
        {policies.map((policy, i) => (
          <motion.div
            key={policy}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 text-sm"
          >
            <div className="mt-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  i === 0
                    ? "bg-green-500"
                    : i === 1
                      ? "bg-yellow-500"
                      : i === 2
                        ? "bg-red-500"
                        : "bg-accent"
                }`}
              />
            </div>
            <p className="text-white/70">
              {t(`cancellationPolicies.${policy}`)}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   ATTENDEES SECTION
   ============================================ */
function AttendeesSection({
  attendees,
  t,
}: {
  attendees: NonNullable<(typeof events)[0]["detail"]>["attendees"];
  t: ReturnType<typeof useTranslations>;
}) {
  const visibleCount = 8;
  const visible = attendees.slice(0, visibleCount);
  const remaining = attendees.length - visibleCount;

  return (
    <div className="glass rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Users size={16} className="text-accent" />
          </div>
          {t("attendees")}
        </h2>
        <span className="text-xs text-muted">
          {t("attendeesCount", { count: attendees.length })}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {visible.map((attendee) => (
          <motion.div
            key={attendee.id}
            className="group flex items-center gap-2.5 glass rounded-full pr-4 pl-1 py-1 hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.02 }}
            data-cursor-hover
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/10">
              <Image
                src={attendee.avatar}
                alt={attendee.showName ? attendee.name : t("anonymousAttendee")}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs text-white/70 group-hover:text-white transition-colors">
              {attendee.showName ? attendee.name : t("anonymousAttendee")}
            </span>
          </motion.div>
        ))}

        {remaining > 0 && (
          <div className="flex items-center gap-2 glass rounded-full px-4 py-1">
            <div className="flex -space-x-2">
              {attendees.slice(visibleCount, visibleCount + 3).map((a) => (
                <div
                  key={a.id}
                  className="relative w-6 h-6 rounded-full overflow-hidden ring-2 ring-background"
                >
                  <Image src={a.avatar} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
            <span className="text-xs text-muted">
              {t("moreAttendees", { count: remaining })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================
   TICKETS SECTION (Sidebar)
   ============================================ */
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

function TicketsSection({
  tickets,
  eventId,
  t,
}: {
  tickets: NonNullable<(typeof events)[0]["detail"]>["ticketTypes"];
  eventId: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const [selected, setSelected] = useState(0);
  const { isAuthenticated, openAuthModal } = useAuth();
  const [purchasedTicket, setPurchasedTicket] = useState<StoredTicket | null>(
    null,
  );

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("pulse_tickets") || "[]",
      ) as StoredTicket[];
      const found = stored.find(
        (t) => t.eventId === eventId && t.status === "active",
      );
      if (found) setPurchasedTicket(found);
    } catch {
      // ignore
    }
  }, [eventId]);

  const handleBuyClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openAuthModal();
    }
  };

  return (
    <div className="glass rounded-2xl p-6 sticky top-28">
      {/* Purchased ticket banner */}
      {purchasedTicket && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 rounded-xl bg-green-500/10 border border-green-500/20 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 size={14} className="text-green-400" />
            </div>
            <span className="text-sm font-bold text-green-400">
              {t("youHaveTicket")}
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/50">{t("purchasedTicketType")}</span>
              <span className="font-semibold">{purchasedTicket.ticketType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">{t("purchasedQuantity")}</span>
              <span className="font-semibold">{purchasedTicket.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">{t("purchasedTotal")}</span>
              <span className="font-semibold text-green-400">
                {purchasedTicket.totalPaid}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">{t("purchasedDate")}</span>
              <span className="font-semibold">
                {purchasedTicket.purchaseDate}
              </span>
            </div>
          </div>
          <Link href="/my-tickets">
            <motion.button
              className="w-full mt-4 py-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-cursor-hover
            >
              <QrCode size={14} />
              {t("goToMyTickets")}
            </motion.button>
          </Link>
        </motion.div>
      )}
      <h2 className="text-lg font-bold mb-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Ticket size={16} className="text-primary" />
        </div>
        {t("tickets")}
      </h2>

      <div className="space-y-3">
        {tickets.map((ticket, i) => (
          <motion.div
            key={ticket.name}
            className={`relative rounded-xl p-4 cursor-pointer transition-all duration-300 ${
              !ticket.available
                ? "opacity-50 cursor-not-allowed"
                : selected === i
                  ? "bg-primary/10 ring-1 ring-primary/40"
                  : "glass hover:bg-white/5"
            }`}
            onClick={() => ticket.available && setSelected(i)}
            whileTap={ticket.available ? { scale: 0.98 } : {}}
            data-cursor-hover
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold">{ticket.name}</h3>
              <span
                className={`text-lg font-bold ${
                  ticket.available
                    ? "text-gradient-primary"
                    : "text-muted line-through"
                }`}
              >
                {ticket.price}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-white/50">
                {t(ticket.description)}
              </p>
              {!ticket.available && (
                <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                  {t("soldOut")}
                </span>
              )}
              {ticket.available && selected === i && (
                <motion.span
                  layoutId="ticket-selected"
                  className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                >
                  {t("available")}
                </motion.span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <Link href={`/events/${eventId}/checkout`} onClick={handleBuyClick}>
        <motion.button
          className="w-full mt-5 py-3.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(123,97,255,0.2)]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          data-cursor-hover
        >
          <Ticket size={16} />
          {t("buyNow")}
          <span className="text-white/70 ml-1">
            — {tickets[selected]?.price}
          </span>
        </motion.button>
      </Link>
    </div>
  );
}

/* ============================================
   ARTIST CARD (Sidebar)
   ============================================ */
function ArtistCard({
  artist,
  t,
}: {
  artist: (typeof artists)[0];
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-sm font-bold mb-4 flex items-center gap-3 text-muted uppercase tracking-wider">
        <Music size={14} className="text-primary" />
        {t("artist")}
      </h3>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-lg">{artist.name}</h4>
          <p className="text-xs text-primary">{artist.genre}</p>
        </div>
      </div>

      <p className="text-xs text-white/60 mb-4 leading-relaxed">{artist.bio}</p>

      <div className="flex items-center gap-4 text-xs text-muted mb-4">
        <span>{t("artistFollowers", { count: artist.followers })}</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span>{t("artistUpcoming", { count: artist.upcoming })}</span>
      </div>

      <Link
        href="/artists"
        className="flex items-center justify-center gap-2 w-full py-2.5 glass rounded-xl text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
        data-cursor-hover
      >
        <User size={12} />
        {t("viewArtist")}
        <ChevronRight size={12} />
      </Link>
    </div>
  );
}

/* ============================================
   VENUE CARD (Sidebar)
   ============================================ */
function VenueCard({
  venue,
  t,
}: {
  venue: (typeof venues)[0];
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-sm font-bold mb-4 flex items-center gap-3 text-muted uppercase tracking-wider">
        <Building2 size={14} className="text-accent" />
        {t("venue")}
      </h3>

      <div className="relative w-full h-32 rounded-xl overflow-hidden mb-4">
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <h4 className="font-bold">{venue.name}</h4>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted mb-4">
        <span className="flex items-center gap-1">
          <MapPin size={11} className="text-accent" />
          {venue.city}
        </span>
        <span className="flex items-center gap-1">
          <Users size={11} className="text-accent" />
          {t("venueCapacity", { capacity: venue.capacity })}
        </span>
        <span className="flex items-center gap-1">
          <Star size={11} className="text-gold fill-gold" />
          {venue.rating}
        </span>
      </div>

      <Link
        href={`/venues/${venue.id}`}
        className="flex items-center justify-center gap-2 w-full py-2.5 glass rounded-xl text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
        data-cursor-hover
      >
        <Building2 size={12} />
        {t("viewVenue")}
        <ChevronRight size={12} />
      </Link>
    </div>
  );
}

/* ============================================
   ORGANIZER CARD (Sidebar)
   ============================================ */
function OrganizerCard({
  detail,
  t,
}: {
  detail: NonNullable<(typeof events)[0]["detail"]>;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-sm font-bold mb-4 flex items-center gap-3 text-muted uppercase tracking-wider">
        <ShieldCheck size={14} className="text-gold" />
        {t("organizer")}
      </h3>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={detail.organizerLogo}
            alt={detail.organizerName}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold">{detail.organizerName}</h4>
          <p className="text-[10px] text-muted flex items-center gap-1 mt-0.5">
            <ShieldCheck size={10} className="text-green-400" />
            Verified Organizer
          </p>
        </div>
      </div>

      <p className="text-xs text-white/60 mb-4 leading-relaxed">
        {detail.organizerDescription}
      </p>

      <div className="flex gap-2">
        <button
          className="flex-1 py-2.5 glass rounded-xl text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-1.5"
          data-cursor-hover
        >
          <User size={12} />
          {t("viewOrganizer")}
        </button>
        <button
          className="flex-1 py-2.5 glass rounded-xl text-xs font-medium text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-1.5"
          data-cursor-hover
        >
          <ExternalLink size={12} />
          {t("contactOrganizer")}
        </button>
      </div>
    </div>
  );
}

/* ============================================
   ACTIONS CARD (Sidebar)
   ============================================ */
function ActionsCard({ eventId, t }: { eventId: string; t: ReturnType<typeof useTranslations> }) {
  const { isSaved, toggleSave } = useSaved();
  const { isAuthenticated, openAuthModal } = useAuth();
  const saved = isSaved(eventId, "event");

  const handleSave = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    toggleSave(eventId, "event");
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex flex-col gap-2">
        <button
          className="w-full py-2.5 glass rounded-xl text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
          data-cursor-hover
        >
          <Share2 size={14} />
          {t("shareEvent")}
        </button>
        <motion.button
          onClick={handleSave}
          className={`w-full py-2.5 glass rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2 ${
            saved
              ? "text-gold bg-gold/5 hover:bg-gold/10"
              : "text-white/70 hover:text-white hover:bg-white/5"
          }`}
          whileTap={{ scale: 0.97 }}
          data-cursor-hover
        >
          <Bookmark size={14} className={saved ? "fill-gold" : ""} />
          {saved ? t("saved") : t("saveEvent")}
        </motion.button>
        <button
          className="w-full py-2.5 glass rounded-xl text-xs font-medium text-muted hover:text-red-400 hover:bg-red-500/5 transition-colors flex items-center justify-center gap-2"
          data-cursor-hover
        >
          <Flag size={14} />
          {t("reportEvent")}
        </button>
      </div>
    </div>
  );
}

/* ============================================
   SIMILAR EVENTS
   ============================================ */
function SimilarEvents({
  currentEvent,
  t,
}: {
  currentEvent: (typeof events)[0];
  t: ReturnType<typeof useTranslations>;
}) {
  const similar = events
    .filter(
      (e) =>
        e.id !== currentEvent.id &&
        (e.genre === currentEvent.genre || e.city === currentEvent.city),
    )
    .slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="display-md mb-8">{t("similarEvents")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {similar.map((event, i) => (
          <Link key={event.id} href={`/events/${event.id}`}>
            <motion.div
              className="group glass rounded-2xl overflow-hidden card-hover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              data-cursor-hover
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute top-3 right-3 glass-strong px-3 py-1 rounded-full text-[10px] font-medium">
                  {event.genre}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <p className="text-xs text-muted mb-3">{event.artist}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Calendar size={11} className="text-primary" />
                    {event.date}
                  </div>
                  <span className="text-sm font-bold text-white">
                    {event.price}
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
