(function () {
  const wheelEl = document.getElementById('wheel');
  const formEl = document.getElementById('claim-form');
  const phoneEl = document.getElementById('phone');
  const spinBtn = document.getElementById('spin-btn');
  const messageEl = document.getElementById('message');

  let prizes = [];
  let currentRotation = 0;
  let alreadySpun = false;

  function setMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = 'message' + (type ? ' ' + type : '');
  }

  function buildWheel(list) {
    const n = list.length;
    const segAngle = 360 / n;

    const gradientStops = list
      .map((p, i) => `${p.color} ${i * segAngle}deg ${(i + 1) * segAngle}deg`)
      .join(', ');
    wheelEl.style.background = `conic-gradient(${gradientStops})`;

    list.forEach((p, i) => {
      const label = document.createElement('div');
      label.className = 'wheel-label';
      const midAngle = i * segAngle + segAngle / 2;
      label.style.transform = `rotate(${midAngle}deg)`;
      label.textContent = p.label;
      wheelEl.appendChild(label);
    });
  }

  function spinTo(index) {
    const n = prizes.length;
    const segAngle = 360 / n;
    const centerAngle = index * segAngle + segAngle / 2;
    const jitter = (Math.random() - 0.5) * (segAngle * 0.5);
    const extraSpins = 5;

    // Pointer is fixed at the top; rotate the wheel so segment `index` ends up there.
    const targetWithinTurn = (360 - centerAngle - jitter + 360) % 360;
    currentRotation += extraSpins * 360 + targetWithinTurn - (currentRotation % 360);
    wheelEl.style.transform = `rotate(${currentRotation}deg)`;
  }

  async function loadPrizes() {
    const res = await fetch('/api/prizes');
    const data = await res.json();
    prizes = data.prizes;
    buildWheel(prizes);
  }

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (alreadySpun) return;

    const phone = phoneEl.value.trim();
    if (!phone) return;

    spinBtn.disabled = true;
    setMessage('Spinning…', 'info');

    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (res.status === 404 && data.status === 'not_eligible') {
        setMessage("This phone number isn't on our list. Contact us if you think this is a mistake.", 'error');
        spinBtn.disabled = false;
        return;
      }

      if (data.status === 'already_claimed') {
        alreadySpun = true;
        spinTo(data.prizeIndex || 0);
        setTimeout(() => {
          setMessage(`You've already claimed your prize: ${data.prize}. Each phone number can only claim once.`, 'info');
        }, 4300);
        return;
      }

      if (data.status === 'won') {
        alreadySpun = true;
        spinTo(data.prizeIndex);
        setTimeout(() => {
          setMessage(`🎉 You won: ${data.prize}! Show this screen to claim your bonus.`, 'success');
        }, 4300);
        return;
      }

      setMessage('Something went wrong. Please try again.', 'error');
      spinBtn.disabled = false;
    } catch (err) {
      setMessage('Network error — please check your connection and try again.', 'error');
      spinBtn.disabled = false;
    }
  });

  loadPrizes();
})();
