# Stripe Subscription Integration - Implementation Summary (v2)

## Overview

Complete Stripe subscription system has been implemented for Lupi MVP with support for:
- **Premium Health Record (CDS - Premium)**: Monthly subscription (4.99€/month) or annual subscription (50€/year), both with 90-day free trial
- **DNA Test**: One-time purchase at 187.70€
- **Automatic Discount**: 50% discount on Premium subscriptions for 12 months when DNA test is purchased

## Files Created

### Database
- `supabase/migrations/20251107123537_create_subscriptions_table.sql` - Subscription table with enums, RLS policies, and indexes
- `supabase/migrations/20251113133607_update_subscriptions_v2.sql` - Migration to v2: new plan types and discount tracking fields

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
1. **Premium Monthly Plan** (`premium_mensuel_4_99`)
   - Price: 4.99€/month
   - Billing period: Monthly (recurring)
   - Trial period: 90 days
   - No commitment

2. **Premium Annual Plan** (`premium_annuel_50`)
   - Price: 50€/year
   - Billing period: Yearly (recurring)
   - Trial period: 90 days
   - No commitment

3. **DNA Test Product** (`test_adn`)
   - Price: 187.70€
   - One-time payment (not a subscription)
   - No trial

#### Create Discount Coupon & Promotion Code:
1. **Coupon**: 50% off, repeating, duration 12 months
   - Name: "Premium Discount - DNA Test"
   - Percent off: 50%
   - Duration: Repeating
   - Duration in months: 12

2. **Promotion Code**: Non-public, linked to coupon above
   - Active: true
   - Not visible to customers (backend-only)
   - This will be automatically created by the webhook if not provided via environment variable

#### Environment Variables

**Frontend** (`.env` or Vite env):
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PRICE_ID_PREMIUM_MENSUEL_4_99=price_...
VITE_STRIPE_PRICE_ID_PREMIUM_ANNUEL_50=price_...
VITE_STRIPE_PRICE_ID_TEST_ADN=price_...
```

**Backend** (Supabase Dashboard > Settings > Edge Functions > Secrets):
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PREMIUM_MENSUEL_4_99=price_...
STRIPE_PRICE_ID_PREMIUM_ANNUEL_50=price_...
STRIPE_PRICE_ID_TEST_ADN=price_...
STRIPE_COUPON_ID_PREMIUM_DISCOUNT=coupon_... (optional - will be auto-created if not provided)
STRIPE_PROMOTION_CODE_ID_PREMIUM_DISCOUNT=promo_... (optional - will be auto-created if not provided)
```

**Note**: Legacy plan types (`pro_annuel_14_90`, `pro_mensuel_14_90`, `gardien_mensuel_4_90`, `gardien_annuel_45`) are kept for backward compatibility but are no longer used for new subscriptions.

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
   - `checkout.session.completed` (NEW - for DNA test discount logic)
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

✅ Database schema with subscriptions table and discount tracking
✅ Stripe Checkout integration for Premium plans and DNA test
✅ Webhook handling for subscription lifecycle events
✅ Automatic 50% discount application when DNA test is purchased
✅ Discount logic: applies to existing subscriptions or stores for future subscriptions
✅ Subscription status display in BillingSettings
✅ Customer Portal integration for payment management
✅ Trial period tracking (90 days for all new Premium subscriptions)
✅ Email reminder function (needs email service integration)
✅ Real-time subscription updates via Supabase realtime

## Discount Logic

When a user purchases a DNA test (187.70€):
1. **If user has active Premium subscription**: Discount is applied immediately to the subscription
2. **If user is in freemium/trial**: Discount is stored in database and applied when they subscribe after trial ends
3. **Discount duration**: 12 months from DNA test purchase date
4. **Discount amount**: 50% off Premium subscription (monthly or annual)
5. **Non-cumulative**: Only one discount can be active at a time

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

