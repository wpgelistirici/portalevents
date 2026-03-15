import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  Ticket,
  LogOut,
  Settings,
  Bookmark,
  LayoutDashboard,
  Shield,
  LogIn,
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { User } from "@/lib/auth-context";

interface UserMenuProps {
  user: User;
  isOrganizer: boolean;
  isAdmin: boolean;
  logout: () => void;
  openAuthModal: () => void;
}

export default function UserMenu({
  user,
  isOrganizer,
  isAdmin,
  logout,
  openAuthModal,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("Navbar");

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-cursor-hover
        className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 glass rounded-full hover:bg-foreground/[0.06] transition-colors"
      >
        <div className="relative w-7 h-7 rounded-full overflow-hidden ring-2 ring-primary/30">
          <Image src={user.avatar} alt={user.name} fill className="object-cover" />
        </div>
        <span className="text-xs font-medium max-w-[100px] truncate">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown
          size={12}
          className={`text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-2xl p-2 shadow-xl"
          >
            {/* User info header */}
            <div className="px-3 py-3 border-b border-foreground/5 mb-1">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20 flex-shrink-0">
                  <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{user.name}</p>
                  <p className="text-[10px] text-muted truncate">{user.email}</p>
                </div>
              </div>
            </div>

            <Link
              href="/my-tickets"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
              data-cursor-hover
            >
              <Ticket size={14} className="text-primary" />
              {t("myTickets")}
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
                data-cursor-hover
              >
                <Shield size={14} className="text-red-400" />
                {t("adminPanel")}
              </Link>
            )}

            {isOrganizer && !isAdmin && (
              <Link
                href="/organizer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
                data-cursor-hover
              >
                <LayoutDashboard size={14} className="text-primary" />
                {t("organizerPanel")}
              </Link>
            )}

            <Link
              href="/saved"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
              data-cursor-hover
            >
              <Bookmark size={14} className="text-gold" />
              {t("savedItems")}
            </Link>

            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
              data-cursor-hover
            >
              <Settings size={14} className="text-accent" />
              {t("accountSettings")}
            </Link>

            <div className="h-px bg-foreground/5 my-1" />

            <button
              onClick={() => {
                setIsOpen(false);
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
  );
}

interface LoginButtonProps {
  openAuthModal: () => void;
}

export function LoginButton({ openAuthModal }: LoginButtonProps) {
  const t = useTranslations("Navbar");
  return (
    <button
      onClick={openAuthModal}
      data-cursor-hover
      className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-primary text-white rounded-full hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_0_20px_rgba(123,97,255,0.4)]"
    >
      <LogIn size={13} />
      {t("login")}
    </button>
  );
}
