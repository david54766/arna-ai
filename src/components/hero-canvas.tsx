import { useEffect, useRef } from "react";

// React port of reference/original-site/js/site.js initGraph().
// Two colour families (Arna cyan / MemoryOS violet), three depth layers,
// pointer parallax, shimmering links, pulsing cores.
export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ARNA: [number, number, number] = [34, 211, 238];
    const MEM: [number, number, number] = [167, 139, 250];
    let nodes: Array<{
      x: number; y: number; vx: number; vy: number; r: number;
      c: [number, number, number]; depth: number; pulse: number; pulseSpeed: number;
    }> = [];
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf: number | null = null;
    let running = false;
    let t = 0;
    let px = 0, py = 0, tx = 0, ty = 0;

    const rgba = (c: [number, number, number], a: number) =>
      `rgba(${c[0]},${c[1]},${c[2]},${a})`;

    function size() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height || 1;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function build() {
      let target = Math.round((w * h) / 20000);
      target = Math.max(16, Math.min(52, target));
      nodes = [];
      for (let i = 0; i < target; i++) {
        const depth = Math.floor(Math.random() * 3);
        const isArna = Math.random() < 0.5;
        const speed = 0.05 + depth * 0.05;
        nodes.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * speed, vy: (Math.random() - 0.5) * speed,
          r: 0.9 + depth * 0.9 + Math.random() * 0.8,
          c: isArna ? ARNA : MEM, depth,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.006 + Math.random() * 0.01,
        });
      }
    }

    const LINK_DIST = 155;

    function render(animated: boolean) {
      ctx.clearRect(0, 0, w, h);
      px += (tx - px) * 0.05; py += (ty - py) * 0.05;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const noff = (n.depth - 1) * 14;
        const nx = n.x + px * noff; const ny = n.y + py * noff;
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const moff = (m.depth - 1) * 14;
          const mx = m.x + px * moff; const my = m.y + py * moff;
          const dx = nx - mx, dy = ny - my;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            const base = (1 - d / LINK_DIST) * 0.2;
            const shimmer = animated ? 0.7 + 0.3 * Math.sin(t * 0.03 + (i + j) * 0.6) : 1;
            const a = base * shimmer;
            if (a <= 0.008) continue;
            const grad = ctx.createLinearGradient(nx, ny, mx, my);
            grad.addColorStop(0, rgba(n.c, a));
            grad.addColorStop(1, rgba(m.c, a));
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.6 + (n.depth + m.depth) * 0.12;
            ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(mx, my); ctx.stroke();
          }
        }
      }

      const order = nodes.slice().sort((a, b) => a.depth - b.depth);
      for (let i = 0; i < order.length; i++) {
        const n = order[i];
        if (animated) {
          n.x += n.vx; n.y += n.vy; n.pulse += n.pulseSpeed;
          if (n.x < -30) n.x = w + 30;
          if (n.x > w + 30) n.x = -30;
          if (n.y < -30) n.y = h + 30;
          if (n.y > h + 30) n.y = -30;
        }
        const off = (n.depth - 1) * 14;
        const cx = n.x + px * off; const cy = n.y + py * off;
        const glow = 0.55 + Math.sin(n.pulse) * 0.3;
        const rr = n.r;
        const depthAlpha = 0.35 + n.depth * 0.28;

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr * 6);
        g.addColorStop(0, rgba(n.c, 0.45 * glow * depthAlpha));
        g.addColorStop(1, rgba(n.c, 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, rr * 6, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = rgba(n.c, (0.8 * glow + 0.2) * depthAlpha);
        ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.fill();
      }
    }

    function frame() { t += 1; render(true); raf = window.requestAnimationFrame(frame); }
    function start() { if (running) return; running = true; if (reduce) { render(false); running = false; } else { raf = window.requestAnimationFrame(frame); } }
    function stop() { running = false; if (raf) { window.cancelAnimationFrame(raf); raf = null; } }
    function rebuild() { size(); build(); render(false); }

    rebuild();

    const onPointer = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onVis = () => { if (document.hidden) stop(); else start(); };
    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const was = running; stop(); rebuild(); if (was && !reduce) start();
      }, 160);
    };

    if (!reduce) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("visibilitychange", onVis);
      start();
    }
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
