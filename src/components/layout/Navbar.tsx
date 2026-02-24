"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin, LogIn, Ticket, User, LogOut, ChevronDown, Settings, Bookmark, LayoutDashboard, Shield } from "lucide-react";
import Image from "next/image";
import AuthModal from "@/components/ui/AuthModal";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import PortalLogo from "@/components/ui/PortalLogo";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { key: "events", href: "/events" as const },
  { key: "artists", href: "/artists" as const },
  { key: "venues", href: "/venues" as const },
  { key: "community", href: "/community" as const },
];

export default function Navbar({ variant }: { variant?: "default" | "solid" } = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const { user, isAuthenticated, isOrganizer, isAdmin, openAuthModal, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-[900] transition-all duration-500 border-0 ${
          variant === "solid"
            ? isScrolled
              ? "py-3 border-b border-white/[0.04]"
              : "py-6"
            : isScrolled
              ? "py-3 glass-strong !border-0"
              : "py-6 bg-black/30 backdrop-blur-md"
        }`}
        style={variant === "solid" ? { background: "rgba(10, 10, 11, 0.92)", backdropFilter: "blur(24px)" } : undefined}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative group" data-cursor-hover>
            <PortalLogo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  data-cursor-hover
                  className={`relative text-sm transition-colors duration-300 group ${
                    isActive
                      ? "text-white font-medium"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i + 0.5 }}
                  >
                    {t(link.key)}
                  </motion.span>
                  <span
                    className={`absolute -bottom-1 left-0 h-[1px] bg-primary transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              data-cursor-hover
            >
              <MapPin size={12} className="text-primary" />
              <span>{t("location")}</span>
            </motion.button>

            <LanguageSwitcher />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              {isAuthenticated && user ? (
                /* User menu */
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    data-cursor-hover
                    className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 glass rounded-full hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="relative w-7 h-7 rounded-full overflow-hidden ring-2 ring-primary/30">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-medium max-w-[100px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown
                      size={12}
                      className={`text-muted transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-2xl p-2 shadow-xl"
                      >
                        {/* User info header */}
                        <div className="px-3 py-3 border-b border-white/5 mb-1">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20 flex-shrink-0">
                              <Image
                                src={user.avatar}
                                alt={user.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold truncate">{user.name}</p>
                              <p className="text-[10px] text-muted truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu items */}
                        <Link
                          href="/my-tickets"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                          data-cursor-hover
                        >
                          <Ticket size={14} className="text-primary" />
                          {t("myTickets")}
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                            data-cursor-hover
                          >
                            <Shield size={14} className="text-red-400" />
                            {t("adminPanel")}
                          </Link>
                        )}
                        {isOrganizer && !isAdmin && (
                          <Link
                            href="/organizer"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                            data-cursor-hover
                          >
                            <LayoutDashboard size={14} className="text-primary" />
                            {t("organizerPanel")}
                          </Link>
                        )}

                        <Link
                          href="/saved"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                          data-cursor-hover
                        >
                          <Bookmark size={14} className="text-gold" />
                          {t("savedItems")}
                        </Link>

                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                          data-cursor-hover
                        >
                          <Settings size={14} className="text-accent" />
                          {t("accountSettings")}
                        </Link>

                        <div className="h-px bg-white/5 my-1" />

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                          data-cursor-hover
                        >
                          <LogOut size={14} />
                          {t("logout")}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Login button */
                <button
                  onClick={openAuthModal}
                  data-cursor-hover
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-primary text-white rounded-full hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_0_20px_rgba(123,97,255,0.4)]"
                >
                  <LogIn size={13} />
                  {t("login")}
                </button>
              )}
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden relative z-50 text-foreground"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            data-cursor-hover
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 z-[899] bg-background/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at top right)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.key}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ delay: i * 0.1 + 0.2 }}
              >
                <Link
                  href={link.href}
                  className="display-md text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {t(link.key)}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {isAuthenticated && user ? (
                <div className="flex flex-col items-center gap-4 mt-8">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/30">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold">{user.name}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link
                      href="/my-tickets"
                      className="px-6 py-3 text-sm font-semibold glass rounded-full"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {t("myTickets")}
                    </Link>
                    <Link
                      href="/saved"
                      className="px-6 py-3 text-sm font-semibold glass rounded-full"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {t("savedItems")}
                    </Link>
                    <Link
                      href="/account"
                      className="px-6 py-3 text-sm font-semibold glass rounded-full"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {t("accountSettings")}
                    </Link>
                    <button
                      className="px-6 py-3 text-sm font-semibold text-red-400 glass rounded-full"
                      onClick={() => {
                        setIsMobileOpen(false);
                        logout();
                      }}
                    >
                      {t("logout")}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="mt-8 px-8 py-4 text-lg font-semibold bg-primary text-white rounded-full"
                  onClick={() => {
                    setIsMobileOpen(false);
                    openAuthModal();
                  }}
                >
                  {t("login")}
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal (Global) */}
      <AuthModal />
    </>
  );
}
