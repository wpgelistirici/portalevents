import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { MapPin, ChevronDown } from "lucide-react";

const CITIES = ["İstanbul", "Ankara", "İzmir", "Antalya", "Bursa"];

export default function LocationDropdown() {
  const t = useTranslations("Navbar");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(t("location"));
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click — handled by parent via ref, but self-contained is also fine
  return (
    <div className="relative" ref={ref}>
      <motion.button
        className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        data-cursor-hover
        onClick={() => setIsOpen(!isOpen)}
      >
        <MapPin size={12} className="text-primary" />
        <span>{selectedCity}</span>
        <ChevronDown
          size={10}
          className={`text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 w-44 glass-strong rounded-xl p-1.5 shadow-xl z-50"
          >
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                  selectedCity === city
                    ? "text-primary bg-primary/10 font-medium"
                    : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                }`}
                data-cursor-hover
              >
                {city}
              </button>
            ))}
            <button
              onClick={() => {
                setSelectedCity(t("allCities"));
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                selectedCity === t("allCities")
                  ? "text-primary bg-primary/10 font-medium"
                  : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
              }`}
              data-cursor-hover
            >
              {t("allCities")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
