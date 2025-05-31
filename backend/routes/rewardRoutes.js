const express = require('express');
const router = express.Router();
const Reward = require('../models/Reward');

// GET reward by user ID
router.get('/:userId', async (req, res) => {
  try {
    const reward = await Reward.findOne({ user: req.params.userId });
    if (!reward) return res.json({});
    res.json(reward);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// (Optional) POST to mark reward as claimed
router.post('/claim/:userId', async (req, res) => {
  try {
    const reward = await Reward.findOneAndUpdate(
      { user: req.params.userId },
      { claimed: true },
      { new: true }
    );
    res.json(reward);
  } catch (err) {
    res.status(500).json({ message: 'Claim failed' });
  }
});

module.exports = router;
