import { useCallback, useEffect, useRef, useState } from "react";

import excited from "@/assets/gallery/arna-phone-shoulders-excited.jpg.asset.json";
import closeup from "@/assets/gallery/arna-phone-closeup-smile.jpg.asset.json";
import shot6 from "@/assets/gallery/arna-app-shot-6.jpg.asset.json";
import shot7 from "@/assets/gallery/arna-app-shot-7.jpg.asset.json";
import shot8 from "@/assets/gallery/arna-app-shot-8.jpg.asset.json";
import shot9 from "@/assets/gallery/arna-app-shot-9.jpg.asset.json";
import shot10 from "@/assets/gallery/arna-app-shot-10.jpg.asset.json";
import shot11 from "@/assets/gallery/arna-app-shot-11.jpg.asset.json";
import shot12 from "@/assets/gallery/arna-app-shot-12.jpg.asset.json";

type Shot = { src: string; alt: string; caption: string; crop?: boolean };

const shots: Shot[] = [
  { src: excited.url, alt: "Arna reacting mid-conversation", caption: "She reacts — mid-conversation" },
  { src: closeup.url, alt: "Close-up of Arna smiling", caption: "Up close" },
  { src: shot6.url, alt: "Inside the Arna app", caption: "Inside the app" },
  { src: shot7.url, alt: "Inside the Arna app", caption: "Inside the app" },
  { src: shot8.url, alt: "Inside the Arna app", caption: "Inside the app" },
  { src: shot9.url, alt: "Memory graph in MemoryOS", caption: "Memory graph", crop: true },
  { src: shot10.url, alt: "Inside the Arna app", caption: "Inside the app" },
  { src: shot11.url, alt: "Inside the Arna app", caption: "Inside the app" },
  { src: shot12.url, alt: "MemoryOS nav", caption: "MemoryOS" },
];

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);
  const next = useCallback(() => setActive((i) => (i === null ? null : (i + 1) % shots.length)), []);
  const prev = useCallback(() => setActive((i) => (i === null ? null : (i - 1 + shots.length) % shots.length)), []);

  useEffect(() => {
    if (active === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, next, prev]);

  return (
    <section id="gallery" className="section" aria-labelledby="gallery-title">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker kicker-arna">See her in action</p>
          <h2 id="gallery-title" className="section-title">Straight from the app.</h2>
          <p className="lede lede-center">Real captures of Arna — v178 on Android. Tap any frame to zoom.</p>
        </div>
        <ul className="gallery-grid" aria-label="Product screenshots">
          {shots.map((shot, i) => (
            <TiltGalleryItem key={shot.src} shot={shot} onOpen={() => setActive(i)} />
          ))}
        </ul>
      </div>

      {active !== null ? (
        <div
          className="lightbox"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={shots[active].caption}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(2,6,23,0.92)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
          }}
        >
          <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous"
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", padding: "10px 16px", borderRadius: 999, border: "1px solid var(--line-2)", background: "var(--glass)", color: "var(--fg)", cursor: "pointer" }}>←</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next"
            style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", padding: "10px 16px", borderRadius: 999, border: "1px solid var(--line-2)", background: "var(--glass)", color: "var(--fg)", cursor: "pointer" }}>→</button>
          <button type="button" onClick={close} aria-label="Close"
            style={{ position: "absolute", right: 16, top: 16, padding: "6px 14px", borderRadius: 999, border: "1px solid var(--line-2)", background: "var(--glass)", color: "var(--fg-dim)", cursor: "pointer", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>Close</button>
          <figure style={{ margin: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, maxHeight: "100%", maxWidth: "100%" }} onClick={(e) => e.stopPropagation()}>
            {shots[active].crop ? (
              <div className="crop-memoryos">
                <img src={shots[active].src} alt={shots[active].alt} />
              </div>
            ) : (
              <img src={shots[active].src} alt={shots[active].alt} style={{ maxHeight: "80vh", width: "auto", borderRadius: 16, border: "1px solid var(--line)" }} />
            )}
            <figcaption style={{ color: "var(--fg-dim)", fontSize: 14, maxWidth: 480, textAlign: "center" }}>{shots[active].caption}</figcaption>
          </figure>
        </div>
      ) : null}
    </section>
  );
}

function TiltGalleryItem({ shot, onOpen }: { shot: Shot; onOpen: () => void }) {
  const ref = useRef<HTMLLIElement | null>(null);
  const reduce = useRef(false);
  useEffect(() => {
    reduce.current = typeof window !== "undefined" && window.matchMedia
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const onMove = (e: React.PointerEvent<HTMLLIElement>) => {
    if (reduce.current) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * 10;
    const ry = (x - 0.5) * 10;
    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transform = "";
  };
  return (
    <li
      ref={ref}
      className="gallery-item"
      onClick={onOpen}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ cursor: "pointer", transformStyle: "preserve-3d" }}
    >
      {shot.crop ? (
        <div className="crop-memoryos">
          <img src={shot.src} alt={shot.alt} loading="lazy" />
        </div>
      ) : (
        <img src={shot.src} alt={shot.alt} loading="lazy" />
      )}
      <p className="gallery-cap">{shot.caption}</p>
    </li>
  );
}
