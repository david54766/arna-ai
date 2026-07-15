import { useEffect, useState } from "react";

type Shot = { src: string; alt: string; caption?: string };

// Manifest starts empty; drop entries here when screenshots are ready.
const manifest: Shot[] = [];

export function Gallery() {
  const [shots, setShots] = useState<Shot[]>([]);

  useEffect(() => {
    setShots(manifest);
  }, []);

  if (shots.length === 0) return null;

  return (
    <section id="gallery" className="mx-auto max-w-6xl px-6 py-24">
      <div className="eyebrow mb-6">Gallery</div>
      <h2 className="font-display text-4xl tracking-tight md:text-5xl">See her in action</h2>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {shots.map((shot, i) => (
          <figure key={i} className="panel overflow-hidden">
            <img src={shot.src} alt={shot.alt} className="w-full" loading="lazy" />
            {shot.caption ? (
              <figcaption className="border-t hairline p-4 text-sm text-muted-foreground">
                {shot.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}