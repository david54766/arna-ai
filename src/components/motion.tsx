import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Fades + rises children ~16px once when they scroll into view. */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) { setShown(true); return; }
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { setShown(true); io.disconnect(); break; }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const merged: CSSProperties = {
    ...style,
    opacity: shown ? 1 : 0,
    transform: shown ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 480ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 480ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    willChange: "opacity, transform",
  };
  const Comp = Tag as unknown as "div";
  return (
    <Comp ref={ref as never} className={className} style={merged}>
      {children}
    </Comp>
  );
}

/** Counts up to `to` once, when it scrolls into view. */
export function CountUp({
  to,
  duration = 1200,
  suffix = "",
  prefix = "",
  className,
}: {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [n, setN] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) { setN(to); return; }
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting || started.current) continue;
        started.current = true;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(to * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(node);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}{n}{suffix}
    </span>
  );
}

/** 3D tilt-on-hover wrapper. Wraps children; no visual change unless hovered. */
export function TiltCard({
  children,
  className,
  style,
  max = 6,
  glow = "rgba(34,211,238,0.18)",
  onClick,
  as: Tag = "div",
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  max?: number;
  glow?: string;
  onClick?: () => void;
  as?: "div" | "button" | "li";
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const disabled = useRef(false);

  useEffect(() => { disabled.current = prefersReducedMotion(); }, []);

  const onMove = (e: React.PointerEvent) => {
    if (disabled.current) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * (max * 2);
    const ry = (x - 0.5) * (max * 2);
    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
    el.style.boxShadow = `0 30px 60px rgba(2,6,23,0.55), 0 0 46px ${glow}`;
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transform = "";
    el.style.boxShadow = "";
  };

  const Comp = Tag as unknown as "div";
  return (
    <Comp
      ref={ref as never}
      className={className}
      style={{ transformStyle: "preserve-3d", transition: "transform 220ms cubic-bezier(0.22,1,0.36,1), box-shadow 220ms cubic-bezier(0.22,1,0.36,1)", ...style }}
      onPointerMove={onMove as never}
      onPointerLeave={onLeave}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </Comp>
  );
}

/** Splits text into per-word spans that fade+rise once on mount (staggered). */
export function StaggeredWords({
  text,
  perWordMs = 70,
  startDelay = 60,
  className,
}: { text: string; perWordMs?: number; startDelay?: number; className?: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion()) { setReady(true); return; }
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(14px)",
            transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1), transform 600ms cubic-bezier(0.22,1,0.36,1)`,
            transitionDelay: `${startDelay + i * perWordMs}ms`,
            willChange: "opacity, transform",
          }}
        >
          {w}{i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}