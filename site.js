(function () {
  "use strict";

  /* Gallery: renders from window.RSTI_GALLERY (gallery-data.js) and drives a
     simple lightbox. Owner-maintained: add a photo file plus one line in
     gallery-data.js, no code changes needed here. */
  (function () {
    var grid = document.getElementById("gallery-grid");
    if (!grid) return;
    var empty = document.getElementById("gallery-empty");
    var items = (window.RSTI_GALLERY || []).filter(function (p) { return p && p.src; });

    if (!items.length) {
      if (empty) empty.hidden = false;
      return;
    }

    items.forEach(function (photo, i) {
      var btn = document.createElement("button");
      btn.className = "gallery-item";
      btn.type = "button";
      btn.setAttribute("aria-label", "Open photo: " + (photo.caption || "untitled"));
      var img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.caption || "";
      img.loading = "lazy";
      btn.appendChild(img);
      if (photo.caption) {
        var cap = document.createElement("span");
        cap.className = "gallery-item__cap";
        cap.textContent = photo.caption;
        btn.appendChild(cap);
      }
      btn.addEventListener("click", function () { openLightbox(i); });
      grid.appendChild(btn);
    });

    var lightbox = document.getElementById("lightbox");
    var lbImg = document.getElementById("lightbox-img");
    var lbCap = document.getElementById("lightbox-caption");
    var lbClose = document.getElementById("lightbox-close");
    var lbPrev = document.getElementById("lightbox-prev");
    var lbNext = document.getElementById("lightbox-next");
    var current = 0;

    function show(i) {
      current = (i + items.length) % items.length;
      var photo = items[current];
      lbImg.src = photo.src;
      lbImg.alt = photo.caption || "";
      lbCap.textContent = photo.caption || "";
    }
    function openLightbox(i) {
      show(i);
      lightbox.hidden = false;
      lbClose.focus();
      document.body.style.overflow = "hidden";
    }
    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = "";
    }
    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", function () { show(current - 1); });
    lbNext.addEventListener("click", function () { show(current + 1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "ArrowRight") show(current + 1);
    });
  })();

  /* Top nav: mobile menu toggle. */
  var navToggle = document.querySelector(".site-nav__toggle");
  var navLinks = document.querySelector(".site-nav__links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    Array.prototype.forEach.call(navLinks.querySelectorAll("a"), function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Folio (now inside the top nav): the chapter number/title update as
     chapters pass. */
  var chapters = Array.prototype.slice.call(document.querySelectorAll("[data-chapter]"));
  var folioNum = document.querySelector(".folio__num");
  var folioTitle = document.querySelector(".folio__title");

  function currentChapterAt(y) {
    var current = chapters[0];
    for (var i = 0; i < chapters.length; i++) {
      if (chapters[i].offsetTop <= y) current = chapters[i];
    }
    return current;
  }

  /* Trace rail: a clickable jump-to-section index whose fill is a single
     continuous thread down the whole page. It is the connective tissue
     between hard-cut chapters — the hero's flow-field carries through as
     this line, rather than the page reading as ten disconnected slides. */
  var traceRail = document.querySelector(".trace-rail");
  var traceTrack = traceRail && traceRail.querySelector(".trace-rail__track");
  var traceFill = traceRail && traceRail.querySelector(".trace-rail__fill");
  var traceDots = [];

  function buildTraceRail() {
    if (!traceRail || !traceTrack || !chapters.length) return;
    Array.prototype.forEach.call(traceTrack.querySelectorAll(".trace-rail__dot"), function (d) { d.remove(); });
    traceDots = chapters.map(function (ch) {
      var dot = document.createElement("a");
      dot.className = "trace-rail__dot";
      dot.href = "#" + ch.id;
      var label = (ch.getAttribute("data-chapter") || "") + " — " + (ch.getAttribute("data-chapter-title") || "");
      dot.setAttribute("aria-label", label);
      var tip = document.createElement("span");
      tip.className = "trace-rail__tip";
      tip.textContent = label;
      dot.appendChild(tip);
      traceTrack.appendChild(dot);
      return { el: dot, chapter: ch };
    });
    positionTraceDots();
  }

  function positionTraceDots() {
    if (!traceDots.length) return;
    var total = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    traceDots.forEach(function (d) {
      var pct = Math.min(100, Math.max(0, (d.chapter.offsetTop / total) * 100));
      d.el.style.top = pct + "%";
    });
  }

  function updateTrace(current) {
    var total = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    var pct = Math.min(1, Math.max(0, window.scrollY / total));
    if (traceFill) traceFill.style.transform = "scaleY(" + pct + ")";
    traceDots.forEach(function (d) { d.el.classList.toggle("is-active", d.chapter === current); });
  }

  function updateFolio() {
    if (!chapters.length) return;
    var current = currentChapterAt(window.scrollY + window.innerHeight * 0.32);
    if (folioNum) folioNum.textContent = current.getAttribute("data-chapter");
    if (folioTitle) folioTitle.textContent = current.getAttribute("data-chapter-title");
    updateTrace(current);
  }
  window.addEventListener("scroll", updateFolio, { passive: true });
  window.addEventListener("resize", function () { positionTraceDots(); updateFolio(); });
  buildTraceRail();
  updateFolio();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { positionTraceDots(); updateFolio(); });
  }

  /* Generative graphic: "variation is inevitable, robustness is engineered"
     drawn as points, scattered (chaos) on the left resolving into an
     aligned, connected grid (order) on the right. Deterministic PRNG so the
     composition is stable across reloads rather than reshuffling. */
  function seededRandom(seed) {
    var x = Math.sin(seed) * 43758.5453;
    return x - Math.floor(x);
  }
  function renderScatterGrid(svg) {
    var W = 600, H = 320, cols = 9, rows = 5;
    var ns = "http://www.w3.org/2000/svg";
    var frag = document.createDocumentFragment();
    var points = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var gx = (c + 0.5) / cols;
        var gy = (r + 0.5) / rows;
        var chaos = Math.max(0, 1 - gx * 1.15);
        var seed = (r * cols + c + 1) * 12.9898;
        var jx = (seededRandom(seed) - 0.5) * chaos * 100;
        var jy = (seededRandom(seed + 1) - 0.5) * chaos * 74;
        var x = gx * W + jx;
        var y = gy * H + jy;
        points.push({ x: x, y: y, r: r, c: c, chaos: chaos });
      }
    }
    points.forEach(function (p, i) {
      if (p.chaos < 0.3 && p.c < cols - 1) {
        var neighbor = points[i + 1];
        if (neighbor && neighbor.chaos < 0.3) {
          var line = document.createElementNS(ns, "line");
          line.setAttribute("x1", p.x.toFixed(1));
          line.setAttribute("y1", p.y.toFixed(1));
          line.setAttribute("x2", neighbor.x.toFixed(1));
          line.setAttribute("y2", neighbor.y.toFixed(1));
          line.setAttribute("class", "sg-line");
          frag.appendChild(line);
        }
      }
    });
    points.forEach(function (p, i) {
      var circle = document.createElementNS(ns, "circle");
      circle.setAttribute("cx", p.x.toFixed(1));
      circle.setAttribute("cy", p.y.toFixed(1));
      circle.setAttribute("r", (1.6 + (1 - p.chaos) * 1.8).toFixed(1));
      circle.setAttribute("class", "sg-dot");
      circle.style.animationDelay = ((i % 12) * 0.18).toFixed(2) + "s";
      frag.appendChild(circle);
    });
    svg.appendChild(frag);
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-graphic="scatter-grid"]'), renderScatterGrid);

  /* Signature move: the RVF flow draws itself under the reader's scroll.
     Bespoke, reading the pinned framework act's own --sc-p; the engine is
     never touched. See BRIEF.md §5. */
  var act = document.getElementById("framework-act");
  if (!act) return;
  var fill = act.querySelector(".flow__fill");
  var nodes = Array.prototype.slice.call(act.querySelectorAll(".flow__node"));
  var n = nodes.length;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function apply(p) {
    if (fill) fill.style.transform = "scaleY(" + p + ")";
    for (var i = 0; i < n; i++) {
      var start = i / n;
      var end = (i + 0.6) / n;
      var local = (p - start) / (end - start);
      if (local < 0) local = 0;
      if (local > 1) local = 1;
      if (i === 0) local = 1; // the first node is the ground: already there
      var node = nodes[i];
      node.style.opacity = local;
      node.style.transform = "translateX(" + ((1 - local) * -10) + "px)";
      node.classList.toggle("is-lit", local > 0.5);
    }
  }

  if (reduced) {
    apply(1);
    return;
  }

  function tick() {
    var raw = getComputedStyle(act).getPropertyValue("--sc-p");
    var p = parseFloat(raw);
    if (isNaN(p)) p = 0;
    apply(p);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
