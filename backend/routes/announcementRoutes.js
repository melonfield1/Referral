const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// ✅ Basic Auth Middleware
const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const [user, pass] = Buffer.from(auth.split(' ')[1] || '', 'base64').toString().split(':');
  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) return next();
  res.setHeader('WWW-Authenticate', 'Basic');
  return res.status(401).send('Authentication required');
};

// ✅ Create or Replace Announcement
router.post('/announcement', basicAuth, async (req, res) => {
  await Announcement.deleteMany(); // 🧹 Keep only 1 active
  const newAnnouncement = await Announcement.create({ message: req.body.message });
  res.json({ message: 'Announcement posted', id: newAnnouncement._id });
});

// ✅ Get Latest Announcement (User Side)
router.get('/announcement/latest', async (req, res) => {
  const latest = await Announcement.findOne().sort({ createdAt: -1 });
  res.json(latest || {});
});

// ✅ Get All Announcements (Admin View)
router.get('/announcement/all', basicAuth, async (req, res) => {
  const list = await Announcement.find().sort({ createdAt: -1 }).limit(10);
  res.json(list);
});

// ✅ Delete Announcement by ID
router.delete('/announcement/:id', basicAuth, async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: 'Announcement deleted' });
});

module.exports = router;
