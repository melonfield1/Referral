const router = require('express').Router();
const Announcement = require('../models/Announcement');

const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const [user, pass] = Buffer.from(auth.split(' ')[1] || '', 'base64').toString().split(':');
  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) return next();
  res.setHeader('WWW-Authenticate', 'Basic');
  return res.status(401).send('Authentication required');
};

router.post('/announcement', basicAuth, async (req, res) => {
  await Announcement.deleteMany();
  const newAnnouncement = await Announcement.create({ message: req.body.message });
  res.json({ message: 'Announcement posted', id: newAnnouncement._id });
});

router.get('/announcement/latest', async (req, res) => {
  const latest = await Announcement.find().sort({ createdAt: -1 }).limit(1);
  res.json(latest[0] || {});
});

router.delete('/announcement/:id', basicAuth, async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: 'Announcement deleted' });
});

module.exports = router;
