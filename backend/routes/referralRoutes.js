const express = require('express');
const router = express.Router();
const Referral = require('../models/Referral');
const User = require('../models/User');

// ✅ GET /api/referrals/all
router.get('/all', async (req, res) => {
  try {
    const referrals = await Referral.find()
      .populate('referrer', 'email')
      .populate('referred', 'email');
    res.json(referrals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching referrals' });
  }
});

module.exports = router;
