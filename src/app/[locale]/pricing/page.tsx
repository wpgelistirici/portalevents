"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientOrb from "@/components/ui/GradientOrb";
import { FadeInUp } from "@/components/ui/AnimatedText";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { useTranslations } from "next-intl";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

const planKeys = ["starter", "pro", "enterprise"] as const;
const planIcons = { starter: Zap, pro: Sparkles, enterprise: Crown };
const planColors = {
  starter: { text: "text-accent", bg: "bg-accent/10" },
  pro: { text: "text-primary", bg: "bg-primary/10" },
  enterprise: { text: "text-gold", bg: "bg-gold/10" },
};
const popularPlan = "pro";

export default function PricingPage() {
  const t = useTranslations("PricingPage");

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen pt-32 pb-20">
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
          <div className="text-center mb-16">
            <FadeInUp>
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                {t("label")}
              </span>
              <h1 className="display-lg mt-4 mb-6">
                {t("titleLine1")}
                <br />
                <span className="text-gradient-primary">{t("titleLine2")}</span>
              </h1>
              <p className="text-muted text-sm max-w-md mx-auto">
                {t("description")}
              </p>
            </FadeInUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {planKeys.map((key, i) => {
              const Icon = planIcons[key];
              const colors = planColors[key];
              const isPopular = key === popularPlan;
              const features = t.raw(`${key}.features`) as string[];

              return (
                <FadeInUp key={key} delay={0.1 * i}>
                  <motion.div
                    className={`relative glass rounded-2xl p-8 h-full flex flex-col ${
                      isPopular ? "ring-2 ring-primary/30" : ""
                    }`}
                    whileHover={{ y: -4 }}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                        {t("popular")}
                      </div>
                    )}

                    <div
                      className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}
                    >
                      <Icon size={20} className={colors.text} />
                    </div>

                    <h3 className="text-lg font-bold mb-1">
                      {t(`${key}.name`)}
                    </h3>
                    <p className="text-xs text-muted mb-4">
                      {t(`${key}.description`)}
                    </p>

                    <div className="mb-6">
                      <span className="text-3xl font-bold">
                        {t(`${key}.price`)}
                      </span>
                      {t(`${key}.period`) && (
                        <span className="text-sm text-muted">
                          {t(`${key}.period`)}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {features.map((feature: string) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-foreground/70"
                        >
                          <Check size={14} className={colors.text} />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                        isPopular
                          ? "bg-primary text-white hover:shadow-[0_0_30px_rgba(123,97,255,0.3)]"
                          : "glass hover:bg-foreground/5"
                      }`}
                      data-cursor-hover
                    >
                      {t("getStarted")}
                    </button>
                  </motion.div>
                </FadeInUp>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
