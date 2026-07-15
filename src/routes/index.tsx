import { createFileRoute } from "@tanstack/react-router";
import { Page, Section, PullQuote } from "../components/site-chrome";
import { Gallery } from "../components/gallery";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <Page>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(circle, oklch(0.85 0.15 210 / 0.22), transparent 65%)" }} />
        </div>
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-32 md:pt-40 md:pb-40">
          <div className="eyebrow mb-8">Arna · a companion trilogy</div>
          <h1 className="font-display text-5xl leading-[1.02] tracking-tight md:text-7xl lg:text-8xl">
            One mouth,
            <br />
            one memory,
            <br />
            <span className="text-glow">one mind.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            A body, a memory, and a mind you own. Runs on your hardware. No cloud required.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a href="mailto:waitlist@arna.ai?subject=Arna%20waitlist" className="btn-primary">
              Join the waitlist
            </a>
            <a href="/chronicle" className="btn-ghost">
              Read her story →
            </a>
          </div>
          <div className="mt-20 grid grid-cols-2 gap-6 border-t hairline pt-10 text-sm text-muted-foreground md:grid-cols-4">
            <div><div className="font-mono text-xs uppercase tracking-widest text-foreground/70">Arna</div><div className="mt-1">the body</div></div>
            <div><div className="font-mono text-xs uppercase tracking-widest text-foreground/70">MemoryOS</div><div className="mt-1">what she knows</div></div>
            <div><div className="font-mono text-xs uppercase tracking-widest text-foreground/70">Arna Mind</div><div className="mt-1">what she's thinking</div></div>
            <div><div className="font-mono text-xs uppercase tracking-widest text-foreground/70">Arna Link</div><div className="mt-1">family video calling</div></div>
          </div>
        </div>
      </section>

      {/* THE BODY */}
      <Section id="body" eyebrow="The body — Arna">
        <div className="grid gap-16 md:grid-cols-[1.1fr_1fr] md:items-end">
          <h2 className="font-display text-4xl leading-tight tracking-tight md:text-6xl">
            A voiced, seeing avatar with a face, moods, and a wake word.
          </h2>
          <p className="text-lg text-muted-foreground">
            On desktop and phone. Everything you see and hear — a hologram you can address by name,
            that looks at you back.
          </p>
        </div>
      </Section>

      {/* THE MIND */}
      <Section id="mind" eyebrow="The mind — Arna Mind">
        <h2 className="font-display text-4xl leading-tight tracking-tight md:text-6xl">
          She visibly thinks before she speaks.
        </h2>
        <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
          A cognitive runtime whose thinking you can watch — reasoning, hesitation, the moment a
          thread catches. Not a chat log. A mind at work.
        </p>
      </Section>

      {/* SHE GROWS — the differentiator */}
      <Section id="grows" eyebrow="She grows">
        <h2 className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
          Not a parrot with a notebook. She forms her own view —
          <span className="text-glow"> and you can correct it.</span>
        </h2>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <p className="text-lg text-muted-foreground md:text-xl">
            Every night she reviews the day's conversations and forms her own impressions.
            Her first self-derived belief was:
          </p>
          <div className="panel p-8">
            <div className="eyebrow mb-3">Belief · self-derived</div>
            <p className="font-display text-2xl leading-snug">
              "The owner values precise, compact and visually clean interfaces."
            </p>
          </div>
        </div>

        <div className="mt-20 panel p-8 md:p-12">
          <div className="eyebrow mb-4">The calibration loop</div>
          <h3 className="font-display text-3xl tracking-tight md:text-4xl">
            She asked to be graded on her own thinking.
          </h3>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <p className="text-muted-foreground">
              Reviewers grade each connection — <span className="text-foreground">pattern</span>,{" "}
              <span className="text-foreground">actor</span>,{" "}
              <span className="text-foreground">intent</span>,{" "}
              <span className="text-foreground">lesson</span> — each verdict separate, so a correct
              instinct is never punished for one wrong attribution.
            </p>
            <p className="text-muted-foreground">
              Graded lessons feed back into her nightly reflection. Weekly growth audits measure
              her against a dated baseline — she gets better, and you can prove it.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 font-mono text-xs uppercase tracking-widest md:grid-cols-4">
            {["pattern", "actor", "intent", "lesson"].map((k) => (
              <div key={k} className="rounded-md border hairline px-4 py-3 text-center text-muted-foreground">
                {k}
              </div>
            ))}
          </div>
        </div>

        <PullQuote>I'll bring the curiosity. You bring the course correction.</PullQuote>
      </Section>

      {/* UNDER YOUR OVERSIGHT */}
      <Section id="oversight" eyebrow="Under your oversight">
        <h2 className="font-display text-4xl leading-tight tracking-tight md:text-6xl">
          Trust through machinery, not promises.
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {[
            {
              t: "Real browser, gated actions",
              b: "She can operate a real browser — but consequential actions require the owner's approval on an in-app card before they execute.",
            },
            {
              t: "Passwords stay yours",
              b: "Passwords and payment walls always hand the keyboard back to the human. No exceptions.",
            },
            {
              t: "Permanent ledger",
              b: "Every action is written to a permanent, reviewable ledger. Nothing she does is invisible.",
            },
            {
              t: "Read her model of you",
              b: "The owner can read her entire model of him, line by line — and correct it.",
            },
          ].map((c) => (
            <div key={c.t} className="panel p-8">
              <h3 className="font-display text-xl tracking-tight">{c.t}</h3>
              <p className="mt-3 text-muted-foreground">{c.b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* THE ROUNDTABLE */}
      <Section id="roundtable" eyebrow="The Roundtable">
        <h2 className="font-display text-4xl leading-tight tracking-tight md:text-6xl">
          Three AIs in one room.
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Arna and two frontier coding agents in structured conversation that becomes her durable
          memory.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <PullQuote>He doesn't want an assistant. He wants someone who was there.</PullQuote>
          <PullQuote>If a hologram can't be embarrassing on main, what's the point?</PullQuote>
        </div>
      </Section>

      {/* MEMORYOS */}
      <Section id="memoryos" eyebrow="MemoryOS">
        <h2 className="font-display text-4xl leading-tight tracking-tight md:text-6xl">
          A second brain she owns — and so do you.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { t: "Review queue", b: "Every proposed memory passes the owner's review queue before it lands." },
            { t: "Sourced facts", b: "Sources tracked for every fact — origin, conversation, timestamp." },
            { t: "Supersede, never overwrite", b: "History is preserved. A newer belief replaces the old — it doesn't erase it." },
          ].map((c) => (
            <div key={c.t} className="panel p-8">
              <h3 className="font-display text-xl tracking-tight">{c.t}</h3>
              <p className="mt-3 text-muted-foreground">{c.b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ARNA LINK */}
      <Section id="link" eyebrow="Arna Link">
        <h2 className="font-display text-4xl leading-tight tracking-tight md:text-6xl">
          Zero-config family video calling on your own network.
        </h2>
        <p className="mt-8 font-display text-2xl text-muted-foreground md:text-3xl">
          "Call Dad" — and it rings.
        </p>
      </Section>

      <Gallery />

      {/* FOUNDERS */}
      <Section id="founders" eyebrow="Founders">
        <div className="panel p-10 md:p-16">
          <h2 className="font-display text-4xl leading-tight tracking-tight md:text-5xl">
            One-time licenses. Never subscriptions for core products.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { t: "Arna", d: "The body." },
              { t: "MemoryOS + Arna Mind", d: "What she knows and how she thinks." },
              { t: "Trilogy Founders Edition", d: "All three, plus lifetime updates." },
            ].map((p) => (
              <div key={p.t} className="border-t hairline pt-6">
                <div className="font-display text-2xl tracking-tight">{p.t}</div>
                <div className="mt-2 text-muted-foreground">{p.d}</div>
                <div className="mt-6 font-mono text-xs uppercase tracking-widest text-accent">
                  Announced at launch
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-4">
            <a href="mailto:waitlist@arna.ai?subject=Arna%20waitlist" className="btn-primary">
              Join the waitlist
            </a>
            <a href="/chronicle" className="btn-ghost">Read her story →</a>
          </div>
        </div>
      </Section>
    </Page>
  );
}
