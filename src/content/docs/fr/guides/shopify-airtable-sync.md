---
title: Synchroniser l'inventaire Shopify avec Airtable via JavaScript
description: Apprenez à automatiser la synchronisation de vos stocks Shopify vers Airtable en temps réel avec un script Node.js.
---

L'automatisation est la clé pour optimiser la gestion de votre e-commerce. Connecter Shopify à Airtable permet de synchroniser automatiquement vos stocks, facilitant ainsi votre suivi opérationnel.

:::note
Ce tutoriel utilise l'API Admin de Shopify et l'API REST d'Airtable.
:::

## Prérequis

- Une boutique [Shopify](https://shopify.pxf.io/ZVrAgR) avec un accès API.
- Une base de données [Airtable](https://www.airtable.com) prête.
- Node.js installé sur votre machine.
- La bibliothèque `axios` : `npm install axios`

## Le code Node.js

Voici un script pour automatiser cette tâche :

```javascript title="sync.js"
const axios = require('axios');

// Configuration
const SHOPIFY_STORE = 'votre-boutique.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = 'votre_token_shopify';
const AIRTABLE_API_KEY = 'votre_cle_airtable';
const AIRTABLE_BASE_ID = 'appXXXXXXX';
const AIRTABLE_TABLE_NAME = 'Inventory';

async function syncInventory() {
    try {
        // Récupération depuis Shopify
        const shopifyUrl = `https://${SHOPIFY_STORE}/admin/api/2026-01/products.json`;
        const response = await axios.get(shopifyUrl, {
            headers: { 'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN }
        });

        // Envoi vers Airtable
        for (const product of response.data.products) {
            await axios.post(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
                fields: { "Product Name": product.title, "Stock": product.variants[0].inventory_quantity }
            }, {
                headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
            });
        }
        console.log('Synchronisation réussie.');
    } catch (error) {
        console.error('Erreur:', error.message);
    }
}
```

:::danger[Attention aux clés API]
Ne partagez jamais vos jetons d'accès ou clés API publiquement. Utilisez des variables d'environnement (`.env`).
:::

## Conclusion
Vous disposez maintenant d'une base solide pour automatiser votre gestion d'inventaire.
