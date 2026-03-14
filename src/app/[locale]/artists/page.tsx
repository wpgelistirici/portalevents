"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { artists } from "@/lib/data";
import { useTranslations } from "next-intl";
import { FadeInUp } from "@/components/ui/AnimatedText";
import GradientOrb from "@/components/ui/GradientOrb";
import { Users, Calendar, ArrowUpRight, Play, Search, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

const artistGenres = ["All", "Progressive House", "Techno", "Downtempo", "Jazz", "Electronic", "Indie / Post-punk"];

export default function ArtistsPage() {
  const t = useTranslations("ArtistsPage");
  const tCommon = useTranslations("Common");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "followers">("followers");

  const filteredArtists = useMemo(() => {
    let result = [...artists];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.genre.toLowerCase().includes(q)
      );
    }

    if (activeGenre !== "All") {
      result = result.filter((a) => a.genre === activeGenre);
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => {
        const parseFollowers = (s: string) => {
          const num = parseFloat(s);
          if (s.includes("M")) return num * 1_000_000;
          if (s.includes("K")) return num * 1_000;
          return num;
        };
        return parseFollowers(b.followers) - parseFollowers(a.followers);
      });
    }

    return result;
  }, [searchQuery, activeGenre, sortBy]);
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen pt-32 pb-20">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <GradientOrb color="secondary" size={500} top="5%" left="-10%" />
          <GradientOrb
            color="accent"
            size={350}
            bottom="15%"
            right="-5%"
            delay={2}
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
                  className="w-full pl-11 pr-4 py-3 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-secondary/50 placeholder:text-muted"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                data-cursor-hover
                className={`flex items-center gap-2 px-5 py-3 glass rounded-xl text-sm transition-colors ${
                  showFilters
                    ? "text-secondary border-secondary/30"
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
                  <div className="glass rounded-xl p-5 mb-6">
                    <div>
                      <label className="text-[10px] text-muted uppercase tracking-wider mb-2 block">
                        {t("sortBy")}
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSortBy("followers")}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                            sortBy === "followers"
                              ? "bg-secondary/15 text-secondary font-medium"
                              : "glass text-muted hover:text-foreground"
                          }`}
                          data-cursor-hover
                        >
                          {t("byPopularity")}
                        </button>
                        <button
                          onClick={() => setSortBy("name")}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                            sortBy === "name"
                              ? "bg-secondary/15 text-secondary font-medium"
                              : "glass text-muted hover:text-foreground"
                          }`}
                          data-cursor-hover
                        >
                          {t("byName")}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </FadeInUp>

          {/* Genre tabs */}
          <FadeInUp delay={0.1}>
            <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-2 scrollbar-hide">
              {artistGenres.map((genre) => (
                <button
                  key={genre}
                  data-cursor-hover
                  onClick={() => setActiveGenre(genre)}
                  className={`px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                    activeGenre === genre
                      ? "bg-secondary text-white shadow-[0_0_20px_rgba(0,224,255,0.3)]"
                      : "glass text-muted hover:text-foreground"
                  }`}
                >
                  {genre === "All" ? tCommon("all") : genre}
                </button>
              ))}
            </div>
          </FadeInUp>

          {/* Artists grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGenre + searchQuery + sortBy}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredArtists.length > 0 ? (
                filteredArtists.map((artist, i) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/artists/${artist.id}` as "/artists/[id]">
                  <motion.div
                    className="group relative glass rounded-2xl overflow-hidden card-hover"
                    data-cursor-hover
                    data-cursor-text={t("cursorProfile")}
                    whileHover={{ y: -6 }}
                  >
                    {/* Image */}
                    <div className="relative h-72 overflow-hidden">
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.div
                          className="w-14 h-14 rounded-full glass-strong flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Play size={20} fill="white" className="ml-1" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="inline-block px-3 py-1 glass rounded-full text-[10px] font-medium text-secondary mb-2">
                            {artist.genre}
                          </span>
                          <h3 className="text-xl font-bold group-hover:text-secondary transition-colors">
                            {artist.name}
                          </h3>
                        </div>
                        <motion.div
                          className="w-8 h-8 rounded-full glass flex items-center justify-center"
                          whileHover={{ scale: 1.2 }}
                        >
                          <ArrowUpRight size={14} className="text-secondary" />
                        </motion.div>
                      </div>

                      <p className="text-xs text-muted leading-relaxed mb-4">
                        {artist.bio}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted pt-4 border-t border-foreground/5">
                        <span className="flex items-center gap-1">
                          <Users size={12} className="text-secondary" />
                          {artist.followers} {t("followers")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-secondary" />
                          {artist.upcoming} {t("event")}
                        </span>
                      </div>
                    </div>

                    {/* Hover border */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary via-accent to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </motion.div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-muted text-sm">{t("noResults")}</p>
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
