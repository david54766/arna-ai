import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Page } from "@/components/site-chrome";
import { WaitlistForm } from "@/components/waitlist-form";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "See her think — the Arna Mind live demo" },
      { name: "description", content: "Watch Arna think before she speaks: a recorded cognitive session played turn-by-turn, her Mind Console synced to each turn, and an explorable memory graph." },
    ],
  }),
  component: DemoPage,
});

type MemoryId = "recharge" | "lucia" | "book_club" | "low_energy" | "memory_review";
type Turn = { sam: string; mind: string; arna: string; litIds: MemoryId[] | "all" };

const memoryLibrary: { id: MemoryId; label: string; source: string; type: string }[] = [
  { id: "recharge", label: "Sam recharges with garden work", source: "inferred from conversation", type: "preference" },
  { id: "lucia", label: "Maria recommended Lucia's — get the pappardelle", source: "June 14 conversation", type: "fact" },
  { id: "book_club", label: "Book club: Tuesdays → superseded → Thursdays", source: "history preserved", type: "decision" },
  { id: "low_energy", label: "Pattern: low energy, 3 signals this week", source: "reflection, nightly", type: "note" },
  { id: "memory_review", label: "Memory review opened — every belief on one page", source: "user request", type: "note" },
];

const turns: Turn[] = [
  { sam: "Morning Arna. Long day ahead — two client calls and the garden's a mess.",
    mind: "Two stressors named. Calendar shows the calls at 10 and 2. Garden = the relaxing chore for Sam, not a burden — filed as recharge.",
    arna: "Morning. Calls at ten and two — I'll keep the afternoon quiet after. And the garden isn't a mess, it's waiting for you.",
    litIds: ["recharge"] },
  { sam: "What was that pasta place Maria mentioned last month?",
    mind: "Search: Maria + restaurant + pasta. One hit, high confidence, sourced to June 14.",
    arna: "Lucia's Trattoria — Maria brought it up on June 14th. She said get the pappardelle.",
    litIds: ["lucia"] },
  { sam: "Book club's moving to Thursdays.",
    mind: "Standing schedule change — supersedes the Tuesday belief, never overwrites it. Old belief archived, history intact.",
    arna: "Updated — Thursdays now. I kept the history, in case it moves back.",
    litIds: ["book_club"] },
  { sam: "Honestly I've been stretched thin lately.",
    mind: "Third low-energy signal this week. Pattern, not incident. Offer something small — the harmless tier. No unsolicited advice.",
    arna: "I've noticed. Want me to keep tomorrow morning clear before the nine o'clock? You think better with a slow start.",
    litIds: ["low_energy"] },
  { sam: "How do you know all this about me?",
    mind: "Transparency question — the most important kind. Show, don't reassure.",
    arna: "Because you told me — and everything I believe about you is on one page you can read and correct. Want to see it?",
    litIds: "all" },
  { sam: "Show me.",
    mind: "Opening the memory review — every belief, every source, her whole model of Sam.",
    arna: "Here it is. Anything wrong, you fix it. Anything private, you delete it. It's your brain — I just keep it.",
    litIds: ["memory_review"] },
];

function DemoPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [turnIdx, setTurnIdx] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem("arna_demo_unlocked") === "1") setUnlocked(true);
  }, []);

  return (
    <Page>
      <section className="demo-hero">
        <div className="wrap demo-hero-inner">
          <p className="eyebrow"><span className="grad-mind" style={{ fontWeight: 700 }}>Arna Mind</span> · the flagship</p>
          <h1 className="demo-title">See her <span className="grad-mind">think</span> before she speaks.</h1>
          <p className="demo-lede">
            Not a canned chatbot transcript. A real Arna Mind cognitive session, recorded
            turn-by-turn — with the pre-verbal thinking beat made visible, her whole mental state
            exposed in a live console, and an explorable memory graph beneath it.
          </p>
          <div className="honesty-banner" role="note">
            <svg className="hb-icon" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 8 v0.01 M12 11 v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            <p>
              <strong>Recorded from a real Arna Mind session</strong> over a purpose-scripted,
              fully fictional conversation — plus <strong>illustrative synthetic memories</strong>.
              No real personal data appears anywhere here. The product runs
              <strong> 100% locally on your machine</strong>.
            </p>
          </div>
        </div>
      </section>

      {unlocked ? (
        <DemoStage turnIdx={turnIdx} setTurnIdx={setTurnIdx} />
      ) : (
        <DemoGate onUnlock={() => {
          if (typeof window !== "undefined") window.localStorage.setItem("arna_demo_unlocked", "1");
          setUnlocked(true);
        }} />
      )}
    </Page>
  );
}

function DemoGate({ onUnlock }: { onUnlock: () => void }) {
  return (
    <section className="section" style={{ paddingTop: "clamp(40px, 6vw, 72px)" }}>
      <div className="wrap">
        <div className="demo-gate panel">
          <div className="gate-copy">
            <p className="kicker kicker-mind">One step</p>
            <h2 className="section-title">Unlock the interactive demo.</h2>
            <p className="lede">
              Drop your email to open <em>&ldquo;See her think.&rdquo;</em> You'll join the founders
              waitlist, and the demo unlocks right here in your browser.
            </p>
            <ul className="gate-points">
              <li>Play a real cognitive session, turn by turn</li>
              <li>Watch the Mind Console update with every turn</li>
              <li>See which memories light up on each answer</li>
            </ul>
          </div>
          <div>
            <WaitlistForm source="demo_gate" label="Unlock the demo" onSuccess={onUnlock} />
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoStage({ turnIdx, setTurnIdx }: { turnIdx: number; setTurnIdx: (n: number | ((p: number) => number)) => void }) {
  const currentTurn = turns[turnIdx];
  const visible = turns.slice(0, turnIdx + 1);
  const litSet = useMemo(() => {
    const s = new Set<MemoryId>();
    if (currentTurn.litIds === "all") memoryLibrary.forEach((m) => s.add(m.id));
    else currentTurn.litIds.forEach((id) => s.add(id));
    return s;
  }, [currentTurn]);
  const atEnd = turnIdx >= turns.length - 1;

  return (
    <section className="section" style={{ paddingTop: "clamp(30px, 4vw, 56px)" }}>
      <div className="wrap">
        <div className="section-head" style={{ marginBottom: "clamp(28px, 4vw, 44px)" }}>
          <p className="kicker kicker-mind">Live demo · unlocked</p>
          <h2 className="section-title">One turn at a time — watch the whole mind work.</h2>
        </div>

        <div className="demo-controls" role="group" aria-label="Replay controls">
          <button
            type="button"
            className="btn demo-advance"
            onClick={() => setTurnIdx((i: number) => Math.min(i + 1, turns.length - 1))}
            disabled={atEnd}
          >
            {atEnd ? "End of demo" : turnIdx === 0 ? "Begin the session" : "Next turn →"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setTurnIdx(0)} disabled={turnIdx === 0}>Restart</button>
          <span className="demo-progress" aria-live="polite">turn {turnIdx + 1} of {turns.length}</span>
        </div>

        <div className="demo-grid">
          {/* A — replay */}
          <div className="pane panel">
            <div className="pane-head">
              <span className="pane-badge badge-arna">A</span>
              <div>
                <h3>Conversation replay</h3>
                <p className="pane-sub">the pre-verbal beat, made visible</p>
              </div>
              <span className="dot dot-live" aria-hidden />
            </div>
            <div className="chat-scroll" role="log" aria-live="polite">
              {visible.map((t, i) => (
                <div key={i} style={{ display: "grid", gap: 10 }}>
                  <div className="chat-row chat-user">
                    <span className="chat-who">Sam</span>
                    <div className="chat-bubble bubble-user">{t.sam}</div>
                  </div>
                  <div className="chat-row chat-arna">
                    <span className="chat-who chat-who-arna">Arna — thinking</span>
                    <div className="chat-bubble bubble-think">
                      <span className="think-chip">
                        <span className="think-orb" aria-hidden />
                        <span style={{ color: "var(--fg)", fontWeight: 650 }}>{t.mind}</span>
                      </span>
                    </div>
                  </div>
                  <div className="chat-row chat-arna">
                    <span className="chat-who chat-who-arna">Arna</span>
                    <div className="chat-bubble bubble-arna">{t.arna}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* B — mind console */}
          <div className="pane">
            <div className="mind-console">
              <div className="mc-bar">
                <span className="pane-badge badge-mind">B</span>
                <span className="mc-title">Mind Console</span>
                <span className="mc-status">turn {turnIdx + 1}</span>
              </div>
              <div style={{ padding: 16, display: "grid", gap: 12 }}>
                <div>
                  <span className="mc-h">Percept</span>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--fg-dim)", lineHeight: 1.5 }}>{currentTurn.mind}</p>
                </div>
                <div>
                  <span className="mc-h">Chosen stance</span>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>
                    <span className="dot dot-live" style={{ display: "inline-block", marginRight: 8 }} />
                    {["warm · practical","warm · precise","careful · exact","gentle · attentive","transparent · direct","transparent · direct"][turnIdx]}
                  </p>
                </div>
                <div>
                  <span className="mc-h">Memories lit</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                    {[...litSet].map((id) => {
                      const m = memoryLibrary.find((x) => x.id === id)!;
                      return <span key={id} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 999, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.26)", color: "var(--mem-soft)" }}>{m.label}</span>;
                    })}
                  </div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: "12.5px", color: "var(--fg-mute)", margin: "12px 0 0", textAlign: "center" }}>
              Real captured fields — synced to the replay on the left.
            </p>
          </div>

          {/* C — memory */}
          <div className="pane panel">
            <div className="pane-head">
              <span className="pane-badge badge-mem">C</span>
              <div>
                <h3>Memory · what lit up</h3>
                <p className="pane-sub">synthetic persona · illustrative</p>
              </div>
              <span className="dot" style={{ background: "var(--mem)", boxShadow: "0 0 9px var(--mem)", marginLeft: "auto" }} aria-hidden />
            </div>
            <ul style={{ listStyle: "none", padding: 16, margin: 0, display: "grid", gap: 10 }}>
              {memoryLibrary.map((m) => {
                const lit = litSet.has(m.id);
                return (
                  <li key={m.id} className={`mem-item ${lit ? "mem-lit" : ""}`}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: lit ? "var(--mem)" : "var(--fg-mute)", boxShadow: lit ? "0 0 10px var(--mem)" : "none", flex: "none" }} />
                      <span className="mem-label">{m.label}</span>
                    </div>
                    <div className="mem-src">source · {m.source}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {atEnd ? (
          <div className="panel" style={{ marginTop: 40, padding: "clamp(30px, 5vw, 52px)", textAlign: "center", borderRadius: "var(--radius-lg)", borderColor: "rgba(240,167,66,0.24)", background: "linear-gradient(150deg, rgba(240,167,66,0.08), rgba(167,139,250,0.05) 60%, var(--panel))" }}>
            <p style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 650, color: "var(--fg)", letterSpacing: "-0.02em", margin: 0 }}>
              Every memory above is synthetic. The machinery is real.
            </p>
            <p style={{ marginTop: 6, color: "var(--fg-dim)" }}>— Join the waitlist to meet her.</p>
            <div style={{ marginTop: 20, maxWidth: 520, marginInline: "auto" }}>
              <WaitlistForm source="demo_end" label="Join the waitlist" />
            </div>
          </div>
        ) : null}

        <p className="fine center demo-foot" style={{ marginTop: 30 }}>
          The conversation and its cognition are recorded from a real Arna Mind run; the persona,
          its memories, and any review card are synthetic and purpose-built for this demo.
        </p>
      </div>
    </section>
  );
}
