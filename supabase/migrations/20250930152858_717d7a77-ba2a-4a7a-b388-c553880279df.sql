-- Create share permission and status enums
CREATE TYPE share_permission AS ENUM ('read', 'write_notes');
CREATE TYPE share_status AS ENUM ('pending', 'accepted', 'revoked', 'expired');

-- Rename existing tables to match new architecture
ALTER TABLE dog_owner_profiles RENAME TO owners;
ALTER TABLE professional_profiles RENAME TO professionals;

-- Update owners structure
ALTER TABLE owners
  RENAME COLUMN id TO user_id;

-- Update professionals structure
ALTER TABLE professionals
  RENAME COLUMN id TO user_id;

-- Update dogs table to reference owners
ALTER TABLE dogs
  DROP CONSTRAINT IF EXISTS dogs_owner_id_fkey,
  ADD CONSTRAINT dogs_owner_id_fkey 
    FOREIGN KEY (owner_id) 
    REFERENCES owners(user_id) 
    ON DELETE CASCADE;

-- Create dog_shares table
CREATE TABLE dog_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id UUID NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(user_id) ON DELETE CASCADE,
  permission share_permission NOT NULL DEFAULT 'read',
  status share_status NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (dog_id, professional_id)
);

-- Enable RLS on dog_shares
ALTER TABLE dog_shares ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on dogs and recreate with new logic
DROP POLICY IF EXISTS "Owners can view their own dogs" ON dogs;
DROP POLICY IF EXISTS "Owners can insert their own dogs" ON dogs;
DROP POLICY IF EXISTS "Owners can update their own dogs" ON dogs;
DROP POLICY IF EXISTS "Owners can delete their own dogs" ON dogs;
DROP POLICY IF EXISTS "Professionals can view dogs they have access to" ON dogs;

-- OWNERS: full access to their own dogs
CREATE POLICY "owners_full_access_own_dogs"
  ON dogs FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- PROS: read access to shared dogs (accepted, non-expired)
CREATE POLICY "pros_read_shared_dogs"
  ON dogs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dog_shares s
      WHERE s.dog_id = dogs.id
        AND s.professional_id = auth.uid()
        AND s.status = 'accepted'
        AND (s.expires_at IS NULL OR s.expires_at > now())
    )
  );

-- DOG_SHARES policies
-- Owner can manage shares for their own dogs
CREATE POLICY "owner_manage_shares_own_dogs"
  ON dog_shares FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM dogs d 
      WHERE d.id = dog_shares.dog_id 
        AND d.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dogs d 
      WHERE d.id = dog_shares.dog_id 
        AND d.owner_id = auth.uid()
    )
  );

-- Professional can view shares that concern them
CREATE POLICY "pro_read_own_shares"
  ON dog_shares FOR SELECT
  USING (professional_id = auth.uid());

-- Professional can update status of shares directed to them
CREATE POLICY "pro_update_own_share_status"
  ON dog_shares FOR UPDATE
  USING (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

-- Create view for professionals to see their patients
CREATE OR REPLACE VIEW patients_for_pro AS
SELECT d.*
FROM dogs d
JOIN dog_shares s ON s.dog_id = d.id
WHERE s.professional_id = auth.uid()
  AND s.status = 'accepted'
  AND (s.expires_at IS NULL OR s.expires_at > now());

-- Create trigger for updated_at on dog_shares
CREATE TRIGGER update_dog_shares_updated_at
  BEFORE UPDATE ON dog_shares
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update handle_new_user function to use new table names
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Handle professional role
  IF NEW.raw_user_meta_data->>'role' = 'professional' THEN
    INSERT INTO public.professionals (user_id, full_name, email, profession, zone)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'full_name',
      NEW.email,
      NEW.raw_user_meta_data->>'profession',
      NEW.raw_user_meta_data->>'zone'
    );
  -- Handle owner/guardian role
  ELSIF NEW.raw_user_meta_data->>'role' = 'guardian' OR NEW.raw_user_meta_data->>'role' = 'owner' THEN
    INSERT INTO public.owners (user_id, full_name, email)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'full_name',
      NEW.email
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update RLS policies for renamed tables
DROP POLICY IF EXISTS "Dog owners can insert their own profile" ON owners;
DROP POLICY IF EXISTS "Dog owners can update their own profile" ON owners;
DROP POLICY IF EXISTS "Dog owners can view all dog owner profiles" ON owners;

CREATE POLICY "owners_insert_own_profile"
  ON owners FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "owners_update_own_profile"
  ON owners FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "owners_view_all_profiles"
  ON owners FOR SELECT
  USING (true);

-- Update RLS policies for professionals
DROP POLICY IF EXISTS "Professionals can insert their own profile" ON professionals;
DROP POLICY IF EXISTS "Professionals can update their own profile" ON professionals;
DROP POLICY IF EXISTS "Professionals can view all professional profiles" ON professionals;

CREATE POLICY "pros_insert_own_profile"
  ON professionals FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "pros_update_own_profile"
  ON professionals FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "pros_view_all_profiles"
  ON professionals FOR SELECT
  USING (true);