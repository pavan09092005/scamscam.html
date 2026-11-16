"use strict";

/* =====================================
   NIMMIII APOLOGY WEBSITE
===================================== */

const slides = [...document.querySelectorAll(".slide")];
const dots = [...document.querySelectorAll(".dots i")];
const stepLabel = document.getElementById("stepLabel");

const fill = document.getElementById("fill");
const progressBar = document.getElementById("progressBar");
const percent = document.getElementById("percent");
const hint = document.getElementById("hint");
const meterArt = document.getElementById("meterArt");
const heal = document.getElementById("heal");
const forgiven = document.getElementById("forgiven");
const secret = document.getElementById("secret");

const pins = [...document.querySelectorAll(".pin input")];
const pinForm = document.getElementById("pinForm");
const passwordMessage = document.getElementById("passwordMessage");
const unlocked = document.getElementById("unlocked");
const continueButton = document.getElementById("continue");

const password = "24102026";

let currentSlide = 0;
let forgiveness = 0;
let isUnlocked = false;
let isChecking = false;


/* -------------------------------------
   SLIDE NAVIGATION
------------------------------------- */

function showSlide(number) {
  if (number < 0 || number >= slides.length) return;

  currentSlide = number;

  slides.forEach((slide, index) => {
    const active = index === currentSlide;

    slide.classList.toggle("active", active);
    slide.setAttribute("aria-hidden", String(!active));
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });

  if (stepLabel) {
    stepLabel.textContent =
      `${String(currentSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  }

  if (currentSlide === 5 && !isUnlocked) {
    setTimeout(() => pins[0]?.focus(), 350);
  }

  const card = document.querySelector(".card");

  if (card) {
    card.scrollTop = 0;
  }
}

document.addEventListener("click", (event) => {
  const next = event.target.closest("[data-next]");
  const back = event.target.closest("[data-back]");

  if (next) {
    showSlide(Number(next.dataset.next));
  }

  if (back) {
    showSlide(Number(back.dataset.back));
  }
});


/* -------------------------------------
   FORGIVENESS METER
------------------------------------- */

const meterHints = {
  20: "A little love is reaching my heart ♡",
  40: "You're making my heart smile 🥹",
  60: "My heart is starting to heal 💗",
  80: "Almost there, my favourite person ♡",
  100: "My heart feels whole again 💖"
};

heal.addEventListener("click", () => {
  if (forgiveness >= 100) return;

  forgiveness = Math.min(forgiveness + 20, 100);

  fill.style.width = `${forgiveness}%`;
  percent.textContent = `${forgiveness}% FORGIVEN`;

  progressBar.setAttribute("aria-valuenow", forgiveness);
  hint.textContent = meterHints[forgiveness];

  if (forgiveness >= 40) {
    meterArt.src = "assets/nimmiii-bunny-heart.png";
    meterArt.alt = "A bunny holding a heart";
  }

  if (forgiveness === 100) {
    meterArt.src = "assets/nimmiii-hug-bunnies.png";
    meterArt.alt = "Two bunnies hugging happily";

    heal.disabled = true;
    heal.hidden = true;
    forgiven.hidden = false;
  }
});


/* -------------------------------------
   SECRET PAGE NAVIGATION
------------------------------------- */

secret.addEventListener("click", () => {
  showSlide(5);
});


/* -------------------------------------
   PASSWORD INPUT HELPERS
------------------------------------- */

function getEnteredPassword() {
  return pins.map((pin) => pin.value).join("");
}

function clearPasswordMessage() {
  passwordMessage.textContent = "";
  passwordMessage.classList.remove("error", "success");
}

function resetPins() {
  pins.forEach((pin) => {
    pin.value = "";
  });

  pins[0]?.focus();
}

function showPasswordError(message) {
  passwordMessage.textContent = message;
  passwordMessage.classList.remove("success");
  passwordMessage.classList.add("error");
}


/* -------------------------------------
   CHECK PASSWORD
------------------------------------- */

function checkPassword() {
  if (isChecking || isUnlocked) return;

  const entered = getEnteredPassword();

  if (entered.length !== 8) return;

  isChecking = true;

  if (entered === password) {
    isUnlocked = true;

    passwordMessage.textContent = "That's our little secret ♡";
    passwordMessage.classList.remove("error");
    passwordMessage.classList.add("success");

    pinForm.hidden = true;
    unlocked.hidden = false;

    celebrateUnlock();

  } else {
    showPasswordError("Oops! Try again, my love ♡");

    setTimeout(() => {
      resetPins();
      clearPasswordMessage();
      isChecking = false;
    }, 650);

    return;
  }

  isChecking = false;
}


/* -------------------------------------
   INPUT ONE DIGIT AT A TIME
------------------------------------- */

pins.forEach((pin, index) => {

  pin.addEventListener("input", () => {
    if (isUnlocked) return;

    const digits = pin.value.replace(/\D/g, "");

    pin.value = digits.slice(-1);

    clearPasswordMessage();

    if (pin.value && index < pins.length - 1) {
      pins[index + 1].focus();
    }

    checkPassword();
  });

  pin.addEventListener("keydown", (event) => {

    if (
      event.key === "Backspace" &&
      !pin.value &&
      index > 0
    ) {
      pins[index - 1].focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      pins[index - 1].focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < pins.length - 1
    ) {
      pins[index + 1].focus();
    }
  });

  pin.addEventListener("paste", (event) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 8);

    if (!pasted) return;

    pasted.split("").forEach((digit, i) => {
      if (pins[i]) pins[i].value = digit;
    });

    clearPasswordMessage();

    const nextEmpty = pins.find((input) => !input.value);

    if (nextEmpty) {
      nextEmpty.focus();
    } else {
      pins[7].focus();
      checkPassword();
    }
  });

});


/* -------------------------------------
   FORM SUBMISSION
------------------------------------- */

pinForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (isUnlocked) return;

  if (getEnteredPassword().length !== 8) {
    showPasswordError("Enter all eight digits first ♡");
    return;
  }

  checkPassword();
});


/* -------------------------------------
   UNLOCK CELEBRATION
------------------------------------- */

function celebrateUnlock() {

  const symbols = ["♥", "♡", "💗", "💕"];
  const app = document.querySelector(".app");

  for (let i = 0; i < 16; i++) {

    const heart = document.createElement("span");

    heart.textContent = symbols[i % symbols.length];
    heart.setAttribute("aria-hidden", "true");

    Object.assign(heart.style, {
      position: "absolute",
      left: `${8 + Math.random() * 84}%`,
      top: `${20 + Math.random() * 60}%`,
      zIndex: "10",
      pointerEvents: "none",
      fontSize: `${16 + Math.random() * 18}px`,
      color: i % 2 ? "#e94d88" : "#bd1c58",
      animation: "unlockHeart 1.8s ease-out forwards"
    });

    app.appendChild(heart);

    setTimeout(() => heart.remove(), 1900);
  }

}

    /* -------------------------------------
      CONTINUE TO LOVE STORY
    ------------------------------------- */

    continueButton.addEventListener("click", () => {
      if (!isUnlocked) return;

      continueButton.disabled = true;

      const message = document.getElementById("transitionMessage");

      message.hidden = false;

      continueButton.textContent = "Opening our love story... ❤️";

      setTimeout(() => {
        window.location.href = "love-story/index.html";
      }, 2200);
    });


/* -------------------------------------
   START
------------------------------------- */

showSlide(0);