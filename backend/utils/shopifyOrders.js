// ✅ utils/shopifyOrders.js
const axios = require('axios');
const Order = require('../models/Order');

const fetchShopifyOrders = async () => {
  try {
    const url = `https://${process.env.SHOPIFY_SHOP_DOMAIN}/admin/api/2023-07/orders.json?status=any`;

    const res = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    const orders = res.data.orders;
    let newOrders = 0;

    for (const order of orders) {
      const exists = await Order.findOne({ orderId: order.id });
      if (!exists) {
        await Order.create({
          orderId: order.id,
          customerEmail: order.email,
          totalPrice: parseFloat(order.total_price),
          createdAt: new Date(order.created_at)
        });
        newOrders++;
      }
    }

    return newOrders;
  } catch (err) {
    console.error('Shopify sync error:', err.message);
    return 0;
  }
};

module.exports = { fetchShopifyOrders };
