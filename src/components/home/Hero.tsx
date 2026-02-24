"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import GradientOrb from "@/components/ui/GradientOrb";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowDown, Play, Search, Calendar, Music, MapPin } from "lucide-react";
import { Link } from "@/i18n/routing";
import { events, artists, venues } from "@/lib/data";
import type { Event, Artist, Venue } from "@/lib/data";
import gsap from "gsap";

interface SearchResults {
  events: Event[];
  artists: Artist[];
  venues: Venue[];
}

function HeroSearch() {
  const t = useTranslations("Hero");
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    events: [],
    artists: [],
    venues: [],
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasResults =
    results.events.length > 0 ||
    results.artists.length > 0 ||
    results.venues.length > 0;

  const showDropdown = focused && query.length >= 2 && hasResults;

  const search = useCallback((q: string) => {
    if (q.length < 2) {
      setResults({ events: [], artists: [], venues: [] });
      return;
    }
    const lower = q.toLowerCase();

    const matchedEvents = events
      .filter(
        (e) =>
          e.title.toLowerCase().includes(lower) ||
          e.artist.toLowerCase().includes(lower) ||
          e.venue.toLowerCase().includes(lower) ||
          e.genre.toLowerCase().includes(lower)
      )
      .slice(0, 3);

    const matchedArtists = artists
      .filter(
        (a) =>
          a.name.toLowerCase().includes(lower) ||
          a.genre.toLowerCase().includes(lower)
      )
      .slice(0, 3);

    const matchedVenues = venues
      .filter(
        (v) =>
          v.name.toLowerCase().includes(lower) ||
          v.city.toLowerCase().includes(lower)
      )
      .slice(0, 3);

    setResults({
      events: matchedEvents,
      artists: matchedArtists,
      venues: matchedVenues,
    });
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => search(value), 300);
    },
    [search]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.7 }}
    >
      {/* Search input */}
      <div
        className={`relative flex items-center gap-3 glass-strong rounded-2xl px-5 py-4 transition-all duration-300 ${
          focused
            ? "ring-1 ring-primary/40 shadow-[0_0_30px_rgba(123,97,255,0.15)]"
            : ""
        }`}
      >
        <Search size={20} className="text-muted flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={t("searchPlaceholder")}
          className="flex-1 bg-transparent text-foreground text-base placeholder:text-muted/60 outline-none"
          style={{ cursor: "text" }}
        />
        {query.length > 0 && (
          <button
            onClick={() => {
              setQuery("");
              setResults({ events: [], artists: [], venues: [] });
            }}
            className="text-muted hover:text-foreground transition-colors text-xs"
            style={{ cursor: "pointer" }}
          >
            {t("searchClear")}
          </button>
        )}
      </div>

      {/* Dropdown results */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full mt-2 rounded-2xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto bg-[#111111]/95 backdrop-blur-2xl border border-white/10 shadow-2xl"
          >
            {results.events.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-2 px-2 pb-2">
                  <Calendar size={13} className="text-primary" />
                  <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                    {t("searchEvents")}
                  </span>
                </div>
                {results.events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                    style={{ cursor: "pointer" }}
                    onClick={() => setFocused(false)}
                  >
                    <div
                      className="w-10 h-10 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${event.image})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {event.artist} &middot; {event.date}
                      </p>
                    </div>
                    <span className="text-xs text-white font-medium flex-shrink-0">
                      {event.price}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {results.artists.length > 0 && (
              <div className="p-3 border-t border-white/5">
                <div className="flex items-center gap-2 px-2 pb-2">
                  <Music size={13} className="text-primary" />
                  <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                    {t("searchArtists")}
                  </span>
                </div>
                {results.artists.map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/artists/${artist.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                    style={{ cursor: "pointer" }}
                    onClick={() => setFocused(false)}
                  >
                    <div
                      className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${artist.image})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {artist.name}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {artist.genre} &middot; {artist.followers} takipçi
                      </p>
                    </div>
                    <span className="text-xs text-muted flex-shrink-0">
                      {artist.upcoming} etkinlik
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {results.venues.length > 0 && (
              <div className="p-3 border-t border-white/5">
                <div className="flex items-center gap-2 px-2 pb-2">
                  <MapPin size={13} className="text-primary" />
                  <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                    {t("searchVenues")}
                  </span>
                </div>
                {results.venues.map((venue) => (
                  <Link
                    key={venue.id}
                    href={`/venues/${venue.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                    style={{ cursor: "pointer" }}
                    onClick={() => setFocused(false)}
                  >
                    <div
                      className="w-10 h-10 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${venue.image})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {venue.name}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {venue.city} &middot; {venue.type}
                      </p>
                    </div>
                    <span className="text-xs text-muted flex-shrink-0">
                      {venue.capacity} kişi
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results state */}
      <AnimatePresence>
        {focused && query.length >= 2 && !hasResults && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute left-0 right-0 top-full mt-2 rounded-2xl p-6 text-center z-50 bg-[#111111]/95 backdrop-blur-2xl border border-white/10 shadow-2xl"
          >
            <p className="text-sm text-muted">{t("searchNoResults")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function HeroTitle() {
  const t = useTranslations("Hero");

  return (
    <h1 className="mb-4">
      <motion.span
        className="display-md inline-block"
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 0.7,
          delay: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {t("line1")}{" "}
        <span className="text-gradient-primary">{t("line2")}</span>{" "}
        {t("line3")}
      </motion.span>
    </h1>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioVisualizerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Hero");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  useEffect(() => {
    if (!audioVisualizerRef.current) return;
    const bars = audioVisualizerRef.current.querySelectorAll(".vis-bar");

    bars.forEach((bar, i) => {
      gsap.to(bar, {
        height: `${Math.random() * 80 + 20}%`,
        duration: 0.4 + Math.random() * 0.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.02,
      });
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-32"
    >
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <GradientOrb
          color="primary"
          size={600}
          top="-10%"
          left="-10%"
          delay={0}
        />
        <GradientOrb
          color="secondary"
          size={500}
          top="20%"
          right="-15%"
          delay={2}
        />
        <GradientOrb
          color="accent"
          size={400}
          bottom="-10%"
          left="30%"
          delay={4}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Audio Visualizer Background */}
      <div
        ref={audioVisualizerRef}
        className="absolute bottom-0 left-0 w-full h-[30vh] flex items-end gap-[1px] opacity-[0.08]"
      >
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={i}
            className="vis-bar flex-1 min-w-[2px] bg-gradient-to-t from-primary to-secondary rounded-t"
            style={{ height: "20%" }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-3xl mx-auto w-full"
        style={{ y, opacity, scale }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-xs font-medium text-muted">
            {t("liveBadge")}
          </span>
        </motion.div>

        {/* Headline */}
        <HeroTitle />

        {/* Subtitle */}
        <motion.p
          className="text-base md:text-lg text-muted max-w-lg mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          {t("subtitle")}{" "}
          <span className="text-foreground font-medium">
            {t("subtitleHighlight")}
          </span>
        </motion.p>

        {/* Search */}
        <HeroSearch />

        {/* CTA Buttons */}
        <motion.div
          className="relative z-0 flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.7 }}
        >
          <MagneticButton className="px-6 py-3 bg-primary text-white text-sm font-semibold rounded-full hover:shadow-[0_0_30px_rgba(123,97,255,0.4)] transition-shadow duration-500">
            <span className="flex items-center gap-2">
              {t("ctaExplore")}
              <ArrowDown size={14} className="animate-bounce" />
            </span>
          </MagneticButton>

          <MagneticButton className="px-6 py-3 glass text-foreground text-sm font-semibold rounded-full hover:bg-white/10 transition-all duration-300">
            <span className="flex items-center gap-2">
              <Play size={12} fill="currentColor" />
              {t("ctaHow")}
            </span>
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
