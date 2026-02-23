"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import GradientOrb from "@/components/ui/GradientOrb";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowDown, Play } from "lucide-react";
import gsap from "gsap";

function HeroTitle() {
  const t = useTranslations("Hero");
  const lines = [
    { text: t("line1"), gradient: false, delay: 0.8 },
    { text: t("line2"), gradient: true, delay: 1.2 },
    { text: t("line3"), gradient: false, delay: 1.6 },
  ];

  return (
    <h1 className="mb-8">
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="block">
          <motion.span
            className={`display-xl inline-block ${
              line.gradient ? "text-gradient-primary" : ""
            }`}
            initial={{ opacity: 0, y: 80, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              delay: line.delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {line.text}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioVisualizerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Hero");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  useEffect(() => {
    if (!audioVisualizerRef.current) return;
    const bars = audioVisualizerRef.current.querySelectorAll(".vis-bar");

    bars.forEach((bar, i) => {
      gsap.to(bar, {
        height: `${Math.random() * 80 + 20}%`,
        duration: 0.4 + Math.random() * 0.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.02,
      });
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24"
    >
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <GradientOrb
          color="primary"
          size={600}
          top="-10%"
          left="-10%"
          delay={0}
        />
        <GradientOrb
          color="secondary"
          size={500}
          top="20%"
          right="-15%"
          delay={2}
        />
        <GradientOrb
          color="accent"
          size={400}
          bottom="-10%"
          left="30%"
          delay={4}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Audio Visualizer Background - Full Width */}
      <div
        ref={audioVisualizerRef}
        className="absolute bottom-0 left-0 w-full h-[30vh] flex items-end gap-[1px] opacity-[0.08]"
      >
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={i}
            className="vis-bar flex-1 min-w-[2px] bg-gradient-to-t from-primary to-secondary rounded-t"
            style={{ height: "20%" }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-6xl mx-auto"
        style={{ y, opacity, scale }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-xs font-medium text-muted">
            {t("liveBadge")}
          </span>
        </motion.div>

        {/* Headline */}
        <HeroTitle />

        {/* Subtitle */}
        <motion.p
          className="text-base md:text-xl text-muted max-w-xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          {t("subtitle")}
          <br />
          <span className="text-foreground font-medium">
            {t("subtitleHighlight")}
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.8 }}
        >
          <MagneticButton className="px-8 py-4 bg-primary text-white text-sm font-semibold rounded-full hover:shadow-[0_0_40px_rgba(255,45,85,0.4)] transition-shadow duration-500">
            <span className="flex items-center gap-2">
              {t("ctaExplore")}
              <ArrowDown size={16} className="animate-bounce" />
            </span>
          </MagneticButton>

          <MagneticButton className="px-8 py-4 glass text-foreground text-sm font-semibold rounded-full hover:bg-white/10 transition-all duration-300">
            <span className="flex items-center gap-2">
              <Play size={14} fill="currentColor" />
              {t("ctaHow")}
            </span>
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
