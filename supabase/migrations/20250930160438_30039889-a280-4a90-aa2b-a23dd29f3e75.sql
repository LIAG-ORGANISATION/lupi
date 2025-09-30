-- Fix infinite recursion in RLS policies by using security definer functions

-- Drop existing problematic policies
DROP POLICY IF EXISTS "pros_read_shared_dogs" ON dogs;
DROP POLICY IF EXISTS "pro can read docs for shared dogs" ON dog_documents;

-- Create a security definer function to check if a professional has access to a dog
CREATE OR REPLACE FUNCTION public.professional_has_dog_access(
  _dog_id uuid,
  _professional_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM dog_shares
    WHERE dog_id = _dog_id
      AND professional_id = _professional_id
      AND status = 'accepted'
      AND (expires_at IS NULL OR expires_at > now())
  );
$$;

-- Recreate the policy for professionals to read shared dogs using the function
CREATE POLICY "pros_read_shared_dogs"
ON dogs
FOR SELECT
TO authenticated
USING (
  public.professional_has_dog_access(id, auth.uid())
);

-- Recreate the policy for professionals to read documents using the function
CREATE POLICY "pro can read docs for shared dogs"
ON dog_documents
FOR SELECT
TO authenticated
USING (
  public.professional_has_dog_access(dog_id, auth.uid())
);