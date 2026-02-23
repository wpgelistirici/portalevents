"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientOrb from "@/components/ui/GradientOrb";
import { FadeInUp } from "@/components/ui/AnimatedText";
import { Link } from "@/i18n/routing";
import { ArrowLeft, FileText, ScrollText } from "lucide-react";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

export default function DistanceSalesPage() {
  const t = useTranslations("LegalPages");

  const sections = [
    { title: t("distanceSales.section1Title"), content: t("distanceSales.section1Content") },
    { title: t("distanceSales.section2Title"), content: t("distanceSales.section2Content") },
    { title: t("distanceSales.section3Title"), content: t("distanceSales.section3Content") },
    { title: t("distanceSales.section4Title"), content: t("distanceSales.section4Content") },
    { title: t("distanceSales.section5Title"), content: t("distanceSales.section5Content") },
    { title: t("distanceSales.section6Title"), content: t("distanceSales.section6Content") },
    { title: t("distanceSales.section7Title"), content: t("distanceSales.section7Content") },
    { title: t("distanceSales.section8Title"), content: t("distanceSales.section8Content") },
  ];

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen pt-28 pb-20">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <GradientOrb color="primary" size={400} top="5%" right="-10%" />
          <GradientOrb color="secondary" size={300} bottom="15%" left="-8%" delay={3} />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <FadeInUp>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
              data-cursor-hover
            >
              <ArrowLeft size={14} />
              {t("backToHome")}
            </Link>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ScrollText size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="display-md">{t("distanceSales.title")}</h1>
                <p className="text-sm text-muted mt-1">{t("lastUpdated")}</p>
              </div>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <div className="glass rounded-2xl p-8 mb-6">
              <p className="text-sm text-muted leading-relaxed">
                {t("distanceSales.intro")}
              </p>
            </div>
          </FadeInUp>

          <div className="space-y-4">
            {sections.map((section, i) => (
              <FadeInUp key={i} delay={0.2 + i * 0.05}>
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-base font-bold mb-3 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {i + 1}
                    </div>
                    {section.title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              </FadeInUp>
            ))}
          </div>

          <FadeInUp delay={0.6}>
            <div className="mt-8 glass rounded-2xl p-6 flex items-start gap-3">
              <FileText size={18} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted leading-relaxed">
                {t("distanceSales.footer")}
              </p>
            </div>
          </FadeInUp>
        </div>
      </main>

      <Footer />
    </>
  );
}
