---
title: Synchroniser Stripe avec Supabase pour gérer vos abonnements SaaS
description: Apprenez à synchroniser automatiquement vos abonnements Stripe vers Supabase avec Python pour un suivi SaaS simplifié.
---

Gérer ses abonnements SaaS peut rapidement devenir un casse-tête. En synchronisant Stripe avec Supabase, vous créez une source de vérité unique pour vos données clients, accessible directement via une base de données PostgreSQL puissante.

:::note
Ce tutoriel utilise le SDK Python officiel `stripe` et `supabase-py`.
:::

## Prérequis

- Un compte [Stripe](https://stripe.com) avec une clé API secrète.
- Un projet [Supabase](https://supabase.com/) configuré.
- Python 3 et `pip` installés.
- Installation des bibliothèques nécessaires : 
  `pip install stripe supabase`

## L'implémentation technique

Le script suivant permet d'extraire les abonnements actifs de Stripe et d'effectuer une opération d'upsert dans Supabase.

```python title="sync_stripe_supabase.py"
import stripe
from supabase import create_client, Client

# Configuration
STRIPE_API_KEY = "sk_test_..."
SUPABASE_URL = "https://votre-projet.supabase.co"
SUPABASE_KEY = "votre_service_role_key"

# Initialisation
stripe.api_key = STRIPE_API_KEY
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def sync_subscriptions():
    """Récupère les abonnements Stripe et les synchronise dans Supabase."""
    try:
        # 1. Récupération des abonnements actifs
        subscriptions = stripe.Subscription.list(status='active', limit=10)
        
        for sub in subscriptions.data:
            subscription_data = {
                "stripe_id": sub.id,
                "customer_id": sub.customer,
                "status": sub.status,
                "plan_id": sub.plan.id,
                "current_period_end": sub.current_period_end
            }
            
            # 2. Upsert dans Supabase
            # Nécessite une contrainte UNIQUE sur 'stripe_id' dans votre table
            supabase.table("subscriptions").upsert(
                subscription_data, 
                on_conflict="stripe_id"
            ).execute()
            
            print(f"Abonnement {sub.id} synchronisé.")
            
    except Exception as e:
        print(f"Erreur : {e}")

if __name__ == "__main__":
    sync_subscriptions()
```

:::danger[Sécurité de la clé Supabase]
Pour cette synchronisation, nous utilisons la `service_role` key. **Ne l'exposez jamais côté client.** Elle doit rester dans votre environnement serveur sécurisé uniquement.
:::

## Conclusion
Cette automatisation vous permet de garder un historique propre dans votre base de données, idéal pour créer des dashboards ou déclencher des emails transactionnels personnalisés.
