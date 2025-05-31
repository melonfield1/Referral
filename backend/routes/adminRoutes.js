const express = require('express');
const router = express.Router();
const User = require('../models/User');

const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const base64 = authHeader.split(' ')[1];
  const [user, pass] = Buffer.from(base64 || '', 'base64').toString().split(':');

  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic');
    res.status(401).send('Authentication required.');
  }
};

router.get('/all-users', basicAuth, async (req, res) => {
  try {
    const users = await User.find({}, 'email referralCode referredBy successfulReferrals');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
