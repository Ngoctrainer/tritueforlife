const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz_XgmmFsC3nnjQlstnqvdLN_zEYM3YSTQpfsZ4wcfa/dev";

const usernameInput = document.getElementById("username");
const startBtn = document.getElementById("startBtn");
const spinBtn = document.getElementById("spinBtn");
const spinInfo = document.getElementById("spinInfo");
const wheel = document.getElementById("wheel");
const resultMessage = document.getElementById("resultMessage");

let currentSpins = 0;

const prizes = [
  { code: "A+", label: "1M" },
  { code: "A", label: "500K" },
  { code: "B", label: "300K" },
  { code: "C", label: "200K" },
  { code: "D", label: "100K" },
  { code: "E", label: "50K" },
  { code: "F", label: "20K" },
  { code: "G", label: "10K" },
  { code: "MISS", label: "🍀" }
];

// Bấm kiểm tra lượt
startBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  if (!username) return alert("Vui lòng nhập mã nhân sự!");

  spinInfo.textContent = "Đang kiểm tra lượt quay...";
  spinBtn.disabled = true;

  try {
    const res = await fetch(`${SCRIPT_URL}?action=getSpins&username=${encodeURIComponent(username)}`);
    const data = await res.json();

    if (data.success) {
      currentSpins = data.spins;
      spinInfo.textContent = currentSpins > 0
        ? `Bạn còn ${currentSpins} lượt quay.`
        : "Bạn đã hết lượt quay.";
      spinBtn.disabled = currentSpins <= 0;
    } else {
      spinInfo.textContent = "Không tìm thấy mã nhân sự.";
    }
  } catch (err) {
    console.error(err);
    spinInfo.textContent = "Lỗi kết nối đến server.";
  }
});

// Bấm quay
spinBtn.addEventListener("click", async () => {
  if (currentSpins <= 0) return;

  spinBtn.disabled = true;
  resultMessage.textContent = "Đang quay...";

  const username = usernameInput.value.trim();

  try {
    const res = await fetch(`${SCRIPT_URL}?action=spin&username=${encodeURIComponent(username)}`);
    const data = await res.json();

    if (!data.success) {
      resultMessage.textContent = "Có lỗi xảy ra khi quay.";
      return;
    }

    currentSpins = data.spins;
    spinInfo.textContent = currentSpins > 0
      ? `Bạn còn ${currentSpins} lượt quay.`
      : "Bạn đã hết lượt quay.";

    const prizeCode = data.prizeCode;
    const prizeName = data.prizeName;
    const index = prizes.findIndex(p => p.code === prizeCode);
    const slice = 360 / prizes.length;
    const angleToPrize = index * slice + slice / 2;

    // Quay 5–7 vòng + dừng đúng miếng trúng
    const extraSpin = Math.floor(Math.random() * 3 + 5) * 360;
    const targetAngle = extraSpin + (360 - angleToPrize);

    // Reset trước quay
    wheel.style.transition = "none";
    wheel.style.transform = "rotate(0deg)";

    setTimeout(() => {
      wheel.style.transition = "transform 4s cubic-bezier(0.25, 1, 0.3, 1)";
      wheel.style.transform = `rotate(${targetAngle}deg)`;
    }, 50);

    setTimeout(() => {
      resultMessage.textContent = `Bạn trúng: ${prizeName}`;
      spinBtn.disabled = currentSpins <= 0;
    }, 4500);
  } catch (err) {
    console.error(err);
    resultMessage.textContent = "Lỗi kết nối khi quay.";
    spinBtn.disabled = false;
  }
});
