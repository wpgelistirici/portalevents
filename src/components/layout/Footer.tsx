"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { FadeInUp } from "@/components/ui/AnimatedText";
import {
  Instagram,
  Twitter,
  Youtube,
  Music2,
  ArrowUpRight,
  Heart,
} from "lucide-react";

const footerLinkKeys = {
  explore: [
    { key: "events", href: "/events" },
    { key: "artists", href: "/artists" },
    { key: "venues", href: "/venues" },
    { key: "community", href: "/community" },
  ],
  platform: [
    { key: "organizer", href: "#" },
    { key: "pricing", href: "#" },
    { key: "api", href: "#" },
    { key: "integrations", href: "#" },
  ],
  support: [
    { key: "faq", href: "#" },
    { key: "contact", href: "#" },
    { key: "privacy", href: "/legal/kvkk" },
    { key: "terms", href: "/legal/distance-sales" },
  ],
};

const socials = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Music2, href: "#", label: "Spotify" },
];

export default function Footer() {
  const t = useTranslations("Footer");

  const footerSections = [
    { titleKey: "explore", links: footerLinkKeys.explore },
    { titleKey: "platform", links: footerLinkKeys.platform },
    { titleKey: "support", links: footerLinkKeys.support },
  ];

  return (
    <footer className="relative pt-32 pb-8 overflow-hidden">
      {/* Top gradient line */}
      <div className="section-divider" />

      {/* Background orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Newsletter section */}
        <FadeInUp>
          <div className="text-center mb-20 pt-16">
            <h2 className="display-md mb-4">
              {t("newsletterTitle")}
              <br />
              <span className="text-gradient-primary">
                {t("newsletterTitleHighlight")}
              </span>
            </h2>
            <p className="text-muted text-sm max-w-md mx-auto mb-8">
              {t("newsletterDescription")}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                className="flex-1 w-full px-5 py-3 glass rounded-full text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted"
              />
              <button
                data-cursor-hover
                className="px-6 py-3 bg-primary text-white text-sm font-semibold rounded-full hover:shadow-[0_0_20px_rgba(255,45,85,0.3)] transition-all duration-300 whitespace-nowrap"
              >
                {t("subscribe")}
              </button>
            </div>
          </div>
        </FadeInUp>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {/* Brand column */}
          <FadeInUp>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-end gap-[2px] h-5">
                  {[0.4, 0.7, 1, 0.6, 0.8].map((height, i) => (
                    <div
                      key={i}
                      className="w-[2px] bg-primary rounded-full"
                      style={{ height: `${height * 20}px` }}
                    />
                  ))}
                </div>
                <span className="text-lg font-bold">PULSE</span>
              </div>
              <p className="text-xs text-muted leading-relaxed mb-6">
                {t("brandDescription")}
              </p>
              <div className="flex items-center gap-3">
                {socials.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    data-cursor-hover
                    className="w-8 h-8 glass rounded-full flex items-center justify-center text-muted hover:text-primary hover:border-primary/30 transition-colors duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    aria-label={social.label}
                  >
                    <social.icon size={14} />
                  </motion.a>
                ))}
              </div>
            </div>
          </FadeInUp>

          {/* Link columns */}
          {footerSections.map((section, i) => (
            <FadeInUp key={section.titleKey} delay={0.1 * (i + 1)}>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">
                  {t(section.titleKey)}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        data-cursor-hover
                        className="text-sm text-muted hover:text-foreground transition-colors duration-300 group inline-flex items-center gap-1"
                      >
                        {t(link.key)}
                        <ArrowUpRight
                          size={10}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInUp>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">{t("copyright")}</p>
          <p className="text-xs text-muted flex items-center gap-1">
            <Heart size={10} className="text-primary" fill="currentColor" />
            {t("madeWith")}
          </p>
        </div>
      </div>
    </footer>
  );
}
