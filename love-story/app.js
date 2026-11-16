/* ==========================================
   SHERANYA'S BIRTHDAY WEBSITE
   Complete app.js
========================================== */

/* ==========================================
   CONFIGURATION AND ELEMENTS
========================================== */

const stageEl = document.getElementById("stage");

const sceneIntroEl = document.getElementById("scene-intro");
const sceneCardEl = document.getElementById("scene-card");
const sceneTreeEl = document.getElementById("scene-tree");

const bowRigEl = document.querySelector(".bow-rig");
const bowSvg = document.getElementById("bow");
const bowstringEl = document.getElementById("bowstring");
const arrowSvg = document.getElementById("arrow");
const arrowGroupEl = document.getElementById("arrow-group");
const heartTargetEl = document.getElementById("heart-target");

const wishLineEl = document.getElementById("wish-line");
const cardTitleEl = document.getElementById("card-title");
const cardSubtitleEl = document.getElementById("card-subtitle");
const tapHintEl = document.getElementById("tap-hint");
const titleUnderlineEl = document.getElementById("title-underline");
const underlinePathEl = titleUnderlineEl.querySelector("path");

const petalFieldEl = document.getElementById("petal-field");
const trunkPathEl = document.getElementById("trunk-path");

const branchEls = Array.from(
  document.querySelectorAll("#tree-branches .branch")
);

const signatureLineEl = document.getElementById("signature-line");
const canopyEl = document.getElementById("canopy");
const finaleEl = document.getElementById("finale");
const replayBtnEl = document.getElementById("replay-btn");

const bgmEl = document.getElementById("bgm");
const bgmToggleEl = document.getElementById("bgm-toggle");

/* New pages */

const sceneMemoryEl = document.getElementById("scene-memory");
const sceneCakeEl = document.getElementById("scene-cake");
const sceneCelebrationEl = document.getElementById("scene-celebration");
const sceneGiftEl = document.getElementById("scene-gift");
const sceneLetterEl = document.getElementById("scene-letter");

const memoryVideo = document.getElementById("memory-video");
const memoryNextBtn = document.getElementById("memory-next-btn");

const celebrationVideo =
  document.getElementById("celebration-video");

const giftNextBtn = document.getElementById("gift-next-btn");

const treeNextBtn = document.getElementById("tree-next-btn");

const candlesContainer = document.getElementById("candles");
const candleCountText = document.getElementById("candle-count");
const cakeMessage = document.getElementById("cake-message");

const giftBox = document.getElementById("gift-box");
const giftCount = document.getElementById("gift-count");
const letterOpenBtn = document.getElementById("letter-open-btn");

const letterEnvelope = document.getElementById("letter-envelope");
const loveLetter = document.getElementById("love-letter");


/* ==========================================
   SCENE MANAGEMENT - FIXED
========================================== */

const allScenes = [
  sceneIntroEl,
  sceneCardEl,
  sceneTreeEl,
  sceneMemoryEl,
  sceneCakeEl,
  sceneCelebrationEl,
  sceneGiftEl,
  sceneLetterEl
];

const SceneManager = {
  current: "intro",

  goTo(name) {

    // FIX: Handle the heart burst separately.
    if (name === "burst") {
      this.current = "burst";
      startBurstTransition();
      return;
    }

    const sceneMap = {
      intro: sceneIntroEl,
      card: sceneCardEl,
      tree: sceneTreeEl,
      memory: sceneMemoryEl,
      cake: sceneCakeEl,
      celebration: sceneCelebrationEl,
      gift: sceneGiftEl,
      letter: sceneLetterEl
    };

    const destination = sceneMap[name];

    if (!destination) {
      console.error("Unknown scene:", name);
      return;
    }

    this.current = name;

    if (name !== "memory") {
      memoryVideo.pause();
    }

    if (name !== "celebration") {
      celebrationVideo.pause();
    }

    allScenes.forEach((scene) => {
      scene.classList.remove("is-active");
    });

    destination.classList.add("is-active");

    if (name === "card") {
      enterCardScene();
    }

    if (name === "tree") {
      enterTreeScene();
    }

    if (name === "memory") {
      startMemoryPage();
    }

    if (name === "cake") {
      createCandles();
    }

    if (name === "celebration") {
      startCelebration();
    }

    if (name === "gift") {
      resetGift();
    }

    if (name === "letter") {
      resetLetter();
    }
  }
};

/* ==========================================
   THEME AND TEXT
========================================== */

function kebabCase(name) {
  return name.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
}

function applyConfigTheme() {
  const rootStyle = document.documentElement.style;

  Object.entries(CONFIG).forEach(([key, value]) => {
    if (typeof value === "string" && value.startsWith("#")) {
      rootStyle.setProperty(`--${kebabCase(key)}`, value);
    }
  });
}

function applySceneIntroText() {
  document.getElementById("intro-line").textContent =
    CONFIG.introLine;

  document.getElementById("pull-hint").textContent =
    CONFIG.pullInstruction;
}

function applySceneCardText() {
  wishLineEl.textContent = CONFIG.wishLine;
  cardTitleEl.textContent = CONFIG.cardTitle;

  document.getElementById("card-name").textContent =
    CONFIG.cardNameLine;

  cardSubtitleEl.textContent = CONFIG.cardSubtitle;

  document.getElementById("card-for").textContent =
    `for ${CONFIG.recipientName}`;
}

function applySceneTreeText() {
  signatureLineEl.textContent = CONFIG.signatureLine;

  document.getElementById("finale-title").textContent =
    CONFIG.finaleTitle;

  document.getElementById("finale-subtitle").textContent =
    CONFIG.finaleSubtitle;

  document.getElementById("finale-signoff").textContent =
    `— ${CONFIG.senderName}`;
}

/* ==========================================
   BACKGROUND MUSIC
========================================== */

const BGM_SOURCES = [
  "bgm.mp3",
  "assets/bgm.mp3"
];

let bgmSourceIndex = 0;
let bgmUnlocked = false;
let bgmWantPlaying = false;

function tryNextBgmSource() {
  bgmSourceIndex++;

  if (bgmSourceIndex >= BGM_SOURCES.length) return;

  bgmEl.src = BGM_SOURCES[bgmSourceIndex];
  bgmEl.load();
}

function initBgm() {
  const volume =
    typeof CONFIG.musicVolume === "number"
      ? CONFIG.musicVolume
      : 0.35;

  bgmEl.volume = Math.min(Math.max(volume, 0), 1);
  bgmEl.addEventListener("error", tryNextBgmSource);
}

function unlockBgm() {
  if (bgmUnlocked) return;

  bgmUnlocked = true;

  bgmEl.play()
    .then(() => {
      if (!bgmWantPlaying) {
        bgmEl.pause();
        bgmEl.currentTime = 0;
      }
    })
    .catch(() => {
      console.log("Music will start after interaction.");
    });
}

function startBgm() {
  bgmWantPlaying = true;

  bgmEl.play().catch((error) => {
    console.warn("Music playback blocked:", error);
  });
}

function updateBgmIcon() {
  bgmToggleEl.classList.toggle("is-muted", bgmEl.muted);

  bgmToggleEl.setAttribute(
    "aria-label",
    bgmEl.muted ? "unmute music" : "mute music"
  );
}

bgmToggleEl.addEventListener("click", () => {
  bgmEl.muted = !bgmEl.muted;

  if (!bgmEl.muted && bgmEl.paused) {
    bgmWantPlaying = true;

    bgmEl.play().catch((error) => {
      console.warn(error);
    });
  }

  updateBgmIcon();
});

/* ==========================================
   ARROW ANIMATION
========================================== */

const VB_W = 300;
const VB_H = 240;

const VB_CX = VB_W / 2;
const VB_CY = VB_H / 2;

const NOCK_REST = { x: 94, y: 119 };
const STRING_TOP = { x: 96, y: 14 };
const STRING_BOTTOM = { x: 92, y: 224 };

const ARROW_TIP = { x: 268, y: 119 };

const MAX_PULL_CSS_PX = 180;
const MIN_SHOT_CSS_PX = 10;
const FLIGHT_MS = 320;

let mode = "idle";
let aim = null;
let pull = 0;
let targetPull = 0;

let aimRafId = null;
let springRafId = null;
let flightRafId = null;

let rigAngleCache = null;

function getRigAngle() {
  if (rigAngleCache !== null) return rigAngleCache;

  const matrix = getComputedStyle(bowRigEl).transform;

  if (matrix && matrix !== "none") {
    const parts = matrix.match(/matrix\(([^)]+)\)/);

    if (parts) {
      const [a, b] = parts[1].split(",").map(parseFloat);

      rigAngleCache = Math.atan2(b, a);
      return rigAngleCache;
    }
  }

  rigAngleCache = 0;
  return rigAngleCache;
}

function getRigGeometry() {
  const stageRect = stageEl.getBoundingClientRect();
  const angle = getRigAngle();

  return {
    scale: bowRigEl.offsetWidth / VB_W,

    pivot: {
      x: stageRect.left +
        bowRigEl.offsetLeft +
        bowRigEl.offsetWidth / 2,

      y: stageRect.top +
        bowRigEl.offsetTop +
        bowRigEl.offsetHeight / 2
    },

    cos: Math.cos(angle),
    sin: Math.sin(angle)
  };
}

function screenToLocal(point, geom) {
  const g = geom || getRigGeometry();

  const dx = point.x - g.pivot.x;
  const dy = point.y - g.pivot.y;

  return {
    x: (dx * g.cos + dy * g.sin) / g.scale + VB_CX,
    y: (-dx * g.sin + dy * g.cos) / g.scale + VB_CY
  };
}

function renderBowState(pullUnits) {
  arrowGroupEl.setAttribute(
    "transform",
    `translate(${-pullUnits} 0)`
  );

  const nockX = NOCK_REST.x - pullUnits;
  const bend = Math.min(pullUnits / 6, 10);

  bowstringEl.setAttribute(
    "d",
    `M${STRING_TOP.x} ${STRING_TOP.y} Q${nockX - bend} ${NOCK_REST.y} ${STRING_BOTTOM.x} ${STRING_BOTTOM.y}`
  );

  bowSvg.style.transform =
    `scale(${1 + 0.03 * Math.min(
      pullUnits /
      (MAX_PULL_CSS_PX / getRigGeometry().scale),
      1
    )})`;
}

function startAimLoop() {
  cancelAnimationFrame(aimRafId);

  const tick = () => {
    pull += (targetPull - pull) * 0.45;

    if (Math.abs(targetPull - pull) < 0.05) {
      pull = targetPull;
    }

    renderBowState(pull);
    aimRafId = requestAnimationFrame(tick);
  };

  aimRafId = requestAnimationFrame(tick);
}

function stopAimLoop() {
  cancelAnimationFrame(aimRafId);
  aimRafId = null;
}

function onPointerDown(event) {
  unlockBgm();

  if (mode !== "idle") return;

  event.preventDefault();

  arrowSvg.setPointerCapture(event.pointerId);

  mode = "aiming";

  aim = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY
  };

  targetPull = 0;
  pull = 0;

  arrowSvg.classList.add("is-dragging");

  startAimLoop();
}

function onPointerMove(event) {
  if (
    mode !== "aiming" ||
    !aim ||
    event.pointerId !== aim.pointerId
  ) return;

  event.preventDefault();

  const dx = event.clientX - aim.startX;
  const dy = event.clientY - aim.startY;

  const geometry = getRigGeometry();

  const localDx =
    (dx * geometry.cos + dy * geometry.sin) /
    geometry.scale;

  const pulledPx = Math.max(0, -localDx);

  targetPull =
    Math.min(pulledPx, MAX_PULL_CSS_PX) /
    geometry.scale;
}

function onPointerUp(event) {
  if (
    mode !== "aiming" ||
    !aim ||
    event.pointerId !== aim.pointerId
  ) return;

  stopAimLoop();

  arrowSvg.classList.remove("is-dragging");
  aim = null;

  const thresholdUnits =
    MIN_SHOT_CSS_PX / getRigGeometry().scale;

  if (pull < thresholdUnits) {
    mode = "settling";

    runStringSpring(380, 16, () => {
      mode = "idle";
    });
  } else {
    shootArrow();
  }
}

function runStringSpring(stiffness, damping, onDone) {
  cancelAnimationFrame(springRafId);

  let velocity = 0;
  let last = performance.now();

  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.032);

    last = now;

    const acceleration =
      -stiffness * pull - damping * velocity;

    velocity += acceleration * dt;
    pull += velocity * dt;

    renderBowState(pull);

    if (
      Math.abs(pull) < 0.4 &&
      Math.abs(velocity) < 8
    ) {
      pull = 0;
      velocity = 0;

      renderBowState(0);

      springRafId = null;

      if (onDone) onDone();

      return;
    }

    springRafId = requestAnimationFrame(tick);
  };

  springRafId = requestAnimationFrame(tick);
}

function shootArrow() {
  mode = "shooting";

  const fromPull = pull;

  runStringSpring(1000, 34);

  const heartRect = heartTargetEl.getBoundingClientRect();

  const heartCenter = screenToLocal({
    x: heartRect.left + heartRect.width / 2,
    y: heartRect.top + heartRect.height / 2
  });

  const destination = {
    x: heartCenter.x - ARROW_TIP.x,
    y: heartCenter.y - ARROW_TIP.y
  };

  const startPoint = {
    x: -fromPull,
    y: 0
  };

  const start = performance.now();

  cancelAnimationFrame(flightRafId);

  const fly = (now) => {
    const t = Math.min((now - start) / FLIGHT_MS, 1);
    const ease = t * t * t;

    const x =
      startPoint.x +
      (destination.x - startPoint.x) * ease;

    const y =
      startPoint.y +
      (destination.y - startPoint.y) * ease;

    arrowGroupEl.setAttribute(
      "transform",
      `translate(${x} ${y})`
    );

    if (t < 1) {
      flightRafId = requestAnimationFrame(fly);
    } else {
      flightRafId = null;

      startBgm();

      SceneManager.goTo("burst");
    }
  };

  flightRafId = requestAnimationFrame(fly);
}

/* ==========================================
   HEART BURST
========================================== */

function startBurstTransition() {
  mode = "transitioning";

  const heartRect = heartTargetEl.getBoundingClientRect();
  const stageRect = stageEl.getBoundingClientRect();

  const centerX =
    heartRect.left + heartRect.width / 2 - stageRect.left;

  const centerY =
    heartRect.top + heartRect.height / 2 - stageRect.top;

  const initialDiameter =
    Math.max(heartRect.width, heartRect.height);

  const circle = document.createElement("div");

  circle.id = "burst-circle";

  circle.style.width = `${initialDiameter}px`;
  circle.style.height = `${initialDiameter}px`;

  circle.style.left =
    `${centerX - initialDiameter / 2}px`;

  circle.style.top =
    `${centerY - initialDiameter / 2}px`;

  stageEl.appendChild(circle);

  const POP_MS = 100;
  const EXPAND_MS = 500;

  const popStart = performance.now();

  const popTick = (now) => {
    const t = Math.min((now - popStart) / POP_MS, 1);

    heartTargetEl.style.transform =
      `translateX(-50%) scale(${1 + 0.15 * t})`;

    heartTargetEl.style.opacity = String(1 - t);
    circle.style.opacity = String(t);

    if (t < 1) {
      requestAnimationFrame(popTick);
      return;
    }

    heartTargetEl.style.visibility = "hidden";

    const cornerDistance = Math.hypot(
      Math.max(centerX, stageRect.width - centerX),
      Math.max(centerY, stageRect.height - centerY)
    );

    const targetScale =
      (2.1 * cornerDistance) / initialDiameter;

    const expandStart = performance.now();

    const expandTick = (now2) => {
      const t2 = Math.min(
        (now2 - expandStart) / EXPAND_MS,
        1
      );

      const eased = t2 * t2 * t2;

      circle.style.transform =
        `scale(${1 + (targetScale - 1) * eased})`;

      if (t2 < 1) {
        requestAnimationFrame(expandTick);
        return;
      }

      sceneIntroEl.classList.remove("is-active");
      sceneCardEl.classList.add("is-active");

      circle.remove();

      heartTargetEl.style.transform = "";
      heartTargetEl.style.opacity = "";
      heartTargetEl.style.visibility = "";

      SceneManager.goTo("card");
    };

    requestAnimationFrame(expandTick);
  };

  requestAnimationFrame(popTick);
}

/* ==========================================
   CARD PAGE
========================================== */

let cardTimers = [];
let cardTapHandler = null;

const CARD_BAR_DELAY_MS = 150;
const CARD_TEXT_START_MS = 650;
const CARD_STAGGER_MS = 150;
const CARD_ITEM_MS = 600;

function cardDelay(callback, ms) {
  cardTimers.push(setTimeout(callback, ms));
}

function enterCardScene() {
  cardTimers.forEach(clearTimeout);
  cardTimers = [];

  if (cardTapHandler) {
    sceneCardEl.removeEventListener(
      "pointerdown",
      cardTapHandler
    );

    cardTapHandler = null;
  }

  sceneCardEl.classList.remove("bars-open");

  document
    .querySelectorAll("#scene-card .reveal-item")
    .forEach((element) => {
      element.classList.remove("is-in");
    });

  tapHintEl.classList.remove("is-in");

  const length = underlinePathEl.getTotalLength();

  underlinePathEl.style.transition = "none";
  underlinePathEl.style.strokeDasharray = `${length}`;
  underlinePathEl.style.strokeDashoffset = `${length}`;

  void sceneCardEl.offsetWidth;

  cardDelay(() => {
    sceneCardEl.classList.add("bars-open");
  }, CARD_BAR_DELAY_MS);

  const items = [
    wishLineEl,
    cardTitleEl,
    document.getElementById("card-name"),
    titleUnderlineEl,
    cardSubtitleEl,
    document.getElementById("card-for")
  ];

  items.forEach((element, index) => {
    const at =
      CARD_TEXT_START_MS +
      index * CARD_STAGGER_MS;

    cardDelay(() => {
      element.classList.add("is-in");

      if (element === titleUnderlineEl) {
        underlinePathEl.style.transition =
          "stroke-dashoffset 500ms ease-out";

        underlinePathEl.style.strokeDashoffset = "0";
      }
    }, at);
  });

  const textDoneMs =
    CARD_TEXT_START_MS +
    (items.length - 1) * CARD_STAGGER_MS +
    CARD_ITEM_MS;

  if (CONFIG.autoAdvanceCard) {
    cardDelay(() => {
      SceneManager.goTo("tree");
    }, textDoneMs + CONFIG.cardHoldMs);
  } else {
    cardDelay(() => {
      tapHintEl.classList.add("is-in");
    }, textDoneMs + 200);

    cardTapHandler = () => {
      SceneManager.goTo("tree");
    };

    cardDelay(() => {
      sceneCardEl.addEventListener(
        "pointerdown",
        cardTapHandler
      );
    }, textDoneMs);
  }
}

/* ==========================================
   TREE PAGE
========================================== */

const TREE_START_DELAY_MS = 250;
const TREE_TRUNK_MS = 1600;
const TREE_BRANCH_MS = 1000;
const TREE_BRANCH_STAGGER_MS = 100;

const PETAL_COUNT = 26;
const BLOSSOM_COUNT = 650;
const BRANCH_LEAF_SHARE = 0.18;

const BLOOM_SPREAD_MS = 550;
const BLOOM_JITTER_MS = 400;
const BLOOM_ITEM_MS = 450;

let treeTimers = [];

const HEART_MINI_PATH =
  "M12 21 C6 15 2 11 2 7.5 C2 4.5 4.5 2.5 7 2.5 C9 2.5 11 4 12 6 " +
  "C13 4 15 2.5 17 2.5 C19.5 2.5 22 4.5 22 7.5 C22 11 18 15 12 21 Z";

const BLOSSOM_COLORS = Array.isArray(CONFIG.leafColors)
  ? CONFIG.leafColors
  : ["#ff6f91", "#e0245e", "#e0b34d"];

function treeDelay(callback, ms) {
  treeTimers.push(setTimeout(callback, ms));
}

function spawnPetals() {
  petalFieldEl.innerHTML = "";

  for (let i = 0; i < PETAL_COUNT; i++) {
    const petal = document.createElement("span");

    petal.className = "petal";

    const size = 10 + Math.random() * 10;

    const colors = [
      "var(--heart-pink)",
      "var(--heart-deep)",
      "#ffc7d6"
    ];

    petal.style.left = `${4 + Math.random() * 92}%`;
    petal.style.top = `${4 + Math.random() * 82}%`;

    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;

    petal.style.color = colors[i % colors.length];

    petal.style.opacity =
      String(0.2 + Math.random() * 0.25);

    petal.style.animation =
      `petal-drift ${(6 + Math.random() * 4).toFixed(2)}s ease-in-out ${(-Math.random() * 8).toFixed(2)}s infinite alternate`;

    petal.innerHTML =
      '<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="currentColor" d="M12 21 C6 15 2 11 2 7.5 C2 4.5 4.5 2.5 7 2.5 C9 2.5 11 4 12 6 C13 4 15 2.5 17 2.5 C19.5 2.5 22 4.5 22 7.5 C22 11 18 15 12 21 Z"/></svg>';

    petalFieldEl.appendChild(petal);
  }
}

function animateStroke(path, duration) {
  const length = path.getTotalLength();

  path.style.strokeDasharray = `${length}`;
  path.style.strokeDashoffset = `${length}`;

  path.getBoundingClientRect();

  path.style.transition =
    `stroke-dashoffset ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`;

  path.style.strokeDashoffset = "0";
}

function heartOutline(t) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3),

    y: -(
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
    )
  };
}

function buildCanopy() {
  canopyEl.innerHTML = "";

  const SCALE = 8.8;
  const CENTER_X = 200;
  const BOTTOM_Y = 218;
  const CENTROID_Y = 2.5;
  const JITTER = 5;

  const TRUNK_TOP = { x: 196, y: 235 };

  const points = [];

  const branchLeafCount =
    Math.round(BLOSSOM_COUNT * BRANCH_LEAF_SHARE);

  const perBranch =
    Math.max(1, Math.floor(
      branchLeafCount / branchEls.length
    ));

  branchEls.forEach((branch) => {
    const length = branch.getTotalLength();

    for (let k = 0; k < perBranch; k++) {
      const point = branch.getPointAtLength(
        Math.random() * length
      );

      points.push({
        x: point.x +
          (Math.random() * 2 - 1) * (JITTER + 4),

        y: point.y +
          (Math.random() * 2 - 1) * (JITTER + 4)
      });
    }
  });

  while (points.length < BLOSSOM_COUNT) {
    const outline = heartOutline(
      Math.random() * Math.PI * 2
    );

    const u = Math.sqrt(Math.random());

    const px = outline.x * u;

    const py =
      CENTROID_Y +
      (outline.y - CENTROID_Y) * u;

    points.push({
      x: CENTER_X +
        px * SCALE +
        (Math.random() * 2 - 1) * JITTER,

      y: BOTTOM_Y -
        (17 - py) * SCALE +
        (Math.random() * 2 - 1) * JITTER
    });
  }

  let maxDistance = 1;

  points.forEach((point) => {
    point.dist = Math.hypot(
      point.x - TRUNK_TOP.x,
      point.y - TRUNK_TOP.y
    );

    if (point.dist > maxDistance) {
      maxDistance = point.dist;
    }
  });

  const svgNS = "http://www.w3.org/2000/svg";

  points.forEach((point) => {
    const outer = document.createElementNS(svgNS, "g");

    outer.setAttribute(
      "transform",
      `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`
    );

    const inner = document.createElementNS(svgNS, "g");

    inner.setAttribute("class", "blossom");

    inner.dataset.distNorm =
      (point.dist / maxDistance).toFixed(3);

    const color =
      BLOSSOM_COLORS[
        Math.floor(Math.random() * BLOSSOM_COLORS.length)
      ];

    if (Math.random() < 0.6) {
      const size = 9 + Math.random() * 8;

      const shape = document.createElementNS(svgNS, "path");

      shape.setAttribute("d", HEART_MINI_PATH);
      shape.setAttribute("fill", color);

      shape.setAttribute(
        "transform",
        `scale(${(size / 24).toFixed(3)}) translate(-12 -12)`
      );

      inner.appendChild(shape);
    } else {
      const dot = document.createElementNS(svgNS, "circle");

      dot.setAttribute(
        "r",
        (3.5 + Math.random() * 3).toFixed(2)
      );

      dot.setAttribute("fill", color);
      dot.setAttribute("opacity", "0.9");

      inner.appendChild(dot);
    }

    outer.appendChild(inner);
    canopyEl.appendChild(outer);
  });
}

function bloomCanopy(onDone) {
  const blossoms = Array.from(
    canopyEl.querySelectorAll(".blossom")
  );

  let latestEnd = 0;

  blossoms.forEach((element) => {
    const delay =
      parseFloat(element.dataset.distNorm) *
        BLOOM_SPREAD_MS +
      Math.random() * BLOOM_JITTER_MS;

    latestEnd = Math.max(
      latestEnd,
      delay + BLOOM_ITEM_MS
    );

    treeDelay(() => {
      element.style.transition =
        "opacity 450ms ease-out, transform 450ms ease-out";

      element.style.opacity = "1";

      element.style.transform =
        `scale(1) rotate(${(
          (Math.random() * 2 - 1) * 20
        ).toFixed(1)}deg)`;
    }, delay);
  });

  treeDelay(() => {
    if (onDone) onDone();
  }, latestEnd + 300);
}

function enterTreeScene() {
  cardTimers.forEach(clearTimeout);
  cardTimers = [];

  if (cardTapHandler) {
    sceneCardEl.removeEventListener(
      "pointerdown",
      cardTapHandler
    );

    cardTapHandler = null;
  }

  treeTimers.forEach(clearTimeout);
  treeTimers = [];

  sceneCardEl.classList.remove("is-active");

  signatureLineEl.classList.remove("is-in");
  finaleEl.classList.remove("is-in");
  replayBtnEl.classList.remove("is-in");
  treeNextBtn.classList.remove("is-in");

  canopyEl.innerHTML = "";

  [trunkPathEl, ...branchEls].forEach((path) => {
    const length = path.getTotalLength();

    path.style.transition = "none";
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
  });

  void sceneTreeEl.offsetWidth;

  treeDelay(() => {
    animateStroke(trunkPathEl, TREE_TRUNK_MS);
  }, TREE_START_DELAY_MS);

  branchEls.forEach((branch, index) => {
    treeDelay(() => {
      animateStroke(branch, TREE_BRANCH_MS);
    },
    TREE_START_DELAY_MS +
      TREE_TRUNK_MS +
      index * TREE_BRANCH_STAGGER_MS);
  });

  const lastBranchEnd =
    TREE_START_DELAY_MS +
    TREE_TRUNK_MS +
    (branchEls.length - 1) *
      TREE_BRANCH_STAGGER_MS +
    TREE_BRANCH_MS;

  treeDelay(() => {
    signatureLineEl.classList.add("is-in");
  }, lastBranchEnd + 150);

  buildCanopy();

  treeDelay(() => {
    bloomCanopy(() => {
      finaleEl.classList.add("is-in");

      treeNextBtn.classList.add("is-in");

      treeDelay(() => {
        replayBtnEl.classList.add("is-in");
      }, 700);
    });
  }, lastBranchEnd);
}

/* ==========================================
   MEMORY VIDEO PAGE
========================================== */

function startMemoryPage() {
  memoryNextBtn.hidden = true;

  memoryVideo.currentTime = 0;

  memoryVideo.play().catch(() => {
    console.log("Press play to start the memory video.");
  });
}

memoryVideo.addEventListener("ended", () => {
  memoryNextBtn.hidden = false;
});

memoryVideo.addEventListener("error", () => {
  console.error(
    "Memory video could not load. Check memory.mp4."
  );

  memoryNextBtn.hidden = false;
});

treeNextBtn.addEventListener("click", () => {
  SceneManager.goTo("memory");
});

memoryNextBtn.addEventListener("click", () => {
  SceneManager.goTo("cake");
});

/* ==========================================
   CAKE AND 16 CANDLES
========================================== */

const TOTAL_CANDLES = 16;

let blownCandles = 0;
let celebrationStarted = false;

function createCandles() {
  candlesContainer.innerHTML = "";

  blownCandles = 0;
  celebrationStarted = false;

  candleCountText.textContent =
    `${TOTAL_CANDLES} candles remaining`;

  cakeMessage.textContent =
    "Make your beautiful wish ♥";

  for (let i = 0; i < TOTAL_CANDLES; i++) {
    const candle = document.createElement("button");

    candle.type = "button";
    candle.className = "candle";

    candle.setAttribute(
      "aria-label",
      `Blow out candle ${i + 1}`
    );

    const flame = document.createElement("span");

    flame.className = "candle-flame";

    candle.appendChild(flame);

    candle.addEventListener("click", () => {
      if (
        candle.classList.contains("blown") ||
        celebrationStarted
      ) return;

      candle.classList.add("blown");
      candle.disabled = true;

      blownCandles++;

      const remaining =
        TOTAL_CANDLES - blownCandles;

      candleCountText.textContent =
        remaining === 0
          ? "All candles are out! ♥"
          : `${remaining} candles remaining`;

      if (remaining === 0) {
        cakeMessage.textContent =
          "Your wish is on its way! ✨";

        celebrationStarted = true;

        setTimeout(() => {
          SceneManager.goTo("celebration");
        }, 900);
      }
    });

    candlesContainer.appendChild(candle);
  }
}

/* ==========================================
   CELEBRATION VIDEO PAGE
========================================== */

function startCelebration() {
  giftNextBtn.hidden = true;

  celebrationVideo.currentTime = 0;

  celebrationVideo.play().catch(() => {
    console.log(
      "Press play to start the celebration video."
    );
  });
}

celebrationVideo.addEventListener("ended", () => {
  giftNextBtn.hidden = false;
});

celebrationVideo.addEventListener("error", () => {
  console.error(
    "Celebration video could not load. Check celebration.mp4."
  );

  giftNextBtn.hidden = false;
});

giftNextBtn.addEventListener("click", () => {
  SceneManager.goTo("gift");
});

/* ==========================================
   GIFT BOX - THREE TAPS
========================================== */

let giftTaps = 0;

function resetGift() {
  giftTaps = 0;

  giftBox.classList.remove("opened");
  giftBox.style.transform = "";

  giftCount.textContent = "3 little taps to go ♥";

  letterOpenBtn.hidden = true;
}

giftBox.addEventListener("click", () => {
  if (giftTaps >= 3) return;

  giftTaps++;

  const remaining = 3 - giftTaps;

  giftCount.textContent =
    remaining > 0
      ? `${remaining} little taps to go ♥`
      : "Your surprise is ready! 💌";

  giftBox.style.transform =
    `scale(${1 + giftTaps * 0.06})`;

  if (giftTaps === 3) {
    giftBox.classList.add("opened");

    setTimeout(() => {
      letterOpenBtn.hidden = false;
    }, 900);
  }
});

letterOpenBtn.addEventListener("click", () => {
  SceneManager.goTo("letter");
});

/* ==========================================
   LOVE LETTER
========================================== */

function resetLetter() {
  letterEnvelope.hidden = false;
  loveLetter.hidden = true;
}

letterEnvelope.addEventListener("click", () => {
  letterEnvelope.hidden = true;
  loveLetter.hidden = false;

  loveLetter.animate(
    [
      {
        opacity: 0,
        transform: "translateY(25px) scale(0.95)"
      },
      {
        opacity: 1,
        transform: "translateY(0) scale(1)"
      }
    ],
    {
      duration: 900,
      easing: "ease-out",
      fill: "both"
    }
  );
});

/* ==========================================
   REPLAY
========================================== */

replayBtnEl.addEventListener("click", () => {
  window.location.reload();
});

/* ==========================================
   ARROW EVENTS
========================================== */

arrowSvg.addEventListener("pointerdown", onPointerDown);
arrowSvg.addEventListener("pointermove", onPointerMove);
arrowSvg.addEventListener("pointerup", onPointerUp);
arrowSvg.addEventListener("pointercancel", onPointerUp);

bowRigEl.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

/* ==========================================
   INITIALIZATION
========================================== */

applyConfigTheme();
applySceneIntroText();
applySceneCardText();
applySceneTreeText();

spawnPetals();
initBgm();
updateBgmIcon();

console.log("Sheranya's birthday website is ready! ❤️");