const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerEmail: String,
  totalPrice: Number,
  createdAt: Date
});

module.exports = mongoose.model('Order', orderSchema);
