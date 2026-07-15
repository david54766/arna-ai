/* =========================================================================
   admin.js — local-only admin console for the Arna site
   -------------------------------------------------------------------------
   Functional ONLY when served locally (localhost / 127.0.0.1 / file://).
   Otherwise it shows a friendly notice and disables the tools.

     1) Demos       — list demos/manifest.json with preview links.
     2) Import demo — file-picker validates a recorded session JSON against
                      the expected shape, normalizes it, and DOWNLOADS a
                      "ready-to-drop" file plus the exact manifest line to add.
     3) Waitlist    — reads the localStorage emails, renders a table, and
                      exports CSV. Clear button wipes the local list.

   No external requests. Import/export are pure client-side (Blob download,
   FileReader). See README-ADMIN.md for the full flow.
   ========================================================================= */
(function () {
  "use strict";

  var WAITLIST_KEY = "arna_memoryos_waitlist";

  /* --- environment gate: localhost only --- */
  function isLocal() {
    var h = location.hostname;
    return (
      location.protocol === "file:" ||
      h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0" || h === "::1" ||
      h === "" // file:// on some browsers
    );
  }

  function setNotice() {
    var box = document.getElementById("admin-notice");
    var text = document.getElementById("admin-notice-text");
    var panel = document.getElementById("admin-panel");
    if (isLocal()) {
      box.classList.add("local-ok");
      text.innerHTML = "<strong>Local environment detected</strong> — all tools are live. " +
        "You're on <code>" + escapeHtml(location.host || "file://") + "</code>.";
      return true;
    }
    text.innerHTML = "<strong>Admin is local-only.</strong> This console is functional only when " +
      "served from localhost (e.g. the preview at <code>http://localhost:4600/admin.html</code>). " +
      "On a public host the tools stay disabled by design.";
    document.body.classList.add("admin-locked");
    if (panel) panel.setAttribute("aria-disabled", "true");
    return false;
  }

  /* --- 1) demos list --- */
  function loadDemos() {
    var list = document.getElementById("demo-list");
    if (!list) return;
    fetch("demos/manifest.json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error("manifest " + r.status); return r.json(); })
      .then(function (m) {
        var demos = (m && m.demos) || [];
        if (!demos.length) { list.innerHTML = '<li class="admin-empty">No demos listed in the manifest yet.</li>'; return; }
        list.innerHTML = demos.map(function (d) {
          return '<li class="admin-demo-row">' +
            '<div class="adr-main">' +
              '<span class="adr-title">' + escapeHtml(d.title || d.id) + '</span>' +
              '<span class="adr-meta">' + escapeHtml(d.persona || "") + ' · ' + (d.turns || "?") + ' turns · <span class="adr-file">demos/' + escapeHtml(d.file) + '</span></span>' +
            '</div>' +
            '<div class="adr-actions">' +
              '<a class="admin-btn admin-btn-primary" href="demo.html" target="_blank" rel="noopener">Preview ↗</a>' +
              '<a class="admin-btn" href="demos/' + encodeURIComponent(d.file) + '" target="_blank" rel="noopener">Raw JSON</a>' +
            '</div>' +
          '</li>';
        }).join("");
      })
      .catch(function (err) {
        list.innerHTML = '<li class="admin-empty">Could not load manifest (' + escapeHtml(err.message) +
          '). Run <code>node tools/record-mind-demo.mjs</code> to create it.</li>';
      });
  }

  /* --- 2) import demo: validate → normalize → download ready-to-drop --- */
  var REQUIRED_TOP = ["turns"];
  function validateSession(obj) {
    var errs = [];
    if (typeof obj !== "object" || obj === null) { return { ok: false, errs: ["Not a JSON object."] }; }
    REQUIRED_TOP.forEach(function (k) { if (!(k in obj)) errs.push('Missing top-level "' + k + '".'); });
    if (!Array.isArray(obj.turns)) errs.push('"turns" must be an array.');
    else if (obj.turns.length === 0) errs.push('"turns" is empty — nothing to play.');
    else {
      obj.turns.forEach(function (t, i) {
        if (typeof t.user !== "string" || !t.user) errs.push("turn[" + i + "] missing .user text.");
        if (typeof t.reply !== "string" || !t.reply) errs.push("turn[" + i + "] missing .reply text.");
        if (typeof t.pauseMs !== "number") errs.push("turn[" + i + "] missing numeric .pauseMs (the pre-verbal beat).");
        if (!t.mind || typeof t.mind !== "object") errs.push("turn[" + i + "] missing .mind debug block.");
      });
    }
    return { ok: errs.length === 0, errs: errs };
  }

  function normalizeSession(obj) {
    // Ensure the fields the demo relies on exist; fill safe defaults.
    var id = obj.id || ("session-" + Date.now());
    var out = {
      schema: obj.schema || "arna-mind-demo-session/1",
      id: id,
      title: obj.title || "Imported session",
      persona: obj.persona || "(persona unspecified)",
      recordedAt: obj.recordedAt || new Date().toISOString(),
      source: obj.source || "",
      sessionIdUsed: obj.sessionIdUsed || "",
      honesty: obj.honesty || "Recorded Arna Mind session. Memory contents shown are synthetic.",
      syntheticMemories: Array.isArray(obj.syntheticMemories) ? obj.syntheticMemories : [],
      turns: obj.turns.map(function (t, i) {
        return {
          id: t.id || ("t" + (i + 1)),
          userLabel: t.userLabel || "User",
          user: String(t.user),
          pauseMs: Number(t.pauseMs) || 0,
          thinkingFace: t.thinkingFace || (t.avatar && t.avatar.preSpeech && t.avatar.preSpeech.face) || "thinking",
          reply: String(t.reply),
          avatar: t.avatar || null,
          mind: t.mind || {},
          memoryWriteCandidates: Array.isArray(t.memoryWriteCandidates) ? t.memoryWriteCandidates : [],
          attention: t.attention || null,
          sanitizeNotes: t.sanitizeNotes || []
        };
      })
    };
    return out;
  }

  function handleFile(file) {
    var out = document.getElementById("import-result");
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var parsed;
      try { parsed = JSON.parse(reader.result); }
      catch (e) {
        out.innerHTML = '<div class="ar-err"><strong>Invalid JSON.</strong> ' + escapeHtml(e.message) + '</div>';
        return;
      }
      var v = validateSession(parsed);
      if (!v.ok) {
        out.innerHTML = '<div class="ar-err"><strong>Validation failed:</strong><ul style="margin:6px 0 0;padding-left:18px;">' +
          v.errs.map(function (e) { return '<li>' + escapeHtml(e) + '</li>'; }).join("") + '</ul></div>';
        return;
      }
      var norm = normalizeSession(parsed);
      var fname = "ready-to-drop." + norm.id + ".json";
      var blob = new Blob([JSON.stringify(norm, null, 2) + "\n"], { type: "application/json" });
      var url = URL.createObjectURL(blob);

      var manifestLine = JSON.stringify({
        id: norm.id, file: norm.id + ".json", title: norm.title,
        persona: norm.persona, turns: norm.turns.length, recordedAt: norm.recordedAt
      });

      out.innerHTML = '<div class="ar-ok">' +
        '<strong>✓ Valid — ' + norm.turns.length + ' turns, persona "' + escapeHtml(norm.persona) + '".</strong>' +
        '<a class="admin-btn admin-btn-primary" id="dl-normalized" href="' + url + '" download="' + fname + '">Download ' + escapeHtml(fname) + '</a>' +
        '<div><strong>To install:</strong></div>' +
        '<div>1 · Rename the download to <code>' + escapeHtml(norm.id) + '.json</code> and place it in <code>demos/</code>.</div>' +
        '<div>2 · Add this line to the <code>demos</code> array in <code>demos/manifest.json</code>:</div>' +
        '<code class="admin-code">' + escapeHtml(manifestLine) + '</code>' +
        '</div>';
    };
    reader.readAsText(file);
  }

  function initImport() {
    var input = document.getElementById("import-file");
    var drop = document.getElementById("admin-drop");
    if (input) input.addEventListener("change", function () { handleFile(this.files && this.files[0]); });
    if (drop) {
      ["dragenter", "dragover"].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("dragover"); });
      });
      ["dragleave", "drop"].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("dragover"); });
      });
      drop.addEventListener("drop", function (e) {
        var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        handleFile(f);
      });
    }
  }

  /* --- 3) waitlist viewer + CSV export --- */
  function readWaitlist() {
    try {
      var list = JSON.parse(localStorage.getItem(WAITLIST_KEY) || "[]");
      return Array.isArray(list) ? list : [];
    } catch (e) { return []; }
  }

  function renderWaitlist() {
    var list = readWaitlist();
    var table = document.getElementById("wl-table");
    var tbody = document.getElementById("wl-tbody");
    var empty = document.getElementById("wl-empty");
    var count = document.getElementById("wl-count");
    if (count) count.textContent = list.length ? "(" + list.length + ")" : "";
    if (!list.length) {
      if (table) table.hidden = true;
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    if (table) table.hidden = false;
    if (tbody) {
      tbody.innerHTML = list.map(function (item, i) {
        var when = item.at ? new Date(item.at).toLocaleString() : "—";
        return '<tr><td>' + (i + 1) + '</td><td class="at-email">' + escapeHtml(item.email || "") + '</td>' +
          '<td>' + escapeHtml(when) + '</td><td>' + escapeHtml(item.source || "site") + '</td></tr>';
      }).join("");
    }
  }

  function exportCsv() {
    var list = readWaitlist();
    if (!list.length) return;
    var rows = [["email", "joined_at", "source"]].concat(
      list.map(function (i) { return [i.email || "", i.at || "", i.source || "site"]; })
    );
    var csv = rows.map(function (r) {
      return r.map(function (cell) {
        var s = String(cell).replace(/"/g, '""');
        return /[",\n]/.test(s) ? '"' + s + '"' : s;
      }).join(",");
    }).join("\r\n") + "\r\n";
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "arna-waitlist-" + new Date().toISOString().slice(0, 10) + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function initWaitlist() {
    renderWaitlist();
    var exp = document.getElementById("wl-export");
    var ref = document.getElementById("wl-refresh");
    var clr = document.getElementById("wl-clear");
    if (exp) exp.addEventListener("click", exportCsv);
    if (ref) ref.addEventListener("click", renderWaitlist);
    if (clr) clr.addEventListener("click", function () {
      if (!readWaitlist().length) return;
      if (window.confirm("Clear the local waitlist on this device? This cannot be undone.")) {
        try { localStorage.removeItem(WAITLIST_KEY); } catch (e) { /* ignore */ }
        renderWaitlist();
      }
    });
  }

  /* --- helpers --- */
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function boot() {
    var local = setNotice();
    // Demos + waitlist are read-only and safe to show either way, but per the
    // spec the tools are "functional only when served locally" — so only wire
    // the interactive tools when local.
    loadDemos();
    if (local) {
      initImport();
      initWaitlist();
    } else {
      // still render a read-only waitlist count of 0-safe state, but no actions
      renderWaitlist();
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
