"use client";

import { motion } from "framer-motion";
import { FadeInUp } from "@/components/ui/AnimatedText";
import { useTranslations } from "next-intl";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  Smartphone,
  Bell,
  QrCode,
  MapPin,
  Zap,
  Apple,
  Play,
} from "lucide-react";
import Image from "next/image";

const featureIcons = [
  { icon: Bell, titleKey: "notifications", descKey: "notificationsDesc" },
  { icon: QrCode, titleKey: "tickets", descKey: "ticketsDesc" },
  { icon: MapPin, titleKey: "nearby", descKey: "nearbyDesc" },
  { icon: Zap, titleKey: "checkin", descKey: "checkinDesc" },
];

export default function MobileApp() {
  const t = useTranslations("MobileApp");
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Phone mockup */}
          <FadeInUp>
            <div className="relative flex justify-center">
              {/* Phone frame */}
              <div className="relative w-[280px] md:w-[300px]">
                {/* Phone body */}
                <div className="relative rounded-[40px] border-[6px] border-white/10 bg-surface overflow-hidden shadow-2xl shadow-black/50">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-2xl z-20" />

                  {/* Screen content */}
                  <div className="relative aspect-[9/19] overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=850&fit=crop"
                      alt="PULSE App"
                      fill
                      className="object-cover"
                    />
                    {/* Screen overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

                    {/* Mock UI elements on screen */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      {/* Mini card */}
                      <div className="glass-strong rounded-2xl p-4 mb-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                          <div>
                            <div className="w-24 h-2 bg-white/20 rounded-full" />
                            <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1.5" />
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                      </div>
                      <div className="glass-strong rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-accent/20" />
                          <div className="w-20 h-2 bg-white/20 rounded-full" />
                        </div>
                        <div className="w-full h-16 rounded-xl bg-white/5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements around phone */}
                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-accent/20 backdrop-blur-xl border border-accent/20 flex items-center justify-center"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Bell size={18} className="text-accent" />
                </motion.div>

                <motion.div
                  className="absolute top-1/4 -left-6 w-10 h-10 rounded-xl bg-secondary/20 backdrop-blur-xl border border-secondary/20 flex items-center justify-center"
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <MapPin size={16} className="text-secondary" />
                </motion.div>

                <motion.div
                  className="absolute bottom-20 -left-8 w-11 h-11 rounded-xl bg-primary/20 backdrop-blur-xl border border-primary/20 flex items-center justify-center"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <QrCode size={16} className="text-primary" />
                </motion.div>

                {/* Glow behind phone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[400px] bg-accent/10 rounded-full blur-[80px] -z-10" />
              </div>
            </div>
          </FadeInUp>

          {/* Right - Content */}
          <div>
            <FadeInUp>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
                  <Smartphone size={14} className="text-accent" />
                  <span className="text-xs font-semibold text-accent">
                    {t("badge")}
                  </span>
                </div>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.1}>
              <h2 className="display-md mb-6">
                {t("titleLine1")}
                <br />
                <span className="text-gradient-multi">{t("titleLine2")}</span>
              </h2>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <p className="text-muted text-sm leading-relaxed mb-10 max-w-md">
                {t("description")}
              </p>
            </FadeInUp>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {featureIcons.map((feature, i) => (
                <FadeInUp key={i} delay={0.25 + i * 0.08}>
                  <motion.div
                    className="glass rounded-xl p-4 group hover:bg-white/[0.04] transition-colors duration-300"
                    whileHover={{ y: -2 }}
                    data-cursor-hover
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                        <feature.icon size={16} className="text-accent" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-0.5">
                          {t(`features.${feature.titleKey}`)}
                        </h4>
                        <p className="text-[11px] text-muted leading-relaxed">
                          {t(`features.${feature.descKey}`)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </FadeInUp>
              ))}
            </div>

            {/* Store buttons */}
            <FadeInUp delay={0.6}>
              <div className="flex flex-wrap gap-3">
                <MagneticButton className="flex items-center gap-3 px-6 py-3.5 glass rounded-xl hover:bg-white/[0.06] transition-colors">
                  <Apple size={22} />
                  <div className="text-left">
                    <div className="text-[9px] text-muted leading-none">
                      {t("appStoreLine1")}
                    </div>
                    <div className="text-sm font-semibold leading-tight">
                      {t("appStoreLine2")}
                    </div>
                  </div>
                </MagneticButton>

                <MagneticButton className="flex items-center gap-3 px-6 py-3.5 glass rounded-xl hover:bg-white/[0.06] transition-colors">
                  <Play size={22} fill="currentColor" />
                  <div className="text-left">
                    <div className="text-[9px] text-muted leading-none">
                      {t("googlePlayLine1")}
                    </div>
                    <div className="text-sm font-semibold leading-tight">
                      {t("googlePlayLine2")}
                    </div>
                  </div>
                </MagneticButton>
              </div>
            </FadeInUp>
          </div>
        </div>
      </div>
    </section>
  );
}
