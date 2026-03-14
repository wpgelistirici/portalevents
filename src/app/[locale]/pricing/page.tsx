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

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

const plans = [
  {
    name: "Starter",
    price: "Ücretsiz",
    period: "",
    description: "Küçük etkinlikler için ideal başlangıç",
    icon: Zap,
    color: "text-accent",
    bg: "bg-accent/10",
    features: [
      "Aylık 2 etkinlik",
      "100 bilet/etkinlik",
      "Temel analitik",
      "E-posta desteği",
      "QR bilet doğrulama",
    ],
  },
  {
    name: "Pro",
    price: "₺499",
    period: "/ay",
    description: "Büyüyen organizatörler için",
    icon: Sparkles,
    color: "text-primary",
    bg: "bg-primary/10",
    popular: true,
    features: [
      "Sınırsız etkinlik",
      "5.000 bilet/etkinlik",
      "Gelişmiş analitik",
      "Öncelikli destek",
      "QR bilet doğrulama",
      "Özel kupon kodları",
      "Topluluk paylaşımları",
      "Doping seçenekleri",
    ],
  },
  {
    name: "Enterprise",
    price: "₺1.499",
    period: "/ay",
    description: "Büyük ölçekli organizasyonlar için",
    icon: Crown,
    color: "text-gold",
    bg: "bg-gold/10",
    features: [
      "Sınırsız her şey",
      "50.000+ bilet/etkinlik",
      "Gerçek zamanlı analitik",
      "7/24 destek",
      "API erişimi",
      "Özel entegrasyonlar",
      "Beyaz etiket seçeneği",
      "Kişiye özel hesap yöneticisi",
      "Gelişmiş raporlama",
    ],
  },
];

export default function PricingPage() {
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
                Fiyatlandırma
              </span>
              <h1 className="display-lg mt-4 mb-6">
                Her Ölçeğe Uygun
                <br />
                <span className="text-gradient-primary">Esnek Planlar</span>
              </h1>
              <p className="text-muted text-sm max-w-md mx-auto">
                Etkinlik büyüklüğünüze göre en uygun planı seçin. İstediğiniz
                zaman yükseltin veya düşürün.
              </p>
            </FadeInUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <FadeInUp key={plan.name} delay={0.1 * i}>
                <motion.div
                  className={`relative glass rounded-2xl p-8 h-full flex flex-col ${
                    plan.popular ? "ring-2 ring-primary/30" : ""
                  }`}
                  whileHover={{ y: -4 }}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                      Popüler
                    </div>
                  )}

                  <div
                    className={`w-12 h-12 rounded-xl ${plan.bg} flex items-center justify-center mb-4`}
                  >
                    <plan.icon size={20} className={plan.color} />
                  </div>

                  <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                  <p className="text-xs text-muted mb-4">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-muted">{plan.period}</span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-foreground/70"
                      >
                        <Check size={14} className={plan.color} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                      plan.popular
                        ? "bg-primary text-white hover:shadow-[0_0_30px_rgba(123,97,255,0.3)]"
                        : "glass hover:bg-foreground/5"
                    }`}
                    data-cursor-hover
                  >
                    Başla
                  </button>
                </motion.div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
