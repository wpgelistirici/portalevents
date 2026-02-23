"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { venues } from "@/lib/data";
import { useTranslations } from "next-intl";
import { FadeInUp, AnimatedWords } from "@/components/ui/AnimatedText";
import GradientOrb from "@/components/ui/GradientOrb";
import { MapPin, Users, Star, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

export default function VenuesPage() {
  const t = useTranslations("VenuesPage");
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
          {/* Header */}
          <div className="text-center mb-20">
            <FadeInUp>
              <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">
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

          {/* Venues grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {venues.map((venue, i) => (
              <FadeInUp key={venue.id} delay={i * 0.15}>
                <Link href={`/venues/${venue.id}`}>
                <motion.div
                  className="group relative glass rounded-2xl overflow-hidden card-hover"
                  data-cursor-hover
                  data-cursor-text="Keşfet"
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
                      <span className="text-xs font-bold">{venue.rating}</span>
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
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
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
              </FadeInUp>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
