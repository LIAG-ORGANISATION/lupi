-- Migration: Update subscriptions table for Stripe v2
-- Purpose: Update plan types, add discount tracking fields
-- Risk: Medium - modifies enum and adds columns

-- Add new plan types to enum (keeping old ones for backward compatibility)
ALTER TYPE subscription_plan_type ADD VALUE IF NOT EXISTS 'premium_mensuel_4_99';
ALTER TYPE subscription_plan_type ADD VALUE IF NOT EXISTS 'premium_annuel_50';
ALTER TYPE subscription_plan_type ADD VALUE IF NOT EXISTS 'test_adn';

-- Add discount tracking columns to subscriptions table
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS has_premium_discount BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS discount_expiry TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS stripe_promotion_code_id TEXT;

-- Create index for discount queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_discount_expiry 
ON public.subscriptions(discount_expiry) 
WHERE has_premium_discount = TRUE;

-- Migrate existing guardian subscriptions to new plan types
-- Note: This is optional - you may want to keep old plan types for historical data
-- Uncomment if you want to migrate existing data:
-- UPDATE public.subscriptions
-- SET plan_type = 'premium_mensuel_4_99'
-- WHERE plan_type = 'gardien_mensuel_4_90';
--
-- UPDATE public.subscriptions
-- SET plan_type = 'premium_annuel_50'
-- WHERE plan_type = 'gardien_annuel_45';

-- Add comment to document the migration
COMMENT ON COLUMN public.subscriptions.has_premium_discount IS 'Indicates if user has a 50% discount from DNA test purchase';
COMMENT ON COLUMN public.subscriptions.discount_expiry IS 'Expiry date for the premium discount (12 months from DNA test purchase)';
COMMENT ON COLUMN public.subscriptions.stripe_promotion_code_id IS 'Stripe promotion code ID applied to subscription';

