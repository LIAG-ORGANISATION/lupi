# Stripe Webhook Edge Function

This Edge Function handles Stripe webhook events to keep subscription data in sync with the database.

## Setup

1. Deploy the function:
```bash
supabase functions deploy stripe-webhook
```

2. Set environment variables in Supabase Dashboard:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret
   - `STRIPE_PRICE_ID_PRO_ANNUEL_14_90`: Price ID for professional annual plan
   - `STRIPE_PRICE_ID_PRO_MENSUEL_14_90`: Price ID for professional monthly plan
   - `STRIPE_PRICE_ID_GARDIEN_MENSUEL_4_90`: Price ID for guardian monthly plan
   - `STRIPE_PRICE_ID_GARDIEN_ANNUEL_45`: Price ID for guardian annual plan

3. Configure webhook in Stripe Dashboard:
   - URL: `https://[your-project-ref].supabase.co/functions/v1/stripe-webhook`
   - Events to listen for:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

## How it works

The function verifies webhook signatures, then processes events to update the `subscriptions` table in the database.

