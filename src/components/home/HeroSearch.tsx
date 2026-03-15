"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Search, Calendar, Music, MapPin } from "lucide-react";
import { Link } from "@/i18n/routing";
import { events, artists, venues } from "@/lib/data";
import type { Event, Artist, Venue } from "@/lib/data";
import {
  SEARCH_DEBOUNCE_MS,
  SEARCH_MIN_LENGTH,
  SEARCH_MAX_RESULTS_PER_CATEGORY,
} from "@/lib/constants";

interface SearchResults {
  events: Event[];
  artists: Artist[];
  venues: Venue[];
}

export default function HeroSearch() {
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

  const showDropdown = focused && query.length >= SEARCH_MIN_LENGTH && hasResults;

  const search = useCallback((q: string) => {
    if (q.length < SEARCH_MIN_LENGTH) {
      setResults({ events: [], artists: [], venues: [] });
      return;
    }
    const lower = q.toLowerCase();

    setResults({
      events: events
        .filter(
          (e) =>
            e.title.toLowerCase().includes(lower) ||
            e.artist.toLowerCase().includes(lower) ||
            e.venue.toLowerCase().includes(lower) ||
            e.genre.toLowerCase().includes(lower),
        )
        .slice(0, SEARCH_MAX_RESULTS_PER_CATEGORY),
      artists: artists
        .filter(
          (a) =>
            a.name.toLowerCase().includes(lower) ||
            a.genre.toLowerCase().includes(lower),
        )
        .slice(0, SEARCH_MAX_RESULTS_PER_CATEGORY),
      venues: venues
        .filter(
          (v) =>
            v.name.toLowerCase().includes(lower) ||
            v.city.toLowerCase().includes(lower),
        )
        .slice(0, SEARCH_MAX_RESULTS_PER_CATEGORY),
    });
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => search(value), SEARCH_DEBOUNCE_MS);
    },
    [search],
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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
          focused ? "ring-1 ring-primary/40 shadow-[0_0_30px_rgba(123,97,255,0.15)]" : ""
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
            className="absolute left-0 right-0 top-full mt-2 rounded-2xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto bg-surface/95 backdrop-blur-2xl border border-foreground/10 shadow-2xl"
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
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-foreground/5 transition-colors group"
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
                    <span className="text-xs text-foreground font-medium flex-shrink-0">
                      {event.price}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {results.artists.length > 0 && (
              <div className="p-3 border-t border-foreground/5">
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
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-foreground/5 transition-colors group"
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
                        {artist.genre} &middot; {artist.followers} {t("searchFollowers")}
                      </p>
                    </div>
                    <span className="text-xs text-muted flex-shrink-0">
                      {artist.upcoming} {t("searchUpcoming")}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {results.venues.length > 0 && (
              <div className="p-3 border-t border-foreground/5">
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
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-foreground/5 transition-colors group"
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
                      {venue.capacity} {t("searchCapacity")}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results */}
      <AnimatePresence>
        {focused && query.length >= SEARCH_MIN_LENGTH && !hasResults && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute left-0 right-0 top-full mt-2 rounded-2xl p-6 text-center z-50 bg-surface/95 backdrop-blur-2xl border border-foreground/10 shadow-2xl"
          >
            <p className="text-sm text-muted">{t("searchNoResults")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
