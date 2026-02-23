"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Navbar from "@/components/layout/Navbar";
import { events, genres } from "@/lib/data";
import type { Event } from "@/lib/data";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  X,
  TrendingUp,
  Navigation,
  Music,
  PanelLeftClose,
  SlidersHorizontal,
} from "lucide-react";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

// Dynamic import for the map component (Leaflet requires window)
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ background: "#0a0a0b" }}>
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-xs text-muted animate-pulse">Harita yükleniyor...</p>
      </div>
    </div>
  ),
});

/* ============================================
   SELECTED EVENT DETAIL PANEL (anchored to marker)
   ============================================ */
function EventDetailPanel({
  event,
  onClose,
  t,
  markerPos,
}: {
  event: Event;
  onClose: () => void;
  t: ReturnType<typeof useTranslations>;
  markerPos: { x: number; y: number } | null;
}) {
  const panelWidth = 310;
  const panelHeight = 380;
  const arrowOffset = 20;
  const gap = 28;

  // Calculate position: to the right of the marker by default,
  // flip to left if not enough space
  const windowW = typeof window !== "undefined" ? window.innerWidth : 1920;
  const windowH = typeof window !== "undefined" ? window.innerHeight : 1080;

  if (!markerPos) return null;

  const spaceRight = windowW - markerPos.x - gap;
  const showRight = spaceRight >= panelWidth + 20;

  const left = showRight
    ? markerPos.x + gap
    : markerPos.x - gap - panelWidth;

  // Vertically center on marker, but clamp to viewport
  const minTop = 100;
  const maxTop = windowH - panelHeight - 20;
  const rawTop = markerPos.y - panelHeight / 2;
  const top = Math.max(minTop, Math.min(maxTop, rawTop));

  // Arrow vertical position relative to panel
  const arrowTop = Math.max(24, Math.min(panelHeight - 40, markerPos.y - top));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: showRight ? 20 : -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: showRight ? 20 : -20 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="fixed z-[600] hidden lg:block"
      style={{ left, top, width: panelWidth }}
    >
      {/* Arrow pointing to marker */}
      <div
        className="absolute w-3 h-3 rotate-45 border border-white/[0.06]"
        style={{
          background: "#0a0a0b",
          top: arrowTop - 6,
          ...(showRight
            ? { left: -7, borderRight: "none", borderTop: "none" }
            : { right: -7, borderLeft: "none", borderBottom: "none" }),
        }}
      />

      <div
        className="rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/[0.06]"
        style={{ background: "#0a0a0b" }}
      >
        {/* Image */}
        <div className="relative h-36">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-black/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-colors"
            data-cursor-hover
          >
            <X size={12} />
          </button>

          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-medium backdrop-blur-sm bg-black/40 border border-white/10">
            {event.genre}
          </div>

          <div className="absolute bottom-2.5 left-3">
            <span className="text-lg font-bold text-gradient-primary">
              {event.price}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4" style={{ background: "#0a0a0b" }}>
          <h3 className="text-sm font-bold mb-0.5">{event.title}</h3>
          <p className="text-[11px] text-primary mb-3">{event.artist}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2.5 text-[11px] text-muted">
              <Calendar size={11} className="text-primary/60" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[11px] text-muted">
              <Clock size={11} className="text-primary/60" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[11px] text-muted">
              <MapPin size={11} className="text-primary/60" />
              <span>{event.venue}, {event.city}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/events/${event.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-white text-[11px] font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(255,45,85,0.2)]"
              data-cursor-hover
            >
              {t("viewEvent")}
              <ArrowRight size={11} />
            </Link>
            {event.detail && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${event.detail.lat},${event.detail.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 px-3.5 py-2.5 rounded-xl text-[11px] font-medium border border-white/[0.06] hover:bg-white/[0.04] transition-colors"
                style={{ background: "#111113" }}
                data-cursor-hover
              >
                <Navigation size={11} />
                {t("directions")}
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================
   MAIN MAP EXPLORATION PAGE
   ============================================ */
export default function ExploreMapPage() {
  const t = useTranslations("ExploreMapPage");
  const tCommon = useTranslations("Common");

  const [activeGenre, setActiveGenre] = useState("Tümü");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [markerPos, setMarkerPos] = useState<{ x: number; y: number } | null>(null);

  // Only events with coordinates
  const eventsWithCoords = useMemo(
    () => events.filter((e) => e.detail?.lat && e.detail?.lng),
    [],
  );

  // Filter by genre + search
  const filteredEvents = useMemo(() => {
    let filtered = eventsWithCoords;

    if (activeGenre !== "Tümü") {
      filtered = filtered.filter((e) => e.genre === activeGenre);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.artist.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q),
      );
    }

    return filtered;
  }, [activeGenre, searchQuery, eventsWithCoords]);

  // Istanbul center as default
  const mapCenter = useMemo(
    () => ({ lat: 41.0082, lng: 28.9784 }),
    [],
  );

  const handleSelectEvent = useCallback(
    (event: Event) => {
      setSelectedEvent((prev) => (prev?.id === event.id ? null : event));
    },
    [],
  );

  const handleMarkerPosition = useCallback(
    (pos: { x: number; y: number } | null) => {
      setMarkerPos(pos);
    },
    [],
  );

  return (
    <>
      <CustomCursor />
      <Navbar variant="solid" />

      {/* Full-screen map container */}
      <div className="fixed inset-0 z-0" style={{ background: "#0a0a0b" }}>
        <MapView
          events={filteredEvents}
          center={mapCenter}
          selectedEvent={selectedEvent}
          onSelectEvent={handleSelectEvent}
          onMarkerPosition={handleMarkerPosition}
        />
      </div>

      {/* ========== FLOATING UI OVERLAYS ========== */}

      {/* Left Drawer */}
      <motion.div
        className="fixed top-0 left-0 bottom-0 z-[500] flex pt-[76px] lg:pt-[90px]"
        initial={false}
        animate={{ x: isDrawerOpen ? 0 : -360 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Drawer panel */}
        <div
          className="w-[360px] h-full flex flex-col border-r border-white/[0.04] shadow-2xl shadow-black/50"
          style={{ background: "rgba(10, 10, 11, 0.92)" }}
        >
          {/* Drawer header */}
          <div className="p-4 pb-3 border-b border-white/[0.04]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Search size={14} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-bold">{t("drawerTitle")}</h2>
                  <p className="text-[10px] text-muted">
                    {filteredEvents.length} {t("events")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
                data-cursor-hover
              >
                <PanelLeftClose size={14} />
              </button>
            </div>

            {/* Search bar */}
            <div
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
                isSearchFocused
                  ? "border-primary/30 bg-white/[0.04]"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              <Search
                size={14}
                className={`flex-shrink-0 transition-colors ${isSearchFocused ? "text-primary" : "text-white/30"}`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder={t("searchPlaceholder")}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-white/30 hover:text-white transition-colors"
                  data-cursor-hover
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Genre filter chips */}
          <div className="px-4 py-3 border-b border-white/[0.04]">
            <div className="flex items-center gap-2 mb-2.5">
              <SlidersHorizontal size={11} className="text-white/30" />
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium">
                {t("categories")}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    setActiveGenre(genre);
                    setSelectedEvent(null);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-200 ${
                    activeGenre === genre
                      ? "bg-primary text-white shadow-[0_0_12px_rgba(255,45,85,0.2)]"
                      : "bg-white/[0.04] text-white/40 hover:text-white/70 hover:bg-white/[0.07]"
                  }`}
                  data-cursor-hover
                >
                  {genre === "Tümü" ? tCommon("all") : genre}
                </button>
              ))}
            </div>
          </div>

          {/* Event list in drawer */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="p-2">
              {filteredEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => handleSelectEvent(event)}
                  className={`w-full text-left p-3 rounded-xl mb-1 transition-all duration-200 ${
                    selectedEvent?.id === event.id
                      ? "bg-primary/10 ring-1 ring-primary/20"
                      : "hover:bg-white/[0.03]"
                  }`}
                  data-cursor-hover
                >
                  <div className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      {event.trending && (
                        <div className="absolute top-0.5 left-0.5 bg-primary/90 p-0.5 rounded">
                          <TrendingUp size={7} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold truncate">{event.title}</h3>
                      <p className="text-[10px] text-primary truncate">{event.artist}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[9px] text-white/30">
                        <span className="flex items-center gap-0.5">
                          <Calendar size={8} />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <MapPin size={8} />
                          {event.venue}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-gradient-primary flex-shrink-0 mt-0.5">
                      {event.price}
                    </span>
                  </div>
                </button>
              ))}

              {filteredEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <MapPin size={24} className="text-white/15 mb-3" />
                  <p className="text-xs text-white/30">{t("noEvents")}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toggle button (attached to drawer edge) */}
        <div className="flex flex-col justify-center py-4">
          <motion.button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="relative -ml-px flex items-center justify-center w-7 h-14 rounded-r-xl border border-l-0 border-white/[0.06] text-white/40 hover:text-white transition-all"
            style={{ background: "rgba(10, 10, 11, 0.88)", backdropFilter: "blur(16px)" }}
            whileHover={{ width: 32 }}
            data-cursor-hover
          >
            <motion.div animate={{ rotate: isDrawerOpen ? 0 : 180 }}>
              <PanelLeftClose size={13} />
            </motion.div>
          </motion.button>
        </div>
      </motion.div>

      {/* Event detail panel anchored to marker (desktop) */}
      <AnimatePresence>
        {selectedEvent && markerPos && (
          <EventDetailPanel
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            t={t}
            markerPos={markerPos}
          />
        )}
      </AnimatePresence>

      {/* Mobile: Selected event bottom sheet */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[700] lg:hidden"
          >
            <div
              className="rounded-t-2xl overflow-hidden border-t border-white/[0.06] shadow-2xl shadow-black/60"
              style={{ background: "#0a0a0b" }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-8 h-1 rounded-full bg-white/15" />
              </div>

              <div className="flex gap-4 p-4 pt-0">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold truncate">
                        {selectedEvent.title}
                      </h3>
                      <p className="text-[11px] text-primary">
                        {selectedEvent.artist}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="w-7 h-7 rounded-full bg-white/[0.05] flex items-center justify-center text-white/40 hover:text-white flex-shrink-0"
                      data-cursor-hover
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar size={9} />
                      {selectedEvent.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={9} />
                      {selectedEvent.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={9} />
                      {selectedEvent.venue}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-base font-bold text-gradient-primary">
                      {selectedEvent.price}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 px-4 pb-5">
                <Link
                  href={`/events/${selectedEvent.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors"
                  data-cursor-hover
                >
                  {t("viewEvent")}
                  <ArrowRight size={12} />
                </Link>
                {selectedEvent.detail && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedEvent.detail.lat},${selectedEvent.detail.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl text-xs font-medium border border-white/[0.06]"
                    style={{ background: "#111113" }}
                    data-cursor-hover
                  >
                    <Navigation size={12} />
                    {t("directions")}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
