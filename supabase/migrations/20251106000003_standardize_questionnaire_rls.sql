-- Migration: Standardize dog_questionnaires RLS pattern
-- Purpose: Use professional_has_dog_access() function for consistency
-- Risk: Low - policy replacement, same logic

-- Drop existing policy
DROP POLICY IF EXISTS "pros_read_shared_dog_questionnaires" ON public.dog_questionnaires;

-- Recreate using standard function pattern
CREATE POLICY "pros_read_shared_dog_questionnaires"
ON public.dog_questionnaires
FOR SELECT
TO authenticated
USING (
  -- Use the same security definer function as other tables
  public.professional_has_dog_access(dog_id, auth.uid())
);

-- Verify the policy was updated
DO $$
DECLARE
  policy_qual TEXT;
BEGIN
  SELECT qual INTO policy_qual
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'dog_questionnaires'
    AND policyname = 'pros_read_shared_dog_questionnaires';

  IF policy_qual LIKE '%professional_has_dog_access%' THEN
    RAISE NOTICE 'SUCCESS: Policy now uses professional_has_dog_access() function';
  ELSE
    RAISE WARNING 'Policy may not be using the correct function';
  END IF;
END $$;

