const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Reward = require('../models/Reward');
const Log = require('../models/Log');
const Announcement = require('../models/Announcement');

const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const base64 = authHeader.split(' ')[1];
  const [user, pass] = Buffer.from(base64 || '', 'base64').toString().split(':');

  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    return next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).send('Authentication required.');
  }
};

router.get('/all-users', basicAuth, async (req, res) => {
  try {
    const users = await User.find({}, 'email displayName referralCode referredBy successfulReferrals alias');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/rewards', basicAuth, async (req, res) => {
  try {
    const rewards = await Reward.find().populate('user', 'displayName email');
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/logs', basicAuth, async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Log fetch error' });
  }
});

router.get('/leaderboard', basicAuth, async (req, res) => {
  try {
    const topReferrers = await User.find().sort({ successfulReferrals: -1 }).limit(10);
    res.json(topReferrers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

router.post('/log', basicAuth, async (req, res) => {
  try {
    const log = await Log.create({ type: req.body.type, message: req.body.message });
    res.json({ message: 'Log created', log });
  } catch (err) {
    res.status(500).json({ message: 'Log error' });
  }
});

module.exports = router;
