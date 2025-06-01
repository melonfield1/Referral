// ✅ models/Log.js
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  type: String,
  details: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
