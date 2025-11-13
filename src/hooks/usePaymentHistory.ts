import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  type: 'subscription' | 'one-time';
  invoiceUrl?: string | null;
}

export const usePaymentHistory = () => {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPayments([]);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase.functions.invoke('get-payment-history', {
        body: {},
      });

      if (fetchError) {
        setError(fetchError.message || 'Failed to fetch payment history');
        setPayments([]);
      } else if (data?.payments) {
        setPayments(data.payments as PaymentHistoryItem[]);
      } else {
        setPayments([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payment history');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    payments,
    loading,
    error,
    refetch: fetchPaymentHistory,
  };
};

