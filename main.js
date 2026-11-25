(function () {
  "use strict";

  var SRC = "assets/DontPickOnMe.riv";
  var canvases = Array.prototype.slice.call(document.querySelectorAll(".rive-canvas"));
  var heroStatus = document.querySelector(".rive-status");
  var root = document.documentElement;

  /* ---------- Header: shadow on scroll + mobile menu ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() { header.classList.toggle("on-scroll", window.scrollY > 0); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var burger = document.querySelector(".hamburger-click-area");
  var menu = document.getElementById("responsive-nav");
  function setMenu(open) {
    root.classList.toggle("show-responsive-nav", open);
    burger.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
  }
  burger.addEventListener("click", function () { setMenu(true); });
  menu.querySelector(".close-responsive-click-area").addEventListener("click", function () { setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 932) setMenu(false); });

  /* ---------- Rive ---------- */
  function fail(message) {
    if (!heroStatus) return;
    heroStatus.textContent = message;
    heroStatus.classList.remove("is-hidden");
    heroStatus.classList.add("is-error");
  }

  if (typeof rive === "undefined") {
    fail("The animation runtime failed to load. Check your connection and try again.");
    return;
  }

  // The pinned runtime (2.55.1) still supports these; linear-animation playback is intentional here (see README).
  rive.Rive.suppressDeprecationWarnings = ["animations-param", "names-array", "animation-names"];

  var instances = new Map(); // canvas -> Rive
  var file = new rive.RiveFile({
    src: SRC,
    onLoad: function () {
      // One shared RiveFile; each canvas starts when it first scrolls near the viewport.
      if (!("IntersectionObserver" in window)) { canvases.forEach(start); return; }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var canvas = entry.target;
          var inst = instances.get(canvas);
          if (entry.isIntersecting) {
            if (!inst) start(canvas); else inst.play();
          } else if (inst) {
            inst.pause(); // pause-offscreen
          }
        });
      }, { rootMargin: "120px" });
      canvases.forEach(function (c) { io.observe(c); });
    },
    onLoadError: function () { fail("Don't Pick On Me couldn't load. Try refreshing the page."); },
  });
  file.init();

  function hex(h) { return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }

  function start(canvas) {
    var d = canvas.dataset;
    var layoutOpts = { fit: rive.Fit.Contain, alignment: rive.Alignment.Center };
    if (d.bounds) {
      var b = d.bounds.split(",").map(Number); // minX,minY,maxX,maxY in artboard units
      layoutOpts.minX = b[0]; layoutOpts.minY = b[1]; layoutOpts.maxX = b[2]; layoutOpts.maxY = b[3];
    }
    var params = {
      riveFile: file,
      canvas: canvas,
      artboard: d.artboard,
      autoplay: true,
      autoBind: true,
      layout: new rive.Layout(layoutOpts),
      onLoad: function () {
        inst.resizeDrawingSurfaceToCanvas();
        var vm = inst.viewModelInstance;
        if (vm && d.body) { var c = hex(d.body); vm.color("bodyColor").rgb(c[0], c[1], c[2]); }
        if (vm && d.cap) { var k = hex(d.cap); vm.color("capColour").rgb(k[0], k[1], k[2]); }
        if (heroStatus && d.artboard === "PLAY") heroStatus.classList.add("is-hidden");
      },
      onLoadError: function () { if (d.artboard === "PLAY") fail("Don't Pick On Me couldn't load. Try refreshing the page."); },
    };
    if (d.stateMachine) params.stateMachine = d.stateMachine;
    else if (d.animation) params.animations = d.animation;
    params.onStop = function (e) { if (d.interactive === "shroomie" && inst) onShroomieStop(canvas, e); };
    var inst = new rive.Rive(params);
    instances.set(canvas, inst);
    if (d.interactive === "shroomie") wireShroomie(canvas, inst);

    if ("ResizeObserver" in window) {
      new ResizeObserver(function () { inst.resizeDrawingSurfaceToCanvas(); }).observe(canvas);
    }
  }

  /* Shroomie: IDLE loops; hover -> HOVER loop; click -> DEATH, then REGROW, then back to IDLE/HOVER. */
  var shroomieState = new Map(); // canvas -> {hovering, phase: "idle" | "dying" | "regrow"}
  function playOnly(inst, name) {
    var current = inst.playingAnimationNames;
    if (current.length) inst.stop(current);
    inst.play(name);
  }
  function wireShroomie(canvas, inst) {
    var s = { hovering: false, phase: "idle" };
    shroomieState.set(canvas, s);
    canvas.classList.add("is-live");
    canvas.addEventListener("pointerenter", function (e) {
      if (e.pointerType !== "mouse") return;
      s.hovering = true;
      if (s.phase === "idle") playOnly(inst, "Shroomie HOVER");
    });
    canvas.addEventListener("pointerleave", function () {
      s.hovering = false;
      if (s.phase === "idle") playOnly(inst, "Shroomie IDLE");
    });
    canvas.addEventListener("click", function () {
      if (s.phase !== "idle") return;
      s.phase = "dying";
      playOnly(inst, "Shroomie DEATH");
    });
  }
  function onShroomieStop(canvas, e) {
    var s = shroomieState.get(canvas), inst = instances.get(canvas);
    var names = (e && e.data) || [];
    if (!s || !inst) return;
    if (s.phase === "dying" && names.indexOf("Shroomie DEATH") !== -1) {
      s.phase = "regrow";
      inst.play("Shroomie REGROW");
    } else if (s.phase === "regrow" && names.indexOf("Shroomie REGROW") !== -1) {
      s.phase = "idle";
      playOnly(inst, s.hovering ? "Shroomie HOVER" : "Shroomie IDLE");
    }
  }

  window.addEventListener("resize", function () {
    instances.forEach(function (inst) { inst.resizeDrawingSurfaceToCanvas(); });
  });
})();
