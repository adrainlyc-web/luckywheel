const { PRIZES } = require('../config/prizes');

module.exports = (req, res) => {
  res.status(200).json({
    prizes: PRIZES.map((p) => ({ label: p.label, color: p.color })),
  });
};
