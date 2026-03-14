"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientOrb from "@/components/ui/GradientOrb";
import { FadeInUp } from "@/components/ui/AnimatedText";
import { Code2, Key, Globe, Webhook, Terminal, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

const endpointKeys = [
  "listEvents",
  "getEvent",
  "listArtists",
  "listVenues",
  "validateTicket",
  "createEvent",
  "updateEvent",
  "analyticsOverview",
] as const;

const endpointPaths: Record<string, { method: string; path: string }> = {
  listEvents: { method: "GET", path: "/api/v1/events" },
  getEvent: { method: "GET", path: "/api/v1/events/:id" },
  listArtists: { method: "GET", path: "/api/v1/artists" },
  listVenues: { method: "GET", path: "/api/v1/venues" },
  validateTicket: { method: "POST", path: "/api/v1/tickets/validate" },
  createEvent: { method: "POST", path: "/api/v1/events" },
  updateEvent: { method: "PUT", path: "/api/v1/events/:id" },
  analyticsOverview: { method: "GET", path: "/api/v1/analytics/overview" },
};

const methodColors: Record<string, string> = {
  GET: "text-green-400 bg-green-500/10",
  POST: "text-blue-400 bg-blue-500/10",
  PUT: "text-amber-400 bg-amber-500/10",
  DELETE: "text-red-400 bg-red-500/10",
};

export default function ApiDocsPage() {
  const t = useTranslations("ApiDocsPage");

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

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <FadeInUp>
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <Code2 size={28} className="text-accent" />
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

          {/* Quick start cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            <FadeInUp delay={0.1}>
              <div className="glass rounded-2xl p-6">
                <Key size={20} className="text-primary mb-3" />
                <h3 className="text-sm font-bold mb-2">{t("auth")}</h3>
                <p className="text-xs text-muted leading-relaxed">
                  {t("authDesc")}
                </p>
              </div>
            </FadeInUp>
            <FadeInUp delay={0.15}>
              <div className="glass rounded-2xl p-6">
                <Globe size={20} className="text-secondary mb-3" />
                <h3 className="text-sm font-bold mb-2">{t("baseUrl")}</h3>
                <code className="text-xs text-accent bg-accent/5 px-2 py-1 rounded">
                  https://api.portalevents.co/v1
                </code>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  {t("baseUrlDesc")}
                </p>
              </div>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <div className="glass rounded-2xl p-6">
                <Webhook size={20} className="text-gold mb-3" />
                <h3 className="text-sm font-bold mb-2">{t("webhooks")}</h3>
                <p className="text-xs text-muted leading-relaxed">
                  {t("webhooksDesc")}
                </p>
              </div>
            </FadeInUp>
          </div>

          {/* Endpoints */}
          <FadeInUp delay={0.25}>
            <div className="glass rounded-2xl p-8">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Terminal size={18} className="text-primary" />
                {t("endpoints")}
              </h2>

              <div className="space-y-2">
                {endpointKeys.map((key) => {
                  const ep = endpointPaths[key];
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-foreground/[0.03] transition-colors group"
                    >
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${methodColors[ep.method]}`}
                      >
                        {ep.method}
                      </span>
                      <code className="text-sm font-mono text-foreground/80 flex-1">
                        {ep.path}
                      </code>
                      <span className="text-xs text-muted hidden sm:block">
                        {t(`endpointDescriptions.${key}`)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeInUp>

          {/* CTA */}
          <FadeInUp delay={0.3}>
            <div className="text-center mt-12">
              <div className="glass rounded-2xl p-8 inline-block">
                <BookOpen size={24} className="text-primary mx-auto mb-3" />
                <h3 className="text-sm font-bold mb-2">{t("fullDocsTitle")}</h3>
                <p className="text-xs text-muted mb-4">{t("fullDocsDesc")}</p>
                <span className="inline-block px-5 py-2.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  {t("comingSoon")}
                </span>
              </div>
            </div>
          </FadeInUp>
        </div>
      </main>

      <Footer />
    </>
  );
}
