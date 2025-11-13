import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

export const getStripe = (): Promise<Stripe | null> => {
  return stripePromise;
};

// Plan type definitions matching database enum
export type PlanType = 
  | 'premium_mensuel_4_99'
  | 'premium_annuel_50'
  | 'test_adn'
  // Legacy plan types (kept for backward compatibility)
  | 'pro_annuel_14_90'
  | 'pro_mensuel_14_90'
  | 'gardien_mensuel_4_90'
  | 'gardien_annuel_45';

// Plan configuration
export const PLAN_CONFIG: Record<PlanType, {
  name: string;
  price: string;
  trialDays: number;
  isAnnual: boolean;
  hasCommitment: boolean;
  isOneTime?: boolean;
}> = {
  premium_mensuel_4_99: {
    name: 'Carnet de Santé Premium - Mensuel',
    price: '4,99€',
    trialDays: 90,
    isAnnual: false,
    hasCommitment: false,
  },
  premium_annuel_50: {
    name: 'Carnet de Santé Premium - Annuel',
    price: '50€',
    trialDays: 90,
    isAnnual: true,
    hasCommitment: false,
  },
  test_adn: {
    name: 'Test ADN',
    price: '187,70€',
    trialDays: 0,
    isAnnual: false,
    hasCommitment: false,
    isOneTime: true,
  },
  // Legacy plans (kept for backward compatibility)
  pro_annuel_14_90: {
    name: 'Abonnement Professionnel Annuel',
    price: '14,90€',
    trialDays: 90,
    isAnnual: false, // Monthly billing with annual commitment
    hasCommitment: true,
  },
  pro_mensuel_14_90: {
    name: 'Abonnement Professionnel Mensuel',
    price: '14,90€',
    trialDays: 30,
    isAnnual: false,
    hasCommitment: false,
  },
  gardien_mensuel_4_90: {
    name: 'Formule Mensuelle',
    price: '4,90€',
    trialDays: 30,
    isAnnual: false,
    hasCommitment: false,
  },
  gardien_annuel_45: {
    name: 'Formule Annuelle',
    price: '45€',
    trialDays: 0, // No trial for one-time purchase
    isAnnual: true,
    hasCommitment: false,
  },
};

// Get Stripe Price ID from environment variables
export const getStripePriceId = (planType: PlanType): string => {
  const envKey = `VITE_STRIPE_PRICE_ID_${planType.toUpperCase()}`;
  const priceId = import.meta.env[envKey];
  
  if (!priceId) {
    throw new Error(`Stripe Price ID not configured for plan: ${planType}`);
  }
  
  return priceId;
};

