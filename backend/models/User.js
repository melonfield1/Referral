const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  referralCode: { type: String, unique: true },
  referredBy: { type: String, default: null },
  successfulReferrals: { type: Number, default: 0 },
  sessionToken: { type: String, default: null },
}, { timestamps: true });

// Hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (plainText) {
  return bcrypt.compare(plainText, this.password);
};

module.exports = mongoose.model('User', userSchema);
