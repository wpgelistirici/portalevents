"use client";

import { useEffect, useState } from "react";

export default function NoiseOverlay() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <div className="noise-overlay" aria-hidden="true" />;
}
