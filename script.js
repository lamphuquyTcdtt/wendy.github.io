let currentSong = "";

function updateTimer() {
  const createdAt = new Date("2025-04-21T00:00:00");
  const now = new Date();
  const diff = Math.floor((now - createdAt) / 1000);
  const d = Math.floor(diff / 86400),
        h = Math.floor((diff % 86400) / 3600),
        m = Math.floor((diff % 3600) / 60),
        s = diff % 60;
  document.getElementById("timer").innerText = `${d} day ${h} hour ${m} minute ${s} second`;
}

function changeSong(url) {
  const audio = document.getElementById("bgMusic");
  if (url !== currentSong) {
    currentSong = url;
    audio.src = url;
    audio.play();
  }
}

function createSnowflakes() {
  const snow = document.querySelector(".snow");
  for (let i = 0; i < 100; i++) {
    const flake = document.createElement("div");
    flake.classList.add("snowflake");
    flake.innerHTML = ".";
    flake.style.left = Math.random() * 100 + "vw";
    flake.style.animationDuration = 2 + Math.random() * 3 + "s";
    flake.style.opacity = Math.random();
    flake.style.fontSize = 8 + Math.random() * 10 + "px";
    snow.appendChild(flake);
  }
}

let lastFrame = performance.now();
let frameCount = 0;

function updateFPS() {
  const now = performance.now();
  frameCount++;
  if (now - lastFrame >= 1000) {
    document.getElementById("fps").innerText = "FPS: " + frameCount;
    frameCount = 0;
    lastFrame = now;
  }
  requestAnimationFrame(updateFPS);
}

window.onload = () => {
  updateTimer();
  createSnowflakes();
  updateFPS();
  setInterval(updateTimer, 1000);
};