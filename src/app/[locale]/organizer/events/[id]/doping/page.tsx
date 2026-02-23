"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useOrganizer } from "@/lib/organizer-context";
import { dopingPackages, type ActiveDoping } from "@/lib/data";
import { ArrowLeft, Zap, Check, Star, TrendingUp, Award } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const typeIcons = {
  homepage_featured: Star,
  explore_popular: TrendingUp,
  events_editor_pick: Award,
};

const typeColors = {
  homepage_featured: { bg: "from-[#FF2D55] to-[#FF6B6B]", border: "border-[#FF2D55]/30", badge: "bg-[#FF2D55]/10 text-[#FF2D55]" },
  explore_popular: { bg: "from-[#7B61FF] to-[#A78BFA]", border: "border-[#7B61FF]/30", badge: "bg-[#7B61FF]/10 text-[#7B61FF]" },
  events_editor_pick: { bg: "from-[#FFD600] to-[#FFA000]", border: "border-[#FFD600]/30", badge: "bg-[#FFD600]/10 text-[#FFD600]" },
};

export default function DopingPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("OrganizerPanel");
  const { organizerEvents, purchaseDoping } = useOrganizer();
  const [purchased, setPurchased] = useState<string | null>(null);

  const event = organizerEvents.find((e) => e.id === params.id);

  if (!event) {
    return (
      <div className="text-center py-16">
        <p className="text-white/40">{t("events.notFound")}</p>
      </div>
    );
  }

  const activeDopings = event.dopings.filter((d) => d.status === "active");

  const handlePurchase = (pkg: (typeof dopingPackages)[0]) => {
    const now = new Date();
    const end = new Date(now.getTime() + pkg.durationDays * 24 * 60 * 60 * 1000);

    const doping: ActiveDoping = {
      packageId: pkg.id,
      type: pkg.type,
      startDate: now.toISOString(),
      endDate: end.toISOString(),
      status: "active",
    };

    purchaseDoping(event.id, doping);
    setPurchased(pkg.id);
    setTimeout(() => setPurchased(null), 3000);
  };

  const groupedPackages = {
    homepage_featured: dopingPackages.filter((p) => p.type === "homepage_featured"),
    explore_popular: dopingPackages.filter((p) => p.type === "explore_popular"),
    events_editor_pick: dopingPackages.filter((p) => p.type === "events_editor_pick"),
  };

  // Check which specific doping packages are currently active
  const activePackageIds = new Set(activeDopings.map((d) => d.packageId));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{t("doping.title")}</h1>
          <p className="text-white/50 text-sm mt-1">&quot;{event.title}&quot; {t("doping.forEvent")}</p>
        </div>
      </div>

      {/* Active Dopings */}
      {activeDopings.length > 0 && (
        <div className="rounded-2xl bg-[#7B61FF]/5 border border-[#7B61FF]/20 p-6">
          <h3 className="text-sm font-semibold text-[#7B61FF] flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4" />
            {t("doping.activeDopings")}
          </h3>
          <div className="space-y-2">
            {activeDopings.map((d, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-white/70">{t(`doping.types.${d.type}`)}</span>
                <span className="text-white/40">
                  {new Date(d.endDate).toLocaleDateString("tr-TR")} {t("doping.until")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doping Packages */}
      {(Object.keys(groupedPackages) as Array<keyof typeof groupedPackages>).map((type) => {
        const packages = groupedPackages[type];
        const Icon = typeIcons[type];
        const colors = typeColors[type];

        return (
          <div key={type} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.badge}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{t(`doping.types.${type}`)}</h2>
                <p className="text-sm text-white/40">{t(`doping.typeDesc.${type}`)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative rounded-2xl bg-white/5 border ${colors.border} backdrop-blur-xl p-6 hover:bg-white/[0.07] transition-all group`}
                >
                  {/* Active Badge */}
                  {activePackageIds.has(pkg.id) && (
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                        {t("doping.active")}
                      </span>
                    </div>
                  )}
                  {purchased === pkg.id && (
                    <div className="absolute inset-0 rounded-2xl bg-green-400/10 flex items-center justify-center z-10">
                      <div className="flex items-center gap-2 text-green-400 font-medium">
                        <Check className="w-5 h-5" />
                        {t("doping.purchased")}
                      </div>
                    </div>
                  )}
                  <div className="text-center space-y-3">
                    <p className="text-sm text-white/50">{pkg.duration}</p>
                    <p className="text-3xl font-bold text-white">{pkg.price}</p>
                    <ul className="text-xs text-white/40 space-y-1.5">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-white/30" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handlePurchase(pkg)}
                      className={`w-full py-3 rounded-xl text-sm font-medium bg-gradient-to-r ${colors.bg} text-white hover:opacity-80 transition-opacity mt-4`}
                    >
                      {t("doping.purchase")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
