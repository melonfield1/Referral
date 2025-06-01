const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// ✅ Admin basic auth
const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const [user, pass] = Buffer.from(auth.split(' ')[1] || '', 'base64').toString().split(':');
  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) return next();
  res.setHeader('WWW-Authenticate', 'Basic');
  return res.status(401).send('Authentication required');
};

// ✅ POST new announcement (replace existing)
router.post('/announcement', basicAuth, async (req, res) => {
  await Announcement.deleteMany(); // Always keep only one
  const newAnnouncement = await Announcement.create({ message: req.body.message });
  res.json({ message: 'Announcement posted', id: newAnnouncement._id });
});

// ✅ GET latest announcement
router.get('/announcement/latest', async (req, res) => {
  const latest = await Announcement.findOne().sort({ createdAt: -1 });
  res.json(latest || {});
});

// ✅ DELETE announcement by ID
router.delete('/announcement/:id', basicAuth, async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: 'Announcement deleted' });
});

module.exports = router;
