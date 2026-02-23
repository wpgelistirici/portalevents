"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { events, genres } from "@/lib/data";
import type { OrganizerEvent } from "@/lib/data";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { FadeInUp } from "@/components/ui/AnimatedText";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Map,
  Star,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

export default function FeaturedEvents() {
  const [activeGenre, setActiveGenre] = useState("Tümü");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("FeaturedEvents");
  const tCommon = useTranslations("Common");
  const [featuredEvents, setFeaturedEvents] = useState<OrganizerEvent[]>([]);

  // Load doping-featured events from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pulse_organizer_events");
      if (stored) {
        const orgEvents: OrganizerEvent[] = JSON.parse(stored);
        const featured = orgEvents.filter(
          (e) =>
            e.status === "approved" &&
            e.dopings?.some(
              (d) => d.type === "homepage_featured" && d.status === "active",
            ),
        );
        setFeaturedEvents(featured);
      }
    } catch {
      // ignore
    }
  }, []);

  const filteredEvents =
    activeGenre === "Tümü"
      ? events
      : events.filter((e) => e.genre === activeGenre);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 420;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative py-32">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <FadeInUp>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                {t("label")}
              </span>
              <h2 className="display-lg mt-4">
                {t("titleLine1")}
                <br />
                <span className="text-gradient-primary">{t("titleLine2")}</span>
              </h2>
            </div>
            <div className="flex items-center gap-6">
              <p className="text-muted text-sm max-w-sm leading-relaxed hidden md:block">
                {t("description")}
              </p>
              {/* Navigation arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scroll("left")}
                  data-cursor-hover
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  onClick={() => scroll("right")}
                  data-cursor-hover
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Genre filter */}
        <FadeInUp delay={0.2}>
          <div className="flex items-center gap-2 mt-10 overflow-x-auto pb-2 scrollbar-hide">
            {genres.map((genre) => (
              <button
                key={genre}
                data-cursor-hover
                onClick={() => setActiveGenre(genre)}
                className={`px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                  activeGenre === genre
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(255,45,85,0.3)]"
                    : "glass text-muted hover:text-foreground"
                }`}
              >
                {genre === "Tümü" ? tCommon("all") : genre}
              </button>
            ))}
          </div>
        </FadeInUp>
      </div>

      {/* Featured / Doping Events */}
      {featuredEvents.length > 0 && (
        <FadeInUp delay={0.25}>
          <div className="max-w-7xl mx-auto px-6 mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-[#FFD600]" />
              <span className="text-sm font-semibold text-[#FFD600]">{t("featuredLabel") || "Öne Çıkan Etkinlikler"}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFD600]/5 to-[#FF2D55]/5 border border-[#FFD600]/20 hover:border-[#FFD600]/40 transition-all group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFD600]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative h-36 overflow-hidden">
                      <Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#FFD600]/90 text-black px-3 py-1 rounded-full text-[10px] font-bold">
                        <Star size={10} />
                        {t("featuredBadge") || "Öne Çıkan"}
                      </div>
                    </div>
                    <div className="p-4 relative">
                      <h3 className="font-bold text-white group-hover:text-[#FFD600] transition-colors">{event.title}</h3>
                      <p className="text-xs text-white/40 mt-1">{event.artist} · {event.venue}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-white/30">{event.date} · {event.time}</span>
                        <span className="text-sm font-bold text-[#FFD600]">{event.price}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FFD600] to-[#FF2D55] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </FadeInUp>
      )}

      {/* Events horizontal scroll - drag & scroll enabled */}
      <FadeInUp delay={0.3}>
        <div className="max-w-7xl mx-auto px-6">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 pb-8 -mr-6 overflow-x-auto scrollbar-hide pr-6"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {filteredEvents.map((event, i) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <motion.div
                  className="relative group w-[340px] md:w-[400px] flex-shrink-0 rounded-2xl overflow-hidden glass card-hover"
                  style={{ scrollSnapAlign: "start" }}
                  data-cursor-hover
                  data-cursor-text="Keşfet"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                    {/* Trending badge */}
                    {event.trending && (
                      <div className="absolute top-4 left-4 flex items-center gap-1 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold">
                        <TrendingUp size={10} />
                        {t("trending")}
                      </div>
                    )}

                    {/* Genre tag */}
                    <div className="absolute top-4 right-4 glass-strong px-3 py-1 rounded-full text-[10px] font-medium">
                      {event.genre}
                    </div>
                  </div>

                  {/* Content */}
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

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gradient-primary">
                        {event.price}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted group-hover:text-primary transition-colors">
                        {t("details")}
                        <ArrowRight
                          size={12}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>

                  {/* Bottom gradient border on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.div>
              </Link>
            ))}

            {/* View all card */}
            <div
              className="w-[340px] md:w-[400px] flex-shrink-0 rounded-2xl glass flex items-center justify-center card-hover"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="text-center p-8" data-cursor-hover>
                <div className="w-16 h-16 rounded-full glass-strong flex items-center justify-center mx-auto mb-4">
                  <ArrowRight size={24} className="text-primary" />
                </div>
                <p className="text-sm font-semibold mb-1">{t("viewAll")}</p>
                <p className="text-xs text-muted">
                  {t("eventCount", { count: events.length })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Explore on Map CTA */}
      <FadeInUp delay={0.4}>
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <Link href="/explore-map">
            <motion.div
              className="glass rounded-2xl p-6 flex items-center justify-between group cursor-pointer card-hover"
              data-cursor-hover
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Map size={22} className="text-primary" />
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
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </motion.div>
          </Link>
        </div>
      </FadeInUp>
    </section>
  );
}
