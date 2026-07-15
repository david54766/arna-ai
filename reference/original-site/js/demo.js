/* =========================================================================
   demo.js — "See her think": email-gated interactive Arna Mind demo
   -------------------------------------------------------------------------
   Three panes, all driven by a RECORDED synthetic session baked under demos/:
     (a) Conversation replay — plays the scripted turns with the VISIBLE
         pre-verbal beat (typing indicator -> a "thinking" state chip that
         waits the real pauseMs -> the reply), advancing on click.
     (b) Mind Console — synced to the replay; renders the genuine MindResult
         debug fields for the current turn (percept, affect, chosen stance +
         why + discarded, faculty sources, timings).
     (c) Memory graph — an explorable canvas of ~25 SYNTHETIC memories in the
         site's graph-hero visual style; click a node to inspect it. Plus a
         mini, illustrative review-inbox vignette.

   Gate: email validated client-side, appended to the same localStorage
   waitlist the homepage uses, and a separate unlock flag persists the unlock.
   A single, clearly-marked submitWaitlist() hook is the seam for a real
   endpoint later.

   No external requests of any kind. Everything is same-origin fetch of the
   baked JSON under demos/.
   ========================================================================= */
(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var WAITLIST_KEY = "arna_memoryos_waitlist"; // shared with homepage
  var UNLOCK_KEY = "arna_demo_unlocked";        // persists the demo unlock
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* =======================================================================
     PLUGGABLE SUBMIT HOOK  ← wire a real endpoint here later.
     -----------------------------------------------------------------------
     Today: append to localStorage only (static-site honest — nothing leaves
     the browser). To connect a backend, replace the body with a fetch/POST
     and return a Promise. The gate awaits this; a rejection surfaces an error
     and does NOT unlock, so the local write below is the source of truth for
     the static build.

       Example real implementation:
         return fetch("/api/waitlist", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ email: email, source: "demo-gate" })
         }).then(function (r) { if (!r.ok) throw new Error("submit failed"); });
     ======================================================================= */
  function submitWaitlist(email) {
    // --- static-site default: persist locally, resolve immediately ---
    try {
      var list = JSON.parse(localStorage.getItem(WAITLIST_KEY) || "[]");
      if (!Array.isArray(list)) list = [];
      var lower = email.toLowerCase();
      var already = list.some(function (i) {
        return (i.email || "").toLowerCase() === lower;
      });
      if (!already) {
        list.push({ email: email, at: new Date().toISOString(), source: "demo-gate" });
        localStorage.setItem(WAITLIST_KEY, JSON.stringify(list));
      }
    } catch (e) { /* private mode — unlock still proceeds */ }
    return Promise.resolve({ ok: true, local: true });
  }

  /* -----------------------------------------------------------------------
     GATE
     --------------------------------------------------------------------- */
  function isUnlocked() {
    try { return localStorage.getItem(UNLOCK_KEY) === "1"; } catch (e) { return false; }
  }
  function persistUnlock() {
    try { localStorage.setItem(UNLOCK_KEY, "1"); } catch (e) { /* ignore */ }
  }

  function revealStage(scroll) {
    var gate = document.getElementById("demo-gate");
    var stage = document.getElementById("demo-stage");
    if (gate) gate.classList.add("is-satisfied");
    if (stage) {
      stage.hidden = false;
      stage.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
    }
    if (scroll && stage) {
      try { stage.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); }
      catch (e) { stage.scrollIntoView(); }
    }
    initDemo();
  }

  function initGate() {
    var form = document.getElementById("gate-form");
    if (!form) return;
    var input = document.getElementById("gate-email");
    var note = document.getElementById("gate-note");

    function setNote(msg, kind) {
      if (!note) return;
      note.textContent = msg;
      note.className = "gate-note " + (kind || "");
    }

    // already unlocked on this device → skip straight in
    if (isUnlocked()) {
      setNote("Already unlocked on this device — welcome back.", "ok");
      revealStage(false);
      return;
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var value = (input.value || "").trim();
      if (!EMAIL_RE.test(value)) {
        input.setAttribute("aria-invalid", "true");
        setNote("Please enter a valid email address.", "err");
        input.focus();
        return;
      }
      input.removeAttribute("aria-invalid");
      setNote("Unlocking…", "");
      var btn = form.querySelector("button[type=submit]");
      if (btn) btn.disabled = true;

      submitWaitlist(value)
        .then(function () {
          persistUnlock();
          setNote("Unlocked — you're on the founders waitlist. Enjoy the demo.", "ok");
          form.reset();
          revealStage(true);
        })
        .catch(function () {
          if (btn) btn.disabled = false;
          setNote("Something went wrong — please try again.", "err");
        });
    });
  }

  /* -----------------------------------------------------------------------
     DEMO ENGINE — loads the baked session, drives the three panes
     --------------------------------------------------------------------- */
  var demoBooted = false;
  var SESSION = null;
  var turnIndex = 0;      // 0 = nothing played yet; N = N turns played
  var animating = false;

  function initDemo() {
    if (demoBooted) return;
    demoBooted = true;
    loadSession();
  }

  function loadSession() {
    var sub = document.getElementById("stage-sub");
    // 1) manifest → 2) first session file. Same-origin, no external requests.
    fetch("demos/manifest.json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error("manifest " + r.status); return r.json(); })
      .then(function (manifest) {
        var first = (manifest.demos && manifest.demos[0]) || null;
        if (!first) throw new Error("no demos listed in manifest");
        return fetch("demos/" + first.file, { cache: "no-cache" });
      })
      .then(function (r) { if (!r.ok) throw new Error("session " + r.status); return r.json(); })
      .then(function (session) {
        SESSION = session;
        if (sub) {
          sub.innerHTML =
            'Recorded session: <strong>' + escapeHtml(session.title) + '</strong> · persona ' +
            escapeHtml(session.persona) + ' · ' + session.turns.length + ' turns.';
        }
        var adv = document.getElementById("btn-advance");
        if (adv) { adv.disabled = false; }
        updateProgress();
        buildGraph(session.syntheticMemories || []);
      })
      .catch(function (err) {
        if (sub) sub.innerHTML =
          '<span style="color:#f4a6a3;">Could not load the recorded session (' +
          escapeHtml(err.message) + '). Re-run <code>node tools/record-mind-demo.mjs</code> to (re)create demos/session-1.json.</span>';
      });

    var advBtn = document.getElementById("btn-advance");
    var resetBtn = document.getElementById("btn-reset");
    if (advBtn) advBtn.addEventListener("click", advanceTurn);
    if (resetBtn) resetBtn.addEventListener("click", resetTurns);
  }

  function updateProgress() {
    var p = document.getElementById("demo-progress");
    var total = SESSION ? SESSION.turns.length : 0;
    if (p) p.textContent = "turn " + turnIndex + " of " + total;
    var adv = document.getElementById("btn-advance");
    if (!adv) return;
    if (turnIndex === 0) adv.textContent = "Begin the session";
    else if (turnIndex >= total) { adv.textContent = "Session complete"; adv.disabled = true; }
    else adv.textContent = "Next turn →";
  }

  function resetTurns() {
    if (animating) return;
    turnIndex = 0;
    var scroll = document.getElementById("chat-scroll");
    if (scroll) {
      scroll.innerHTML =
        '<div class="chat-empty" id="chat-empty"><svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true"><circle cx="24" cy="24" r="20" fill="none" stroke="var(--arna)" stroke-width="1.4" stroke-opacity="0.5"/><path d="M16 22 h16 M16 27 h10" stroke="var(--arna)" stroke-width="1.6" stroke-linecap="round" stroke-opacity="0.7"/></svg><p>Press <strong>Begin the session</strong> to play the first turn.</p></div>';
    }
    var body = document.getElementById("mc-body");
    if (body) body.innerHTML = '<p class="mc-idle">Awaiting the first turn — the console updates in sync with the replay.</p>';
    var label = document.getElementById("mc-turn-label");
    if (label) label.textContent = "awaiting turn 1";
    var adv = document.getElementById("btn-advance");
    if (adv) adv.disabled = false;
    updateProgress();
  }

  function advanceTurn() {
    if (animating || !SESSION) return;
    if (turnIndex >= SESSION.turns.length) return;
    var turn = SESSION.turns[turnIndex];
    animating = true;
    var adv = document.getElementById("btn-advance");
    if (adv) adv.disabled = true;

    var empty = document.getElementById("chat-empty");
    if (empty && empty.parentNode) empty.parentNode.removeChild(empty);

    playTurn(turn, function () {
      turnIndex += 1;
      animating = false;
      var adv2 = document.getElementById("btn-advance");
      if (adv2 && turnIndex < SESSION.turns.length) adv2.disabled = false;
      updateProgress();
    });
  }

  /* --- (a) conversation replay: user msg → typing → THINKING beat → reply --- */
  function playTurn(turn, done) {
    var scroll = document.getElementById("chat-scroll");
    if (!scroll) { done(); return; }

    // user bubble
    var u = el("div", "chat-row chat-user");
    u.innerHTML =
      '<span class="chat-who">' + escapeHtml(turn.userLabel || "Sam") + '</span>' +
      '<div class="chat-bubble bubble-user">' + escapeHtml(turn.user) + '</div>';
    scroll.appendChild(u);
    scrollBottom(scroll);

    // update the console immediately so B is synced to the turn being played
    renderConsole(turn);

    // typing indicator
    var typing = el("div", "chat-row chat-arna");
    typing.innerHTML =
      '<span class="chat-who chat-who-arna">Arna</span>' +
      '<div class="chat-bubble bubble-typing"><span class="typing"><i></i><i></i><i></i></span></div>';
    scroll.appendChild(typing);
    scrollBottom(scroll);

    var typingMs = reduceMotion ? 120 : 780;
    // the VISIBLE pre-verbal beat uses the REAL captured pauseMs
    var pauseMs = Math.max(0, turn.pauseMs || 0);
    // keep the beat perceptible but not tedious in the demo
    var beatMs = reduceMotion ? 220 : Math.min(1600, Math.max(700, pauseMs));

    setTimeout(function () {
      // swap typing → thinking state chip (shows the actual face + the delay)
      typing.querySelector(".chat-bubble").outerHTML =
        '<div class="chat-bubble bubble-thinking">' +
          '<span class="think-chip">' +
            '<span class="think-orb"></span>' +
            'thinking — <span class="think-face">' + escapeHtml(turn.thinkingFace || "thinking") + '</span>' +
            '<span class="think-ms">pre-verbal beat · ' + pauseMs + 'ms</span>' +
          '</span>' +
        '</div>';
      scrollBottom(scroll);

      setTimeout(function () {
        // reply
        typing.querySelector(".chat-bubble").outerHTML =
          '<div class="chat-bubble bubble-arna">' + escapeHtml(turn.reply) + '</div>';
        scrollBottom(scroll);
        done();
      }, beatMs);
    }, typingMs);
  }

  /* --- (b) Mind Console: real MindResult debug fields for this turn --- */
  function renderConsole(turn) {
    var body = document.getElementById("mc-body");
    var label = document.getElementById("mc-turn-label");
    if (label) label.textContent = "turn " + (turn.id ? turn.id.replace("t", "") : "");
    if (!body) return;
    var m = turn.mind || {};
    var pct = m.percept || {};
    var aff = m.affect || {};
    var arb = m.arbitration || {};
    var fac = m.facultySources || {};
    var tim = m.timings || {};

    function bar(nameLbl, v) {
      var w = Math.round(clamp01(v) * 100);
      return '<span class="mc-affrow">' + escapeHtml(nameLbl) +
        ' <span class="mc-affbar"><span class="mc-afffill" style="width:' + w + '%"></span></span>' +
        '<span class="mc-affval">' + v.toFixed(2) + '</span></span>';
    }
    function chip(k, v) {
      var cls = v === "model" ? "fs-model" : "fs-fallback";
      return '<span class="fs-chip ' + cls + '">' + escapeHtml(k) + '<b>' + escapeHtml(v) + '</b></span>';
    }

    var discarded = (arb.discarded || []).map(function (d) {
      return '<li><span class="disc-opt">' + escapeHtml(d.option) + '</span><span class="disc-why">' + escapeHtml(cleanText(d.reason)) + '</span></li>';
    }).join("");

    var facultyChips = Object.keys(fac).map(function (k) { return chip(k, fac[k]); }).join("");

    var entities = (pct.entities || []).map(function (e) {
      return '<span class="ent-chip">' + escapeHtml(e) + '</span>';
    }).join("");

    var skeptic = (m.skepticConstraints || []).map(function (s) {
      return '<li>' + escapeHtml(cleanText(s)) + '</li>';
    }).join("");

    var loops = m.openLoopDebug || {};
    var loopBits = "";
    if ((loops.opened || []).length) loopBits += '<span class="loop-tag loop-open">＋ opened ' + loops.opened.length + '</span>';
    if ((loops.resolved || []).length) loopBits += '<span class="loop-tag loop-res">✓ resolved ' + loops.resolved.length + '</span>';
    if ((loops.inAttention || []).length) loopBits += '<span class="loop-tag loop-hold">◔ holding ' + loops.inAttention.length + '</span>';
    if (!loopBits) loopBits = '<span class="loop-tag loop-none">no open loops</span>';

    var writes = (turn.memoryWriteCandidates || []).map(function (c) {
      return '<div class="mcw-row">' +
        '<span class="mcw-chip">✓ ' + escapeHtml(c.type || "candidate") + ' · conf ' + (typeof c.confidence === "number" ? c.confidence.toFixed(2) : "—") + '</span>' +
        '<span class="mcw-body">' + escapeHtml(cleanText(c.content || "")) +
        (c.reason ? '<span class="mcw-reason">reason · ' + escapeHtml(cleanText(c.reason)) + '</span>' : '') +
        '</span></div>';
    }).join("");

    body.innerHTML =
      '<div class="mc-cell">' +
        '<span class="mc-h">Percept</span>' +
        '<p class="mc-line"><span class="mc-k">tone</span> <b class="tone-' + escapeHtml(String(pct.tone || "")) + '">' + escapeHtml(pct.tone || "—") + '</b> · <span class="mc-k">urgency</span> ' + (typeof pct.urgency === "number" ? pct.urgency.toFixed(2) : "—") + '</p>' +
        (entities ? '<div class="ent-row">' + entities + '</div>' : '') +
        (pct.implied_request ? '<p class="mc-imp"><span class="mc-k">implied</span> ' + escapeHtml(pct.implied_request) + '</p>' : '') +
      '</div>' +
      '<div class="mc-cell">' +
        '<span class="mc-h">Affect (carried over)</span>' +
        '<div class="mc-affect">' +
          bar("warmth", num(aff.warmth)) + bar("curiosity", num(aff.curiosity)) +
          bar("caution", num(aff.caution)) + bar("confidence", num(aff.confidence)) +
        '</div>' +
      '</div>' +
      '<div class="mc-cell mc-wide">' +
        '<span class="mc-h">Chosen stance</span>' +
        '<span class="mc-stance">' + escapeHtml(m.chosenStance || arb.chosenStance || "—") + '</span>' +
        '<span class="mc-why">' + escapeHtml(cleanText(arb.why || "")) + '</span>' +
        (discarded ? '<span class="mc-h" style="margin-top:8px;">Discarded options</span><ul class="disc-list">' + discarded + '</ul>' : '') +
      '</div>' +
      '<div class="mc-cell mc-wide">' +
        '<span class="mc-h">Faculty sources</span>' +
        '<div class="fs-row">' + facultyChips + '</div>' +
        '<div class="mc-meta-row">' +
          '<span class="mc-h" style="margin-top:8px;">Open loops</span> ' + loopBits +
        '</div>' +
      '</div>' +
      '<div class="mc-cell mc-wide">' +
        '<span class="mc-h">Timings (this real cycle)</span>' +
        '<div class="tim-row">' +
          timChip("total", tim.totalMs) + timChip("perceive", tim.perceiveMs) +
          timChip("retrieve", tim.retrieveMs) + timChip("appraise", tim.appraiseMs) +
          timChip("deliberate", tim.deliberateMs) + timChip("respond", tim.respondMs) +
        '</div>' +
      '</div>' +
      (skeptic ? '<div class="mc-cell mc-wide"><span class="mc-h">Skeptic constraints (suppression-only)</span><ul class="skep-list">' + skeptic + '</ul></div>' : '') +
      (writes ? '<div class="mc-cell mc-wide"><span class="mc-h">Proposed memory writes → review inbox</span>' + writes + '</div>' : '');
  }

  function timChip(k, v) {
    if (typeof v !== "number") return "";
    return '<span class="tim-chip"><b>' + Math.round(v) + '</b><span>ms</span> ' + escapeHtml(k) + '</span>';
  }

  /* --- (c) memory graph: explorable canvas of synthetic memories --- */
  var graphState = null;

  function buildGraph(memories) {
    var canvas = document.getElementById("mem-graph-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Expand the ~4 baked persona memories into ~25 SYNTHETIC nodes for an
    // explorable graph (all fictional "Sam" content, clustered by type).
    var nodes = buildSyntheticNodes(memories);

    var ARNA = [34, 211, 238], MEM = [167, 139, 250], MIND = [240, 167, 66];
    var typeColor = {
      person: MEM, project: ARNA, preference: MIND, fact: MEM, decision: ARNA, note: MIND
    };
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, raf = null, t = 0, hover = -1, selected = -1;

    function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }

    function size() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height || 320;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // lay nodes out: hub in the centre, clusters around it
      layout();
    }

    function layout() {
      var cx = w / 2, cy = h / 2;
      nodes.forEach(function (n, i) {
        if (n.hub) { n.x = cx; n.y = cy; return; }
        var ring = n.ring || 1;
        var rad = Math.min(w, h) * (ring === 1 ? 0.26 : 0.42);
        var a = n.angle;
        n.x = cx + Math.cos(a) * rad * (0.9 + 0.2 * (i % 3) / 3);
        n.y = cy + Math.sin(a) * rad * (0.72 + 0.18 * (i % 2));
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      // edges
      nodes.forEach(function (n) {
        (n.links || []).forEach(function (j) {
          var m = nodes[j];
          if (!m) return;
          var active = (hover === n.i || hover === j || selected === n.i || selected === j);
          var a = active ? 0.5 : 0.16;
          var grad = ctx.createLinearGradient(n.x, n.y, m.x, m.y);
          grad.addColorStop(0, rgba(n.color, a));
          grad.addColorStop(1, rgba(m.color, a));
          ctx.strokeStyle = grad;
          ctx.lineWidth = active ? 1.4 : 0.7;
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
        });
      });
      // nodes
      nodes.forEach(function (n, i) {
        var pulse = 0.6 + Math.sin(t * 0.03 + i) * 0.2;
        var active = (hover === i || selected === i);
        var rr = n.r * (active ? 1.35 : 1);
        var g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, rr * 5);
        g.addColorStop(0, rgba(n.color, (active ? 0.6 : 0.4) * pulse));
        g.addColorStop(1, rgba(n.color, 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(n.x, n.y, rr * 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = rgba(n.color, active ? 1 : 0.85);
        ctx.beginPath(); ctx.arc(n.x, n.y, rr, 0, Math.PI * 2); ctx.fill();
        if (selected === i) {
          ctx.strokeStyle = rgba(n.color, 0.9); ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(n.x, n.y, rr + 4, 0, Math.PI * 2); ctx.stroke();
        }
        // label the hub + selected/hovered
        if (n.hub || active) {
          ctx.font = (n.hub ? "600 12px " : "500 11px ") + "-apple-system, Segoe UI, Roboto, sans-serif";
          ctx.fillStyle = active ? "#eaf0fb" : "#a6b6d2";
          ctx.textAlign = "center";
          ctx.fillText(n.label, n.x, n.y - rr - 7);
        }
      });
    }

    function frame() { t += 1; draw(); raf = requestAnimationFrame(frame); }
    function start() { if (reduceMotion) { draw(); return; } if (!raf) raf = requestAnimationFrame(frame); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    function pick(ev) {
      var rect = canvas.getBoundingClientRect();
      var mx = ev.clientX - rect.left, my = ev.clientY - rect.top;
      var best = -1, bestD = 18;
      nodes.forEach(function (n, i) {
        var d = Math.hypot(mx - n.x, my - n.y);
        if (d < Math.max(bestD, n.r + 8)) { if (d < bestD) { bestD = d; best = i; } }
      });
      return best;
    }

    canvas.addEventListener("pointermove", function (ev) {
      var p = pick(ev); hover = p; canvas.style.cursor = p >= 0 ? "pointer" : "default";
      if (reduceMotion) draw();
    });
    canvas.addEventListener("pointerleave", function () { hover = -1; if (reduceMotion) draw(); });
    function selectAt(ev) {
      var p = pick(ev);
      if (p < 0) return;
      selected = p;
      showDetail(nodes[p]);
      var hint = document.getElementById("graph-hint");
      if (hint) hint.style.opacity = "0";
      if (reduceMotion) draw();
    }
    canvas.addEventListener("click", selectAt);
    // keyboard: allow tabbing the canvas + Enter cycles selection
    canvas.setAttribute("tabindex", "0");
    canvas.setAttribute("role", "application");
    canvas.setAttribute("aria-label", "Explorable synthetic memory graph — click a node to inspect it");
    canvas.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        selected = (selected + 1) % nodes.length;
        showDetail(nodes[selected]);
      }
    });

    function showDetail(n) {
      var d = document.getElementById("graph-detail");
      if (!d) return;
      d.innerHTML =
        '<div class="gd-card">' +
          '<div class="gd-top"><span class="gd-type gd-type-' + escapeHtml(n.type) + '">' + escapeHtml(n.type) + '</span>' +
          '<span class="gd-id">' + escapeHtml(n.id) + '</span></div>' +
          '<p class="gd-content">' + escapeHtml(n.content) + '</p>' +
          '<p class="gd-prov"><span class="gd-k">provenance</span> ' + escapeHtml(n.provenance) + '</p>' +
        '</div>';
    }

    graphState = { size: size, start: start, stop: stop, draw: draw };
    size();
    start();

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { size(); if (reduceMotion) draw(); }, 150);
    });

    // pause offscreen / hidden
    if ("IntersectionObserver" in window && !reduceMotion) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && !document.hidden) start(); else stop(); });
      });
      io.observe(canvas);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
  }

  // Build ~25 synthetic nodes from the baked persona memories (all fictional).
  function buildSyntheticNodes(seed) {
    var ARNA = [34, 211, 238], MEM = [167, 139, 250], MIND = [240, 167, 66];
    var typeColor = { person: MEM, project: ARNA, preference: MIND, fact: [167,139,250], decision: ARNA, note: MIND };
    // A fixed, purpose-built fictional "Sam" knowledge set.
    var raw = [
      { id: "syn-hub", type: "person", content: "Sam Rivera — freelance product designer, the persona at the centre of this graph.", provenance: "persona root", hub: true },
      // seed memories (from the baked session) sit on the inner ring
    ].concat((seed || []).map(function (s) {
      return { id: s.id, type: s.type, content: s.content, provenance: s.provenance, ring: 1 };
    }));

    // extra synthetic memories to reach ~25 (projects, prefs, facts, decisions, notes)
    var extra = [
      { id: "syn-mem-05", type: "project", content: "Aurora fitness app — redesigned the activity dashboard for a startup client.", provenance: "case note · 2026-04", ring: 2 },
      { id: "syn-mem-06", type: "project", content: "Northwind e-commerce checkout — reduced cart abandonment in a 3-week sprint.", provenance: "client wrap-up · 2026-03", ring: 2 },
      { id: "syn-mem-07", type: "preference", content: "Prefers Figma for high-fidelity work, pen-and-paper for early ideation.", provenance: "tooling chat · 2026-05", ring: 2 },
      { id: "syn-mem-08", type: "preference", content: "Likes async written feedback over live design reviews.", provenance: "working-style note · 2026-05", ring: 2 },
      { id: "syn-mem-09", type: "fact", content: "Based in Lisbon; works remotely across European client timezones.", provenance: "onboarding · 2026-05", ring: 2 },
      { id: "syn-mem-10", type: "fact", content: "Ran a two-person studio for four years before going solo.", provenance: "background · 2026-05", ring: 2 },
      { id: "syn-mem-11", type: "decision", content: "Chose a case-study-first portfolio over a gallery of shots.", provenance: "portfolio plan · 2026-06", ring: 1 },
      { id: "syn-mem-12", type: "decision", content: "Decided to lead each case study with the problem, not the visuals.", provenance: "portfolio plan · 2026-06", ring: 1 },
      { id: "syn-mem-13", type: "note", content: "Wants to eventually mentor junior designers one afternoon a week.", provenance: "goals chat · 2026-06", ring: 2 },
      { id: "syn-mem-14", type: "project", content: "Meridian Bank — three onboarding drop-off points identified and fixed.", provenance: "session note · 2026-07", ring: 1 },
      { id: "syn-mem-15", type: "fact", content: "Meridian case study now published live with before/after for each fix.", provenance: "turn-3 update · 2026-07", ring: 1 },
      { id: "syn-mem-16", type: "preference", content: "Prefers a short morning check-in to plan the day's design work.", provenance: "turn-4 preference · 2026-07", ring: 1 },
      { id: "syn-mem-17", type: "note", content: "Slightly nervous publishing work under her own name post-studio.", provenance: "turn-2 reflection · 2026-07", ring: 2 },
      { id: "syn-mem-18", type: "fact", content: "Comfortable with motion design; less confident writing case-study copy.", provenance: "skills note · 2026-06", ring: 2 },
      { id: "syn-mem-19", type: "decision", content: "Will add measurable outcomes to every portfolio piece going forward.", provenance: "portfolio plan · 2026-07", ring: 2 },
      { id: "syn-mem-20", type: "project", content: "Personal site rebuild — moving from a template to a hand-built layout.", provenance: "side project · 2026-05", ring: 2 },
      { id: "syn-mem-21", type: "preference", content: "Enjoys a calm, low-contrast dark UI for long working sessions.", provenance: "aesthetic note · 2026-06", ring: 2 },
      { id: "syn-mem-22", type: "note", content: "Keeps a running 'wins' file to counter impostor feelings.", provenance: "habit note · 2026-06", ring: 2 },
      { id: "syn-mem-23", type: "fact", content: "Speaks Portuguese and English; takes some clients in Spanish.", provenance: "profile · 2026-05", ring: 2 }
    ];

    var all = raw.concat(extra);
    all.forEach(function (n, i) {
      n.i = i;
      n.color = typeColor[n.type] || MEM;
      n.r = n.hub ? 8 : (n.ring === 1 ? 5.5 : 4.2);
      n.label = shortLabel(n.content);
      if (!n.hub) n.angle = (i * (Math.PI * 2 / (all.length - 1))) + (n.ring === 2 ? 0.35 : 0);
      n.links = [];
    });
    // link everything to the hub, plus a few intra-type edges for texture
    for (var i = 1; i < all.length; i++) {
      all[i].links.push(0);
    }
    // a handful of thematic cross-links (indices are stable given the fixed arrays)
    linkByIds(all, "syn-mem-02", "syn-mem-14"); // Meridian project ↔ drop-off points
    linkByIds(all, "syn-mem-14", "syn-mem-15"); // fixes ↔ published
    linkByIds(all, "syn-mem-02", "syn-mem-11"); // flagship ↔ portfolio decision
    linkByIds(all, "syn-mem-03", "syn-mem-16"); // mornings ↔ morning check-in
    linkByIds(all, "syn-mem-11", "syn-mem-12"); // portfolio decisions
    linkByIds(all, "syn-mem-12", "syn-mem-19"); // problem-first ↔ measurable outcomes
    linkByIds(all, "syn-mem-04", "syn-mem-11"); // process-over-screens ↔ case-study-first
    linkByIds(all, "syn-mem-17", "syn-mem-22"); // nervous ↔ wins file
    return all;
  }

  function linkByIds(arr, a, b) {
    var ia = arr.findIndex(function (n) { return n.id === a; });
    var ib = arr.findIndex(function (n) { return n.id === b; });
    if (ia >= 0 && ib >= 0) { arr[ia].links.push(ib); }
  }

  function shortLabel(text) {
    var w = String(text).split(/\s+/).slice(0, 2).join(" ");
    return w.replace(/[—,.:;].*$/, "");
  }

  /* --- small helpers --- */
  function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }
  function scrollBottom(node) { node.scrollTop = node.scrollHeight; }
  function num(v) { return typeof v === "number" ? v : 0; }
  function clamp01(v) { return Math.max(0, Math.min(1, num(v))); }
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  // strip stray non-ASCII the local model occasionally emits, so debug text
  // renders cleanly (purely cosmetic; never changes meaning of real fields).
  function cleanText(s) {
    return String(s == null ? "" : s).replace(/[^\x09\x0A\x0D\x20-\x7E·—’“”…]/g, "").replace(/\s{2,}/g, " ").trim();
  }

  /* --- boot --- */
  function boot() {
    var header = document.querySelector(".site-header");
    if (header) {
      window.addEventListener("scroll", function () {
        if (window.scrollY > 12) header.classList.add("is-scrolled");
      }, { passive: true });
    }
    initGate();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
