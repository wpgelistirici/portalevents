import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

export default function AuthSuccessState() {
  const t = useTranslations("AuthModal");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 z-20 bg-surface-light flex flex-col items-center justify-center rounded-3xl"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4"
      >
        <Check size={32} className="text-green-400" />
      </motion.div>
      <p className="text-lg font-bold">{t("welcomeBack")}</p>
      <p className="text-sm text-muted mt-1">{t("redirecting")}</p>
    </motion.div>
  );
}
