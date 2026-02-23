"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeInUp } from "@/components/ui/AnimatedText";
import { useTranslations } from "next-intl";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  BarChart3,
  Ticket,
  Users,
  Megaphone,
  ArrowRight,
  Zap,
} from "lucide-react";

const featureIcons = [
  { icon: Ticket, titleKey: "ticketing", descKey: "ticketingDesc" },
  { icon: BarChart3, titleKey: "analytics", descKey: "analyticsDesc" },
  { icon: Users, titleKey: "audience", descKey: "audienceDesc" },
  { icon: Megaphone, titleKey: "promotion", descKey: "promotionDesc" },
];

export default function OrganizerCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("OrganizerCTA");
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [8, 0]);
  const scaleCard = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          style={{
            rotateX,
            scale: scaleCard,
            transformPerspective: 1200,
          }}
        >
          {/* Card background */}
          <div className="absolute inset-0 bg-gradient-to-br from-surface-light via-surface to-background" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

          {/* Grid pattern inside */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Border gradient */}
          <div className="absolute inset-0 rounded-3xl border border-white/[0.06]" />

          <div className="relative z-10 p-8 md:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Content */}
              <div>
                <FadeInUp>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Zap size={14} className="text-primary" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
                      {t("badge")}
                    </span>
                  </div>
                </FadeInUp>

                <FadeInUp delay={0.1}>
                  <h2 className="display-md mb-6">
                    {t("titleLine1")}
                    <br />
                    <span className="text-gradient-primary">
                      {t("titleLine2")}
                    </span>
                    <br />
                    {t("titleLine3")}
                  </h2>
                </FadeInUp>

                <FadeInUp delay={0.2}>
                  <p className="text-muted text-sm leading-relaxed mb-8 max-w-md">
                    {t("description")}
                  </p>
                </FadeInUp>

                <FadeInUp delay={0.3}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <MagneticButton className="px-8 py-4 bg-primary text-white text-sm font-semibold rounded-full hover:shadow-[0_0_40px_rgba(255,45,85,0.4)] transition-shadow duration-500">
                      <span className="flex items-center gap-2">
                        {t("ctaPrimary")}
                        <ArrowRight size={14} />
                      </span>
                    </MagneticButton>
                    <MagneticButton className="px-8 py-4 glass text-foreground text-sm font-semibold rounded-full hover:bg-white/10 transition-all duration-300">
                      {t("ctaSecondary")}
                    </MagneticButton>
                  </div>
                </FadeInUp>
              </div>

              {/* Right - Feature grid */}
              <div className="grid grid-cols-2 gap-4">
                {featureIcons.map((feature, i) => (
                  <FadeInUp key={i} delay={0.2 + i * 0.1}>
                    <motion.div
                      className="glass rounded-xl p-5 group hover:bg-white/[0.06] transition-colors duration-300"
                      whileHover={{ y: -4, scale: 1.02 }}
                      data-cursor-hover
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                        <feature.icon size={18} className="text-primary" />
                      </div>
                      <h4 className="text-sm font-bold mb-1">
                        {t(`features.${feature.titleKey}`)}
                      </h4>
                      <p className="text-[11px] text-muted leading-relaxed">
                        {t(`features.${feature.descKey}`)}
                      </p>
                    </motion.div>
                  </FadeInUp>
                ))}
              </div>
            </div>

            {/* Bottom stats */}
            <FadeInUp delay={0.6}>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-white/5">
                {[
                  { value: "2,400+", key: "organizers" },
                  { value: "₺12M+", key: "sales" },
                  { value: "98%", key: "satisfaction" },
                  { value: "24/7", key: "support" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-gradient-primary">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-muted uppercase tracking-widest mt-1">
                      {t(`stats.${stat.key}`)}
                    </div>
                  </div>
                ))}
              </div>
            </FadeInUp>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
