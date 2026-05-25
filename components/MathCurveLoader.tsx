"use client";

import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════
   MathCurveLoader · 数学曲线加载动画
   参考 math-curve-loaders (MIT) 的曲线方程
   适配镜塔 Tarot 暗色星图 + 克制金色气质
   ═══════════════════════════════════════════ */

/* ─── types ─── */

type Variant = "rose" | "lemniscate" | "star" | "orbit";
type Tone = "gold" | "plum";

interface MathCurveLoaderProps {
  variant?: Variant;
  size?: number;
  label?: string;
  tone?: Tone;
  active?: boolean;
}

/* ─── curve definitions ─── */

interface CurveConfig {
  particleCount: number;
  trailSpan: number;
  durationMs: number;
  rotationDurationMs: number;
  pulseDurationMs: number;
  strokeWidth: number;
  rotate: boolean;
  point: (progress: number, detailScale: number) => { x: number; y: number };
}

const CURVES: Record<Variant, CurveConfig> = {
  /* Rose Curve: r = a·cos(7t) — 七瓣花环，适合“洗牌中” */
  rose: {
    particleCount: 48,
    trailSpan: 0.36,
    durationMs: 4600,
    rotationDurationMs: 28000,
    pulseDurationMs: 4200,
    strokeWidth: 5,
    rotate: true,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const baseRadius = 7;
      const detailAmp = 3 * detailScale;
      const k = 7;
      const scale = 3.9;
      const x = baseRadius * Math.cos(t) - detailAmp * Math.cos(k * t);
      const y = baseRadius * Math.sin(t) - detailAmp * Math.sin(k * t);
      return { x: 50 + x * scale, y: 50 + y * scale };
    },
  },

  /* Lemniscate: Bernoulli 无限符号 — 适合“AI 解读中” */
  lemniscate: {
    particleCount: 52,
    trailSpan: 0.4,
    durationMs: 5600,
    rotationDurationMs: 34000,
    pulseDurationMs: 5000,
    strokeWidth: 4.5,
    rotate: false,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const scale = 20 + detailScale * 7;
      const d = 1 + Math.sin(t) ** 2;
      return {
        x: 50 + (scale * Math.cos(t)) / d,
        y: 50 + (scale * Math.sin(t) * Math.cos(t)) / d,
      };
    },
  },

  /* Astroid Star: 内旋轮线四尖星芒 — 适合“生成报告中” */
  star: {
    particleCount: 56,
    trailSpan: 0.34,
    durationMs: 5200,
    rotationDurationMs: 32000,
    pulseDurationMs: 4600,
    strokeWidth: 4.2,
    rotate: true,
    point(progress) {
      const t = progress * Math.PI * 2;
      const R = 8;
      const r = 2;
      const d = 4;
      const x = (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
      const y = (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
      const scale = 3.3;
      return { x: 50 + x * scale, y: 50 + y * scale };
    },
  },

  /* Orbit: 双环 Cassini 风格 — 适合“解锁/支付中” */
  orbit: {
    particleCount: 44,
    trailSpan: 0.38,
    durationMs: 5000,
    rotationDurationMs: 26000,
    pulseDurationMs: 4400,
    strokeWidth: 4.8,
    rotate: true,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const baseRadius = 8;
      const amp = 3.5 * detailScale;
      const petals = 5;
      const x = baseRadius * Math.cos(t) - amp * Math.cos(petals * t);
      const y = baseRadius * Math.sin(t) - amp * Math.sin(petals * t);
      const scale = 3.7;
      return { x: 50 + x * scale, y: 50 + y * scale };
    },
  },
};

/* ─── tone colors ─── */

const TONE_COLORS: Record<Tone, { stroke: string; fill: string }> = {
  gold: { stroke: "rgba(216,170,93,0.18)", fill: "#f1d38a" },
  plum: { stroke: "rgba(111,61,97,0.2)", fill: "#c9a0b8" },
};

/* ─── particles for reduced motion ─── */

const REDUCED_PARTICLE_COUNT = 16;

/* ─── component ─── */

export function MathCurveLoader({
  variant = "rose",
  size = 160,
  label = "正在整理牌面",
  tone = "gold",
  active = true,
}: MathCurveLoaderProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const particlesRef = useRef<SVGCircleElement[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const [reduced, setReduced] = useState(false);

  /* ─── check reduced motion ─── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  /* ─── create static SVG elements once ─── */
  useEffect(() => {
    const svg = svgRef.current;
    const group = groupRef.current;
    if (!svg || !group) return;

    const curve = CURVES[variant];
    /* reduced motion 用更少粒子 */
    const count = reduced ? REDUCED_PARTICLE_COUNT : curve.particleCount;

    /* clear old particles */
    particlesRef.current.forEach((c) => c.remove());
    particlesRef.current = [];

    const SVG_NS = "http://www.w3.org/2000/svg";
    for (let i = 0; i < count; i++) {
      const circle = document.createElementNS(SVG_NS, "circle");
      circle.setAttribute("fill", TONE_COLORS[tone].fill);
      circle.setAttribute("opacity", "0");
      group.appendChild(circle);
      particlesRef.current.push(circle);
    }
  }, [variant, reduced, tone]);

  /* ─── animation loop ─── */
  useEffect(() => {
    if (!active) return;

    const curve = CURVES[variant];
    const path = pathRef.current;
    const group = groupRef.current;
    if (!path || !group) return;

    const count = reduced ? REDUCED_PARTICLE_COUNT : curve.particleCount;
    const particles = particlesRef.current;
    startTimeRef.current = performance.now();

    /* 构建静态路径（仅 reduced motion 或首次） */
    const buildPath = (detailScale: number, steps = 320) => {
      let d = "";
      for (let i = 0; i <= steps; i++) {
        const p = curve.point(i / steps, detailScale);
        d += `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)} `;
      }
      return d.trim();
    };

    const getDetailScale = (time: number): number => {
      const prog = (time % curve.pulseDurationMs) / curve.pulseDurationMs;
      const angle = prog * Math.PI * 2;
      return 0.52 + ((Math.sin(angle + 0.55) + 1) / 2) * 0.48;
    };

    const getRotation = (time: number): number => {
      if (!curve.rotate) return 0;
      return (
        -((time % curve.rotationDurationMs) / curve.rotationDurationMs) * 360
      );
    };

    const normalize = (p: number) => ((p % 1) + 1) % 1;

    const getParticle = (
      index: number,
      progress: number,
      detailScale: number,
    ) => {
      const tailOffset = index / Math.max(count - 1, 1);
      const pp = normalize(progress - tailOffset * curve.trailSpan);
      const pt = curve.point(pp, detailScale);
      const fade = Math.pow(1 - tailOffset, 0.56);
      return {
        x: pt.x,
        y: pt.y,
        radius: 0.8 + fade * 2.5,
        opacity: 0.04 + fade * 0.96,
      };
    };

    /* reduced motion: render once, no animation */
    if (reduced) {
      const ds = getDetailScale(0);
      const rot = getRotation(0);
      group.setAttribute("transform", `rotate(${rot} 50 50)`);
      path.setAttribute("d", buildPath(ds));
      path.setAttribute("stroke", TONE_COLORS[tone].stroke);
      path.setAttribute("stroke-width", String(curve.strokeWidth));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      path.setAttribute("opacity", "0.12");

      /* place particles evenly along curve */
      const ps = particles.slice(0, count);
      const progressStep = curve.trailSpan / Math.max(count - 1, 1);
      ps.forEach((circ, i) => {
        const pp = normalize(1 - i * progressStep);
        const pt = curve.point(pp, ds);
        const fade = Math.pow(1 - i / Math.max(count - 1, 1), 0.56);
        circ.setAttribute("cx", pt.x.toFixed(2));
        circ.setAttribute("cy", pt.y.toFixed(2));
        circ.setAttribute("r", (0.8 + fade * 2.5).toFixed(2));
        circ.setAttribute(
          "opacity",
          Math.min(1, 0.04 + fade * 0.96).toFixed(3),
        );
        circ.setAttribute("fill", TONE_COLORS[tone].fill);
      });
      return;
    }

    /* full animation */
    const tick = (now: number) => {
      const time = now - startTimeRef.current;
      const progress = (time % curve.durationMs) / curve.durationMs;
      const ds = getDetailScale(time);
      const rot = getRotation(time);

      group.setAttribute("transform", `rotate(${rot} 50 50)`);
      path.setAttribute("d", buildPath(ds));
      path.setAttribute("stroke", TONE_COLORS[tone].stroke);
      path.setAttribute("stroke-width", String(curve.strokeWidth));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      path.setAttribute("opacity", "0.1");

      const ps = particles.slice(0, count);
      for (let i = 0; i < ps.length; i++) {
        const p = getParticle(i, progress, ds);
        ps[i].setAttribute("cx", p.x.toFixed(2));
        ps[i].setAttribute("cy", p.y.toFixed(2));
        ps[i].setAttribute("r", p.radius.toFixed(2));
        ps[i].setAttribute("opacity", p.opacity.toFixed(3));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [active, variant, reduced, tone]);

  /* ─── IntersectionObserver: pause when hidden ─── */
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shouldAnimate = active && visible;

  return (
    <div
      ref={containerRef}
      className="math-curve-loader"
      role="status"
      aria-live="polite"
      aria-label={label}
      style={{ width: size, height: size }}
    >
      <svg
        ref={svgRef}
        className="math-curve-loader__frame"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <g ref={groupRef}>
          <path ref={pathRef} className="math-curve-loader__path" />
        </g>
      </svg>
      <span className="math-curve-loader__label">{label}</span>
      {/* When invisible, still render but pause animation */}
      {!shouldAnimate && active && (
        <span style={{ display: "none" }} aria-hidden="true" />
      )}
    </div>
  );
}
