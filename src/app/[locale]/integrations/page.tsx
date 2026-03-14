"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientOrb from "@/components/ui/GradientOrb";
import { FadeInUp } from "@/components/ui/AnimatedText";
import { Link } from "@/i18n/routing";
import {
  Code2,
  Calendar,
  Ticket,
  Music2,
  MapPin,
  ArrowRight,
  Copy,
  Check,
  Key,
  Zap,
  Globe,
  Shield,
} from "lucide-react";
import { useTranslations } from "next-intl";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

const apiServices = [
  {
    key: "events",
    icon: Calendar,
    color: "text-primary",
    bg: "bg-primary/10",
    method: "GET",
    path: "/api/v1/events",
  },
  {
    key: "tickets",
    icon: Ticket,
    color: "text-green-400",
    bg: "bg-green-500/10",
    method: "POST",
    path: "/api/v1/tickets",
  },
  {
    key: "artists",
    icon: Music2,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    method: "GET",
    path: "/api/v1/artists",
  },
  {
    key: "venues",
    icon: MapPin,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    method: "GET",
    path: "/api/v1/venues",
  },
] as const;

const useCaseKeys = [
  "ticketPlatforms",
  "eventAggregators",
  "mobileDevelopers",
  "analytics",
] as const;

const useCaseIcons = {
  ticketPlatforms: Ticket,
  eventAggregators: Globe,
  mobileDevelopers: Zap,
  analytics: Shield,
};

const codeExample = `// Install: npm install @portal/sdk
import Portal from '@portal/sdk';

const portal = new Portal({ apiKey: 'pk_live_...' });

// List upcoming events
const events = await portal.events.list({
  city: 'Istanbul',
  limit: 10,
});

// Get ticket availability
const tickets = await portal.tickets.check({
  eventId: 'evt_abc123',
});

// Search artists
const artists = await portal.artists.search({
  genre: 'Electronic',
});`;

export default function IntegrationsPage() {
  const t = useTranslations("IntegrationsPage");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          {/* Hero */}
          <div className="text-center mb-16">
            <FadeInUp>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Code2 size={28} className="text-primary" />
              </div>
              <h1 className="display-lg mb-4">
                {t("titleLine1")}
                <br />
                <span className="text-gradient-primary">{t("titleLine2")}</span>
              </h1>
              <p className="text-muted text-sm max-w-lg mx-auto">
                {t("description")}
              </p>
            </FadeInUp>
          </div>

          {/* Stats */}
          <FadeInUp delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {(
                [
                  "statRequests",
                  "statUptime",
                  "statLatency",
                  "statDevelopers",
                ] as const
              ).map((key) => (
                <div key={key} className="glass rounded-2xl p-5 text-center">
                  <p className="text-lg font-bold text-foreground">
                    {t(`${key}Value`)}
                  </p>
                  <p className="text-[11px] text-muted mt-1">{t(key)}</p>
                </div>
              ))}
            </div>
          </FadeInUp>

          {/* API Services */}
          <div className="mb-16">
            <FadeInUp delay={0.15}>
              <h2 className="text-xl font-bold mb-2">{t("servicesTitle")}</h2>
              <p className="text-muted text-xs mb-8">{t("servicesDesc")}</p>
            </FadeInUp>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {apiServices.map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <FadeInUp key={svc.key} delay={0.2 + i * 0.05}>
                    <div
                      className="glass rounded-2xl p-6 group hover:bg-foreground/[0.02] transition-colors"
                      data-cursor-hover
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`w-11 h-11 rounded-xl ${svc.bg} flex items-center justify-center shrink-0`}
                        >
                          <Icon size={18} className={svc.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold mb-1">
                            {t(`${svc.key}.title`)}
                          </h3>
                          <p className="text-xs text-muted leading-relaxed">
                            {t(`${svc.key}.description`)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-[10px] font-mono font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                          {svc.method}
                        </span>
                        <code className="text-[11px] text-muted font-mono truncate">
                          {svc.path}
                        </code>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(t.raw(`${svc.key}.features`) as string[]).map((f) => (
                          <span
                            key={f}
                            className="text-[10px] text-muted bg-foreground/5 px-2 py-0.5 rounded-full"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </FadeInUp>
                );
              })}
            </div>
          </div>

          {/* Code Example */}
          <FadeInUp delay={0.3}>
            <div className="mb-16">
              <h2 className="text-xl font-bold mb-2">{t("codeTitle")}</h2>
              <p className="text-muted text-xs mb-6">{t("codeDesc")}</p>
              <div className="glass rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    <span className="text-[10px] text-muted ml-2 font-mono">
                      app.js
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="text-muted hover:text-foreground transition-colors p-1"
                    data-cursor-hover
                  >
                    {copied ? (
                      <Check size={14} className="text-green-400" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
                <pre className="p-5 overflow-x-auto text-[11px] leading-relaxed">
                  <code className="text-muted">{codeExample}</code>
                </pre>
              </div>
            </div>
          </FadeInUp>

          {/* Use Cases */}
          <div className="mb-16">
            <FadeInUp delay={0.35}>
              <h2 className="text-xl font-bold mb-2">{t("useCasesTitle")}</h2>
              <p className="text-muted text-xs mb-8">{t("useCasesDesc")}</p>
            </FadeInUp>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {useCaseKeys.map((key, i) => {
                const Icon = useCaseIcons[key];
                return (
                  <FadeInUp key={key} delay={0.4 + i * 0.05}>
                    <div className="glass rounded-2xl p-6" data-cursor-hover>
                      <Icon size={18} className="text-primary mb-3" />
                      <h3 className="text-sm font-bold mb-1">
                        {t(`useCases.${key}.title`)}
                      </h3>
                      <p className="text-xs text-muted leading-relaxed">
                        {t(`useCases.${key}.description`)}
                      </p>
                    </div>
                  </FadeInUp>
                );
              })}
            </div>
          </div>

          {/* Getting Started */}
          <FadeInUp delay={0.45}>
            <div className="glass rounded-2xl p-8 text-center">
              <Key size={24} className="text-primary mx-auto mb-4" />
              <h2 className="text-lg font-bold mb-2">{t("ctaTitle")}</h2>
              <p className="text-xs text-muted max-w-md mx-auto mb-6">
                {t("ctaDesc")}
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/api-docs"
                  className="px-5 py-2.5 rounded-xl bg-primary text-background text-xs font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                  data-cursor-hover
                >
                  {t("ctaDocs")} <ArrowRight size={14} />
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-xl glass text-xs font-semibold hover:bg-foreground/5 transition-colors"
                  data-cursor-hover
                >
                  {t("ctaContact")}
                </Link>
              </div>
            </div>
          </FadeInUp>
        </div>
      </main>

      <Footer />
    </>
  );
}
