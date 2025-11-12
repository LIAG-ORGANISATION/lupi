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
      .select('stripe_customer_id')
      .eq('user_id', user_id)
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

    // Get trial period days
    const trialDays = getTrialDaysForPlanType(plan_type);

    // Create checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: plan_type === 'gardien_annuel_45' ? 'payment' : 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin') || 'http://localhost:5173'}/profile/billing?success=true`,
      cancel_url: `${req.headers.get('origin') || 'http://localhost:5173'}/profile/billing?canceled=true`,
      metadata: {
        user_id: user_id,
        plan_type: plan_type,
      },
    };

    // Add trial period for subscription plans
    if (trialDays > 0 && plan_type !== 'gardien_annuel_45') {
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
    pro_annuel_14_90: Deno.env.get('STRIPE_PRICE_ID_PRO_ANNUEL_14_90') || '',
    pro_mensuel_14_90: Deno.env.get('STRIPE_PRICE_ID_PRO_MENSUEL_14_90') || '',
    gardien_mensuel_4_90: Deno.env.get('STRIPE_PRICE_ID_GARDIEN_MENSUEL_4_90') || '',
    gardien_annuel_45: Deno.env.get('STRIPE_PRICE_ID_GARDIEN_ANNUEL_45') || '',
  };

  return priceIdMap[planType] || null;
}

function getTrialDaysForPlanType(planType: string): number {
  const trialDaysMap: Record<string, number> = {
    pro_annuel_14_90: 90,
    pro_mensuel_14_90: 30,
    gardien_mensuel_4_90: 30,
    gardien_annuel_45: 0,
  };

  return trialDaysMap[planType] || 0;
}

