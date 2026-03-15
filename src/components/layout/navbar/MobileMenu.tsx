import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { User } from "@/lib/auth-context";
import { navLinks } from "./NavLinks";

interface MobileMenuProps {
  isOpen: boolean;
  user: User | null;
  isAuthenticated: boolean;
  logout: () => void;
  openAuthModal: () => void;
  onClose: () => void;
}

export default function MobileMenu({
  isOpen,
  user,
  isAuthenticated,
  logout,
  openAuthModal,
  onClose,
}: MobileMenuProps) {
  const t = useTranslations("Navbar");

  return (
    <AnimatePresence>
      {isOpen && (
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
                onClick={onClose}
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
                    <Image src={user.avatar} alt={user.name} fill className="object-cover" />
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
                    onClick={onClose}
                  >
                    {t("myTickets")}
                  </Link>
                  <Link
                    href="/saved"
                    className="px-6 py-3 text-sm font-semibold glass rounded-full"
                    onClick={onClose}
                  >
                    {t("savedItems")}
                  </Link>
                  <Link
                    href="/account"
                    className="px-6 py-3 text-sm font-semibold glass rounded-full"
                    onClick={onClose}
                  >
                    {t("accountSettings")}
                  </Link>
                  <button
                    className="px-6 py-3 text-sm font-semibold text-red-400 glass rounded-full"
                    onClick={() => {
                      onClose();
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
                  onClose();
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
  );
}
