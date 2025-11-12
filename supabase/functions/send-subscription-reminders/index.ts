// Supabase Edge Function: Send Subscription Reminders
// Sends email reminders for trial endings and annual subscription expirations
// Should be called via cron job (e.g., daily)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { format, addDays, differenceInDays } from 'https://esm.sh/date-fns@3.6.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

serve(async (req) => {
  try {
    // Initialize Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const today = new Date();
    const threeDaysFromNow = addDays(today, 3);
    const fifteenDaysFromNow = addDays(today, 15);

    // Find subscriptions with trial ending in 3 days
    const { data: trialEndingSubscriptions, error: trialError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'trial')
      .gte('trial_end', today.toISOString())
      .lte('trial_end', threeDaysFromNow.toISOString());

    if (trialError) {
      console.error('Error fetching trial ending subscriptions:', trialError);
    }

    // Find gardien_annuel_45 subscriptions expiring in 15 days
    const { data: annualExpiringSubscriptions, error: annualError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('plan_type', 'gardien_annuel_45')
      .eq('status', 'active')
      .gte('current_period_end', today.toISOString())
      .lte('current_period_end', fifteenDaysFromNow.toISOString());

    if (annualError) {
      console.error('Error fetching annual expiring subscriptions:', annualError);
    }

    const results = {
      trialRemindersSent: 0,
      annualRemindersSent: 0,
      errors: [] as string[],
    };

    // Send trial ending reminders
    if (trialEndingSubscriptions) {
      for (const subscription of trialEndingSubscriptions) {
        try {
          // Get user email from auth.users
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
            subscription.user_id
          );

          if (userError || !userData?.user?.email) {
            results.errors.push(`User not found for subscription ${subscription.id}`);
            continue;
          }

          const userEmail = userData.user.email;
          const trialEndDate = subscription.trial_end 
            ? format(new Date(subscription.trial_end), 'd MMMM yyyy', { locale: 'fr' })
            : 'bientôt';

          // Send email via Supabase Auth (or your email service)
          // Note: You may need to integrate with a proper email service like SendGrid, Resend, etc.
          // For now, we'll log the reminder
          console.log(`Trial ending reminder for ${userEmail}: Trial ends on ${trialEndDate}`);

          // TODO: Implement actual email sending
          // Example with Supabase Auth email:
          // await supabase.auth.admin.generateLink({
          //   type: 'magiclink',
          //   email: userEmail,
          //   options: {
          //     emailRedirectTo: `${req.headers.get('origin')}/profile/billing`,
          //   },
          // });

          results.trialRemindersSent++;
        } catch (error) {
          results.errors.push(`Error sending trial reminder for subscription ${subscription.id}: ${error.message}`);
        }
      }
    }

    // Send annual expiration reminders
    if (annualExpiringSubscriptions) {
      for (const subscription of annualExpiringSubscriptions) {
        try {
          // Get user email from auth.users
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
            subscription.user_id
          );

          if (userError || !userData?.user?.email) {
            results.errors.push(`User not found for subscription ${subscription.id}`);
            continue;
          }

          const userEmail = userData.user.email;
          const expirationDate = subscription.current_period_end
            ? format(new Date(subscription.current_period_end), 'd MMMM yyyy', { locale: 'fr' })
            : 'bientôt';

          // Send email reminder
          console.log(`Annual expiration reminder for ${userEmail}: Subscription expires on ${expirationDate}`);

          // TODO: Implement actual email sending
          results.annualRemindersSent++;
        } catch (error) {
          results.errors.push(`Error sending annual reminder for subscription ${subscription.id}: ${error.message}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        ...results,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Reminder function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

