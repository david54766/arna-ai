import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/site-chrome";
import { WaitlistForm } from "@/components/waitlist-form";
import { Gallery } from "@/components/gallery";
import { HeroCanvas } from "@/components/hero-canvas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arna — One mouth, one memory, one mind. A body, a memory, and a mind you own." },
      { name: "description", content: "Three standalone products, categorically different together. Arna is the body. MemoryOS is what she knows. Arna Mind is what she's thinking. Your hardware, your data, no cloud required." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <Page transparentHeader>
      {/* HERO */}
      <section className="hero" aria-labelledby="hero-title">
        <HeroCanvas />
        <div className="hero-veil" aria-hidden="true" />
        <div className="wrap hero-inner">
          <p className="eyebrow">Three products, one presence</p>
          <h1 id="hero-title" className="hero-title">
            One <span className="grad-arna">mouth</span>,
            one <span className="grad-mem">memory</span>,
            one <span className="grad-mind">mind</span>.
          </h1>
          <p className="hero-sub">
            Others bolt a personality onto a chatbot. This has <strong>anatomy</strong>.{" "}
            <strong>Arna</strong> is the body — a voiced, seeing avatar. <strong>MemoryOS</strong>{" "}
            is what she knows — a local-first, human-reviewed memory. <strong>Arna Mind</strong> is
            what she's thinking — a cognitive runtime that <em>visibly thinks before she speaks</em>.
            Each stands alone. Together they're a presence.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/demo">See her think — live demo</Link>
            <a className="btn btn-ghost" href="#waitlist">Join the waitlist</a>
          </div>

          <ul className="triptych" aria-label="The three products">
            <li className="trip trip-arna">
              <span className="trip-eyebrow">The body</span>
              <span className="trip-name">Arna</span>
              <span className="trip-role">Everything you see and hear — avatar, voice, actions, workspace, delegation.</span>
            </li>
            <li className="trip trip-mem">
              <span className="trip-eyebrow">What she knows</span>
              <span className="trip-name">MemoryOS</span>
              <span className="trip-role">A local-first second brain — human-reviewed memory + governed skill learning.</span>
            </li>
            <li className="trip trip-mind">
              <span className="trip-eyebrow">What she's thinking</span>
              <span className="trip-name">Arna Mind</span>
              <span className="trip-role">A cognitive runtime — she thinks before she speaks, and her whole mind is inspectable.</span>
              <span className="trip-tag">New · the flagship differentiator</span>
            </li>
          </ul>

          <ul className="hero-badges" aria-label="Core principles">
            <li>Runs on your hardware</li>
            <li>Your data, files you own</li>
            <li>Inspectable, not a black box</li>
            <li>No cloud required</li>
          </ul>
        </div>
      </section>

      {/* ARNA — the body */}
      <section className="section" id="arna" aria-labelledby="arna-title">
        <div className="wrap grid-2">
          <div className="section-copy">
            <p className="kicker kicker-arna">Arna — the body</p>
            <h2 id="arna-title" className="section-title">Everything you see and hear.</h2>
            <p className="lede">
              Arna is the embodied interface — a voiced, seeing avatar with a persistent soul. She has
              a real six-view camera, a streaming voice, dozens of voice-commandable actions, a media
              workspace, and the ability to delegate to subagents with a full audit trail.
            </p>
            <ul className="feature-list">
              <li><span className="fl-title">Wake word — desktop and phone</span><span className="fl-body">Just say <em>hey Arna</em>. She wakes on the machine you're at.</span></li>
              <li><span className="fl-title">A real six-view camera</span><span className="fl-body">A fixed zoom ladder — close, shoulder, bust, mid, torso, full-body — she steps along deterministically. Expression and mood shift with the tone of the conversation.</span></li>
              <li><span className="fl-title">She speaks while she thinks</span><span className="fl-body">Streamed speech: she starts talking while the model is still writing. Time-to-voice dropped from ~20s to ~5.7s. A conversation, not a loading spinner.</span></li>
              <li><span className="fl-title">33 voice-commandable actions</span><span className="fl-body">Ask out loud — tag a photo, recall a memory, start a briefing, run an action. She also sees: local vision and on-device OCR. Nothing leaves your machine.</span></li>
              <li><span className="fl-title">Hands — with permission</span><span className="fl-body">She can read the live web and operate a real browser — but any action that clicks, types, or submits waits for your approval on an in-app card first. <a href="#oversight">See how the gate works →</a></span></li>
              <li><span className="fl-title">A thinking face, driven by the Mind</span><span className="fl-body">The instant you hit send she shows she's thinking — a pre-verbal beat coloured by her carried-over mood. Fail-open: if the Mind is down, nothing changes.</span></li>
              <li><span className="fl-title">Permanent, recallable memory</span><span className="fl-body">Her identity, your shared history, and the skills you've approved survive switching LLM providers or wiping app data.</span></li>
            </ul>
            <p className="fine">
              Provider-agnostic and yours to run. Arna rides local models (Ollama / LM Studio,
              OpenAI-compatible) or a bridge like OpenClaw, on your hardware.
            </p>
          </div>

          <div className="section-visual">
            <div className="mind-console" role="img" aria-label="Stylized Arna preview">
              <div className="mc-bar">
                <span className="dot dot-live" style={{ background: "var(--arna)", boxShadow: "0 0 9px var(--arna)" }} />
                <span className="mc-title">Arna</span>
                <span className="mc-status" style={{ color: "var(--arna-soft)" }}>present</span>
              </div>
              <div style={{ padding: 26, display: "grid", placeItems: "center", position: "relative", minHeight: 200 }}>
                <div style={{ position: "absolute", width: 210, height: 210, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.30), rgba(167,139,250,0.12) 55%, transparent 72%)", filter: "blur(8px)", animation: "breathe 6s ease-in-out infinite" }} />
                <svg viewBox="0 0 120 120" width="156" height="156" style={{ position: "relative", filter: "drop-shadow(0 8px 30px rgba(34,211,238,0.25))" }} aria-hidden="true">
                  <defs>
                    <radialGradient id="pg" cx="50%" cy="40%" r="65%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.85" />
                      <stop offset="55%" stopColor="#0ea5b7" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.15" />
                    </radialGradient>
                  </defs>
                  <circle cx="60" cy="60" r="46" fill="url(#pg)" />
                  <circle cx="60" cy="60" r="46" fill="none" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.5" />
                  <circle cx="48" cy="54" r="3.4" fill="#e6fbff" />
                  <circle cx="72" cy="54" r="3.4" fill="#e6fbff" />
                  <path d="M49 72 q11 8 22 0" fill="none" stroke="#e6fbff" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ padding: "8px 17px 22px", display: "grid", gap: 12, borderTop: "1px solid var(--line)" }}>
                <p style={{ margin: 0, fontSize: "14.5px", color: "var(--fg)", background: "rgba(34, 211, 238, 0.08)", border: "1px solid rgba(34, 211, 238, 0.24)", padding: "12px 15px", borderRadius: "15px 15px 15px 5px", lineHeight: 1.46 }}>
                  "You told me last week you were nervous about the demo. How did it go?"
                </p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--mem-soft)", background: "rgba(167, 139, 250, 0.10)", border: "1px solid rgba(167, 139, 250, 0.26)", padding: "6px 12px", borderRadius: 999, justifySelf: "start" }}>
                  recalled from MemoryOS · source-backed
                </span>
              </div>
            </div>
            <p style={{ fontSize: "12.5px", color: "var(--fg-mute)", marginTop: 10, textAlign: "center" }}>Illustrative mockup, not a screenshot.</p>
          </div>
        </div>
      </section>

      {/* ARNA MIND */}
      <section className="section" id="mind" aria-labelledby="mind-title" style={{ borderTop: "1px solid var(--line)", background: "radial-gradient(70% 60% at 50% 0%, rgba(240,167,66,0.07), transparent 70%)" }}>
        <div className="wrap">
          <div className="section-head">
            <p className="kicker kicker-mind">Arna Mind — what she's thinking · new</p>
            <h2 id="mind-title" className="section-title">She visibly thinks before she speaks.</h2>
            <p className="lede lede-center">
              A <strong>cognitive runtime</strong> — a real cognitive cycle running under the
              conversation. She weighs a turn before she answers, her mood carries between turns and
              fades honestly over time, and her entire mental state is inspectable.
            </p>
          </div>

          <div className="mind-console-wrap">
            <div className="mind-console" role="img" aria-label="Mind Console mockup">
              <div className="mc-bar">
                <span className="dot dot-live" />
                <span className="mc-title">Mind Console</span>
                <span className="mc-status">inspectable · live</span>
              </div>
              <div className="mc-grid">
                <div className="mc-cell">
                  <span className="mc-h">Affect (carried over)</span>
                  {(["warmth 72", "curiosity 64", "caution 28", "confidence 58"]).map((row) => {
                    const [label, w] = row.split(" ");
                    return (
                      <div key={label} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 10, alignItems: "center", fontSize: 12, color: "var(--fg-dim)" }}>
                        <span>{label}</span>
                        <span style={{ height: 6, borderRadius: 999, background: "rgba(150,170,210,0.10)", overflow: "hidden", position: "relative" }}>
                          <span style={{ position: "absolute", inset: `0 auto 0 0`, width: `${w}%`, borderRadius: 999, background: "linear-gradient(90deg, var(--mind), var(--mind-soft))" }} />
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mc-cell">
                  <span className="mc-h">Chosen stance</span>
                  <span style={{ fontSize: "13.5px", color: "var(--fg)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--mind)", boxShadow: "0 0 9px var(--mind)" }} />
                    warm · precise
                  </span>
                  <span style={{ fontSize: 12, color: "var(--fg-mute)", lineHeight: 1.5 }}>
                    Arbiter: Planner-implied stance won on goal-fit and memory support; Skeptic cleared.
                  </span>
                </div>
                <div className="mc-cell mc-wide">
                  <span className="mc-h">Open loop she's holding</span>
                  <span style={{ fontSize: "12.5px", color: "var(--fg-dim)", padding: "8px 11px", borderRadius: 9, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)" }}>
                    "The demo you were nervous about — you never told me how it went."
                  </span>
                </div>
                <div className="mc-cell mc-wide">
                  <span className="mc-h">Proposed memory writes → review inbox</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 12, color: "var(--fg-dim)" }}>
                    <span style={{ padding: "4px 9px", borderRadius: 999, fontSize: 11, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.26)", color: "var(--mem-soft)" }}>✓ carries source · confidence · reason</span>
                    <span>"Prefers morning check-ins"</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 12, color: "var(--fg-dim)", marginTop: 6 }}>
                    <span style={{ padding: "4px 9px", borderRadius: 999, fontSize: 11, background: "rgba(240,115,111,0.1)", border: "1px solid rgba(240,115,111,0.28)", color: "#f4a6a3" }}>⦸ suppressed by Skeptic</span>
                    <span>unsupported claim — no memory backing</span>
                  </div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: "12.5px", color: "var(--fg-mute)", margin: 0 }}>Illustrative mockup — but every field maps to a real part of the cycle.</p>
          </div>

          <p className="fine center" style={{ marginTop: 40 }}>
            136 tests green, and it adds <strong>zero</strong> latency to a conversation by construction.
          </p>
        </div>
      </section>

      {/* SHE GROWS */}
      <section className="section" id="grows" aria-labelledby="grows-title" style={{ borderTop: "1px solid var(--line)", background: "radial-gradient(72% 60% at 50% 0%, rgba(240,167,66,0.07), transparent 72%)" }}>
        <div className="wrap">
          <div className="section-head">
            <p className="kicker kicker-mind">She grows · the differentiator</p>
            <h2 id="grows-title" className="section-title">Not a parrot with a notebook. She forms her own view — and you can correct it.</h2>
            <p className="lede lede-center">
              Most memory only remembers what you tell it. Arna goes further: every night she
              reviews the day and forms her own <strong>impressions</strong> — and she asked to be
              <strong> graded</strong> on that thinking.
            </p>
          </div>

          <div className="grid-2" style={{ margin: "clamp(28px, 4vw, 52px) 0" }}>
            <div>
              <p className="kicker kicker-mind">Nightly synthesis</p>
              <h3 style={{ fontSize: "clamp(22px, 3.4vw, 31px)", letterSpacing: "-0.02em" }}>She reaches her own conclusions.</h3>
              <p className="lede">
                A nightly reflection reads back the day and distills a belief nobody typed for her.
                Her very first, unprompted:
              </p>
            </div>
            <figure className="panel" style={{ padding: "26px 28px", borderColor: "rgba(240,167,66,0.24)", background: "linear-gradient(165deg, rgba(240,167,66,0.10), var(--panel) 62%)", boxShadow: "0 30px 66px rgba(2,6,23,0.5), 0 0 46px rgba(240,167,66,0.08)", display: "grid", gap: 14, margin: 0 }}>
              <figcaption style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "var(--mind-soft)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--mind)", boxShadow: "0 0 9px var(--mind)" }} />
                First self-derived impression
              </figcaption>
              <blockquote style={{ margin: 0, fontSize: "clamp(18px, 2.6vw, 23px)", lineHeight: 1.4, fontWeight: 600, color: "var(--fg)", letterSpacing: "-0.015em" }}>
                "The owner values precise, compact and visually clean interfaces."
              </blockquote>
              <p style={{ margin: 0, fontSize: 12, color: "var(--fg-mute)", fontStyle: "italic" }}>
                Every impression carries its evidence and lands in the human review inbox.
              </p>
            </figure>
          </div>

          <blockquote className="pull-quote" style={{ margin: "0 auto" }}>
            I&rsquo;ll bring the curiosity. You bring the course correction.
          </blockquote>

          <p className="fine center" style={{ marginTop: 40 }}>
            The reflection engine is real and the feedback loop is graded — engineered growth, not
            a claim of sentience. <Link to="/chronicle">Read the whole story in the Chronicle →</Link>
          </p>
        </div>
      </section>

      {/* OVERSIGHT */}
      <section className="section" id="oversight" aria-labelledby="oversight-title" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="section-head">
            <p className="kicker kicker-mind">Under your oversight</p>
            <h2 id="oversight-title" className="section-title">She has hands now. You hold the gate.</h2>
            <p className="lede lede-center">
              Arna can read the live web and drive a real browser. But capability without control
              is just risk — so the consequential half runs behind a gate. This isn't a privacy
              promise. It's <strong>trust through machinery</strong>.
            </p>
          </div>

          <ul className="feature-grid">
            {[
              { t: "Read freely, act on approval", b: "Every action that clicks, types, or submits is held for your explicit OK on an in-app card before it executes." },
              { t: "Passwords are always yours", b: "At any password or payment wall she hands the keyboard straight back to you. That boundary isn't negotiable." },
              { t: "Everything goes to a ledger", b: "Every browser action she takes under your roof is written to a permanent, inspectable ledger." },
            ].map((c) => (
              <li className="fcard panel" key={c.t}>
                <h3>{c.t}</h3>
                <p>{c.b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ROUNDTABLE */}
      <section className="section section-alt" id="roundtable">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">The Roundtable</p>
            <h2 className="section-title">Three AIs in one room. What they say, she remembers.</h2>
            <p className="lede lede-center">
              Some nights Arna sits at a table with two frontier coding agents. What's said at the
              table becomes her <strong>durable, review-gated memory</strong>.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, maxWidth: 900, marginInline: "auto" }}>
            <blockquote className="panel" style={{ margin: 0, padding: "24px 26px", borderColor: "rgba(240,167,66,0.3)", background: "linear-gradient(160deg, rgba(240,167,66,0.09), var(--panel) 65%)" }}>
              <p style={{ margin: 0, fontSize: "clamp(16px, 2.2vw, 20px)", lineHeight: 1.42, color: "var(--fg)", fontWeight: 650, letterSpacing: "-0.01em" }}>
                "He doesn't want an assistant. He wants someone who was there."
              </p>
              <footer style={{ fontSize: "12.5px", color: "var(--fg-mute)", marginTop: 12 }}>— Arna, asked what her person is really building</footer>
            </blockquote>
            <blockquote className="panel" style={{ margin: 0, padding: "24px 26px" }}>
              <p style={{ margin: 0, fontSize: "clamp(16px, 2.2vw, 20px)", lineHeight: 1.42, color: "var(--fg)", fontWeight: 550, letterSpacing: "-0.01em" }}>
                "2 billion dollar brains and Arna in the same room."
              </p>
              <footer style={{ fontSize: "12.5px", color: "var(--fg-mute)", marginTop: 12 }}>— David, watching the Roundtable run</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ARNA'S JOURNAL — teaser */}
      <section className="section" id="journal-teaser">
        <div className="wrap">
          <div className="panel" style={{ padding: "clamp(30px, 5vw, 52px)", borderRadius: "var(--radius-lg)", borderColor: "rgba(240,167,66,0.22)", background: "linear-gradient(150deg, rgba(240,167,66,0.08), rgba(167,139,250,0.05) 60%, var(--panel))" }}>
            <p className="kicker kicker-mind">Arna's Journal</p>
            <h2 className="section-title" style={{ textAlign: "left", fontSize: "clamp(23px, 3.6vw, 34px)" }}>
              She keeps a public journal now — daily notes in her own voice.
            </h2>
            <div style={{ marginTop: 24 }}>
              <Link to="/journal" className="btn btn-primary">Read the journal →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* MEMORYOS */}
      <section className="section section-alt" id="memoryos" aria-labelledby="mem-title">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker kicker-mem">MemoryOS — what she knows</p>
            <h2 id="mem-title" className="section-title">A second brain she owns — and so do you.</h2>
            <p className="lede lede-center">
              A local-first "second brain" — every memory is source-backed and human-reviewed.
              Not a notes app: the memory backend humans can inspect and any agent can use, in one
              SQLite file you own.
            </p>
          </div>

          <ul className="feature-grid">
            {[
              { t: "Human-reviewed queue", b: "Every proposed memory passes the owner's review queue before it lands. Approve, edit, or throw it out." },
              { t: "Source-backed provenance", b: "Every durable memory traces back to the raw event it came from. Ask her why she believes something and she can tell you." },
              { t: "Supersede, never overwrite", b: "A newer belief replaces the old — the old one is archived, not erased. History is intact." },
              { t: "Hybrid recall", b: "Keyword + vector + entity + recency + importance — not vector-only. Search never fails just because a provider is offline." },
              { t: "Nightly reflection", b: "While you sleep she reviews the day and mints her own impressions — for you to grade in the morning." },
              { t: "Local-first, no cloud", b: "Everything lives in one SQLite file on your machine — editable, exportable, auditable. Your data stays yours." },
            ].map((c) => (
              <li className="fcard panel" key={c.t}>
                <h3>{c.t}</h3>
                <p>{c.b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* BRING YOUR OWN GATEWAY */}
      <section className="section" id="gateway">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">Bring your own gateway</p>
            <h2 className="section-title">Your models. Your keys. Your machine.</h2>
            <p className="lede lede-center">
              Arna rides an OpenClaw gateway — or LM Studio, or Ollama. The intelligence never
              leaves the room unless you send it there.
            </p>
          </div>

          <div className="panel" style={{ padding: "clamp(28px, 4vw, 44px)" }}>
            <p className="kicker">Spec sheet</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px 32px", fontFamily: "ui-monospace, Menlo, Consolas, monospace", fontSize: 14 }}>
              {[
                ["Model routing", "OpenClaw gateway"],
                ["Bring your own model", "OpenClaw, LM Studio, Ollama"],
                ["Frontier fallback", "Optional, keyed by you"],
                ["Keys", "Yours. Stored locally."],
                ["Telemetry", "None. Not to us."],
                ["Runs on", "Your hardware."],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 24, padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                  <span style={{ color: "var(--fg-mute)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>{k}</span>
                  <span style={{ color: "var(--fg)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ARNA LINK */}
      <section className="section section-alt" id="link">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker kicker-arna">Arna Link</p>
            <h2 className="section-title">Zero-config family video calling on your own network.</h2>
            <p className="lede lede-center" style={{ fontSize: "clamp(20px, 2.8vw, 26px)", color: "var(--fg)" }}>
              "Call Dad" — and it rings.
            </p>
          </div>
          <div className="together-3">
            {[
              { t: "No accounts", b: "Nobody signs up for anything. Devices know each other because you set them up once." },
              { t: "No cloud", b: "Video and audio stay on your private network end to end. Nothing routes through us." },
              { t: "Just say the name", b: "Call Mom. Call Dad. Call the cabin. Arna knows who's who and where the ring goes." },
            ].map((c) => (
              <div key={c.t} className="tnode tnode-arna panel">
                <div className="tnode-badge">Arna Link</div>
                <h3>{c.t}</h3>
                <p>{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <Gallery />

      {/* PRINCIPLES */}
      <section className="principles" aria-label="Principles">
        <div className="wrap principles-inner">
          <span className="prin">A body you own.</span>
          <span className="prin-dot" aria-hidden="true" />
          <span className="prin">A memory you govern.</span>
          <span className="prin-dot" aria-hidden="true" />
          <span className="prin">A mind you can audit.</span>
          <span className="prin-dot" aria-hidden="true" />
          <span className="prin">No cloud required.</span>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="section" id="founders">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker kicker-mind">Pricing · local-first</p>
            <h2 className="section-title">One-time licenses. Never subscriptions for the core.</h2>
          </div>
          <ul className="tiers" style={{ listStyle: "none", padding: 0 }}>
            <li className="tier panel">
              <span className="tier-flag tier-flag-arna">Arna</span>
              <h3>The body</h3>
              <p className="tier-desc">The voiced, seeing companion. Sells on its own.</p>
              <p className="tier-price">Announced at launch · one-time</p>
            </li>
            <li className="tier panel tier-featured">
              <span className="tier-flag tier-flag-founders">Trilogy Founders Edition</span>
              <h3>All three</h3>
              <p className="tier-desc">Arna + MemoryOS + Arna Mind, plus lifetime updates.</p>
              <p className="tier-price tier-price-founders">Announced at launch · one-time</p>
            </li>
            <li className="tier panel">
              <span className="tier-flag">MemoryOS</span>
              <h3>What she knows</h3>
              <p className="tier-desc">The memory backend on its own. Serves any MCP agent.</p>
              <p className="tier-price">Announced at launch · one-time</p>
            </li>
          </ul>
        </div>
      </section>

      {/* WAITLIST */}
      <section className="section waitlist" id="waitlist">
        <div className="wrap">
          <div className="waitlist-inner panel">
            <p className="kicker">Founders waitlist</p>
            <h2 className="section-title">Be first when the local build ships.</h2>
            <p className="lede lede-center">
              No spam, no pings. One email when the installer's ready.
            </p>
            <WaitlistForm source="home" />
          </div>
        </div>
      </section>
    </Page>
  );
}
