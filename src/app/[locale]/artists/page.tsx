"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { artists } from "@/lib/data";
import { useTranslations } from "next-intl";
import { FadeInUp, AnimatedWords } from "@/components/ui/AnimatedText";
import GradientOrb from "@/components/ui/GradientOrb";
import { Users, Calendar, ArrowUpRight, Play } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

export default function ArtistsPage() {
  const t = useTranslations("ArtistsPage");
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
          {/* Header */}
          <div className="text-center mb-20">
            <FadeInUp>
              <span className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold">
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

          {/* Artists grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.map((artist, i) => (
              <FadeInUp key={artist.id} delay={i * 0.1}>
                <Link href={`/artists/${artist.id}` as "/artists/[id]"}>
                  <motion.div
                    className="group relative glass rounded-2xl overflow-hidden card-hover"
                    data-cursor-hover
                    data-cursor-text="Profil"
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

                      <div className="flex items-center gap-4 text-xs text-muted pt-4 border-t border-white/5">
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
              </FadeInUp>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
