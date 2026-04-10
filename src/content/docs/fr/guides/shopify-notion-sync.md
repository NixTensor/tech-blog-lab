---
title: Synchroniser l'inventaire Shopify avec Notion via JavaScript
description: Maîtrisez la synchronisation automatique de vos stocks Shopify vers Notion pour une gestion d'inventaire simplifiée.
---

L'optimisation de la chaîne logistique est cruciale pour tout e-commerçant. En connectant Shopify à Notion, vous transformez une simple base de données en un véritable tableau de bord opérationnel mis à jour en temps réel.

:::note
Ce tutoriel s'appuie sur l'API Admin de Shopify et l'API publique de Notion.
:::

## Prérequis

- Une boutique [Shopify](https://shopify.pxf.io/ZVrAgR) configurée avec un jeton d'accès admin.
- Un espace de travail [Notion](https://www.notion.com) avec une base de données créée et un jeton d'intégration interne.
- Node.js installé sur votre environnement.
- Les dépendances suivantes : `npm install @notionhq/client axios`

## L'implémentation technique

Le script suivant permet d'extraire les produits Shopify et de créer des entrées correspondantes dans Notion.

```javascript title="sync_shopify_notion.js"
const { Client } = require('@notionhq/client');
const axios = require('axios');

// Configuration
const SHOPIFY_STORE = 'votre-boutique.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = 'shpat_...';
const NOTION_API_KEY = 'ntn_...';
const NOTION_DATABASE_ID = 'votre_id_database';

const SHOPIFY_API_VERSION = '2026-01';
const notion = new Client({ auth: NOTION_API_KEY });

async function syncInventory() {
    try {
        console.log('Début de la synchronisation...');

        // 1. Récupération des produits depuis Shopify
        const shopifyUrl = `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/products.json`;
        const { data } = await axios.get(shopifyUrl, {
            headers: { 'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN }
        });

        // 2. Insertion dans Notion
        for (const product of data.products) {
            const inventoryQty = product.variants[0]?.inventory_quantity || 0;

            await notion.pages.create({
                parent: { database_id: NOTION_DATABASE_ID },
                properties: {
                    "Name": { title: [{ text: { content: product.title } }] },
                    "Stock": { number: inventoryQty }
                }
            });
            console.log(`Produit ${product.title} synchronisé.`);
        }
    } catch (error) {
        console.error('Erreur lors de la synchronisation :', error.message);
    }
}

syncInventory();
```

:::danger[Sécurité des accès]
Ne commitez jamais vos clés API sur GitHub. Utilisez un fichier `.env` et la bibliothèque `dotenv` pour charger vos secrets en toute sécurité.
:::

## Conclusion
En automatisant ce flux, vous éliminez les erreurs de saisie manuelle et disposez d'une vision claire de vos stocks directement dans Notion.
