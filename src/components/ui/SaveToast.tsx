"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookmarkX } from "lucide-react";
import { useSaved } from "@/lib/saved-context";
import { useTranslations } from "next-intl";

export default function SaveToast() {
  const { toast } = useSaved();
  const t = useTranslations("SaveToast");

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.message + Date.now()}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border"
          style={{
            background: toast.type === "save" ? "rgba(10, 10, 11, 0.95)" : "rgba(10, 10, 11, 0.95)",
            borderColor: toast.type === "save" ? "rgba(212, 175, 55, 0.2)" : "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              toast.type === "save" ? "bg-gold/10" : "bg-white/5"
            }`}
          >
            {toast.type === "save" ? (
              <Bookmark size={14} className="text-gold fill-gold" />
            ) : (
              <BookmarkX size={14} className="text-muted" />
            )}
          </div>
          <span className="text-sm font-medium">
            {t(toast.message)}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
