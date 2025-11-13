// Supabase Edge Function: Get Payment History
// Fetches invoice history from Stripe for the authenticated user

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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's Stripe customer ID from subscriptions table
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // If no subscription found, check if customer exists by looking up via email
    let customerId: string | null = null;
    
    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id;
    } else {
      // Try to find customer by email as fallback
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser?.email) {
        const customers = await stripe.customers.list({
          email: authUser.email,
          limit: 1,
        });
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        }
      }
    }

    if (!customerId) {
      // Return empty array if no customer found
      return new Response(
        JSON.stringify({ payments: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 30, // Limit to last 30 invoices
      expand: ['data.subscription', 'data.payment_intent'],
    });

    // Format invoices for frontend
    const payments = invoices.data
      .filter(invoice => invoice.status === 'paid' || invoice.status === 'open') // Only show paid or open invoices
      .map(invoice => {
        // Determine payment type and description
        let description = 'Paiement';
        let type: 'subscription' | 'one-time' = 'one-time';

        if (invoice.subscription) {
          type = 'subscription';
          // Try to get product name from line items
          const lineItem = invoice.lines.data[0];
          if (lineItem?.description) {
            description = lineItem.description;
          } else if (lineItem?.price?.nickname) {
            description = lineItem.price.nickname;
          } else if (lineItem?.price?.product) {
            // Could expand product here if needed
            description = 'Abonnement Premium';
          } else {
            description = 'Abonnement Premium';
          }
        } else {
          // One-time payment - check line items for description
          const lineItem = invoice.lines.data[0];
          if (lineItem?.description) {
            description = lineItem.description;
          } else if (lineItem?.price?.nickname) {
            description = lineItem.price.nickname;
          } else {
            description = 'Paiement unique';
          }
        }

        // Format description based on plan type if available
        if (invoice.metadata?.plan_type) {
          const planType = invoice.metadata.plan_type;
          if (planType === 'test_adn') {
            description = 'Test ADN';
          } else if (planType === 'premium_mensuel_4_99') {
            description = 'Abonnement Premium Mensuel';
          } else if (planType === 'premium_annuel_50') {
            description = 'Abonnement Premium Annuel';
          }
        }

        return {
          id: invoice.id,
          date: new Date(invoice.created * 1000).toISOString(),
          description: description,
          amount: invoice.amount_paid / 100, // Convert from cents to euros
          currency: invoice.currency.toUpperCase(),
          status: invoice.status,
          type: type,
          invoiceUrl: invoice.hosted_invoice_url,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, most recent first

    return new Response(
      JSON.stringify({ payments }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

