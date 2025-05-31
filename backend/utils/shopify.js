const axios = require('axios');

async function createDiscountCode(code, value = 100) {
  const res = await axios.post(
    `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/price_rules.json`,
    {
      price_rule: {
        title: `Referral-${code}`,
        target_type: "line_item",
        target_selection: "all",
        allocation_method: "across",
        value_type: "fixed_amount",
        value: `-${value}`,
        customer_selection: "all",
        once_per_customer: true,
        usage_limit: 1,
        starts_at: new Date().toISOString()
      }
    },
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN
      }
    }
  );

  const ruleId = res.data.price_rule.id;

  const codeRes = await axios.post(
    `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/price_rules/${ruleId}/discount_codes.json`,
    {
      discount_code: { code }
    },
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN
      }
    }
  );

  return codeRes.data.discount_code.code;
}

module.exports = { createDiscountCode };
