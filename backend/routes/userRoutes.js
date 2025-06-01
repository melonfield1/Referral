const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const crypto = require('crypto');

router.post('/register', async (req, res) => {
  try {
    const { email, password, referralCode, displayName } = req.body;

    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) referredBy = referralCode;
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const referral = crypto.randomBytes(4).toString('hex');

    const newUser = new User({
      email,
      password,
      referralCode: referral,
      referredBy,
      sessionToken,
      displayName
    });

    await newUser.save();
    res.status(201).json({ userId: newUser._id, referralCode: newUser.referralCode, sessionToken });
  } catch (err) {
    res.status(500).json({ message: 'Registration error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  user.sessionToken = crypto.randomBytes(32).toString('hex');
  await user.save();
  res.json({ sessionToken: user.sessionToken });
});

router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const user = await User.findOne({ sessionToken: token });
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const latestAnnouncement = await Announcement.findOne().sort({ createdAt: -1 });
  const announcementMessage = latestAnnouncement?.message || '';

  res.json({
    userId: user._id,
    email: user.email,
    referralCode: user.referralCode,
    successfulReferrals: user.successfulReferrals,
    displayName: user.displayName,
    alias: user.alias,
    announcement: announcementMessage
  });
});

router.put('/me/display-name', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const user = await User.findOne({ sessionToken: token });
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  user.displayName = req.body.displayName || '';
  await user.save();
  res.json({ message: 'Name updated' });
});

router.put('/me/alias', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const user = await User.findOne({ sessionToken: token });
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const exists = await User.findOne({ alias: req.body.alias });
  if (exists) return res.status(400).json({ message: 'Alias already in use' });

  user.alias = req.body.alias;
  await user.save();
  res.json({ message: 'Alias set' });
});

module.exports = router;
