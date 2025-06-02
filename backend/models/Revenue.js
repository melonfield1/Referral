// models/Revenue.js
const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema({
  total: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Revenue', revenueSchema);
