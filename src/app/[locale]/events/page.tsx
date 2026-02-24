"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { events, genres } from "@/lib/data";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { FadeInUp, AnimatedWords } from "@/components/ui/AnimatedText";
import GradientOrb from "@/components/ui/GradientOrb";
import {
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  Search,
  SlidersHorizontal,
  Map,
  ArrowRight,
  Bookmark,
} from "lucide-react";
import Image from "next/image";
import { useSaved } from "@/lib/saved-context";
import { useAuth } from "@/lib/auth-context";
import SaveToast from "@/components/ui/SaveToast";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

function EventSaveButton({ eventId }: { eventId: string }) {
  const { isSaved, toggleSave } = useSaved();
  const { isAuthenticated, openAuthModal } = useAuth();
  const saved = isSaved(eventId, "event");

  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) { openAuthModal(); return; }
        toggleSave(eventId, "event");
      }}
      className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
        saved ? "glass-strong text-gold" : "glass-strong text-white/60 hover:text-white"
      }`}
      whileTap={{ scale: 0.85 }}
      data-cursor-hover
    >
      <Bookmark size={13} className={saved ? "fill-gold" : ""} />
    </motion.button>
  );
}

export default function EventsPage() {
  const [activeGenre, setActiveGenre] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("EventsPage");
  const tCommon = useTranslations("Common");

  const filteredEvents = events.filter((e) => {
    const matchesGenre = activeGenre === "Tümü" || e.genre === activeGenre;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen pt-32 pb-20">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <GradientOrb color="primary" size={400} top="10%" right="-10%" />
          <GradientOrb
            color="secondary"
            size={300}
            bottom="20%"
            left="-5%"
            delay={3}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <FadeInUp>
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                {t("label")}
              </span>
              <h1 className="display-lg mt-4 mb-6">
                <AnimatedWords text={t("title")} delay={0.2} />
              </h1>
              <p className="text-muted text-sm max-w-md mx-auto">
                {t("description")}
              </p>
            </FadeInUp>
          </div>

          {/* Explore on Map CTA */}
          <FadeInUp delay={0.25}>
            <Link href="/explore-map">
              <motion.div
                className="glass rounded-2xl p-5 flex items-center justify-between group cursor-pointer card-hover mb-12"
                data-cursor-hover
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Map size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold group-hover:text-primary transition-colors">
                      {t("exploreMapTitle")}
                    </h3>
                    <p className="text-xs text-muted mt-0.5">{t("exploreMapDesc")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted group-hover:text-primary transition-colors">
                  <span className="hidden sm:inline">{t("exploreMapButton")}</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            </Link>
          </FadeInUp>

          {/* Search and filters */}
          <FadeInUp delay={0.3}>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
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
                  className="w-full pl-11 pr-4 py-3 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted"
                />
              </div>
              <button
                data-cursor-hover
                className="flex items-center gap-2 px-5 py-3 glass rounded-xl text-sm text-muted hover:text-foreground transition-colors"
              >
                <SlidersHorizontal size={14} />
                {t("filters")}
              </button>
            </div>
          </FadeInUp>

          {/* Genre tabs */}
          <FadeInUp delay={0.4}>
            <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  data-cursor-hover
                  onClick={() => setActiveGenre(genre)}
                  className={`px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                    activeGenre === genre
                      ? "bg-primary text-white shadow-[0_0_20px_rgba(123,97,255,0.3)]"
                      : "glass text-muted hover:text-foreground"
                  }`}
                >
                  {genre === "Tümü" ? tCommon("all") : genre}
                </button>
              ))}
            </div>
          </FadeInUp>

          {/* Events grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGenre + searchQuery}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredEvents.map((event, i) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <motion.div
                    className="group glass rounded-2xl overflow-hidden card-hover"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    data-cursor-hover
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                      {event.trending && (
                        <div className="absolute top-4 left-4 flex items-center gap-1 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold">
                          <TrendingUp size={10} />
                          {t("trending")}
                        </div>
                      )}
                      <div className="absolute top-4 right-14 glass-strong px-3 py-1 rounded-full text-[10px] font-medium">
                        {event.genre}
                      </div>
                      <EventSaveButton eventId={event.id} />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted mb-4">{event.artist}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-primary" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-primary" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-primary" />
                          {event.city}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-lg font-bold text-white">
                          {event.price}
                        </span>
                        <button className="px-4 py-2 bg-primary/10 text-primary text-xs font-semibold rounded-full hover:bg-primary/20 transition-colors">
                          {t("buyTicket")}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted text-sm">{t("noResults")}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <SaveToast />
    </>
  );
}
