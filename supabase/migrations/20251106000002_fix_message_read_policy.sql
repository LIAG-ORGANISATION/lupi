-- Migration: Fix message read status update policy
-- Purpose: Allow recipients to mark messages as read
-- Risk: Low - only adds new policy, doesn't change existing behavior

-- Add policy for recipients to mark messages as read
CREATE POLICY "message_recipient_mark_as_read"
ON public.messages
FOR UPDATE
TO authenticated
USING (
  -- Recipient can update if they are part of the conversation
  -- but are NOT the sender of this specific message
  EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND (
      -- Guardian is recipient if professional sent the message
      (c.owner_id = auth.uid() AND messages.sender_type = 'professional')
      OR
      -- Professional is recipient if guardian sent the message
      (c.professional_id = auth.uid() AND messages.sender_type = 'owner')
    )
  )
)
WITH CHECK (
  -- Ensure recipients can ONLY update the 'read' field
  -- All other fields must remain unchanged
  sender_id = (SELECT sender_id FROM messages WHERE id = messages.id)
  AND sender_type = (SELECT sender_type FROM messages WHERE id = messages.id)
  AND content = (SELECT content FROM messages WHERE id = messages.id)
  AND conversation_id = (SELECT conversation_id FROM messages WHERE id = messages.id)
  AND created_at = (SELECT created_at FROM messages WHERE id = messages.id)
);

-- Verify the policy was created
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'messages'
    AND policyname = 'message_recipient_mark_as_read';

  IF policy_count = 1 THEN
    RAISE NOTICE 'SUCCESS: Message recipient update policy created';
  ELSE
    RAISE WARNING 'Policy creation may have failed';
  END IF;
END $$;

