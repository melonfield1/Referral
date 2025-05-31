const express = require('express');
const router = express.Router();
const Referral = require('../models/Referral');
const User = require('../models/User');
const Reward = require('../models/Reward');
const { createDiscountCode } = require('../utils/shopify');

router.post('/order-webhook', async (req, res) => {
  try {
    const noteAttr = req.body.note_attributes?.find(attr => attr.name === 'referral_code');
    const referralCode = noteAttr?.value;

    if (!referralCode) return res.status(200).send('No referral code found');

    // Find referrer
    const referrer = await User.findOne({ referralCode });
    if (!referrer) return res.status(200).send('Invalid referral code');

    const email = req.body.email || req.body.customer?.email;
    const referredUser = await User.findOne({ email });

    if (!referredUser) return res.status(200).send('Referred user not found');

    const referral = await Referral.findOne({ referred: referredUser._id });
    if (!referral || referral.purchaseCompleted) {
      return res.status(200).send('Referral already handled');
    }

    // ✅ Mark referral as completed
    referral.purchaseCompleted = true;
    await referral.save();

    // ✅ Update referrer's counter
    referrer.successfulReferrals += 1;
    await referrer.save();

    // 🎉 If 3 referrals hit, reward them
    if (referrer.successfulReferrals === 3) {
      const exists = await Reward.findOne({ user: referrer._id });
      if (!exists) {
        const code = `REF-${referrer.referralCode.toUpperCase()}`;
        const discountCode = await createDiscountCode(code);
        await Reward.create({
          user: referrer._id,
          discountCode,
          claimMethod: 'discount'
        });
      }
    }

    res.status(200).send('Referral purchase recorded');
  } catch (err) {
    console.error('Shopify Webhook Error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
