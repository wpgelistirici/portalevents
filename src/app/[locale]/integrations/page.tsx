"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientOrb from "@/components/ui/GradientOrb";
import { FadeInUp } from "@/components/ui/AnimatedText";
import {
  Puzzle,
  CreditCard,
  BarChart3,
  MessageSquare,
  Music2,
  Megaphone,
  ArrowRight,
} from "lucide-react";
import { useTranslations } from "next-intl";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

const integrationKeys = [
  "stripe",
  "googleAnalytics",
  "whatsapp",
  "spotify",
  "metaAds",
  "zapier",
] as const;

const integrationMeta: Record<
  string,
  {
    icon: typeof CreditCard;
    color: string;
    bg: string;
    statusKey: "statusActive" | "statusBeta" | "statusSoon";
  }
> = {
  stripe: {
    icon: CreditCard,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    statusKey: "statusActive",
  },
  googleAnalytics: {
    icon: BarChart3,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    statusKey: "statusActive",
  },
  whatsapp: {
    icon: MessageSquare,
    color: "text-green-400",
    bg: "bg-green-500/10",
    statusKey: "statusActive",
  },
  spotify: {
    icon: Music2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    statusKey: "statusBeta",
  },
  metaAds: {
    icon: Megaphone,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    statusKey: "statusSoon",
  },
  zapier: {
    icon: Puzzle,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    statusKey: "statusSoon",
  },
};

const statusColorMap: Record<string, string> = {
  statusActive: "text-green-400 bg-green-500/10",
  statusBeta: "text-amber-400 bg-amber-500/10",
  statusSoon: "text-muted bg-foreground/5",
};

export default function IntegrationsPage() {
  const t = useTranslations("IntegrationsPage");

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
            color="accent"
            size={300}
            bottom="20%"
            left="-5%"
            delay={3}
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <FadeInUp>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Puzzle size={28} className="text-primary" />
              </div>
              <h1 className="display-lg mb-4">
                {t("titleLine1")}
                <br />
                <span className="text-gradient-primary">{t("titleLine2")}</span>
              </h1>
              <p className="text-muted text-sm max-w-md mx-auto">
                {t("description")}
              </p>
            </FadeInUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrationKeys.map((key, i) => {
              const meta = integrationMeta[key];
              const Icon = meta.icon;
              const isActive = meta.statusKey === "statusActive";

              return (
                <FadeInUp key={key} delay={0.1 + i * 0.05}>
                  <div
                    className="glass rounded-2xl p-6 h-full flex flex-col group hover:bg-foreground/[0.02] transition-colors"
                    data-cursor-hover
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${meta.bg} flex items-center justify-center`}
                      >
                        <Icon size={20} className={meta.color} />
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${statusColorMap[meta.statusKey]}`}
                      >
                        {t(meta.statusKey)}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold mb-2">
                      {t(`${key}.name`)}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed flex-1">
                      {t(`${key}.description`)}
                    </p>
                    {isActive && (
                      <button
                        className="mt-4 text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
                        data-cursor-hover
                      >
                        {t("configure")} <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
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
