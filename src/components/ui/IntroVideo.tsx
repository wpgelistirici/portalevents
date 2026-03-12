"use client";

import { useState, useRef, useCallback } from "react";
import HoleBackground from "@/components/ui/HoleBackground";

export default function IntroVideo({ onComplete }: { onComplete: () => void }) {
  const [videoEnded, setVideoEnded] = useState(false);
  const [exiting, setExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = useCallback(() => {
    setVideoEnded(true);
  }, []);

  const handleEnter = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      onComplete();
    }, 800);
  }, [onComplete]);

  return (
    <div className={`intro-overlay ${exiting ? "intro-overlay--exit" : ""}`}>
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
        <div className="intro-enter-btn-wrapper">
          <HoleBackground
            strokeColor="rgba(123, 97, 255, 0.25)"
            numberOfLines={50}
            numberOfDiscs={50}
            particleRGBColor={[123, 97, 255]}
            className="opacity-60"
          />
          <button
            className={`intro-enter-btn ${exiting ? "intro-enter-btn--exit" : ""}`}
            onClick={handleEnter}
          >
            ENTER THE PORTAL
          </button>
        </div>
      )}
    </div>
  );
}
