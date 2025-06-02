const chartRouter = require('express').Router();
const { fetchOrders } = require('../utils/shopifyAdmin');

chartRouter.get('/charts/orders-by-day', async (req, res) => {
  try {
    const orders = await fetchOrders();
    const daily = {};
    orders.forEach(o => {
      const date = o.created_at.split('T')[0];
      daily[date] = (daily[date] || 0) + 1;
    });
    res.json(daily);
  } catch (err) {
    res.status(500).json({ message: 'Chart error' });
  }
});

module.exports = chartRouter;
