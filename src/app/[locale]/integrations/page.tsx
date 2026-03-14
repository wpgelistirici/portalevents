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

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

const integrations = [
  {
    name: "Stripe",
    description:
      "Güvenli ödeme altyapısı ile bilet satışlarınızı yönetin. PCI DSS uyumlu, 135+ para birimi desteği.",
    icon: CreditCard,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    status: "Aktif",
  },
  {
    name: "Google Analytics",
    description:
      "Etkinlik sayfalarınızın performansını takip edin. Ziyaretçi davranışı, dönüşüm oranları ve daha fazlası.",
    icon: BarChart3,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    status: "Aktif",
  },
  {
    name: "WhatsApp Business",
    description:
      "Katılımcılarınıza WhatsApp üzerinden otomatik bilet ve hatırlatma bildirimleri gönderin.",
    icon: MessageSquare,
    color: "text-green-400",
    bg: "bg-green-500/10",
    status: "Aktif",
  },
  {
    name: "Spotify",
    description:
      "Etkinlik sayfalarında sanatçının Spotify profilini ve popüler parçalarını gösterin.",
    icon: Music2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    status: "Beta",
  },
  {
    name: "Meta Ads",
    description:
      "Facebook ve Instagram reklamları ile etkinliklerinizi hedef kitlenize ulaştırın.",
    icon: Megaphone,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    status: "Yakında",
  },
  {
    name: "Zapier",
    description:
      "5000+ uygulama ile PORTAL'ı bağlayın. Otomatik iş akışları oluşturun.",
    icon: Puzzle,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    status: "Yakında",
  },
];

const statusColors: Record<string, string> = {
  Aktif: "text-green-400 bg-green-500/10",
  Beta: "text-amber-400 bg-amber-500/10",
  Yakında: "text-muted bg-foreground/5",
};

export default function IntegrationsPage() {
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
                Güçlü
                <br />
                <span className="text-gradient-primary">Entegrasyonlar</span>
              </h1>
              <p className="text-muted text-sm max-w-md mx-auto">
                Favori araçlarınızı PORTAL ile bağlayın. Ödeme, analitik,
                bildirim ve daha fazlası.
              </p>
            </FadeInUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration, i) => (
              <FadeInUp key={integration.name} delay={0.1 + i * 0.05}>
                <div
                  className="glass rounded-2xl p-6 h-full flex flex-col group hover:bg-foreground/[0.02] transition-colors"
                  data-cursor-hover
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${integration.bg} flex items-center justify-center`}
                    >
                      <integration.icon
                        size={20}
                        className={integration.color}
                      />
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${statusColors[integration.status]}`}
                    >
                      {integration.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold mb-2">{integration.name}</h3>
                  <p className="text-xs text-muted leading-relaxed flex-1">
                    {integration.description}
                  </p>
                  {integration.status === "Aktif" && (
                    <button
                      className="mt-4 text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
                      data-cursor-hover
                    >
                      Yapılandır <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
