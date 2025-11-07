# Subscription Reminders Edge Function

This Edge Function sends email reminders for:
- Trial periods ending in 3 days
- Annual subscriptions (`gardien_annuel_45`) expiring in 15 days

## Setup

1. Deploy the function:
```bash
supabase functions deploy send-subscription-reminders
```

2. Set up a cron job to call this function daily:
   - Via Supabase Dashboard: Go to Database > Cron Jobs
   - Or use an external scheduler (e.g., GitHub Actions, cron-job.org)
   - Call: `https://[your-project-ref].supabase.co/functions/v1/send-subscription-reminders`

## Cron Job Configuration

### Using Supabase pg_cron (if available):

```sql
-- Run daily at 9 AM UTC
SELECT cron.schedule(
  'send-subscription-reminders',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://[your-project-ref].supabase.co/functions/v1/send-subscription-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer [your-anon-key]'
    )
  );
  $$
);
```

### Using External Scheduler:

Set up a daily cron job (e.g., via GitHub Actions, Vercel Cron, or cron-job.org) to call:
```
POST https://[your-project-ref].supabase.co/functions/v1/send-subscription-reminders
Headers:
  Authorization: Bearer [your-anon-key]
```

## Email Integration

**Note**: This function currently logs reminders. To send actual emails, you need to:

1. Integrate with an email service (SendGrid, Resend, AWS SES, etc.)
2. Or use Supabase's built-in email functionality
3. Update the TODO sections in the code with your email sending logic

Example with Resend:
```typescript
import { Resend } from 'https://esm.sh/resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

await resend.emails.send({
  from: 'Lupi <noreply@lupi.com>',
  to: userEmail,
  subject: 'Votre essai se termine bientôt',
  html: `...`,
});
```

## Testing

Test manually by calling the function:
```bash
curl -X POST https://[your-project-ref].supabase.co/functions/v1/send-subscription-reminders \
  -H "Authorization: Bearer [your-anon-key]"
```

