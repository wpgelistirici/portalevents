"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { venues } from "@/lib/data";
import { useTranslations } from "next-intl";
import { FadeInUp } from "@/components/ui/AnimatedText";
import { MapPin, Users, Star, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export default function VenueSpotlight() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("VenueSpotlight");
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <FadeInUp>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">
                {t("label")}
              </span>
              <h2 className="display-lg mt-4">
                {t("titleLine1")}
                <span className="text-gradient-multi"> {t("titleLine2")}</span>
                <br />
                {t("titleLine3")}
              </h2>
            </div>
            <Link
              href="/venues"
              data-cursor-hover
              className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors group"
            >
              {t("viewAll")}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </FadeInUp>

        {/* Venue cards with staggered layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {venues.map((venue, i) => (
            <FadeInUp key={venue.id} delay={i * 0.15}>
              <Link href={`/venues/${venue.id}`}>
                <motion.div
                  className="group relative rounded-2xl overflow-hidden glass card-hover"
                  style={i % 2 === 1 ? { y: parallaxY } : {}}
                  data-cursor-hover
                  data-cursor-text="Keşfet"
                >
                  <div className="relative h-64 overflow-hidden">
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

                    {/* Type badge */}
                    <div className="absolute top-4 left-4 glass-strong px-3 py-1 rounded-full text-[10px] font-medium text-accent">
                      {venue.type}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                      {venue.name}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-accent" />
                        {venue.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} className="text-accent" />
                        {venue.capacity} {t("capacity")}
                      </span>
                    </div>

                    {/* Animated border bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent via-secondary to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </motion.div>
              </Link>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
