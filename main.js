const riveFile = "assets/DontPickOnMe.riv";
const root = document.documentElement;
const header = document.querySelector(".site-header");
const menu = document.getElementById("menu");
const menuButton = document.querySelector(".menu-button");
const hero = document.querySelector(".hero");
const heroStatus = document.querySelector(".hero-status");
const canvases = document.querySelectorAll(".rive-canvas");
const players = new Map();

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 0);
}

function toggleMenu(open) {
  root.classList.toggle("show-menu", open);
  menuButton.setAttribute("aria-expanded", open);
  menu.setAttribute("aria-hidden", !open);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuButton.addEventListener("click", () => toggleMenu(true));
menu.querySelector(".menu-close").addEventListener("click", () => toggleMenu(false));
document.addEventListener("keydown", (e) => e.key === "Escape" && toggleMenu(false));
window.addEventListener("resize", () => window.innerWidth > 932 && toggleMenu(false));

function showError(message) {
  heroStatus.textContent = message;
  heroStatus.classList.remove("hidden");
}

function hexToRgb(hex) {
  const n = parseInt(hex, 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}

function watchSplash(canvas) {
  const probe = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const started = performance.now();

  const timer = setInterval(() => {
    probe.clearRect(0, 0, 1, 1);
    probe.drawImage(canvas, 0, 0, 1, 1, 0, 0, 1, 1);
    const [, green] = probe.getImageData(0, 0, 1, 1).data;
    if (green > 100 || performance.now() - started > 8000) {
      hero.classList.add("ready");
      clearInterval(timer);
    }
  }, 100);
}

function makePlayer(canvas, file) {
  const { artboard, stateMachine, animation, body, cap } = canvas.dataset;

  const player = new rive.Rive({
    riveFile: file,
    canvas,
    artboard,
    stateMachine,
    animations: animation,
    autoplay: true,
    autoBind: true,
    onLoad() {
      player.resizeDrawingSurfaceToCanvas();
      if (body) player.viewModelInstance.color("bodyColor").rgb(...hexToRgb(body));
      if (cap) player.viewModelInstance.color("capColour").rgb(...hexToRgb(cap));
      if (artboard === "PLAY") {
        heroStatus.classList.add("hidden");
        watchSplash(canvas);
      }
    },
    onLoadError() {
      if (artboard === "PLAY") showError("Don't Pick On Me couldn't load. Try refreshing the page.");
    },
  });

  new ResizeObserver(() => player.resizeDrawingSurfaceToCanvas()).observe(canvas);
  return player;
}

function playOnly(player, name) {
  const playing = player.playingAnimationNames;
  if (playing.length) player.stop(playing);
  player.play(name);
}

function makeShroomieInteractive(canvas, player) {
  let hovering = false;
  let busy = false;

  const resting = () => (hovering ? "Shroomie HOVER" : "Shroomie IDLE");
  const sequence = ["Shroomie DEATH", "Shroomie REGROW"];

  canvas.classList.add("interactive");

  canvas.addEventListener("pointerenter", (e) => {
    if (e.pointerType !== "mouse") return;
    hovering = true;
    if (!busy) playOnly(player, resting());
  });

  canvas.addEventListener("pointerleave", () => {
    hovering = false;
    if (!busy) playOnly(player, resting());
  });

  canvas.addEventListener("click", () => {
    if (busy) return;
    busy = true;
    playOnly(player, sequence[0]);
  });

  player.on(rive.EventType.Stop, (e) => {
    const finished = e.data[0];
    if (finished === sequence[0]) {
      player.play(sequence[1]);
    } else if (finished === sequence[1]) {
      busy = false;
      playOnly(player, resting());
    }
  });
}

function setUp(file) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        let player = players.get(target);
        if (!player && isIntersecting) {
          player = makePlayer(target, file);
          players.set(target, player);
          if ("shroomie" in target.dataset) makeShroomieInteractive(target, player);
        } else if (player) {
          if (isIntersecting) player.play();
          else player.pause();
        }
      }
    },
    { rootMargin: "120px" }
  );
  canvases.forEach((canvas) => observer.observe(canvas));
}

if (typeof rive === "undefined") {
  showError("The animation runtime failed to load. Check your connection and try again.");
} else {
  rive.Rive.suppressDeprecationWarnings = ["animations-param", "names-array", "animation-names"];
  const file = new rive.RiveFile({
    src: riveFile,
    onLoad: () => setUp(file),
    onLoadError: () => showError("Don't Pick On Me couldn't load. Try refreshing the page."),
  });
  file.init();
}
