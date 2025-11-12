# Stripe Subscription Integration - Implementation Summary

## Overview

Complete Stripe subscription system has been implemented for Lupi MVP with support for:
- **Professional users**: Annual commitment (3-month trial) or monthly (1-month trial) at 14.90€/month
- **Guardian users**: Monthly subscription (1-month trial) at 4.90€/month or annual one-time purchase at 45€

## Files Created

### Database
- `supabase/migrations/20251107123537_create_subscriptions_table.sql` - Subscription table with enums, RLS policies, and indexes

### Frontend
- `src/lib/stripe.ts` - Stripe client initialization and plan configuration
- `src/lib/stripe-checkout.ts` - Checkout session and customer portal helpers
- `src/hooks/useSubscription.ts` - React hook for subscription status

### Backend (Edge Functions)
- `supabase/functions/stripe-webhook/index.ts` - Handles Stripe webhook events
- `supabase/functions/stripe-webhook/README.md` - Webhook setup instructions
- `supabase/functions/create-checkout-session/index.ts` - Creates Stripe Checkout sessions
- `supabase/functions/create-customer-portal-session/index.ts` - Creates Customer Portal sessions
- `supabase/functions/send-subscription-reminders/index.ts` - Sends email reminders
- `supabase/functions/send-subscription-reminders/README.md` - Reminder setup instructions

### Modified Files
- `src/pages/BillingSettings.tsx` - Integrated Stripe Checkout and subscription status display
- `package.json` - Added `@stripe/stripe-js` dependency

## Setup Instructions

### 1. Database Migration

Run the migration to create the subscriptions table:
```bash
supabase db push
# Or via Supabase Dashboard: SQL Editor > Run migration file
```

### 2. Stripe Configuration

#### Create Products & Prices in Stripe Dashboard:
1. **Professional Annual Plan** (`pro_annuel_14_90`)
   - Price: 14.90€/month
   - Billing period: Monthly
   - Trial period: 90 days
   - Note: Configure annual commitment in Stripe (12 billing cycles)

2. **Professional Monthly Plan** (`pro_mensuel_14_90`)
   - Price: 14.90€/month
   - Billing period: Monthly
   - Trial period: 30 days
   - No commitment

3. **Guardian Monthly Plan** (`gardien_mensuel_4_90`)
   - Price: 4.90€/month
   - Billing period: Monthly
   - Trial period: 30 days
   - No commitment

4. **Guardian Annual Plan** (`gardien_annuel_45`)
   - Price: 45€ one-time
   - No trial
   - No auto-renewal (one-time payment)

#### Environment Variables

**Frontend** (`.env` or Vite env):
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PRICE_ID_PRO_ANNUEL_14_90=price_...
VITE_STRIPE_PRICE_ID_PRO_MENSUEL_14_90=price_...
VITE_STRIPE_PRICE_ID_GARDIEN_MENSUEL_4_90=price_...
VITE_STRIPE_PRICE_ID_GARDIEN_ANNUEL_45=price_...
```

**Backend** (Supabase Dashboard > Settings > Edge Functions > Secrets):
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO_ANNUEL_14_90=price_...
STRIPE_PRICE_ID_PRO_MENSUEL_14_90=price_...
STRIPE_PRICE_ID_GARDIEN_MENSUEL_4_90=price_...
STRIPE_PRICE_ID_GARDIEN_ANNUEL_45=price_...
```

### 3. Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy stripe-webhook
npx supabase functions deploy create-checkout-session
npx supabase functions deploy create-customer-portal-session
npx supabase functions deploy send-subscription-reminders
```

### 4. Configure Stripe Webhook

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://[your-project-ref].supabase.co/functions/v1/stripe-webhook`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook signing secret to Supabase Edge Function secrets

### 5. Set Up Email Reminders (Optional)

Configure a daily cron job to call the reminder function:
- Via external scheduler (GitHub Actions, Vercel Cron, etc.)
- Or use Supabase pg_cron if available
- See `supabase/functions/send-subscription-reminders/README.md` for details

**Note**: The reminder function currently logs reminders. Integrate with an email service (SendGrid, Resend, etc.) to send actual emails.

### 6. Configure Stripe Customer Portal

In Stripe Dashboard > Settings > Billing > Customer Portal:
- Enable cancellation
- Allow customers to update payment methods
- Configure cancellation reasons if needed

## Testing

### Test Checkout Flow:
1. Navigate to `/profile/billing`
2. Click "Souscrire maintenant" on any plan
3. Complete Stripe Checkout (use test card: `4242 4242 4242 4242`)
4. Verify redirect back to billing page
5. Check subscription status displays correctly

### Test Webhook:
1. Use Stripe CLI: `stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook`
2. Trigger test events: `stripe trigger customer.subscription.created`
3. Verify subscription record created in database

### Test Subscription Status:
- Trial status: Shows "Essai en cours – se termine le [date]"
- Active status: Shows "Abonnement actif jusqu'au [date]"
- Canceled status: Shows "Abonnement annulé – accès jusqu'au [date]"

## Features Implemented

✅ Database schema with subscriptions table
✅ Stripe Checkout integration for all 4 plan types
✅ Webhook handling for subscription lifecycle events
✅ Subscription status display in BillingSettings
✅ Customer Portal integration for payment management
✅ Trial period tracking
✅ Email reminder function (needs email service integration)
✅ Real-time subscription updates via Supabase realtime

## Next Steps

1. **Email Service Integration**: Connect reminder function to actual email service
2. **Testing**: Test all flows in production-like environment
3. **Monitoring**: Set up error tracking for webhook failures
4. **Analytics**: Track subscription metrics (conversion rates, churn, etc.)

## Support

For issues or questions:
- Check Edge Function logs in Supabase Dashboard
- Verify Stripe webhook events in Stripe Dashboard
- Check database subscriptions table for data consistency

