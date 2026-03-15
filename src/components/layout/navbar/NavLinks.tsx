import { motion } from "framer-motion";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const navLinks = [
  { key: "events", href: "/events" as const },
  { key: "artists", href: "/artists" as const },
  { key: "venues", href: "/venues" as const },
  { key: "community", href: "/community" as const },
];

export default function NavLinks() {
  const t = useTranslations("Navbar");
  const pathname = usePathname();

  return (
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
                ? "text-foreground font-medium"
                : "text-foreground/70 hover:text-foreground"
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
  );
}

export { navLinks };
