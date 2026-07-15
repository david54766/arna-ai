import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Page, Section } from "@/components/site-chrome";
import { WaitlistForm } from "@/components/waitlist-form";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Demo — Arna. A recorded synthetic session." },
      {
        name: "description",
        content:
          "Watch Arna think before she speaks. A recorded, synthetic session showing the conversation, her pre-verbal mind, and the memories she draws on.",
      },
      { property: "og:title", content: "Demo — Arna. A recorded synthetic session." },
      {
        property: "og:description",
        content:
          "Three synced panes: conversation, mind, memory. Every memory is synthetic. The machinery is real.",
      },
    ],
  }),
  component: DemoPage,
});

type MemoryId =
  | "recharge"
  | "lucia"
  | "book_club"
  | "low_energy"
  | "all"
  | "memory_review";

type Turn = {
  sam: string;
  mind: string;
  arna: string;
  litIds: MemoryId[] | "all";
};

const memoryLibrary: { id: MemoryId; label: string; source: string }[] = [
  { id: "recharge", label: "Sam recharges with garden work", source: "inferred from conversation" },
  { id: "lucia", label: "Maria recommended Lucia's Trattoria — get the pappardelle", source: "June 14 conversation" },
  { id: "book_club", label: "Book club: Tuesdays → superseded → Thursdays", source: "history preserved" },
  { id: "low_energy", label: "Pattern: low energy, 3 signals this week", source: "reflection, nightly" },
  { id: "memory_review", label: "Memory review opened — every belief on one page", source: "user request" },
];

const turns: Turn[] = [
  {
    sam: "Morning Arna. Long day ahead — two client calls and the garden's a mess.",
    mind: "Two stressors named. Calendar shows the calls at 10 and 2. Garden = the relaxing kind of chore for Sam, not a burden — filed as recharge activity.",
    arna: "Morning. Calls at ten and two — I'll keep the afternoon quiet after. And the garden isn't a mess, it's waiting for you.",
    litIds: ["recharge"],
  },
  {
    sam: "What was that pasta place Maria mentioned last month?",
    mind: "Search: Maria + restaurant + pasta. One hit, high confidence, sourced to June 14 conversation.",
    arna: "Lucia's Trattoria — Maria brought it up on June 14th. She said get the pappardelle.",
    litIds: ["lucia"],
  },
  {
    sam: "Book club's moving to Thursdays.",
    mind: "Standing schedule change — supersedes the Tuesday belief, never overwrites it. Old belief archived, history intact.",
    arna: "Updated — Thursdays now. I kept the history, in case it moves back.",
    litIds: ["book_club"],
  },
  {
    sam: "Honestly I've been stretched thin lately.",
    mind: "Third low-energy signal this week. Pattern, not incident. Offer something small — the harmless tier. No unsolicited advice.",
    arna: "I've noticed. Want me to keep tomorrow morning clear before the nine o'clock? You think better with a slow start.",
    litIds: ["low_energy"],
  },
  {
    sam: "How do you know all this about me?",
    mind: "Transparency question — the most important kind. Show, don't reassure.",
    arna:
      "Because you told me — and everything I believe about you is on one page you can read and correct. Want to see it?",
    litIds: "all",
  },
  {
    sam: "Show me.",
    mind: "Opening the memory review — every belief, every source, her whole model of Sam.",
    arna:
      "Here it is. Anything wrong, you fix it. Anything private, you delete it. It's your brain — I just keep it.",
    litIds: ["memory_review"],
  },
];

function DemoPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [turnIdx, setTurnIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem("arna_demo_unlocked") === "1") {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (!autoplay || !unlocked) return;
    if (turnIdx >= turns.length - 1) return;
    const t = window.setTimeout(() => setTurnIdx((i) => Math.min(i + 1, turns.length - 1)), 4200);
    return () => window.clearTimeout(t);
  }, [autoplay, turnIdx, unlocked]);

  return (
    <Page>
      <Section eyebrow="Demo · recorded" className="pb-12">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="font-display text-4xl leading-tight tracking-tight md:text-6xl">
            Watch her think before she speaks.
          </h1>
          <span className="rounded-full border hairline px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Recorded demo — synthetic session
          </span>
        </div>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Three panes, moving together turn by turn: the conversation on the left, Arna's
          pre-verbal thinking in the middle — revealed <em>before</em> she replies — and the
          memories she draws on, on the right.
        </p>
      </Section>

      {unlocked ? (
        <DemoStage
          turnIdx={turnIdx}
          setTurnIdx={setTurnIdx}
          autoplay={autoplay}
          setAutoplay={setAutoplay}
        />
      ) : (
        <DemoGate onUnlock={() => {
          if (typeof window !== "undefined") {
            window.sessionStorage.setItem("arna_demo_unlocked", "1");
          }
          setUnlocked(true);
        }} />
      )}
    </Page>
  );
}

function DemoGate({ onUnlock }: { onUnlock: () => void }) {
  return (
    <Section className="pt-0">
      <div className="panel p-8 md:p-12">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <h2 className="font-display text-3xl leading-tight tracking-tight md:text-4xl">
              Drop your email to unlock the recording.
            </h2>
            <p className="mt-4 text-muted-foreground">
              No live model, no cameras, no cloud. Six turns from a fictional person we're calling
              Sam. Every memory below is synthetic — the machinery is real.
            </p>
          </div>
          <div>
            <WaitlistFormWrapper onSuccess={onUnlock} />
          </div>
        </div>
      </div>
    </Section>
  );
}

function WaitlistFormWrapper({ onSuccess }: { onSuccess: () => void }) {
  return <WaitlistForm source="demo" label="Unlock the demo" onSuccess={onSuccess} />;
}

function DemoStage({
  turnIdx,
  setTurnIdx,
  autoplay,
  setAutoplay,
}: {
  turnIdx: number;
  setTurnIdx: (n: number | ((prev: number) => number)) => void;
  autoplay: boolean;
  setAutoplay: (v: boolean) => void;
}) {
  const currentTurn = turns[turnIdx];
  const visibleTurns = turns.slice(0, turnIdx + 1);
  const litSet = useMemo(() => {
    const s = new Set<MemoryId>();
    if (currentTurn.litIds === "all") memoryLibrary.forEach((m) => s.add(m.id));
    else currentTurn.litIds.forEach((id) => s.add(id));
    return s;
  }, [currentTurn]);

  const atEnd = turnIdx >= turns.length - 1;

  return (
    <>
      <Section className="pt-0">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Turn {turnIdx + 1} of {turns.length}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTurnIdx(0)}
              className="btn-ghost text-xs"
              disabled={turnIdx === 0}
            >
              Restart
            </button>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={autoplay}
                onChange={(e) => setAutoplay(e.target.checked)}
                className="h-3 w-3 accent-[color:var(--accent)]"
              />
              Autoplay
            </label>
            <button
              type="button"
              onClick={() => setTurnIdx((i) => Math.min(i + 1, turns.length - 1))}
              className="btn-primary text-sm"
              disabled={atEnd}
            >
              {atEnd ? "End of demo" : "Next turn →"}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT: conversation */}
          <div className="panel flex flex-col p-6">
            <div className="eyebrow mb-4">Conversation</div>
            <div className="flex-1 space-y-4">
              {visibleTurns.map((t, i) => (
                <div key={i} className="space-y-3">
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm border hairline bg-foreground/[0.04] px-4 py-3 text-sm">
                    <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Sam</div>
                    {t.sam}
                  </div>
                  {i < turnIdx || i === turnIdx ? (
                    <div className="mr-auto max-w-[85%] rounded-2xl rounded-bl-sm border px-4 py-3 text-sm" style={{ borderColor: "color-mix(in oklab, var(--accent) 35%, transparent)", background: "color-mix(in oklab, var(--accent) 8%, transparent)" }}>
                      <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-accent">Arna</div>
                      {t.arna}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* MIDDLE: mind */}
          <div className="panel flex flex-col p-6">
            <div className="eyebrow mb-4">Mind Console · pre-verbal</div>
            <div className="flex-1 space-y-3 font-mono text-xs leading-relaxed text-foreground/85">
              {visibleTurns.map((t, i) => (
                <div
                  key={i}
                  className={`rounded-md border hairline px-3 py-3 ${
                    i === turnIdx ? "" : "opacity-40"
                  }`}
                >
                  <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    thought · turn {i + 1}
                  </div>
                  <div className="whitespace-pre-wrap">{t.mind}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: memory */}
          <div className="panel flex flex-col p-6">
            <div className="eyebrow mb-4">Memory · what lit up</div>
            <ul className="flex-1 space-y-3">
              {memoryLibrary.map((m) => {
                const lit = litSet.has(m.id);
                return (
                  <li
                    key={m.id}
                    className={`rounded-md border px-3 py-3 transition ${
                      lit
                        ? "border-transparent text-foreground"
                        : "hairline text-muted-foreground/70"
                    }`}
                    style={
                      lit
                        ? {
                            background: "color-mix(in oklab, var(--accent) 10%, transparent)",
                            borderColor: "color-mix(in oklab, var(--accent) 45%, transparent)",
                            boxShadow: "0 0 24px -8px var(--glow)",
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${
                          lit ? "bg-accent shadow-[0_0_10px_2px_var(--glow)]" : "bg-muted-foreground/40"
                        }`}
                      />
                      <span className="text-sm">{m.label}</span>
                    </div>
                    <div className="mt-1 pl-3.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      source · {m.source}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Section>

      {atEnd ? (
        <Section className="pt-0">
          <div className="panel p-10 text-center md:p-16">
            <p className="font-display text-2xl leading-tight tracking-tight md:text-4xl">
              Every memory above is synthetic. The machinery is real.
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              — Join the waitlist to meet her
            </p>
            <div className="mx-auto mt-8 max-w-xl">
              <WaitlistForm source="demo_end" label="Join the waitlist" />
            </div>
          </div>
        </Section>
      ) : null}
    </>
  );
}