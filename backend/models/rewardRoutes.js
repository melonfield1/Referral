const express = require('express');
const router = express.Router();
const Reward = require('../models/Reward');
const User = require('../models/User');

// GET a user's reward
router.get('/:userId', async (req, res) => {
  const reward = await Reward.findOne({ user: req.params.userId });
  res.json(reward || {});
});

// (optional) POST to mark a reward as claimed
router.post('/claim/:userId', async (req, res) => {
  const reward = await Reward.findOneAndUpdate(
    { user: req.params.userId },
    { claimed: true },
    { new: true }
  );
  res.json(reward);
});

module.exports = router;
