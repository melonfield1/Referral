// ✅ models/ReferrerStats.js
const mongoose = require('mongoose');

const referrerStatsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalReferrals: { type: Number, default: 0 },
  successfulReferrals: { type: Number, default: 0 },
  lastReferralDate: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('ReferrerStats', referrerStatsSchema);
