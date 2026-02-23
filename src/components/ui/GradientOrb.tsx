"use client";

import { motion } from "framer-motion";

interface GradientOrbProps {
  color: "primary" | "secondary" | "accent";
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay?: number;
}

export default function GradientOrb({
  color,
  size = 400,
  top,
  left,
  right,
  bottom,
  delay = 0,
}: GradientOrbProps) {
  return (
    <motion.div
      className={`gradient-orb gradient-orb-${color}`}
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
      }}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -40, 20, 0],
        scale: [1, 1.1, 0.95, 1],
      }}
      transition={{
        duration: 12,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
