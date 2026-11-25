(function () {
  var canvas = document.getElementById("rive-canvas");
  var statusEl = document.getElementById("status");
  var riveInstance = null;

  function hideStatus() {
    statusEl.classList.add("is-hidden");
  }

  function showError(message) {
    statusEl.textContent = message;
    statusEl.classList.add("is-error");
    statusEl.classList.remove("is-hidden");
  }

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    var cssWidth = canvas.clientWidth;
    var cssHeight = canvas.clientHeight;
    var width = Math.max(1, Math.round(cssWidth * dpr));
    var height = Math.max(1, Math.round(cssHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    if (riveInstance && typeof riveInstance.resizeDrawingSurfaceToCanvas === "function") {
      riveInstance.resizeDrawingSurfaceToCanvas(dpr);
    }
  }

  if (typeof rive === "undefined") {
    showError("The animation runtime failed to load. Check your connection and try again.");
    return;
  }

  riveInstance = new rive.Rive({
    src: "assets/DontPickOnMe.riv",
    canvas: canvas,
    artboard: "PLAY",
    stateMachine: "State Machine 1",
    autoplay: true,
    autoBind: true,
    layout: new rive.Layout({
      fit: rive.Fit.Contain,
      alignment: rive.Alignment.Center,
    }),
    onLoad: function () {
      resize();
      hideStatus();
      // The file plays a Rive watermark for about 1.5–2s before the scene.
      window.setTimeout(function () {
        document.body.classList.add("is-ready");
      }, 1800);
    },
    onLoadError: function () {
      showError("Don't Pick On Me couldn't load. Try refreshing the page.");
    },
  });

  window.addEventListener("resize", resize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", resize);
  }
})();
