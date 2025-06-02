const axios = require('axios');

const shopifyAxios = axios.create({
  baseURL: `https://${process.env.SHOPIFY_STORE}/admin/api/2024-04`,
  headers: {
    'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
    'Content-Type': 'application/json'
  }
});

exports.fetchOrders = async () => {
  const res = await shopifyAxios.get('/orders.json?status=any');
  return res.data.orders;
};

exports.fetchRevenue = async () => {
  const orders = await exports.fetchOrders();
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price), 0);
  return { count: orders.length, revenue: totalRevenue };
};
