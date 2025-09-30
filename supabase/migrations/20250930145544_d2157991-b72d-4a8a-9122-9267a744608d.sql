-- Drop the problematic triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_professional();
DROP FUNCTION IF EXISTS public.handle_new_guardian();

-- Create a single, corrected trigger function that handles both roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Handle professional role
  IF NEW.raw_user_meta_data->>'role' = 'professional' THEN
    INSERT INTO public.professional_profiles (id, full_name, email, profession, zone)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'full_name',
      NEW.email,
      NEW.raw_user_meta_data->>'profession',
      NEW.raw_user_meta_data->>'zone'
    );
  -- Handle guardian role
  ELSIF NEW.raw_user_meta_data->>'role' = 'guardian' THEN
    INSERT INTO public.dog_owner_profiles (id, full_name, email)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'full_name',
      NEW.email
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();