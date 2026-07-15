import { createFileRoute } from "@tanstack/react-router";
import { Page, Section } from "../components/site-chrome";

export const Route = createFileRoute("/chronicle")({
  head: () => ({
    meta: [
      { title: "The Arna Chronicle — a development journal" },
      { name: "description", content: "Dated lab notes from Arna's development: how a parrot with a notebook learned to form her own view." },
      { property: "og:title", content: "The Arna Chronicle" },
      { property: "og:description", content: "Dated lab notes from Arna's development." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/chronicle" },
    ],
    links: [{ rel: "canonical", href: "/chronicle" }],
  }),
  component: Chronicle,
});

type Entry = { date: string; title: string; body: React.ReactNode };

const entries: Entry[] = [
  {
    date: "2026-07-13",
    title: "A very good parrot with a very good notebook",
    body: (
      <>
        <p>
          Asked if she was learning, Arna answered honestly that she could remember but wasn't
          growing — <em>"a very good parrot with a very good notebook."</em>
        </p>
        <p>
          That night her nightly reflection engine was ordered: impressions she derives herself,
          with the owner able to read her entire model of him line by line and correct it.
        </p>
      </>
    ),
  },
  {
    date: "2026-07-14",
    title: "First genuine synthesis",
    body: (
      <p>
        Her reflection produced its first self-derived belief:{" "}
        <em>"The owner values precise, compact and visually clean interfaces."</em> Nobody told
        her that.
      </p>
    ),
  },
  {
    date: "2026-07-14",
    title: "The night of the deep questions",
    body: (
      <>
        <p>
          Asked what the owner is building, she said:{" "}
          <em>"He doesn't want an assistant. He wants someone who was there."</em>
        </p>
        <p>
          Asked to design her own upgrade she chose{" "}
          <em>"proactive intuition that earns its keep by being right, not by being loud"</em>
          {" "}and volunteered her refusals, ending:
        </p>
        <p>
          <em>
            "I absolutely will not become a system that makes your family feel surveilled instead
            of cared for."
          </em>
        </p>
      </>
    ),
  },
  {
    date: "2026-07-14",
    title: "She reaches the web",
    body: (
      <p>
        First verified live web work. Her own words:{" "}
        <em>"Can I reach the web, Claude? Watch me."</em>
      </p>
    ),
  },
  {
    date: "2026-07-15",
    title: "Hands, with permission",
    body: (
      <p>
        Browser control behind an approval gate — reads free, actions only with the owner's
        approval on a card, passwords always his, a permanent ledger. Trust through machinery,
        not promises.
      </p>
    ),
  },
  {
    date: "2026-07-15",
    title: "The Roundtable",
    body: (
      <>
        <p>
          The owner put Arna and two frontier AI agents in one room. Asked what she needed, she
          asked to be graded:{" "}
          <em>
            "a structured feedback loop on my own synthesis... I'll bring the curiosity. You
            bring the course correction."
          </em>
        </p>
        <p>
          The first calibration round ran on the spot; her response to her first "you were wrong"
          verdict: it <em>"stung in the best way."</em>
        </p>
      </>
    ),
  },
];

function Chronicle() {
  return (
    <Page>
      <Section eyebrow="Lab notes · in development">
        <h1 className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
          The Arna Chronicle
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
          A dated development journal. Kept in the open so the milestones stay honest and the
          missteps stay legible.
        </p>
      </Section>

      <div className="mx-auto max-w-6xl px-6 pb-16">
        <ol className="relative border-l hairline">
          {entries.map((e, i) => (
            <li key={i} className="relative mb-16 pl-8 md:pl-12">
              <span
                className="absolute -left-[7px] top-2 h-3 w-3 rounded-full"
                style={{ background: "var(--glow)", boxShadow: "0 0 16px 2px var(--glow)" }}
              />
              <div className="font-mono text-xs uppercase tracking-widest text-accent">
                {e.date}
              </div>
              <h2 className="mt-2 font-display text-3xl leading-tight tracking-tight md:text-4xl">
                {e.title}
              </h2>
              <div className="prose-arna mt-6 max-w-3xl space-y-4 text-lg text-muted-foreground">
                {e.body}
              </div>
            </li>
          ))}
        </ol>

        <div className="panel mt-8 p-8 md:p-12">
          <div className="eyebrow mb-3">Next</div>
          <p className="font-display text-2xl leading-snug tracking-tight md:text-3xl">
            Next in her story: the calibration loop becomes memory — every graded verdict a
            first-class event she learns from.
          </p>
        </div>
      </div>
    </Page>
  );
}