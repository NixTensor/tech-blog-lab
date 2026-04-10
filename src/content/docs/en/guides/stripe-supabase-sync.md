---
title: Sync Stripe Subscriptions with Supabase via Python
description: Learn how to automatically synchronize your Stripe subscriptions to Supabase with Python for simplified SaaS tracking.
---

Managing SaaS subscriptions can quickly become complex. By synchronizing Stripe with Supabase, you create a single source of truth for your customer data, accessible directly via a powerful PostgreSQL database.

:::note
This tutorial leverages the official `stripe` and `supabase-py` Python SDKs.
:::

## Prerequisites

- A [Stripe](https://stripe.com) account with a secret API key.
- A [Supabase](https://supabase.com/) project configured.
- Python 3 and `pip` installed.
- Install necessary libraries:
  `pip install stripe supabase`

## Technical Implementation

The following script allows you to extract active subscriptions from Stripe and perform an upsert operation into Supabase.

```python title="sync_stripe_supabase.py"
import stripe
from supabase import create_client, Client

# Configuration
STRIPE_API_KEY = "sk_test_..."
SUPABASE_URL = "https://your-project.supabase.co"
SUPABASE_KEY = "your_service_role_key"

# Initialization
stripe.api_key = STRIPE_API_KEY
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def sync_subscriptions():
    """Retrieve Stripe subscriptions and sync them into Supabase."""
    try:
        # 1. Fetch active subscriptions
        subscriptions = stripe.Subscription.list(status='active', limit=10)
        
        for sub in subscriptions.data:
            subscription_data = {
                "stripe_id": sub.id,
                "customer_id": sub.customer,
                "status": sub.status,
                "plan_id": sub.plan.id,
                "current_period_end": sub.current_period_end
            }
            
            # 2. Upsert into Supabase
            # Requires a UNIQUE constraint on 'stripe_id' in your table
            supabase.table("subscriptions").upsert(
                subscription_data, 
                on_conflict="stripe_id"
            ).execute()
            
            print(f"Subscription {sub.id} synced.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    sync_subscriptions()
```

:::danger[Security Warning]
For this sync, we use the `service_role` key. **Never expose it on the client side.** It must remain in your secure server environment only.
:::

## Conclusion
This automation allows you to keep a clean history in your database, perfect for building dashboards or triggering personalized transactional emails.
