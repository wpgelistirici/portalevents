"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { venues } from "@/lib/data";
import { useTranslations } from "next-intl";
import { FadeInUp, AnimatedWords } from "@/components/ui/AnimatedText";
import GradientOrb from "@/components/ui/GradientOrb";
import {
  MapPin,
  Users,
  Star,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

const venueTypes = ["All", "Concert Hall", "Club", "Arena", "Underground Club"];

export default function VenuesPage() {
  const t = useTranslations("VenuesPage");
  const tCommon = useTranslations("Common");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "name" | "capacity">(
    "rating",
  );
  const [cityFilter, setCityFilter] = useState("all");

  const cities = useMemo(() => {
    const set = new Set(venues.map((v) => v.city));
    return ["all", ...Array.from(set)];
  }, []);

  const filteredVenues = useMemo(() => {
    let result = [...venues];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q) ||
          v.type.toLowerCase().includes(q),
      );
    }

    if (activeType !== "All") {
      result = result.filter((v) => v.type === activeType);
    }

    if (cityFilter !== "all") {
      result = result.filter((v) => v.city === cityFilter);
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "capacity") {
      result.sort((a, b) => {
        const parseCapacity = (s: string) => parseInt(s.replace(/,/g, ""), 10);
        return parseCapacity(b.capacity) - parseCapacity(a.capacity);
      });
    } else {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchQuery, activeType, sortBy, cityFilter]);
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen pt-32 pb-20">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <GradientOrb color="accent" size={450} top="10%" left="-5%" />
          <GradientOrb
            color="primary"
            size={300}
            bottom="10%"
            right="-10%"
            delay={3}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Search and filters */}
          <FadeInUp>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
              <div className="relative flex-1 w-full">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-accent/50 placeholder:text-muted"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                data-cursor-hover
                className={`flex items-center gap-2 px-5 py-3 glass rounded-xl text-sm transition-colors ${
                  showFilters
                    ? "text-accent border-accent/30"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <SlidersHorizontal size={14} />
                {t("filters")}
              </button>
            </div>

            {/* Filter panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="glass rounded-xl p-5 mb-6 flex flex-wrap gap-6">
                    <div>
                      <label className="text-[10px] text-muted uppercase tracking-wider mb-2 block">
                        {tCommon("city")}
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {cities.map((city) => (
                          <button
                            key={city}
                            onClick={() => setCityFilter(city)}
                            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                              cityFilter === city
                                ? "bg-accent/15 text-accent font-medium"
                                : "glass text-muted hover:text-foreground"
                            }`}
                            data-cursor-hover
                          >
                            {city === "all" ? tCommon("all") : city}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-muted uppercase tracking-wider mb-2 block">
                        {t("sortBy")}
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSortBy("rating")}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                            sortBy === "rating"
                              ? "bg-accent/15 text-accent font-medium"
                              : "glass text-muted hover:text-foreground"
                          }`}
                          data-cursor-hover
                        >
                          {t("byRating")}
                        </button>
                        <button
                          onClick={() => setSortBy("name")}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                            sortBy === "name"
                              ? "bg-accent/15 text-accent font-medium"
                              : "glass text-muted hover:text-foreground"
                          }`}
                          data-cursor-hover
                        >
                          {t("byName")}
                        </button>
                        <button
                          onClick={() => setSortBy("capacity")}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                            sortBy === "capacity"
                              ? "bg-accent/15 text-accent font-medium"
                              : "glass text-muted hover:text-foreground"
                          }`}
                          data-cursor-hover
                        >
                          {t("byCapacity")}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </FadeInUp>

          {/* Type tabs */}
          <FadeInUp delay={0.1}>
            <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-2 scrollbar-hide">
              {venueTypes.map((type) => (
                <button
                  key={type}
                  data-cursor-hover
                  onClick={() => setActiveType(type)}
                  className={`px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                    activeType === type
                      ? "bg-accent text-white shadow-[0_0_20px_rgba(0,224,255,0.3)]"
                      : "glass text-muted hover:text-foreground"
                  }`}
                >
                  {type === "All" ? tCommon("all") : type}
                </button>
              ))}
            </div>
          </FadeInUp>

          {/* Venues grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeType + searchQuery + sortBy + cityFilter}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredVenues.length > 0 ? (
                filteredVenues.map((venue, i) => (
                  <motion.div
                    key={venue.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/venues/${venue.id}`}>
                      <motion.div
                        className="group relative glass rounded-2xl overflow-hidden card-hover"
                        data-cursor-hover
                        data-cursor-text={t("cursorExplore")}
                        whileHover={{ y: -6 }}
                      >
                        <div className="relative h-72 overflow-hidden">
                          <Image
                            src={venue.image}
                            alt={venue.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

                          {/* Rating */}
                          <div className="absolute top-4 right-4 flex items-center gap-1 glass-strong px-3 py-1.5 rounded-full">
                            <Star size={12} className="text-gold fill-gold" />
                            <span className="text-xs font-bold">
                              {venue.rating}
                            </span>
                          </div>

                          {/* Type */}
                          <div className="absolute top-4 left-4 glass-strong px-3 py-1 rounded-full text-[10px] font-medium text-accent">
                            {venue.type}
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-2xl font-bold group-hover:text-accent transition-colors">
                                {venue.name}
                              </h3>
                              <div className="flex items-center gap-4 text-xs text-muted mt-2">
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} className="text-accent" />
                                  {venue.city}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users size={12} className="text-accent" />
                                  {venue.capacity} {t("capacity")}
                                </span>
                              </div>
                            </div>
                            <motion.div
                              className="w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              whileHover={{ scale: 1.2 }}
                            >
                              <ArrowUpRight size={16} className="text-accent" />
                            </motion.div>
                          </div>

                          {/* Upcoming events bar */}
                          <div className="mt-4 pt-4 border-t border-foreground/5 flex items-center justify-between">
                            <span className="text-xs text-muted">
                              {t("upcomingEvents")}
                            </span>
                            <div className="flex -space-x-2">
                              {[...Array(3)].map((_, j) => (
                                <div
                                  key={j}
                                  className="w-6 h-6 rounded-full bg-surface-light border border-background flex items-center justify-center text-[8px] font-bold"
                                >
                                  {j + 1}
                                </div>
                              ))}
                              <div className="w-6 h-6 rounded-full bg-accent/20 border border-background flex items-center justify-center text-[8px] font-bold text-accent">
                                +
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent via-secondary to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-lg font-medium text-muted">
                    {t("noResults")}
                  </p>
                  <p className="text-sm text-muted/60 mt-2">
                    {t("noResultsDesc")}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </>
  );
}
