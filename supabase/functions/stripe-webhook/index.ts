// Supabase Edge Function: Stripe Webhook Handler
// Handles Stripe webhook events to sync subscription status with database

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

serve(async (req) => {
  try {
    // Verify webhook signature
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'No signature found' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      return new Response(
        JSON.stringify({ error: 'Webhook secret not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(supabase, session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(supabase, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );
          await handleSubscriptionUpdate(supabase, subscription);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await handlePaymentFailed(supabase, invoice.subscription as string);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

async function handleCheckoutSessionCompleted(
  supabase: any,
  session: Stripe.Checkout.Session
) {
  const planType = session.metadata?.plan_type;
  const userId = session.metadata?.user_id;

  if (!userId) {
    console.error('No user_id found in checkout session metadata');
    return;
  }

  // Check if this is a DNA test purchase
  if (planType === 'test_adn') {
    await handleDNATestPurchase(supabase, userId, session.customer as string);
  }
}

async function handleDNATestPurchase(
  supabase: any,
  userId: string,
  customerId: string
) {
  // Get or create coupon and promotion code
  const { couponId, promotionCodeId } = await getOrCreateDiscountCoupon();

  // Check if user has an active Premium subscription
  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .in('plan_type', ['premium_mensuel_4_99', 'premium_annuel_50'])
    .in('status', ['trial', 'active'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (existingSubscription?.stripe_subscription_id) {
    // User has active Premium subscription - apply discount immediately
    try {
      await stripe.subscriptions.update(existingSubscription.stripe_subscription_id, {
        coupon: couponId,
        promotion_code: promotionCodeId,
      });

      // Update database with promotion code
      await supabase
        .from('subscriptions')
        .update({
          has_premium_discount: true,
          discount_expiry: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 12 months from now
          stripe_promotion_code_id: promotionCodeId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingSubscription.id);

      console.log(`Applied discount to existing subscription for user ${userId}`);
    } catch (error) {
      console.error('Error applying discount to existing subscription:', error);
    }
  } else {
    // User is in freemium/trial - store discount for later application
    const discountExpiry = new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString(); // 12 months from now

    // Check if user has any subscription record (even if expired)
    const { data: anySubscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (anySubscription) {
      // Update existing subscription record
      await supabase
        .from('subscriptions')
        .update({
          has_premium_discount: true,
          discount_expiry: discountExpiry,
          stripe_promotion_code_id: promotionCodeId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', anySubscription.id);
    } else {
      // Create a new subscription record to store discount info
      // This is a special case for users who haven't subscribed yet
      await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          stripe_customer_id: customerId,
          plan_type: 'premium_mensuel_4_99', // Placeholder, will be updated when they subscribe
          status: 'trial',
          has_premium_discount: true,
          discount_expiry: discountExpiry,
          stripe_promotion_code_id: promotionCodeId,
        });
    }

    console.log(`Stored discount for future application for user ${userId}`);
  }
}

async function getOrCreateDiscountCoupon(): Promise<{ couponId: string; promotionCodeId: string }> {
  // Check if coupon ID is in environment (pre-created)
  let couponId = Deno.env.get('STRIPE_COUPON_ID_PREMIUM_DISCOUNT');
  let promotionCodeId = Deno.env.get('STRIPE_PROMOTION_CODE_ID_PREMIUM_DISCOUNT');

  if (couponId && promotionCodeId) {
    return { couponId, promotionCodeId };
  }

  // Create coupon if it doesn't exist
  if (!couponId) {
    const coupon = await stripe.coupons.create({
      percent_off: 50,
      duration: 'repeating',
      duration_in_months: 12,
      name: 'Premium Discount - DNA Test',
    });
    couponId = coupon.id;
    console.log(`Created coupon: ${couponId}`);
  }

  // Create promotion code if it doesn't exist
  if (!promotionCodeId) {
    const promotionCode = await stripe.promotionCodes.create({
      coupon: couponId,
      active: true,
    });
    promotionCodeId = promotionCode.id;
    console.log(`Created promotion code: ${promotionCodeId}`);
  }

  return { couponId, promotionCodeId };
}

async function handleSubscriptionUpdate(
  supabase: any,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;
  
  // Get user_id from customer metadata or lookup
  const customer = await stripe.customers.retrieve(customerId);
  const userId = (customer as Stripe.Customer).metadata?.user_id;
  
  if (!userId) {
    console.error('No user_id found in customer metadata');
    return;
  }

  // Determine plan type from price ID
  const priceId = subscription.items.data[0]?.price.id;
  const planType = await getPlanTypeFromPriceId(priceId);
  
  if (!planType) {
    console.error(`Unknown price ID: ${priceId}`);
    return;
  }

  // Check if this is a Premium subscription and user has a pending discount
  const isPremiumPlan = planType === 'premium_mensuel_4_99' || planType === 'premium_annuel_50';
  
  if (isPremiumPlan && subscription.status === 'active' && !subscription.discount) {
    // Check if user has a stored discount that hasn't been applied
    const { data: subscriptionData } = await supabase
      .from('subscriptions')
      .select('has_premium_discount, discount_expiry, stripe_promotion_code_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subscriptionData?.has_premium_discount && subscriptionData?.stripe_promotion_code_id) {
      const discountNotExpired = subscriptionData.discount_expiry
        ? new Date(subscriptionData.discount_expiry) > new Date()
        : false;

      if (discountNotExpired) {
        // Apply discount to subscription
        try {
          await stripe.subscriptions.update(subscription.id, {
            promotion_code: subscriptionData.stripe_promotion_code_id,
          });
          console.log(`Applied stored discount to new subscription for user ${userId}`);
        } catch (error) {
          console.error('Error applying stored discount:', error);
        }
      }
    }
  }

  // Determine status
  let status: string;
  if (subscription.status === 'trialing') {
    status = 'trial';
  } else if (subscription.status === 'active') {
    status = 'active';
  } else if (subscription.status === 'past_due') {
    status = 'past_due';
  } else if (subscription.status === 'canceled' || subscription.cancel_at_period_end) {
    status = 'canceled';
  } else {
    status = 'expired';
  }

  // Get discount info from subscription
  const discountExpiry = subscription.discount?.end
    ? new Date(subscription.discount.end * 1000).toISOString()
    : null;
  const hasDiscount = !!subscription.discount;
  const promotionCodeId = subscription.discount?.promotion_code as string || null;

  // Upsert subscription record
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      user_id: userId,
      plan_type: planType,
      status: status,
      trial_start: subscription.trial_start
        ? new Date(subscription.trial_start * 1000).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      current_period_start: subscription.current_period_start
        ? new Date(subscription.current_period_start * 1000).toISOString()
        : null,
      current_period_end: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      has_premium_discount: hasDiscount,
      discount_expiry: discountExpiry,
      stripe_promotion_code_id: promotionCodeId,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'stripe_subscription_id',
    });

  if (error) {
    console.error('Error upserting subscription:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(
  supabase: any,
  subscription: Stripe.Subscription
) {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating deleted subscription:', error);
    throw error;
  }
}

async function handlePaymentFailed(
  supabase: any,
  subscriptionId: string
) {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('Error updating payment failed subscription:', error);
    throw error;
  }
}

async function getPlanTypeFromPriceId(priceId: string): Promise<string | null> {
  // This should match the price IDs configured in Stripe Dashboard
  // You can also fetch from Stripe API, but for performance, we'll use env vars
  const priceIdMap: Record<string, string> = {
    // New Premium plans
    [Deno.env.get('STRIPE_PRICE_ID_PREMIUM_MENSUEL_4_99') || '']: 'premium_mensuel_4_99',
    [Deno.env.get('STRIPE_PRICE_ID_PREMIUM_ANNUEL_50') || '']: 'premium_annuel_50',
    [Deno.env.get('STRIPE_PRICE_ID_TEST_ADN') || '']: 'test_adn',
    // Legacy plans (kept for backward compatibility)
    [Deno.env.get('STRIPE_PRICE_ID_PRO_ANNUEL_14_90') || '']: 'pro_annuel_14_90',
    [Deno.env.get('STRIPE_PRICE_ID_PRO_MENSUEL_14_90') || '']: 'pro_mensuel_14_90',
    [Deno.env.get('STRIPE_PRICE_ID_GARDIEN_MENSUEL_4_90') || '']: 'gardien_mensuel_4_90',
    [Deno.env.get('STRIPE_PRICE_ID_GARDIEN_ANNUEL_45') || '']: 'gardien_annuel_45',
  };

  return priceIdMap[priceId] || null;
}

