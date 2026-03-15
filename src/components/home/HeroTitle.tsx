"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function HeroTitle() {
  const t = useTranslations("Hero");

  return (
    <h1 className="mb-4">
      <motion.span
        className="display-md inline-block"
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 0.7,
          delay: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {t("line1")} <span className="text-gradient-primary">{t("line2")}</span>{" "}
        {t("line3")}
      </motion.span>
    </h1>
  );
}
