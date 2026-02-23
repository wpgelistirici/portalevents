"use client";

import { use, useState } from "react";
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
import { venues, events } from "@/lib/data";
import {
  ArrowLeft,
  MapPin,
  Users,
  Star,
  Clock,
  Phone,
  Mail,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  Music2,
  Calendar,
  ExternalLink,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  X,
  Building2,
  Ticket,
  Bookmark,
  Share2,
} from "lucide-react";
import { useSaved } from "@/lib/saved-context";
import { useAuth } from "@/lib/auth-context";
import SaveToast from "@/components/ui/SaveToast";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

export default function VenueDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("VenueDetailPage");
  const venue = venues.find((v) => v.id === id);

  if (!venue || !venue.detail) {
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
                <AlertCircle size={32} className="text-accent" />
              </div>
              <h1 className="display-md mb-4">{t("notFound")}</h1>
              <p className="text-muted text-sm mb-8 max-w-md mx-auto">
                {t("notFoundDesc")}
              </p>
              <Link
                href="/venues"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full text-sm font-semibold hover:bg-accent/90 transition-colors"
              >
                <ArrowLeft size={16} />
                {t("backToVenues")}
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const detail = venue.detail;

  // Auto-generate upcoming events for this venue from events data
  const venueEvents = events.filter((e) => e.venue === venue.name);

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen pt-24 pb-20">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <GradientOrb color="accent" size={500} top="-5%" right="-10%" />
          <GradientOrb
            color="primary"
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
              href="/venues"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
              data-cursor-hover
            >
              <ArrowLeft size={14} />
              {t("backToVenues")}
            </Link>
          </FadeInUp>

          {/* Hero section */}
          <FadeInUp delay={0.1}>
            <HeroSection venue={venue} t={t} />
          </FadeInUp>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
            {/* Left column - main content */}
            <div className="lg:col-span-2 space-y-8">
              <FadeInUp delay={0.2}>
                <AboutSection description={detail.description} t={t} />
              </FadeInUp>

              <FadeInUp delay={0.25}>
                <GallerySection gallery={detail.gallery} t={t} />
              </FadeInUp>

              <FadeInUp delay={0.3}>
                <LocationSection detail={detail} venueName={venue.name} t={t} />
              </FadeInUp>

              <FadeInUp delay={0.35}>
                <OpeningHoursSection hours={detail.openingHours} t={t} />
              </FadeInUp>

              <FadeInUp delay={0.4}>
                <ArtistCalendarSection venueEvents={venueEvents} t={t} />
              </FadeInUp>
            </div>

            {/* Right column - sidebar */}
            <div className="space-y-6">
              <FadeInUp delay={0.2}>
                <ContactCard detail={detail} t={t} />
              </FadeInUp>

              <FadeInUp delay={0.3}>
                <SocialMediaCard social={detail.social} t={t} />
              </FadeInUp>

              <FadeInUp delay={0.35}>
                <QuickInfoCard venue={venue} t={t} />
              </FadeInUp>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <SaveToast />
    </>
  );
}

/* ============================================
   VENUE SAVE BUTTON
   ============================================ */
function VenueSaveButton({ venueId }: { venueId: string }) {
  const { isSaved, toggleSave } = useSaved();
  const { isAuthenticated, openAuthModal } = useAuth();
  const saved = isSaved(venueId, "venue");

  return (
    <motion.button
      onClick={() => {
        if (!isAuthenticated) { openAuthModal(); return; }
        toggleSave(venueId, "venue");
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
  venue,
  t,
}: {
  venue: (typeof venues)[0];
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="relative rounded-3xl overflow-hidden group">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={venue.image}
          alt={venue.name}
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
          <div className="glass-strong px-4 py-1.5 rounded-full text-xs font-medium text-accent">
            {venue.type}
          </div>
          <div className="flex items-center gap-1.5 glass-strong px-4 py-1.5 rounded-full">
            <Star size={12} className="text-gold fill-gold" />
            <span className="text-xs font-bold">{venue.rating}</span>
          </div>
        </div>
        <VenueSaveButton venueId={venue.id} />
      </div>

      {/* Content - part of the flow so it grows with text */}
      <div className="relative z-10 flex flex-col justify-end min-h-[40vh] md:min-h-[50vh] p-8 md:p-12 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="display-md md:display-lg mb-3">{venue.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-accent" />
              {venue.city}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-accent" />
              {venue.capacity} {t("capacity")}
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
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Building2 size={16} className="text-accent" />
        </div>
        {t("about")}
      </h2>
      <p className="text-white/70 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

/* ============================================
   GALLERY SECTION
   ============================================ */
function GallerySection({
  gallery,
  t,
}: {
  gallery: string[];
  t: ReturnType<typeof useTranslations>;
}) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <>
      <div className="glass rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Building2 size={16} className="text-secondary" />
          </div>
          {t("gallery")}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {gallery.map((img, i) => (
            <motion.div
              key={i}
              className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage(i)}
              data-cursor-hover
            >
              <Image
                src={img}
                alt={`Gallery ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-accent transition-colors z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X size={20} />
            </button>

            {selectedImage > 0 && (
              <button
                className="absolute left-6 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-accent transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage - 1);
                }}
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {selectedImage < gallery.length - 1 && (
              <button
                className="absolute right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-accent transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage + 1);
                }}
              >
                <ChevronRight size={20} />
              </button>
            )}

            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={gallery[selectedImage]}
                alt={`Gallery ${selectedImage + 1}`}
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
  detail: NonNullable<(typeof venues)[0]["detail"]>;
  venueName: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${detail.lat},${detail.lng}`;

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
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
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
        <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
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
          className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-xs text-accent hover:bg-accent/10 transition-colors flex-shrink-0"
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
   OPENING HOURS SECTION
   ============================================ */
function OpeningHoursSection({
  hours,
  t,
}: {
  hours: NonNullable<(typeof venues)[0]["detail"]>["openingHours"];
  t: ReturnType<typeof useTranslations>;
}) {
  const today = new Date().getDay();
  // JS: 0=Sunday, 1=Monday... Our data: 0=Monday...6=Sunday
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <div className="glass rounded-2xl p-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
          <Clock size={16} className="text-gold" />
        </div>
        {t("openingHours")}
      </h2>

      <div className="space-y-2">
        {hours.map((item, i) => {
          const isToday = i === todayIdx;
          return (
            <motion.div
              key={item.day}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                isToday
                  ? "bg-accent/10 ring-1 ring-accent/30"
                  : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.isOpen ? "bg-green-400" : "bg-red-400"
                  }`}
                />
                <span
                  className={`text-sm ${isToday ? "font-bold text-accent" : "text-white/70"}`}
                >
                  {t(`days.${item.day}`)}
                </span>
                {isToday && (
                  <span className="text-[10px] font-bold bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                    {t("today")}
                  </span>
                )}
              </div>
              <span
                className={`text-sm ${
                  isToday
                    ? "font-bold"
                    : item.isOpen
                      ? "text-white/70"
                      : "text-red-400/70"
                }`}
              >
                {item.isOpen ? item.hours : t("closed")}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================
   ARTIST CALENDAR SECTION
   ============================================ */
function ArtistCalendarSection({
  venueEvents,
  t,
}: {
  venueEvents: (typeof events);
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="glass rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar size={16} className="text-primary" />
          </div>
          {t("artistCalendar")}
        </h2>
        <span className="text-xs text-muted">
          {t("eventCount", { count: venueEvents.length })}
        </span>
      </div>

      {venueEvents.length === 0 ? (
        <div className="text-center py-8">
          <Calendar size={32} className="text-muted mx-auto mb-3" />
          <p className="text-sm text-muted">{t("noUpcomingEvents")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {venueEvents.map((event, i) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/5 transition-all cursor-pointer"
                data-cursor-hover
              >
                {/* Date badge */}
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-primary font-medium uppercase">
                    {event.date.split(" ")[1]}
                  </span>
                  <span className="text-lg font-bold text-primary leading-none">
                    {event.date.split(" ")[0]}
                  </span>
                </div>

                {/* Event image */}
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Event info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-xs text-muted truncate">{event.artist}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-muted">
                    <span className="flex items-center gap-1">
                      <Clock size={9} />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Ticket size={9} />
                      {event.price}
                    </span>
                  </div>
                </div>

                {/* Genre & arrow */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="hidden sm:block text-[10px] font-medium glass-strong px-2.5 py-1 rounded-full">
                    {event.genre}
                  </span>
                  <ChevronRight
                    size={14}
                    className="text-muted group-hover:text-primary transition-colors"
                  />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================
   CONTACT CARD (Sidebar)
   ============================================ */
function ContactCard({
  detail,
  t,
}: {
  detail: NonNullable<(typeof venues)[0]["detail"]>;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="glass rounded-2xl p-6 sticky top-28">
      <h2 className="text-lg font-bold mb-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Phone size={16} className="text-accent" />
        </div>
        {t("contact")}
      </h2>

      <div className="space-y-4">
        {/* Phone */}
        <a
          href={`tel:${detail.phone}`}
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
          data-cursor-hover
        >
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
            <Phone size={16} className="text-green-400" />
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider">
              {t("phone")}
            </p>
            <p className="text-sm font-medium group-hover:text-accent transition-colors">
              {detail.phone}
            </p>
          </div>
        </a>

        {/* Email */}
        <a
          href={`mailto:${detail.email}`}
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
          data-cursor-hover
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Mail size={16} className="text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider">
              {t("email")}
            </p>
            <p className="text-sm font-medium group-hover:text-accent transition-colors">
              {detail.email}
            </p>
          </div>
        </a>

        {/* Website */}
        <a
          href={detail.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
          data-cursor-hover
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
            <Globe size={16} className="text-purple-400" />
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider">
              {t("website")}
            </p>
            <p className="text-sm font-medium group-hover:text-accent transition-colors">
              {detail.website.replace("https://", "")}
            </p>
          </div>
          <ExternalLink size={12} className="text-muted ml-auto flex-shrink-0" />
        </a>
      </div>
    </div>
  );
}

/* ============================================
   SOCIAL MEDIA CARD (Sidebar)
   ============================================ */
function SocialMediaCard({
  social,
  t,
}: {
  social: NonNullable<(typeof venues)[0]["detail"]>["social"];
  t: ReturnType<typeof useTranslations>;
}) {
  const socialLinks = [
    {
      key: "instagram",
      url: social.instagram,
      icon: Instagram,
      color: "from-pink-500 to-purple-500",
      bgColor: "bg-pink-500/10",
      textColor: "text-pink-400",
    },
    {
      key: "twitter",
      url: social.twitter,
      icon: Twitter,
      color: "from-blue-400 to-blue-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
    },
    {
      key: "youtube",
      url: social.youtube,
      icon: Youtube,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-500/10",
      textColor: "text-red-400",
    },
    {
      key: "spotify",
      url: social.spotify,
      icon: Music2,
      color: "from-green-400 to-green-500",
      bgColor: "bg-green-500/10",
      textColor: "text-green-400",
    },
  ].filter((s) => s.url);

  if (socialLinks.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-sm font-bold mb-4 flex items-center gap-3 text-muted uppercase tracking-wider">
        <Globe size={14} className="text-accent" />
        {t("socialMedia")}
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <motion.a
              key={social.key}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2.5 p-3 rounded-xl ${social.bgColor} hover:scale-[1.02] transition-all`}
              whileHover={{ y: -2 }}
              data-cursor-hover
            >
              <Icon size={16} className={social.textColor} />
              <span className="text-xs font-medium capitalize">
                {social.key}
              </span>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================
   QUICK INFO CARD (Sidebar)
   ============================================ */
function QuickInfoCard({
  venue,
  t,
}: {
  venue: (typeof venues)[0];
  t: ReturnType<typeof useTranslations>;
}) {
  const venueEvents = events.filter((e) => e.venue === venue.name);

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-sm font-bold mb-4 flex items-center gap-3 text-muted uppercase tracking-wider">
        <Building2 size={14} className="text-gold" />
        {t("quickInfo")}
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">{t("venueType")}</span>
          <span className="text-xs font-medium glass-strong px-3 py-1 rounded-full">
            {venue.type}
          </span>
        </div>
        <div className="h-px bg-white/5" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">{t("capacity")}</span>
          <span className="text-xs font-bold flex items-center gap-1.5">
            <Users size={11} className="text-accent" />
            {venue.capacity}
          </span>
        </div>
        <div className="h-px bg-white/5" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">{t("rating")}</span>
          <span className="text-xs font-bold flex items-center gap-1.5">
            <Star size={11} className="text-gold fill-gold" />
            {venue.rating}
          </span>
        </div>
        <div className="h-px bg-white/5" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">{t("upcomingEvents")}</span>
          <span className="text-xs font-bold text-primary">
            {venueEvents.length}
          </span>
        </div>
        <div className="h-px bg-white/5" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">{t("city")}</span>
          <span className="text-xs font-medium flex items-center gap-1.5">
            <MapPin size={11} className="text-accent" />
            {venue.city}
          </span>
        </div>
      </div>
    </div>
  );
}
