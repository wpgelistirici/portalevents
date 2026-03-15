"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryContentProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundaryContent({
  error,
  reset,
}: ErrorBoundaryContentProps) {
  const t = useTranslations("Errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-5 text-center max-w-sm"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertCircle size={28} className="text-red-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">{t("somethingWentWrong")}</h2>
          <p className="text-sm text-muted">{t("errorDescription")}</p>
        </div>

        <button
          onClick={reset}
          data-cursor-hover
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary/90 transition-colors"
        >
          <RefreshCw size={14} />
          {t("tryAgain")}
        </button>
      </motion.div>
    </div>
  );
}
