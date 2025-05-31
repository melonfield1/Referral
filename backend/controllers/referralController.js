const Referral = require('../models/Referral');
const User = require('../models/User');

exports.createReferral = async (req, res) => {
  try {
    const { referredUserId, referralCode } = req.body;
    const referrer = await User.findOne({ referralCode });

    if (!referrer || referrer._id.toString() === referredUserId) {
      return res.status(400).json({ message: 'Invalid referral' });
    }

    const existing = await Referral.findOne({ referred: referredUserId });
    if (existing) return res.status(400).json({ message: 'Referral already exists' });

    const referral = new Referral({
      referrer: referrer._id,
      referred: referredUserId,
    });

    await referral.save();
    await User.findByIdAndUpdate(referredUserId, { referredBy: referrer.referralCode });

    res.status(201).json({ message: 'Referral recorded' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markPurchaseCompleted = async (req, res) => {
  try {
    const { referredUserId } = req.body;
    const referral = await Referral.findOne({ referred: referredUserId });

    if (!referral || referral.purchaseCompleted) {
      return res.status(400).json({ message: 'Invalid or already completed referral' });
    }

    referral.purchaseCompleted = true;
    await referral.save();

    await User.findByIdAndUpdate(referral.referrer, { $inc: { successfulReferrals: 1 } });

    res.json({ message: 'Purchase marked complete' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReferralsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const referrals = await Referral.find({ referrer: userId }).populate('referred', 'email');

    res.json(referrals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
