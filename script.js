const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbysFt9dwjxmia_yZFvdIHPQod273ZEyxC5Rbc2F3h17jCDvw0Umr9EgBtblNRvfX5ueTA/exec";

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

    if (data.success) {
      currentSpins = data.spins;
      spinInfo.textContent = currentSpins > 0
        ? `Bạn còn ${currentSpins} lượt quay.`
        : "Bạn đã hết lượt quay.";
      spinBtn.disabled = currentSpins <= 0;
    } else {
      spinInfo.textContent = "Không tìm thấy username hoặc lỗi server.";
      spinBtn.disabled = true;
    }
  } catch (err) {
    console.error(err);
    spinInfo.textContent = "Lỗi kết nối server.";
    spinBtn.disabled = true;
  }
});

spinBtn.addEventListener('click', async () => {
  if (currentSpins <= 0) return;

  spinBtn.disabled = true;
  resultMessage.textContent = "";

  const prizes = [
    { code: "A+", name: "Voucher 1.000.000đ", percent: 0.5 },
    { code: "A", name: "Voucher 500.000đ", percent: 2 },
    { code: "B", name: "Voucher 300.000đ", percent: 5 },
    { code: "C", name: "Voucher 200.000đ", percent: 5 },
    { code: "D", name: "Voucher 100.000đ", percent: 10 },
    { code: "E", name: "Voucher 50.000đ", percent: 10 },
    { code: "F", name: "Voucher 20.000đ", percent: 17.5 },
    { code: "G", name: "Voucher 10.000đ", percent: 50 }
  ];

  // Xác định giải thưởng
  let r = Math.random() * 100;
  let selectedPrize = prizes.find(p => {
    r -= p.percent;
    return r < 0;
  }) || prizes[prizes.length - 1];

  // Tính góc quay
  const slice = 360 / prizes.length;
const index = prizes.indexOf(selectedPrize);

// Góc chính xác của giải
const prizeAngle = index * slice + slice / 2; // Lấy giữa slice

// Quay ngẫu nhiên 5-7 vòng
const extraSpins = Math.floor(Math.random() * 3 + 5) * 360;

const targetAngle = extraSpins + prizeAngle;

// Khi bấm quay
wheel.style.transition = "transform 5s ease-out";
wheel.style.transform = `rotate(${targetAngle}deg)`;

// Sau khi quay xong + xử lý
setTimeout(async () => {
  resultMessage.textContent = `Bạn trúng: ${selectedPrize.name}`;
  try {
    const res = await fetch(...);
    // Cập nhật kết quả
  } catch (err) {
    console.error(err);
    resultMessage.textContent = "Lỗi ghi nhận kết quả.";
  }

  // ✅ Reset sẵn sàng cho lần quay sau
  wheel.style.transition = "none";
  wheel.style.transform = "rotate(0deg)";
  spinBtn.disabled = false;

}, 5000);
