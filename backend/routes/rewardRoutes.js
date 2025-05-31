const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Reward = require('../models/Reward');
const { createDiscountCode } = require('../utils/shopify');

// ✅ POST /api/rewards/manual/:userId
router.post('/manual/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existing = await Reward.findOne({ user: user._id });
    if (existing) return res.status(409).json({ message: 'Reward already exists' });

    const code = `REF-${user.referralCode.toUpperCase()}`;
    const discountCode = await createDiscountCode(code);

    const reward = await Reward.create({
      user: user._id,
      discountCode,
      claimMethod: 'manual'
    });

    res.json({ message: 'Reward manually triggered', reward });
  } catch (err) {
    console.error('Manual reward error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
