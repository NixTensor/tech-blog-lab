---
title: Sync Shopify Inventory with Notion via JavaScript
description: Master the automatic synchronization of your Shopify stock to Notion for simplified inventory management.
---

Supply chain optimization is crucial for any e-commerce player. By connecting Shopify to Notion, you transform a simple database into a real operational dashboard updated in real-time.

:::note
This tutorial leverages the Shopify Admin API and the Notion Public API.
:::

## Prerequisites

- A [Shopify](https://shopify.pxf.io/ZVrAgR) store configured with an admin access token.
- A [Notion](https://www.notion.com) workspace with a created database and an internal integration token.
- Node.js installed in your environment.
- Following dependencies: `npm install @notionhq/client axios`

## Technical Implementation

The following script allows you to extract Shopify products and create corresponding entries in Notion.

```javascript title="sync_shopify_notion.js"
const { Client } = require('@notionhq/client');
const axios = require('axios');

// Configuration
const SHOPIFY_STORE = 'your-store.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = 'shpat_...';
const NOTION_API_KEY = 'ntn_...';
const NOTION_DATABASE_ID = 'your_database_id';

const SHOPIFY_API_VERSION = '2026-01';
const notion = new Client({ auth: NOTION_API_KEY });

async function syncInventory() {
    try {
        console.log('Starting synchronization...');

        // 1. Fetch from Shopify
        const shopifyUrl = `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/products.json`;
        const { data } = await axios.get(shopifyUrl, {
            headers: { 'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN }
        });

        // 2. Insert into Notion
        for (const product of data.products) {
            const inventoryQty = product.variants[0]?.inventory_quantity || 0;

            await notion.pages.create({
                parent: { database_id: NOTION_DATABASE_ID },
                properties: {
                    "Name": { title: [{ text: { content: product.title } }]},
                    "Stock": { number: inventoryQty }
                }
            });
            console.log(`Product ${product.title} synchronized.`);
        }
    } catch (error) {
    }
}

syncInventory();
```

:::danger[Access Security]
Never commit your API keys to GitHub. Use a `.env` file and the `dotenv` library to actually load your secrets securely.
:::

## Conclusion
By automating this flow, you eliminate manual entry errors and have a clear view of your stock directly in Notion.
