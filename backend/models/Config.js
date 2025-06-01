const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  referralEnabled: { type: Boolean, default: true },
  rewardThreshold: { type: Number, default: 3 },
  maintenanceMode: { type: Boolean, default: false },
  announcementVisible: { type: Boolean, default: true }
});

module.exports = mongoose.model('Config', configSchema);
