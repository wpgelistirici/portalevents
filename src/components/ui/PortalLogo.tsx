"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const portalRings = [
  { rx: 15, ry: 11, tilt: 0, duration: 6, direction: 1, opacity: 0.7, width: 1.2 },
  { rx: 14, ry: 9, tilt: 35, duration: 8, direction: -1, opacity: 0.5, width: 1.0 },
  { rx: 13, ry: 12, tilt: 65, duration: 5, direction: 1, opacity: 0.6, width: 0.8 },
  { rx: 15, ry: 8, tilt: -25, duration: 7, direction: -1, opacity: 0.45, width: 1.1 },
  { rx: 12, ry: 13, tilt: 50, duration: 9, direction: 1, opacity: 0.55, width: 0.7 },
  { rx: 14, ry: 10, tilt: -40, duration: 6.5, direction: -1, opacity: 0.4, width: 0.9 },
];

const fontOrbitron = { fontFamily: "var(--font-orbitron)" };

export default function PortalLogo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="flex items-center relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.span
        className="text-xl font-medium text-white/90"
        style={{ fontFamily: "var(--font-orbitron)" }}
        animate={{
          opacity: isHovered ? 0 : 1,
          filter: isHovered ? "blur(4px)" : "blur(0px)",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        P
      </motion.span>

      <motion.div
        className="relative portal-o-container"
        animate={{
          scale: isHovered ? 2.4 : 1,
          filter: isHovered
            ? "drop-shadow(0 0 8px rgba(123,97,255,0.6)) drop-shadow(0 0 20px rgba(0,240,255,0.3))"
            : "none",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <svg
          viewBox="0 0 40 40"
          className="portal-svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="portal-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7B61FF" />
              <stop offset="50%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#00F0FF" />
            </linearGradient>
            <linearGradient id="portal-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#7B61FF" />
            </linearGradient>
            <linearGradient id="portal-grad-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00F0FF" />
            </linearGradient>

            <filter id="portal-glow-soft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="portal-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx="20" cy="20" r="6" className="portal-core" />

          {portalRings.map((ring, i) => {
            const gradId = `portal-grad-${(i % 3) + 1}`;
            return (
              <ellipse
                key={i}
                cx="20"
                cy="20"
                rx={ring.rx}
                ry={ring.ry}
                className={`portal-ring portal-ring-${i + 1}`}
                style={{
                  transform: `rotate(${ring.tilt}deg)`,
                  transformOrigin: "20px 20px",
                  opacity: ring.opacity,
                  strokeWidth: ring.width,
                  animationDuration: `${ring.duration}s`,
                  animationDirection: ring.direction === -1 ? "reverse" : "normal",
                }}
                stroke={`url(#${gradId})`}
                filter={i < 2 ? "url(#portal-glow-strong)" : "url(#portal-glow-soft)"}
              />
            );
          })}
        </svg>
      </motion.div>

      <motion.span
        className="text-xl font-medium tracking-[0.25em] text-white/90"
        style={fontOrbitron}
        animate={{
          opacity: isHovered ? 0 : 1,
          filter: isHovered ? "blur(4px)" : "blur(0px)",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        RTAL
      </motion.span>
    </motion.div>
  );
}
