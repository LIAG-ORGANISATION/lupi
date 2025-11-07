import { supabase } from '@/integrations/supabase/client';
import { PlanType } from './stripe';

/**
 * Create a Stripe Checkout session for subscription
 * This calls a Supabase Edge Function to create the session securely
 */
export const createCheckoutSession = async (
  planType: PlanType,
  userId: string
): Promise<{ sessionId: string; url: string }> => {
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: {
      plan_type: planType,
      user_id: userId,
    },
  });

  if (error) {
    throw new Error(error.message || 'Failed to create checkout session');
  }

  if (!data?.sessionId || !data?.url) {
    throw new Error('Invalid response from checkout session creation');
  }

  return {
    sessionId: data.sessionId,
    url: data.url,
  };
};

/**
 * Redirect to Stripe Checkout
 */
export const redirectToCheckout = async (
  planType: PlanType,
  userId: string
): Promise<void> => {
  try {
    const { url } = await createCheckoutSession(planType, userId);
    window.location.href = url;
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
};

/**
 * Create a Stripe Customer Portal session for subscription management
 */
export const createCustomerPortalSession = async (
  returnUrl: string
): Promise<string> => {
  const { data, error } = await supabase.functions.invoke('create-customer-portal-session', {
    body: {
      return_url: returnUrl,
    },
  });

  if (error) {
    throw new Error(error.message || 'Failed to create customer portal session');
  }

  if (!data?.url) {
    throw new Error('Invalid response from customer portal session creation');
  }

  return data.url;
};

/**
 * Redirect to Stripe Customer Portal
 */
export const redirectToCustomerPortal = async (
  returnUrl: string = window.location.origin + '/profile/billing'
): Promise<void> => {
  try {
    const url = await createCustomerPortalSession(returnUrl);
    window.location.href = url;
  } catch (error) {
    console.error('Error redirecting to customer portal:', error);
    throw error;
  }
};

