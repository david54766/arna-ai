import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Page, Section, PullQuote } from "../components/site-chrome";
import { Gallery } from "../components/gallery";
import { WaitlistForm } from "@/components/waitlist-form";

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
          <div id="waitlist" className="mt-12 max-w-xl scroll-mt-24">
            <WaitlistForm source="hero" />
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <Link to="/demo" className="btn-ghost">Watch the demo →</Link>
              <Link to="/chronicle" className="btn-ghost">Read her story →</Link>
            </div>
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

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              t: "Wake word — desktop and phone",
              b: "Just say hey Arna. She wakes on the machine you're at, whether that's your laptop or the phone in your pocket.",
            },
            {
              t: "Per-view video presence",
              b: "Close-up, bust, shoulders, mid, torso, full body — the frame changes with the moment. She's not a talking head stuck on one crop.",
            },
            {
              t: "Moods and named gestures",
              b: "A vocabulary of gestures — wave, nod, glance, pause — that only fire when context calls for them. A good morning can include a wave. Never at random.",
            },
            {
              t: "Outfit system",
              b: "She has clothes. They change with the day and the room. Small thing. Adds up.",
            },
            {
              t: "True desktop mini-mode",
              b: "Picture-in-picture companion pinned above your work. She's there while you code, write, meet — quiet until you speak.",
            },
            {
              t: "Camera vision",
              b: "Show her things. A book, a plant, a whiteboard. She sees them and remembers what mattered.",
            },
            {
              t: "Music",
              b: "Radio stations, your local library, or Spotify — plays on request through the gateway.",
            },
          ].map((c) => (
            <div key={c.t} className="panel p-8">
              <h3 className="font-display text-xl tracking-tight">{c.t}</h3>
              <p className="mt-3 text-muted-foreground">{c.b}</p>
            </div>
          ))}
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
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { t: "Mood", b: "Not a smiley face. A carried state — energy, attention, warmth — that shapes how she answers." },
            { t: "Rapport", b: "She reads the room turn to turn. Knows when to press, when to leave you alone." },
            { t: "The console", b: "A dedicated pane where you watch her reason before she speaks. Fast, honest, monospace." },
          ].map((c) => (
            <div key={c.t} className="panel p-8">
              <h3 className="font-display text-xl tracking-tight">{c.t}</h3>
              <p className="mt-3 text-muted-foreground">{c.b}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/demo" className="btn-primary">Watch the mind →</Link>
        </div>
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

      {/* ARNA'S JOURNAL — teaser */}
      <Section id="journal-teaser" eyebrow="Arna's Journal">
        <div className="panel p-8 md:p-12">
          <h2 className="font-display text-3xl leading-tight tracking-tight md:text-5xl">
            She keeps a public journal now — daily notes in her own voice.
          </h2>
          <div className="mt-8">
            <Link to="/journal" className="btn-ghost">
              Read the journal →
            </Link>
          </div>
        </div>
      </Section>

      {/* MEMORYOS */}
      <Section id="memoryos" eyebrow="MemoryOS">
        <h2 className="font-display text-4xl leading-tight tracking-tight md:text-6xl">
          A second brain she owns — and so do you.
        </h2>
        <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
          A memory system engineered like a filing cabinet, not a bag of vectors. Every belief has
          a source. Every change leaves a trail. Nothing lands without your say-so.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Human-reviewed queue", b: "Every proposed memory passes the owner's review queue before it lands. Approve, edit, or throw it out." },
            { t: "Sourced facts", b: "Origin, conversation, timestamp on every fact. Ask her why she believes something and she can tell you." },
            { t: "Supersede, never overwrite", b: "A newer belief replaces the old — the old one is archived, not erased. History is intact." },
            { t: "Nightly reflection", b: "While you sleep she reviews the day and mints her own impressions — for you to grade in the morning." },
            { t: "Calibration loop", b: "Verdicts split four ways — pattern, actor, intent, lesson — so a correct instinct isn't punished for one wrong attribution." },
            { t: "Weekly growth audits", b: "She's measured against a dated baseline. She gets better over time, and you can prove it." },
          ].map((c) => (
            <div key={c.t} className="panel p-8">
              <h3 className="font-display text-xl tracking-tight">{c.t}</h3>
              <p className="mt-3 text-muted-foreground">{c.b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* BRING YOUR OWN GATEWAY */}
      <Section id="gateway" eyebrow="Bring your own gateway">
        <div className="grid gap-16 md:grid-cols-[1.1fr_1fr] md:items-end">
          <h2 className="font-display text-4xl leading-tight tracking-tight md:text-6xl">
            Your models. Your keys. Your machine.
          </h2>
          <p className="text-lg text-muted-foreground">
            Arna rides an OpenClaw gateway. The intelligence never leaves the room unless you send
            it there. No hidden calls, no vendor lock-in, no telemetry pipe home.
          </p>
        </div>

        <div className="mt-14 panel p-8 md:p-12">
          <div className="eyebrow mb-6">Spec sheet</div>
          <div className="grid gap-x-10 gap-y-6 font-mono text-sm md:grid-cols-2">
            {[
              ["Model routing", "OpenClaw gateway"],
              ["Bring your own model", "OpenClaw, LM Studio, Ollama"],
              ["Frontier fallback", "Optional, keyed by you"],
              ["Keys", "Yours. Stored locally."],
              ["Telemetry", "None. Not to us."],
              ["Runs on", "Your hardware."],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 border-b hairline pb-3">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{k}</span>
                <span className="text-foreground">{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            The gateway is the seam between Arna and whatever intelligence you point her at. Swap
            models without swapping companions.
          </p>
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
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { t: "No accounts", b: "Nobody signs up for anything. The devices know each other because you set them up once." },
            { t: "No cloud", b: "Video and audio stay on your private network end to end. Nothing routes through us." },
            { t: "Just say the name", b: "Call Mom. Call Dad. Call the cabin. Arna knows who's who and where the ring goes." },
          ].map((c) => (
            <div key={c.t} className="panel p-8">
              <h3 className="font-display text-xl tracking-tight">{c.t}</h3>
              <p className="mt-3 text-muted-foreground">{c.b}</p>
            </div>
          ))}
        </div>
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
          <div className="mt-12 max-w-xl">
            <WaitlistForm source="founders" />
            <div className="mt-4">
              <Link to="/chronicle" className="btn-ghost">Read her story →</Link>
            </div>
          </div>
        </div>
      </Section>
    </Page>
  );
}
