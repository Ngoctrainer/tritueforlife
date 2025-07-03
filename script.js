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

  const username = usernameInput.value.trim();

  try {
    const res = await fetch(`${SCRIPT_URL}?action=spin&username=${encodeURIComponent(username)}`);
    const data = await res.json();

    if (!data.success) {
      resultMessage.textContent = "Có lỗi khi quay số.";
      return;
    }

    // Lấy dữ liệu trả về từ server
    currentSpins = data.spins;
    const prizeCode = data.prizeCode;
    const prizeName = data.prizeName;

    spinInfo.textContent = currentSpins > 0
      ? `Bạn còn ${currentSpins} lượt quay.`
      : "Bạn đã hết lượt quay.";

    // Tìm vị trí giải trên vòng quay
    const slice = 360 / prizes.length;
    const index = prizes.findIndex(p => p.code === prizeCode);
    const angleToPrize = index * slice + slice / 2;
    const extraSpins = Math.floor(Math.random() * 3 + 5) * 360;
    const targetAngle = extraSpins + (360 - angleToPrize); // Quay ngược chiều kim đồng hồ

    // Reset về góc 0 để đảm bảo hiệu ứng hoạt động
    wheel.style.transition = "none";
    wheel.style.transform = "rotate(0deg)";

    // Bắt đầu xoay sau 50ms (bắt buộc phải delay nhẹ)
    setTimeout(() => {
      wheel.style.transition = "transform 5s ease-out";
      wheel.style.transform = `rotate(${targetAngle}deg)`;
    }, 50);

    // Hiện kết quả sau khi quay xong
    setTimeout(() => {
      resultMessage.textContent = `Bạn trúng: ${prizeName}`;
      spinBtn.disabled = currentSpins <= 0;
    }, 5300);

  } catch (err) {
    console.error(err);
    resultMessage.textContent = "Lỗi kết nối khi quay.";
  }
});
