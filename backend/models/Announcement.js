const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', announcementSchema);
