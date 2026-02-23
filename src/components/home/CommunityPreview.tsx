"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { communityPosts } from "@/lib/data";
import { useTranslations } from "next-intl";
import { FadeInUp } from "@/components/ui/AnimatedText";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  Heart,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Quote,
  Users,
  MessageSquare,
  Globe,
} from "lucide-react";
import Image from "next/image";

const statIcons = [
  { icon: Users, value: "150K+", key: "members" },
  { icon: MessageSquare, value: "8.5K", key: "posts" },
  { icon: Globe, value: "120+", key: "cities" },
];

export default function CommunityPreview() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("CommunityPreview");

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -380 : 380,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header with nav arrows */}
        <FadeInUp>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">
                {t("label")}
              </span>
              <h2 className="display-lg mt-4">
                {t("titleLine1")}
                <br />
                <span className="text-gradient-gold">{t("titleLine2")}</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => scroll("left")}
                data-cursor-hover
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-foreground transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={() => scroll("right")}
                data-cursor-hover
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-foreground transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </FadeInUp>
      </div>

      {/* Horizontal scroll testimonials */}
      <FadeInUp delay={0.2}>
        <div className="max-w-7xl mx-auto px-6">
          <div
            ref={scrollRef}
            className="flex gap-5 -mr-6 overflow-x-auto scrollbar-hide pb-4 pr-6"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {communityPosts.map((post, i) => (
              <motion.div
                key={post.id}
                className="group glass rounded-2xl p-6 w-[340px] flex-shrink-0 flex flex-col justify-between card-hover"
                style={{ scrollSnapAlign: "start" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                data-cursor-hover
              >
                {/* Quote icon */}
                <div>
                  <Quote size={20} className="text-gold/30 mb-4" />
                  <p className="text-sm text-foreground/80 leading-relaxed mb-6">
                    {post.content}
                  </p>
                </div>

                {/* User + actions */}
                <div>
                  <div className="flex items-center gap-6 pb-4 mb-4 border-b border-white/5">
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <Heart size={13} className="text-primary" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <MessageCircle size={13} className="text-secondary" />
                      {post.comments}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-gold/20">
                      <Image
                        src={post.avatar}
                        alt={post.user}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{post.user}</h4>
                      <span className="text-[10px] text-muted">
                        {post.time}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInUp>

      {/* CTA Banner */}
      <FadeInUp delay={0.4}>
        <div className="max-w-7xl mx-auto px-6 mt-16">
          <div className="relative rounded-2xl overflow-hidden">
            {/* BG */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-surface to-gold/5" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            />
            <div className="absolute inset-0 rounded-2xl border border-gold/10" />

            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
              {/* Stats */}
              <div className="flex items-center gap-8 md:gap-10">
                {statIcons.map((stat, i) => (
                  <div key={i} className="text-center">
                    <stat.icon size={18} className="text-gold mx-auto mb-2" />
                    <div className="text-xl md:text-2xl font-bold text-gradient-gold">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-muted uppercase tracking-wider mt-0.5">
                      {t(`stats.${stat.key}`)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-20 bg-gold/10" />

              {/* CTA */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg md:text-xl font-bold mb-2">
                  {t("ctaTitle")}
                </h3>
                <p className="text-xs text-muted mb-5 max-w-sm">
                  {t("ctaDescription")}
                </p>
                <MagneticButton className="px-7 py-3 bg-gold/15 text-gold text-xs font-semibold rounded-full hover:bg-gold/25 transition-all duration-300 border border-gold/20">
                  <span className="flex items-center gap-2">
                    {t("ctaButton")}
                    <ArrowRight size={13} />
                  </span>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </FadeInUp>
    </section>
  );
}
