const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz4YvU2ZeOkbjTu4Olad4frRPgg7wBHAGQ0ql6QafxC9Xq0lWNVzBnAsZraDHbXJTH0og/exec";

const usernameInput = document.getElementById('username');
const startBtn = document.getElementById('startBtn');
const spinBtn = document.getElementById('spinBtn');
const spinInfo = document.getElementById('spinInfo');
const wheel = document.getElementById('wheel');
const resultMessage = document.getElementById('resultMessage');

let currentSpins = 0;

startBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  if (!username) {
    alert("Vui lòng nhập mã nhân sự!");
    return;
  }

  spinInfo.textContent = "Đang kiểm tra lượt quay...";
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getSpins&username=${encodeURIComponent(username)}`);
    const data = await res.json();
    console.log("Kết quả kiểm tra lượt:", data);

    if (data.success === true) {
      currentSpins = data.spins;
      spinInfo.textContent = currentSpins > 0
        ? `Bạn còn ${currentSpins} lượt quay.`
        : "Bạn đã hết lượt quay.";
      spinBtn.disabled = currentSpins <= 0;
    } else {
      spinInfo.textContent = "Không tìm thấy mã nhân sự hoặc lỗi server.";
      spinBtn.disabled = true;
    }
  } catch (err) {
    console.error("Lỗi khi kiểm tra lượt:", err);
    spinInfo.textContent = "Lỗi kết nối server.";
    spinBtn.disabled = true;
  }
});

spinBtn.addEventListener('click', async () => {
  if (currentSpins <= 0) return;

  spinBtn.disabled = true;
  resultMessage.textContent = "";

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

  try {
    const username = usernameInput.value.trim();
    const res = await fetch(`${SCRIPT_URL}?action=spin&username=${encodeURIComponent(username)}`);
    const data = await res.json();
    console.log("Kết quả quay:", data);

    if (data.success === true) {
      currentSpins = data.spins;
      spinInfo.textContent = currentSpins > 0
        ? `Bạn còn ${currentSpins} lượt quay.`
        : "Bạn đã hết lượt quay.";

      const prizeCode = data.prizeCode;
      const prizeName = data.prizeName;
      const index = prizes.findIndex(p => p.code === prizeCode);
      const slice = 360 / prizes.length;
      const prizeAngle = index * slice + slice / 2;
      const extraSpins = Math.floor(Math.random() * 3 + 5) * 360;
      const targetAngle = extraSpins + (360 - prizeAngle);

      // Reset trước khi quay
      wheel.style.transition = "none";
      wheel.style.transform = "rotate(0deg)";

      setTimeout(() => {
        wheel.style.transition = "transform 3s cubic-bezier(0.25, 1, 0.5, 1)";
        wheel.style.transform = `rotate(${targetAngle}deg)`;
      }, 50);

      setTimeout(() => {
        resultMessage.textContent = `Bạn trúng: ${prizeName}`;
        resultMessage.style.marginTop = "20px";
        resultMessage.style.fontWeight = "bold";
        resultMessage.style.fontSize = "20px";
        spinBtn.disabled = currentSpins <= 0;
      }, 3500);
    } else {
      resultMessage.textContent = "Có lỗi khi quay số.";
    }

  } catch (err) {
    console.error("Lỗi khi quay:", err);
    resultMessage.textContent = "Lỗi kết nối khi quay.";
  }
});
