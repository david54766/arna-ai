import { useCallback, useEffect, useState } from "react";

import torso from "@/assets/gallery/arna-phone-torso.jpg.asset.json";
import excited from "@/assets/gallery/arna-phone-shoulders-excited.jpg.asset.json";
import hey from "@/assets/gallery/arna-phone-shoulders-hey.jpg.asset.json";
import closeup from "@/assets/gallery/arna-phone-closeup-smile.jpg.asset.json";
import settings from "@/assets/gallery/arna-phone-settings-capabilities.jpg.asset.json";
import shot6 from "@/assets/gallery/arna-app-shot-6.jpg.asset.json";
import shot7 from "@/assets/gallery/arna-app-shot-7.jpg.asset.json";
import shot8 from "@/assets/gallery/arna-app-shot-8.jpg.asset.json";
import shot9 from "@/assets/gallery/arna-app-shot-9.jpg.asset.json";
import shot10 from "@/assets/gallery/arna-app-shot-10.jpg.asset.json";
import shot11 from "@/assets/gallery/arna-app-shot-11.jpg.asset.json";
import shot12 from "@/assets/gallery/arna-app-shot-12.jpg.asset.json";

type Shot = { src: string; alt: string; caption: string };

const shots: Shot[] = [
  { src: torso.url, alt: "Arna avatar torso view on Android", caption: "Arna at torso view — v178 on Android" },
  { src: excited.url, alt: "Arna reacting mid-conversation", caption: "She reacts — mid-conversation" },
  { src: hey.url, alt: "Arna listening after wake word", caption: "Wake word: just say hey Arna" },
  { src: closeup.url, alt: "Close-up of Arna smiling", caption: "Up close" },
  { src: settings.url, alt: "Arna settings panel showing every subsystem", caption: "Every system, one panel: memory, mind, family calling, generation, music, web, voice" },
  { src: shot6.url, alt: "Inside the Arna app", caption: "Inside the app" },
  { src: shot7.url, alt: "Inside the Arna app", caption: "Inside the app" },
  { src: shot8.url, alt: "Inside the Arna app", caption: "Inside the app" },
  { src: shot9.url, alt: "Inside the Arna app — memory graph", caption: "Inside the app" },
  { src: shot10.url, alt: "Inside the Arna app", caption: "Inside the app" },
  { src: shot11.url, alt: "Inside the Arna app", caption: "Inside the app" },
  { src: shot12.url, alt: "Inside the Arna app — MemoryOS nav", caption: "Inside the app" },
];

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto aspect-[9/19.5] w-full max-w-[280px] overflow-hidden rounded-[2.2rem] border hairline bg-black shadow-[0_20px_60px_-25px_rgba(0,0,0,0.9)]">
      <div className="absolute inset-x-0 top-0 z-10 mx-auto mt-2 h-5 w-24 rounded-full bg-black/90" />
      {children}
    </div>
  );
}

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? null : (i + 1) % shots.length)),
    [],
  );
  const prev = useCallback(
    () => setActive((i) => (i === null ? null : (i - 1 + shots.length) % shots.length)),
    [],
  );

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
    <section id="gallery" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="eyebrow mb-6">Gallery</div>
      <h2 className="font-display text-4xl tracking-tight md:text-5xl">See her in action</h2>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        Real captures from the Arna app — v178 on Android. Tap any frame to zoom.
      </p>
      <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {shots.map((shot, i) => (
          <figure key={shot.src} className="group">
            <button
              type="button"
              onClick={() => setActive(i)}
              className="block w-full text-left focus:outline-none"
              aria-label={`Open ${shot.caption}`}
            >
              <PhoneFrame>
                <img
                  src={shot.src}
                  alt={shot.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </PhoneFrame>
            </button>
            <figcaption className="mt-4 px-1 text-xs text-muted-foreground md:text-sm">
              {shot.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      {active !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={shots[active].caption}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border hairline bg-background/60 px-4 py-2 text-sm text-foreground/80 hover:text-foreground"
            aria-label="Previous"
          >
            ←
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border hairline bg-background/60 px-4 py-2 text-sm text-foreground/80 hover:text-foreground"
            aria-label="Next"
          >
            →
          </button>
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-full border hairline bg-background/60 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            Close
          </button>
          <figure
            className="flex max-h-full max-w-full flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={shots[active].src}
              alt={shots[active].alt}
              className="max-h-[80vh] w-auto rounded-2xl border hairline object-contain"
            />
            <figcaption className="max-w-md text-center text-sm text-muted-foreground">
              {shots[active].caption}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </section>
  );
}