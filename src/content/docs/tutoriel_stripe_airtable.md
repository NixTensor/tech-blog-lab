---
title: Comment connecter l'API de Stripe à Airtable via Python
description: Un tutoriel pour automatiser la synchronisation entre Stripe et Airtable.
---

L'automatisation est la clé pour gagner du temps dans votre gestion commerciale. Connecter Stripe à Airtable permet de synchroniser automatiquement vos paiements, facilitant ainsi votre suivi comptable.

## Introduction
Cet article explique comment créer un script Python qui récupère les transactions Stripe et les enregistre directement dans une base de données Airtable. 

## Prérequis
- Un compte [Stripe](https://stripe.com) avec une clé API secrète.
- Un compte [Airtable](https://airtable.com) avec une table prête à recevoir les données.
- Python 3 installé.
- Les bibliothèques `stripe` et `pyairtable` : 
  `pip install stripe pyairtable`

## Le code Python

Voici un script simple pour synchroniser vos données :

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
En automatisant cette connexion, vous libérez du temps pour des tâches à plus haute valeur ajoutée. Ce script est une base solide que vous pouvez enrichir en ajoutant des filtres ou des webhooks.
