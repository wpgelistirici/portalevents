"use client";

import { motion } from "framer-motion";
import { artists } from "@/lib/data";
import { useTranslations } from "next-intl";
import { FadeInUp } from "@/components/ui/AnimatedText";
import { Users, Calendar, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

const heights = [
  "h-[340px]",
  "h-[400px]",
  "h-[360px]",
  "h-[420px]",
  "h-[350px]",
  "h-[390px]",
];

export default function ArtistShowcase() {
  const t = useTranslations("ArtistShowcase");
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <FadeInUp>
          <div className="text-center mb-20">
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold">
              {t("label")}
            </span>
            <h2 className="display-lg mt-4">
              {t("titleLine1")}
              <span className="text-gradient-multi"> {t("titleLine2")}</span>
            </h2>
            <p className="text-muted text-sm max-w-md mx-auto mt-4 leading-relaxed">
              {t("description")}
            </p>
          </div>
        </FadeInUp>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {artists.map((artist, i) => (
            <FadeInUp key={artist.id} delay={i * 0.08}>
              <Link href={`/artists/${artist.id}` as "/artists/[id]"}>
                <motion.div
                  className="group relative overflow-hidden rounded-2xl cursor-pointer break-inside-avoid"
                  data-cursor-hover
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={`relative ${heights[i]}`}>
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="inline-block px-3 py-1 glass rounded-full text-[10px] font-medium text-secondary mb-3">
                          {artist.genre}
                        </span>
                        <h3 className="text-xl font-bold mb-1 group-hover:text-secondary transition-colors">
                          {artist.name}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <Users size={12} />
                            {artist.followers}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {artist.upcoming} {t("event")}
                          </span>
                        </div>
                      </div>

                      <motion.div
                        className="w-10 h-10 rounded-full glass-strong flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.2 }}
                      >
                        <ArrowUpRight size={16} className="text-secondary" />
                      </motion.div>
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-secondary/20 transition-colors duration-500 pointer-events-none" />
                </motion.div>
              </Link>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
