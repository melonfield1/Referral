const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Reward = require('../models/Reward');
const Log = require('../models/Log');
const Announcement = require('../models/Announcement');
const Config = require('../models/Config');
const Order = require('../models/Order'); // ✅ New
const axios = require('axios');
const Revenue = require('../models/Revenue');

// Get total orders & revenue from Mongo (if manually synced)
router.get('/summary/metrics', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Revenue.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
    res.json({
      orders: totalOrders,
      revenue: totalRevenue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching metrics' });
  }
});

module.exports = router;

// ✅ Basic Auth middleware
const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const base64 = authHeader.split(' ')[1];
  const [user, pass] = Buffer.from(base64 || '', 'base64').toString().split(':');

  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    return next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).send('Authentication required.');
  }
};

// ✅ All Users
router.get('/all-users', basicAuth, async (req, res) => {
  try {
    const users = await User.find({}, 'email displayName referralCode referredBy successfulReferrals alias');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Rewards
router.get('/rewards', basicAuth, async (req, res) => {
  try {
    const rewards = await Reward.find().populate('user', 'displayName email');
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Logs
router.get('/logs', basicAuth, async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Log fetch error' });
  }
});

// ✅ Leaderboard
router.get('/leaderboard', basicAuth, async (req, res) => {
  try {
    const topReferrers = await User.find().sort({ successfulReferrals: -1 }).limit(10);
    res.json(topReferrers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

// ✅ Create Log
router.post('/log', basicAuth, async (req, res) => {
  try {
    const log = await Log.create({ type: req.body.type, message: req.body.message });
    res.json({ message: 'Log created', log });
  } catch (err) {
    res.status(500).json({ message: 'Log error' });
  }
});

// ✅ Config Get
router.get('/config', basicAuth, async (req, res) => {
  let config = await Config.findOne();
  if (!config) config = await Config.create({});
  res.json(config);
});

// ✅ Config Update
router.put('/config', basicAuth, async (req, res) => {
  let config = await Config.findOne();
  if (!config) config = await Config.create({});
  Object.assign(config, req.body);
  await config.save();
  res.json({ message: 'Settings updated' });
});

// ✅ Shopify Order Sync (Admin API)
router.get('/sync-orders', basicAuth, async (req, res) => {
  try {
    const shop = process.env.SHOPIFY_SHOP;
    const token = process.env.SHOPIFY_ADMIN_TOKEN;

    const response = await axios.get(`https://${shop}/admin/api/2024-01/orders.json?status=any&limit=250`, {
      headers: {
        'X-Shopify-Access-Token': token
      }
    });

    const orders = response.data.orders || [];

    for (const order of orders) {
      await Order.updateOne(
        { orderId: order.id.toString() },
        {
          orderId: order.id.toString(),
          customerEmail: order.email,
          totalPrice: parseFloat(order.total_price),
          createdAt: new Date(order.created_at)
        },
        { upsert: true }
      );
    }

    res.json({ message: `${orders.length} orders synced.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to sync orders' });
  }
});

module.exports = router;
