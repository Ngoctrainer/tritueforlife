const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbysFt9dwjxmia_yZFvdIHPQod273ZEyxC5Rbc2F3h17jCDvw0Umr9EgBtblNRvfX5ueTA/exec";

const usernameInput = document.getElementById('username');
const startBtn = document.getElementById('startBtn');
const spinBtn = document.getElementById('spinBtn');
const spinInfo = document.getElementById('spinInfo');
const wheel = document.getElementById('wheel');
const resultMessage = document.getElementById('resultMessage');

let currentSpins = 0;

const prizes = ["10.000đ", "1.000.000đ", "500.000đ", "300.000đ", "200.000đ", "100.000đ", "50.000đ", "20.000đ"];
const prizeCodes = ["G", "A+", "A", "B", "C", "D", "E", "F"];

startBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  if (!username) {
    alert("Vui lòng nhập MNS");
    return;
  }

  spinInfo.textContent = "Đang kiểm tra...";
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getSpins&username=${encodeURIComponent(username)}`);
    const data = await res.json();
    if (data.success) {
      currentSpins = data.spins;
      spinInfo.textContent = `Bạn còn ${currentSpins} lượt quay.`;
      spinBtn.disabled = currentSpins <= 0;
    } else {
      spinInfo.textContent = "Không tìm thấy MNS.";
      spinBtn.disabled = true;
    }
  } catch {
    spinInfo.textContent = "Lỗi kết nối.";
  }
});

spinBtn.addEventListener('click', async () => {
  if (currentSpins <= 0) return;

  spinBtn.disabled = true;
  resultMessage.textContent = "";

  const r = Math.random() * 100;
  let prizeCode = "G";
  if (r < 0.5) prizeCode = "A+";
  else if (r < 2.5) prizeCode = "A";
  else if (r < 7.5) prizeCode = "B";
  else if (r < 12.5) prizeCode = "C";
  else if (r < 22.5) prizeCode = "D";
  else if (r < 32.5) prizeCode = "E";
  else if (r < 50) prizeCode = "F";

  const index = prizeCodes.indexOf(prizeCode);
  const slice = 360 / prizes.length;
  const randomExtra = Math.random() * slice;
  const targetAngle = 360 * 5 + (index * slice) + randomExtra;

  wheel.style.transition = "transform 5s ease-out";
  wheel.style.transform = `rotate(${targetAngle}deg)`;

  setTimeout(async () => {
    try {
      const res = await fetch(`${SCRIPT_URL}?action=spin&username=${encodeURIComponent(usernameInput.value.trim())}&prize=${prizeCode}`);
      const data = await res.json();
      currentSpins = data.spins || 0;
      resultMessage.innerHTML = `<b>${data.prize ? `Bạn trúng: ${data.prize}` : "Lỗi ghi nhận kết quả"}</b>`;
      spinInfo.textContent = currentSpins > 0 ? `Bạn còn ${currentSpins} lượt quay.` : "Hết lượt.";
    } catch {
      resultMessage.textContent = "Lỗi kết nối khi quay.";
    }
    if (currentSpins > 0) spinBtn.disabled = false;
  }, 5000);
});
