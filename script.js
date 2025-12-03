let currentSong = null;

// Đếm thời gian từ ngày tạo
function updateTimer() {
  const createdAt = new Date("2025-04-21T00:00:00");
  const now = new Date();
  const diff = Math.floor((now - createdAt) / 1000);
  const d = Math.floor(diff / 86400);
  const h = Math.floor((diff % 86400) / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  const pad = n => String(n).padStart(2, "0");
  document.getElementById("timer").innerText =
    `${d} day ${pad(h)} hour ${pad(m)} minute ${pad(s)} second`;
}

// Đổi nhạc nếu khác bài hiện tại
function changeSong(url) {
  if (url !== currentSong) {
    currentSong = url;
    const audio = document.getElementById("bgMusic");
    audio.src = url;
    audio.play();
  }
}

// Tạo hiệu ứng tuyết rơi nhẹ nhàng
function createSnowflakes(count = 50) {
  const snowContainer = document.querySelector(".snow");
  for (let i = 0; i < count; i++) {
    const flake = document.createElement("div");
    flake.className = "snowflake";
    flake.textContent = ".";
    Object.assign(flake.style, {
      left: `${Math.random() * 100}vw`,
      animationDuration: `${(2 + Math.random() * 3).toFixed(2)}s`,
      opacity: Math.random(),
      fontSize: `${8 + Math.random() * 10}px`,
      color: "white",
    });
    snowContainer.appendChild(flake);
  }
}

// Hiển thị FPS thật mượt
function monitorFPS() {
  let last = performance.now(), frames = 0;

  function loop() {
    const now = performance.now();
    frames++;
    if (now - last >= 1000) {
      document.getElementById("fps").innerText = `FPS: ${frames}`;
      frames = 0;
      last = now;
    }
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

// Bắt đầu khi web load
window.addEventListener("load", () => {
  updateTimer();
  createSnowflakes();
  monitorFPS();
  setInterval(updateTimer, 1000); // cần giữ để update mỗi giây
});