// Single source of truth for the wheel's segments.
// Both the customer-facing wheel and the /api/claim spin logic read this file,
// so the visual wheel always matches what the server actually awarded.
//
// `weight` controls odds: a segment's chance = its weight / sum of all weights.
// Edit label/color/weight freely. Add or remove segments as needed (any count works).

const PRIZES = [
  { label: 'K50 Bonus',   color: '#7c3aed', weight: 10 },
  { label: 'Free Spin',   color: '#f59e0b', weight: 20 },
  { label: 'K20 Bonus',   color: '#7c3aed', weight: 20 },
  { label: 'Try Again',   color: '#f59e0b', weight: 25 },
  { label: 'K100 Bonus',  color: '#7c3aed', weight: 5  },
  { label: 'K10 Bonus',   color: '#f59e0b', weight: 15 },
  { label: 'Jackpot K500',color: '#7c3aed', weight: 1  },
  { label: 'K30 Bonus',   color: '#f59e0b', weight: 14 },
];

function pickPrizeIndex() {
  const total = PRIZES.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < PRIZES.length; i++) {
    roll -= PRIZES[i].weight;
    if (roll <= 0) return i;
  }
  return PRIZES.length - 1;
}

module.exports = { PRIZES, pickPrizeIndex };
