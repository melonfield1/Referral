const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/admin/all-users
router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find({}, 'email referralCode referredBy successfulReferrals');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
