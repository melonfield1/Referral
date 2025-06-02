// ✅ routes/shopifyAdminRoutes.js
const router = require('express').Router();
const axios = require('axios');

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

router.get('/summary', basicAuth, async (req, res) => {
  try {
    const url = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2023-10/orders.json?status=any`;
    const ordersRes = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_KEY
      }
    });

    const orders = ordersRes.data.orders || [];
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
    res.json({
      totalOrders: orders.length,
      totalRevenue: totalRevenue.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch Shopify data', error: err.message });
  }
});

module.exports = router;
