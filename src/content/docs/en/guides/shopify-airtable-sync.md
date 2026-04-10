---
title: Sync Shopify Inventory with Airtable via JavaScript
description: Learn how to automate your Shopify stock synchronization to Airtable in real-time with a Node.js script.
---

Automation is the key to optimizing your e-commerce management. Connecting Shopify to Airtable allows you to automatically synchronize your stock, thus facilitating your operational tracking.

:::note
This tutorial uses the Shopify Admin API and the Airtable REST API.
:::

## Prerequisites

- A [Shopify](https://shopify.pxf.io/ZVrAgR) store with API access.
- An [Airtable](https://www.airtable.com) database ready.
- Node.js installed on your machine.
- The `axios` library: `npm install axios`

## The Node.js Code

Here is a script to automate this task:

```javascript title="sync.js"
const axios = require('axios');

// Configuration
const SHOPIFY_STORE = 'your-store.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = 'your_shopify_token';
const AIRTABLE_API_KEY = 'your_airtable_api_key';
const AIRTABLE_BASE_ID = 'appXXXXXXX';
const AIRTABLE_TABLE_NAME = 'Inventory';

async function syncInventory() {
    try {
        // Fetch from Shopify
        const shopifyUrl = `https://${SHOPIFY_STORE}/admin/api/2026-01/products.json`;
        const response = await axios.get(shopifyUrl, {
            headers: { 'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN }
        });

        // Send to Airtable
        for (const product of response.data.products) {
            await axios.post(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
                fields: { "Product Name": product.title, "Stock": product.variants[0].inventory_quantity }
            }, {
                headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
            });
        }
        console.log('Sync successful.');
    } catch (error) {
        console.error('Error:', error.message);
    }
}
```

:::danger[Security Warning]
Never share your access tokens or API keys publicly. Use environment variables (`.env`).
:::

## Conclusion
You now have a solid foundation to automate your inventory management.
