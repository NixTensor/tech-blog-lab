---
title: How to Connect Stripe API to Airtable via Python
description: A tutorial to automate synchronization between Stripe and Airtable.
---

Automation is the key to saving time in your commercial management. Connecting Stripe to Airtable allows you to automatically synchronize your payments, thus facilitating your accounting tracking.

## Introduction
This article explains how to create a Python script that retrieves Stripe transactions and saves them directly into an Airtable database.

## Prerequisites
- A [Stripe](https://stripe.com) account with a secret API key.
- An [Airtable](https://airtable.com) account with a table ready to receive the data.
- Python 3 installed.
- The `stripe` and `pyairtable` libraries:
  `pip install stripe pyairtable`

## The Python Code

Here is a simple script to synchronize your data:

```python
import stripe
from pyairtable import Table

# Configuration : Remplacez par vos propres clés
STRIPE_API_KEY = "votre_clé_stripe"
AIRTABLE_API_KEY = "votre_clé_airtable"
AIRTABLE_BASE_ID = "votre_base_id"
AIRTABLE_TABLE_NAME = "Transactions"

# Initialisation
stripe.api_key = STRIPE_API_KEY
table = Table(AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME)

def sync_stripe_to_airtable():
    """Récupère les dernières charges Stripe et les ajoute dans Airtable."""
    try:
        # Récupération des charges depuis Stripe
        charges = stripe.Charge.list(limit=5)
        
        for charge in charges.data:
            fields = {
                "Stripe ID": charge.id,
                "Montant": charge.amount / 100, # Stripe utilise les cents
                "Devise": charge.currency.upper(),
                "Description": charge.description or "Pas de description"
            }
            
            # Insertion dans Airtable
            table.create(fields)
            print(f"Charge {charge.id} ajoutée avec succès.")
            
    except Exception as e:
        print(f"Erreur de synchronisation : {e}")

if __name__ == "__main__":
    sync_stripe_to_airtable()
```

## Conclusion
By automating this connection, you free up time for higher value-added tasks. This script is a solid foundation that you can enrich by adding filters or webhooks.
