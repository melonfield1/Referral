const User = require('../models/User');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const { email, password, referralCode } = req.body;

    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (!referrer) return res.status(400).json({ message: 'Invalid referral code' });
      referredBy = referralCode;
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const newUser = new User({
      email,
      password,
      referralCode: crypto.randomBytes(4).toString('hex'),
      referredBy,
      sessionToken
    });

    await newUser.save();
    res.status(201).json({ userId: newUser._id, referralCode: newUser.referralCode, sessionToken });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Email already registered' });
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    user.sessionToken = sessionToken;
    await user.save();

    res.json({ sessionToken });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserBySession = async (req, res) => {
  const { sessionToken } = req.query;
  try {
    const user = await User.findOne({ sessionToken });
    if (!user) return res.status(401).json({ message: 'Invalid session' });

    res.json({
      userId: user._id,
      email: user.email,
      referralCode: user.referralCode,
      successfulReferrals: user.successfulReferrals
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
