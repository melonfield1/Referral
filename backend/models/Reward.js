// ✅ models/Reward.js
const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  discountCode: String,
  claimMethod: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reward', rewardSchema);
