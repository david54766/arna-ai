/* =========================================================
   Arna & MemoryOS — site interactions
   - Living memory-graph hero canvas: depth layers, pulse,
     shimmer links, gentle pointer parallax (reduced-motion safe)
   - Reveal-on-scroll via IntersectionObserver
   - Waitlist: localStorage only, no backend, no network
   No external requests of any kind.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     1) Living memory graph (hero background)
     Two colour families (Arna cyan / MemoryOS violet), three
     depth layers for parallax, pulsing cores, shimmering links.
     --------------------------------------------------------- */
  function initGraph() {
    var canvas = document.getElementById("graph-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var ARNA = [34, 211, 238]; // cyan
    var MEM = [167, 139, 250]; // violet
    var nodes = [];
    var w = 0, h = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var raf = null;
    var running = false;
    var t = 0;

    // pointer parallax target (eased)
    var px = 0, py = 0, tx = 0, ty = 0;

    function rgba(c, a) {
      return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")";
    }

    function size() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height || 1;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function build() {
      var target = Math.round((w * h) / 20000);
      target = Math.max(16, Math.min(52, target));
      nodes = [];
      for (var i = 0; i < target; i++) {
        // depth 0 (far, small, slow) .. 2 (near, big, fast, more parallax)
        var depth = Math.floor(Math.random() * 3);
        var isArna = Math.random() < 0.5;
        var speed = 0.05 + depth * 0.05;
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          r: 0.9 + depth * 0.9 + Math.random() * 0.8,
          c: isArna ? ARNA : MEM,
          depth: depth,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.006 + Math.random() * 0.01
        });
      }
    }

    var LINK_DIST = 155;

    function render(animated) {
      ctx.clearRect(0, 0, w, h);
      var i, j, n, m;

      // ease pointer parallax
      px += (tx - px) * 0.05;
      py += (ty - py) * 0.05;

      // links (shimmer via slow time-based alpha)
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        var noff = (n.depth - 1) * 14;
        var nx = n.x + px * noff;
        var ny = n.y + py * noff;
        for (j = i + 1; j < nodes.length; j++) {
          m = nodes[j];
          var moff = (m.depth - 1) * 14;
          var mx = m.x + px * moff;
          var my = m.y + py * moff;
          var dx = nx - mx, dy = ny - my;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            var base = (1 - d / LINK_DIST) * 0.20;
            var shimmer = animated ? 0.7 + 0.3 * Math.sin(t * 0.03 + (i + j) * 0.6) : 1;
            var a = base * shimmer;
            if (a <= 0.008) continue;
            var grad = ctx.createLinearGradient(nx, ny, mx, my);
            grad.addColorStop(0, rgba(n.c, a));
            grad.addColorStop(1, rgba(m.c, a));
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.6 + (n.depth + m.depth) * 0.12;
            ctx.beginPath();
            ctx.moveTo(nx, ny);
            ctx.lineTo(mx, my);
            ctx.stroke();
          }
        }
      }

      // nodes (far first so near ones sit on top)
      var order = nodes.slice().sort(function (a2, b2) { return a2.depth - b2.depth; });
      for (i = 0; i < order.length; i++) {
        n = order[i];
        if (animated) {
          n.x += n.vx;
          n.y += n.vy;
          n.pulse += n.pulseSpeed;
          if (n.x < -30) n.x = w + 30;
          if (n.x > w + 30) n.x = -30;
          if (n.y < -30) n.y = h + 30;
          if (n.y > h + 30) n.y = -30;
        }
        var off = (n.depth - 1) * 14;
        var cx = n.x + px * off;
        var cy = n.y + py * off;
        var glow = 0.55 + Math.sin(n.pulse) * 0.3;
        var rr = n.r;
        var depthAlpha = 0.35 + n.depth * 0.28;

        // halo
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr * 6);
        g.addColorStop(0, rgba(n.c, 0.45 * glow * depthAlpha));
        g.addColorStop(1, rgba(n.c, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, rr * 6, 0, Math.PI * 2);
        ctx.fill();

        // core
        ctx.fillStyle = rgba(n.c, (0.8 * glow + 0.2) * depthAlpha);
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function frame() {
      // dev/screenshot escape hatch: window.__PAUSE_GRAPH pauses the loop
      if (window.__PAUSE_GRAPH) { render(false); raf = null; running = false; return; }
      t += 1;
      render(true);
      raf = window.requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      if (reduceMotion) {
        render(false);
        running = false;
      } else {
        raf = window.requestAnimationFrame(frame);
      }
    }
    function stop() {
      running = false;
      if (raf) { window.cancelAnimationFrame(raf); raf = null; }
    }

    function rebuild() {
      size();
      build();
      // Always paint one frame so the hero is never blank, even before the
      // animation loop starts (or if the tab opened in the background).
      render(false);
    }

    rebuild();

    if (!reduceMotion) {
      // pointer parallax
      window.addEventListener(
        "pointermove",
        function (e) {
          tx = (e.clientX / window.innerWidth - 0.5) * 2;
          ty = (e.clientY / window.innerHeight - 0.5) * 2;
        },
        { passive: true }
      );

      // only animate while hero is visible AND tab is focused
      var inView = true;
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            inView = e.isIntersecting;
            if (inView && !document.hidden) start();
            else stop();
          });
        });
        io.observe(canvas);
      }
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) stop();
        else if (inView) start();
      });

      start();
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        var wasRunning = running;
        stop();
        rebuild();
        if (wasRunning && !reduceMotion) start();
      }, 160);
    });
  }

  /* ---------------------------------------------------------
     2) Reveal on scroll (staggered)
     --------------------------------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    function reveal(el) {
      // stagger children within a group for a designed cascade
      var group = el.querySelectorAll("[data-stagger]");
      if (group.length) {
        group.forEach(function (child, k) {
          child.style.transitionDelay = k * 70 + "ms";
        });
      }
      el.classList.add("is-visible");
    }

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach(function (el) { obs.observe(el); });

    // Safety net: if the observer hasn't fired (e.g. tab opened in the
    // background so IntersectionObserver is throttled), never leave content
    // stuck invisible — reveal anything already in the viewport, and
    // guarantee a full reveal shortly after load as a last resort.
    function revealInView() {
      els.forEach(function (el) {
        if (el.classList.contains("is-visible")) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) reveal(el);
      });
    }
    window.setTimeout(revealInView, 300);
    window.setTimeout(function () {
      els.forEach(function (el) { reveal(el); });
    }, 2500);
  }

  /* ---------------------------------------------------------
     3) Header state on scroll
     --------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 12) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------
     4) Waitlist (localStorage only)
     --------------------------------------------------------- */
  function initWaitlist() {
    var form = document.getElementById("waitlist-form");
    if (!form) return;
    var input = document.getElementById("wl-email");
    var note = document.getElementById("wl-note");
    var KEY = "arna_memoryos_waitlist";
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setNote(msg, kind) {
      note.textContent = msg;
      note.className = "wl-note " + (kind || "");
    }

    try {
      var existing = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(existing) && existing.length) {
        setNote("You're on the local list — hosted waitlist coming soon.", "ok");
      }
    } catch (e) { /* ignore corrupt storage */ }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var value = (input.value || "").trim();

      if (!emailRe.test(value)) {
        input.setAttribute("aria-invalid", "true");
        setNote("Please enter a valid email address.", "err");
        input.focus();
        return;
      }
      input.removeAttribute("aria-invalid");

      var list = [];
      try {
        list = JSON.parse(localStorage.getItem(KEY) || "[]");
        if (!Array.isArray(list)) list = [];
      } catch (e) { list = []; }

      var lower = value.toLowerCase();
      var already = list.some(function (item) {
        return (item.email || "").toLowerCase() === lower;
      });

      if (already) {
        setNote("You're already on the local list — hosted waitlist coming soon.", "ok");
      } else {
        list.push({ email: value, at: new Date().toISOString() });
        try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* private mode */ }
        setNote("You're on the local list — hosted waitlist coming soon.", "ok");
      }
      form.classList.add("is-sent");
      form.reset();
    });
  }

  /* ---------------------------------------------------------
     5) "See her in action" gallery
     Reads assets/screenshots/manifest.json and populates the
     gallery. Stays hidden unless the manifest loads AND has at
     least one shot — so it is graceful when empty, and when the
     page is opened over file:// (where the fetch is blocked and
     simply rejects). No error is ever surfaced to the user.
     --------------------------------------------------------- */
  function initGallery() {
    var section = document.getElementById("gallery");
    var grid = document.getElementById("gallery-grid");
    if (!section || !grid || typeof fetch !== "function") return;

    fetch("assets/screenshots/manifest.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        var shots = data && Array.isArray(data.shots) ? data.shots : [];
        if (!shots.length) return; // nothing to show — stay hidden

        var frag = document.createDocumentFragment();
        shots.forEach(function (shot) {
          if (!shot || !shot.file) return;
          var li = document.createElement("li");
          li.className = "gallery-item";

          var img = document.createElement("img");
          img.src = "assets/screenshots/" + shot.file;
          img.alt = shot.alt || shot.caption || "Arna product screenshot";
          img.loading = "lazy";
          img.decoding = "async";
          // If an individual image fails, drop just that card.
          img.addEventListener("error", function () {
            if (li.parentNode) li.parentNode.removeChild(li);
            if (!grid.children.length) section.hidden = true;
          });
          li.appendChild(img);

          if (shot.caption) {
            var cap = document.createElement("p");
            cap.className = "gallery-cap";
            cap.textContent = shot.caption;
            li.appendChild(cap);
          }
          frag.appendChild(li);
        });

        if (!frag.childNodes.length) return;
        grid.appendChild(frag);
        section.hidden = false;
      })
      .catch(function () { /* file:// or missing manifest — stay hidden, silently */ });
  }

  function boot() {
    initGraph();
    initReveal();
    initHeader();
    initWaitlist();
    initGallery();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
