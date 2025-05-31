const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  earnedAt: { type: Date, default: Date.now },
  claimed: { type: Boolean, default: false },
  claimMethod: { type: String, enum: ['manual', 'discount'], default: 'manual' },
  discountCode: { type: String } // optional
});

module.exports = mongoose.model('Reward', rewardSchema);
