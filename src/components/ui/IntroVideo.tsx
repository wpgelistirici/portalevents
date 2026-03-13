"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import HoleBackground from "@/components/ui/HoleBackground";

export default function IntroVideo({ onComplete }: { onComplete: () => void }) {
  const [videoEnded, setVideoEnded] = useState(false);
  const [bgReady, setBgReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isDark =
    typeof window !== "undefined" &&
    localStorage.getItem("portal-theme") !== "light";

  const handleVideoEnd = useCallback(() => {
    setVideoEnded(true);
  }, []);

  useEffect(() => {
    if (!videoEnded) return;
    if (isDark) {
      // Dark mode: wait for white→black transition before showing content
      const timer = setTimeout(() => setBgReady(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Light mode: show immediately
      setBgReady(true);
    }
  }, [videoEnded, isDark]);

  const handleEnter = useCallback(() => {
    setExiting(true);
    // First hide text, then after delay fade out the whole overlay
    setTimeout(() => {
      onComplete();
    }, 1400);
  }, [onComplete]);

  return (
    <div
      className="intro-overlay"
      style={{
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.8s ease 0.6s",
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      <video
        ref={videoRef}
        className="intro-video"
        src="/video.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
      />

      {videoEnded && (
        <div
          className="intro-enter-btn-wrapper"
          style={{
            background: isDark ? undefined : "#fff",
          }}
        >
          {/* Dark mode: white→black bg transition */}
          {isDark && (
            <div
              className="absolute inset-0 z-0"
              style={{
                background: "#fff",
                animation: "intro-bg-to-dark 1s ease forwards",
              }}
            />
          )}

          <div
            className={`relative z-[1] w-full h-full ${isDark && !bgReady ? "opacity-0" : ""}`}
            style={{ transition: "opacity 0.6s ease" }}
          >
            <HoleBackground
              strokeColor="rgba(123, 97, 255, 0.25)"
              numberOfLines={50}
              numberOfDiscs={50}
              particleRGBColor={[123, 97, 255]}
              className="opacity-60"
            />
          </div>

          {bgReady && (
            <button
              className={`intro-enter-btn ${exiting ? "intro-enter-btn--exit" : ""}`}
              style={{ color: isDark ? "#fff" : "#000" }}
              onClick={handleEnter}
            >
              ENTER THE PORTAL
            </button>
          )}
        </div>
      )}
    </div>
  );
}
