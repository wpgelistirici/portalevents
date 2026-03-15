"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/routing";
import AuthModal from "@/components/ui/AuthModal";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import PortalLogo from "@/components/ui/PortalLogo";
import { useAuth } from "@/lib/auth-context";
import { NAVBAR_SCROLL_THRESHOLD } from "@/lib/constants";
import NavLinks from "./navbar/NavLinks";
import LocationDropdown from "./navbar/LocationDropdown";
import ThemeToggleButton from "./navbar/ThemeToggleButton";
import UserMenu, { LoginButton } from "./navbar/UserMenu";
import MobileMenu from "./navbar/MobileMenu";

export default function Navbar({
  variant,
}: { variant?: "default" | "solid" } = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { user, isAuthenticated, isOrganizer, isAdmin, openAuthModal, logout } =
    useAuth();

  useEffect(() => {
    setHasMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > NAVBAR_SCROLL_THRESHOLD);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-[900] transition-all duration-500 border-0 ${
          variant === "solid"
            ? isScrolled
              ? "py-3 border-b border-border/40"
              : "py-6"
            : isScrolled
              ? "py-3 glass-strong !border-0 backdrop-blur-md"
              : "py-6"
        }`}
        style={
          variant === "solid"
            ? {
                background: "var(--color-surface)",
                opacity: 0.92,
                backdropFilter: "blur(24px)",
              }
            : undefined
        }
        initial={hasMounted ? { y: -100 } : false}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative group" data-cursor-hover>
            <PortalLogo />
          </Link>

          {/* Desktop Nav Links */}
          <NavLinks />

          {/* Right side controls */}
          <div className="hidden md:flex items-center gap-4">
            <LocationDropdown />
            <LanguageSwitcher />
            <ThemeToggleButton />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              {isAuthenticated && user ? (
                <UserMenu
                  user={user}
                  isOrganizer={isOrganizer}
                  isAdmin={isAdmin}
                  logout={logout}
                  openAuthModal={openAuthModal}
                />
              ) : (
                <LoginButton openAuthModal={openAuthModal} />
              )}
            </motion.div>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden relative z-50 text-foreground"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            data-cursor-hover
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <MobileMenu
        isOpen={isMobileOpen}
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
        openAuthModal={openAuthModal}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* Auth Modal (Global) */}
      <AuthModal />
    </>
  );
}
