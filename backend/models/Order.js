const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: String,
  customerEmail: String,
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
