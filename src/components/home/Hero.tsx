"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import MagneticButton from "@/components/ui/MagneticButton";
import HoleBackground from "@/components/ui/HoleBackground";
import { ArrowDown, Play } from "lucide-react";
import { Link } from "@/i18n/routing";
import HeroTitle from "./HeroTitle";
import HeroSearch from "./HeroSearch";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Hero");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-32"
    >
      <HoleBackground
        strokeColor="rgba(123, 97, 255, 0.25)"
        numberOfLines={50}
        numberOfDiscs={50}
        particleRGBColor={[123, 97, 255]}
        className="opacity-60"
      />

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
          <span className="text-xs font-medium text-muted">{t("liveBadge")}</span>
        </motion.div>

        <HeroTitle />

        {/* Subtitle */}
        <motion.p
          className="text-base md:text-lg text-muted max-w-lg mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          {t("subtitle")}{" "}
          <span className="text-foreground font-medium">{t("subtitleHighlight")}</span>
        </motion.p>

        <HeroSearch />

        {/* CTA Buttons */}
        <motion.div
          className="relative z-0 flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.7 }}
        >
          <MagneticButton
            className="px-6 py-3 bg-primary text-white text-sm font-semibold rounded-full hover:shadow-[0_0_30px_rgba(123,97,255,0.4)] transition-shadow duration-500"
            onClick={() => {
              const el = document.getElementById("featured-events");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="flex items-center gap-2">
              {t("ctaExplore")}
              <ArrowDown size={14} className="animate-bounce" />
            </span>
          </MagneticButton>

          <Link href="/events">
            <MagneticButton className="px-6 py-3 glass text-foreground text-sm font-semibold rounded-full hover:bg-foreground/10 transition-all duration-300">
              <span className="flex items-center gap-2">
                <Play size={12} fill="currentColor" />
                {t("ctaHow")}
              </span>
            </MagneticButton>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
