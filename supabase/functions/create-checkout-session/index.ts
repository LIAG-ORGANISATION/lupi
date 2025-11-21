// Supabase Edge Function: Create Stripe Checkout Session
// Creates a Stripe Checkout session for subscription signup

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { plan_type, user_id } = await req.json();

    if (!plan_type || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing plan_type or user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user_id);
    if (userError || !userData?.user?.email) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userEmail = userData.user.email;

    // Get or create Stripe customer
    let customerId: string;
    
    // Check if customer already exists in database
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, has_premium_discount, discount_expiry')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existingSubscription?.stripe_customer_id) {
      customerId = existingSubscription.stripe_customer_id;
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          user_id: user_id,
        },
      });
      customerId = customer.id;
    }

    // Get price ID for plan type
    const priceId = getPriceIdForPlanType(plan_type);
    if (!priceId) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine if this is a one-time payment (DNA test) or subscription
    const isOneTime = plan_type === 'test_adn' || plan_type === 'gardien_annuel_45' || plan_type === 'premium_annuel_50';
    
    // Get trial period days (only for subscription plans)
    const trialDays = isOneTime ? 0 : getTrialDaysForPlanType(plan_type);

    // Check for existing discount eligibility (for Premium subscriptions only)
    let promotionCode: string | undefined;
    if (!isOneTime && (plan_type === 'premium_mensuel_4_99' || plan_type === 'premium_annuel_50')) {
      const hasDiscount = existingSubscription?.has_premium_discount === true;
      const discountNotExpired = existingSubscription?.discount_expiry 
        ? new Date(existingSubscription.discount_expiry) > new Date()
        : false;
      
      if (hasDiscount && discountNotExpired) {
        // Get promotion code from environment or retrieve from Stripe
        const promoCodeId = Deno.env.get('STRIPE_PROMOTION_CODE_ID_PREMIUM_DISCOUNT');
        if (promoCodeId) {
          promotionCode = promoCodeId;
        }
      }
    }

    // Determine success URL based on plan type
    const baseUrl = req.headers.get('origin') || 'http://localhost:5173';
    const successUrl = plan_type === 'test_adn'
      ? `${baseUrl}/dna-kit?success=true`
      : `${baseUrl}/profile/billing?success=true`;

    // Create checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: isOneTime ? 'payment' : 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: `${baseUrl}/profile/billing?canceled=true`,
      metadata: {
        user_id: user_id,
        plan_type: plan_type,
      },
    };

    // For DNA test, use customer_email instead of customer to avoid setup_future_usage
    // For subscriptions, use customer to maintain subscription history
    if (plan_type === 'test_adn') {
      sessionParams.customer_email = userEmail;
    } else {
      sessionParams.customer = customerId;
    }

    // Add promotion code if applicable
    if (promotionCode) {
      sessionParams.discounts = [{ promotion_code: promotionCode }];
    }

    // Add trial period for subscription plans
    if (trialDays > 0 && !isOneTime) {
      sessionParams.subscription_data = {
        trial_period_days: trialDays,
        metadata: {
          user_id: user_id,
          plan_type: plan_type,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getPriceIdForPlanType(planType: string): string | null {
  const priceIdMap: Record<string, string> = {
    // New Premium plans
    premium_mensuel_4_99: Deno.env.get('STRIPE_PRICE_ID_PREMIUM_MENSUEL_4_99') || '',
    premium_annuel_50: Deno.env.get('STRIPE_PRICE_ID_PREMIUM_ANNUEL_50') || '',
    test_adn: Deno.env.get('STRIPE_PRICE_ID_TEST_ADN') || '',
    // Legacy plans (kept for backward compatibility)
    pro_annuel_14_90: Deno.env.get('STRIPE_PRICE_ID_PRO_ANNUEL_14_90') || '',
    pro_mensuel_14_90: Deno.env.get('STRIPE_PRICE_ID_PRO_MENSUEL_14_90') || '',
    gardien_mensuel_4_90: Deno.env.get('STRIPE_PRICE_ID_GARDIEN_MENSUEL_4_90') || '',
    gardien_annuel_45: Deno.env.get('STRIPE_PRICE_ID_GARDIEN_ANNUEL_45') || '',
  };

  return priceIdMap[planType] || null;
}

function getTrialDaysForPlanType(planType: string): number {
  const trialDaysMap: Record<string, number> = {
    // New Premium plans - 90 days trial for all new guardians
    premium_mensuel_4_99: 90,
    premium_annuel_50: 90,
    test_adn: 0,
    // Legacy plans (kept for backward compatibility)
    pro_annuel_14_90: 90,
    pro_mensuel_14_90: 30,
    gardien_mensuel_4_90: 30,
    gardien_annuel_45: 0,
  };

  return trialDaysMap[planType] || 0;
}

