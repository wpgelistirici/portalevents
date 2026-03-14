"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GradientOrb from "@/components/ui/GradientOrb";
import { FadeInUp } from "@/components/ui/AnimatedText";
import { Mail, MapPin, Send, MessageSquare, Clock, Check } from "lucide-react";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormState({ name: "", email: "", subject: "", message: "" });
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
            color="secondary"
            size={300}
            bottom="20%"
            left="-5%"
            delay={3}
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <FadeInUp>
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                İletişim
              </span>
              <h1 className="display-lg mt-4 mb-6">
                Bize
                <br />
                <span className="text-gradient-primary">Ulaşın</span>
              </h1>
              <p className="text-muted text-sm max-w-md mx-auto">
                Sorularınız, önerileriniz veya iş birliği teklifleriniz için
                bize ulaşabilirsiniz.
              </p>
            </FadeInUp>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact info cards */}
            <div className="space-y-4">
              <FadeInUp delay={0.1}>
                <div className="glass rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <h3 className="text-sm font-bold mb-1">E-posta</h3>
                  <a
                    href="mailto:info@portalevents.co"
                    className="text-xs text-muted hover:text-primary transition-colors"
                  >
                    info@portalevents.co
                  </a>
                </div>
              </FadeInUp>

              <FadeInUp delay={0.15}>
                <div className="glass rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                    <MapPin size={18} className="text-secondary" />
                  </div>
                  <h3 className="text-sm font-bold mb-1">Adres</h3>
                  <p className="text-xs text-muted">
                    Levent, İstanbul
                    <br />
                    Türkiye
                  </p>
                </div>
              </FadeInUp>

              <FadeInUp delay={0.2}>
                <div className="glass rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <Clock size={18} className="text-accent" />
                  </div>
                  <h3 className="text-sm font-bold mb-1">Destek Saatleri</h3>
                  <p className="text-xs text-muted">
                    Pazartesi - Cuma: 09:00 - 18:00
                    <br />
                    Hafta sonu: E-posta desteği
                  </p>
                </div>
              </FadeInUp>
            </div>

            {/* Contact form */}
            <FadeInUp delay={0.2}>
              <div className="lg:col-span-2 glass rounded-2xl p-8">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <MessageSquare size={18} className="text-primary" />
                  Mesaj Gönderin
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Adınız"
                      required
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      className="w-full px-4 py-3 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted/60"
                    />
                    <input
                      type="email"
                      placeholder="E-posta adresiniz"
                      required
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      className="w-full px-4 py-3 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted/60"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Konu"
                    required
                    value={formState.subject}
                    onChange={(e) =>
                      setFormState({ ...formState, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted/60"
                  />
                  <textarea
                    placeholder="Mesajınız"
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    className="w-full px-4 py-3 glass rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted/60 resize-none"
                  />
                  <motion.button
                    type="submit"
                    className="px-8 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(123,97,255,0.3)] transition-all flex items-center gap-2"
                    whileTap={{ scale: 0.97 }}
                    data-cursor-hover
                  >
                    {submitted ? (
                      <>
                        <Check size={14} />
                        Gönderildi!
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Gönder
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </FadeInUp>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
