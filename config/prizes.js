// Seed data only — used once, the first time the app runs, to populate the
// `prizes` database table. After that, prizes are edited from /admin.html
// and this file is never read again. Safe to leave as-is or edit before
// your very first deploy if you want different starting defaults.

const DEFAULT_PRIZES = [
  { label: 'K50 Bonus',    color: '#7c3aed', weight: 10 },
  { label: 'Free Spin',    color: '#f59e0b', weight: 20 },
  { label: 'K20 Bonus',    color: '#7c3aed', weight: 20 },
  { label: 'Try Again',    color: '#f59e0b', weight: 25 },
  { label: 'K100 Bonus',   color: '#7c3aed', weight: 5 },
  { label: 'K10 Bonus',    color: '#f59e0b', weight: 15 },
  { label: 'Jackpot K500', color: '#7c3aed', weight: 1 },
  { label: 'K30 Bonus',    color: '#f59e0b', weight: 14 },
];

module.exports = { DEFAULT_PRIZES };
