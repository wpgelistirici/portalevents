"use client";

import { useRef, useEffect, useCallback } from "react";

interface HoleBackgroundProps extends React.ComponentProps<"div"> {
  strokeColor?: string;
  numberOfLines?: number;
  numberOfDiscs?: number;
  particleRGBColor?: [number, number, number];
}

// Simple easing function: easeInExpo
function easeInExpo(t: number): number {
  return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
}

function linear(t: number): number {
  return t;
}

interface Disc {
  x: number;
  y: number;
  w: number;
  h: number;
  p: number;
}

interface Particle {
  x: number;
  sx: number;
  dx: number;
  y: number;
  vy: number;
  p: number;
  r: number;
  c: string;
}

interface ClipData {
  disc: { x: number; y: number; w: number; h: number };
  i: number;
  path: Path2D;
}

export default function HoleBackground({
  strokeColor = "#737373",
  numberOfLines = 50,
  numberOfDiscs = 50,
  particleRGBColor = [255, 255, 255],
  className,
  ...props
}: HoleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const stateRef = useRef<{
    discs: Disc[];
    lines: { x: number; y: number }[][];
    particles: Particle[];
    startDisc: { x: number; y: number; w: number; h: number };
    endDisc: { x: number; y: number; w: number; h: number };
    clip: ClipData;
    linesCanvas: OffscreenCanvas | null;
    particleArea: {
      sw: number;
      ew: number;
      h: number;
      sx: number;
      ex: number;
    };
    render: { width: number; height: number; dpi: number };
  }>({
    discs: [],
    lines: [],
    particles: [],
    startDisc: { x: 0, y: 0, w: 0, h: 0 },
    endDisc: { x: 0, y: 0, w: 0, h: 0 },
    clip: {
      disc: { x: 0, y: 0, w: 0, h: 0 },
      i: 0,
      path: null as unknown as Path2D,
    },
    linesCanvas: null,
    particleArea: { sw: 0, ew: 0, h: 0, sx: 0, ex: 0 },
    render: { width: 0, height: 0, dpi: 1 },
  });

  const tweenValue = useCallback(
    (start: number, end: number, p: number, useEase: boolean = false) => {
      const delta = end - start;
      const easeFn = useEase ? easeInExpo : linear;
      return start + delta * easeFn(p);
    },
    [],
  );

  const tweenDisc = useCallback(
    (disc: Disc): Disc => {
      const s = stateRef.current;
      disc.x = tweenValue(s.startDisc.x, s.endDisc.x, disc.p);
      disc.y = tweenValue(s.startDisc.y, s.endDisc.y, disc.p, true);
      disc.w = tweenValue(s.startDisc.w, s.endDisc.w, disc.p);
      disc.h = tweenValue(s.startDisc.h, s.endDisc.h, disc.p);
      return disc;
    },
    [tweenValue],
  );

  const initParticle = useCallback(
    (start = false): Particle => {
      const s = stateRef.current;
      const sx = s.particleArea.sx + s.particleArea.sw * Math.random();
      const ex = s.particleArea.ex + s.particleArea.ew * Math.random();
      const dx = ex - sx;
      const y = start ? s.particleArea.h * Math.random() : s.particleArea.h;
      const r = 0.5 + Math.random() * 4;
      const vy = 0.5 + Math.random();
      const [pr, pg, pb] = particleRGBColor;

      return {
        x: sx,
        sx,
        dx,
        y,
        vy,
        p: 0,
        r,
        c: `rgba(${pr}, ${pg}, ${pb}, ${Math.random()})`,
      };
    },
    [particleRGBColor],
  );

  const tickRef = useRef<() => void>(() => {});

  const setup = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const s = stateRef.current;
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const dpi = window.devicePixelRatio || 1;

    s.render = { width, height, dpi };
    canvas.width = width * dpi;
    canvas.height = height * dpi;

    // Set discs
    s.discs = [];
    s.startDisc = {
      x: width * 0.5,
      y: height * 0.45,
      w: width * 0.75,
      h: height * 0.7,
    };
    s.endDisc = {
      x: width * 0.5,
      y: height * 0.95,
      w: 0,
      h: 0,
    };

    const totalDiscs = numberOfDiscs * 2; // internal resolution higher
    let prevBottom = height;

    s.clip = {
      disc: { x: 0, y: 0, w: 0, h: 0 },
      i: 0,
      path: new Path2D(),
    };

    for (let i = 0; i < totalDiscs; i++) {
      const p = i / totalDiscs;
      const disc: Disc = { x: 0, y: 0, w: 0, h: 0, p };
      // tween inline
      disc.x = tweenValue(s.startDisc.x, s.endDisc.x, p);
      disc.y = tweenValue(s.startDisc.y, s.endDisc.y, p, true);
      disc.w = tweenValue(s.startDisc.w, s.endDisc.w, p);
      disc.h = tweenValue(s.startDisc.h, s.endDisc.h, p);

      const bottom = disc.y + disc.h;
      if (bottom <= prevBottom) {
        s.clip.disc = { ...disc };
        s.clip.i = i;
      }
      prevBottom = bottom;
      s.discs.push(disc);
    }

    s.clip.path = new Path2D();
    s.clip.path.ellipse(
      s.clip.disc.x,
      s.clip.disc.y,
      s.clip.disc.w,
      s.clip.disc.h,
      0,
      0,
      Math.PI * 2,
    );
    s.clip.path.rect(
      s.clip.disc.x - s.clip.disc.w,
      0,
      s.clip.disc.w * 2,
      s.clip.disc.y,
    );

    // Set lines
    s.lines = [];
    const totalLines = numberOfLines * 2;
    const linesAngle = (Math.PI * 2) / totalLines;

    for (let i = 0; i < totalLines; i++) {
      s.lines.push([]);
    }

    s.discs.forEach((disc) => {
      for (let i = 0; i < totalLines; i++) {
        const angle = i * linesAngle;
        s.lines[i].push({
          x: disc.x + Math.cos(angle) * disc.w,
          y: disc.y + Math.sin(angle) * disc.h,
        });
      }
    });

    // Pre-render lines to offscreen canvas
    s.linesCanvas = new OffscreenCanvas(width, height);
    const lctx = s.linesCanvas.getContext("2d");
    if (lctx) {
      s.lines.forEach((line) => {
        lctx.save();
        let lineIsIn = false;

        line.forEach((p1, j) => {
          if (j === 0) return;
          const p0 = line[j - 1];

          if (
            !lineIsIn &&
            (lctx.isPointInPath(s.clip.path, p1.x, p1.y) ||
              lctx.isPointInStroke(s.clip.path, p1.x, p1.y))
          ) {
            lineIsIn = true;
          } else if (lineIsIn) {
            lctx.clip(s.clip.path);
          }

          lctx.beginPath();
          lctx.moveTo(p0.x, p0.y);
          lctx.lineTo(p1.x, p1.y);
          lctx.strokeStyle = strokeColor;
          lctx.lineWidth = 1;
          lctx.stroke();
          lctx.closePath();
        });

        lctx.restore();
      });
    }

    // Set particles
    s.particles = [];
    s.particleArea = {
      sw: s.clip.disc.w * 0.5,
      ew: s.clip.disc.w * 2,
      h: height * 0.85,
      sx: 0,
      ex: 0,
    };
    s.particleArea.sx = (width - s.particleArea.sw) / 2;
    s.particleArea.ex = (width - s.particleArea.ew) / 2;

    const totalParticles = numberOfDiscs * 2;
    for (let i = 0; i < totalParticles; i++) {
      s.particles.push(initParticle(true));
    }
  }, [numberOfDiscs, numberOfLines, strokeColor, tweenValue, initParticle]);

  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = stateRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(s.render.dpi, s.render.dpi);

    // Move discs
    s.discs.forEach((disc) => {
      disc.p = (disc.p + 0.001) % 1;
      tweenDisc(disc);
    });

    // Move particles
    s.particles.forEach((particle) => {
      particle.p = 1 - particle.y / s.particleArea.h;
      particle.x = particle.sx + particle.dx * particle.p;
      particle.y -= particle.vy;
      if (particle.y < 0) {
        const fresh = initParticle(false);
        particle.y = fresh.y;
        particle.sx = fresh.sx;
        particle.dx = fresh.dx;
        particle.r = fresh.r;
        particle.c = fresh.c;
        particle.vy = fresh.vy;
      }
    });

    // Draw discs (ellipses)
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;

    // Outer disc
    const outer = s.startDisc;
    ctx.beginPath();
    ctx.ellipse(outer.x, outer.y, outer.w, outer.h, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();

    // Inner discs
    s.discs.forEach((disc, i) => {
      if (i % 5 !== 0) return;

      if (disc.w < s.clip.disc.w - 5) {
        ctx.save();
        ctx.clip(s.clip.path);
      }

      ctx.beginPath();
      ctx.ellipse(disc.x, disc.y, disc.w, disc.h, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();

      if (disc.w < s.clip.disc.w - 5) {
        ctx.restore();
      }
    });

    // Draw lines
    if (s.linesCanvas) {
      ctx.drawImage(s.linesCanvas, 0, 0);
    }

    // Draw particles
    ctx.save();
    ctx.clip(s.clip.path);
    s.particles.forEach((particle) => {
      ctx.fillStyle = particle.c;
      ctx.beginPath();
      ctx.rect(particle.x, particle.y, particle.r, particle.r);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();

    ctx.restore();

    animationRef.current = requestAnimationFrame(tickRef.current);
  }, [strokeColor, tweenDisc, initParticle]);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  useEffect(() => {
    setup();
    animationRef.current = requestAnimationFrame(() => tickRef.current());

    const handleResize = () => {
      setup();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [setup, tick]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className ?? ""}`}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
      />
    </div>
  );
}
