-- Create trigger function to automatically create owner profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_guardian_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create owner profile if role is guardian
  IF NEW.raw_user_meta_data->>'role' = 'guardian' THEN
    INSERT INTO public.owners (user_id, email, full_name)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to call the function on user creation
DROP TRIGGER IF EXISTS on_auth_guardian_user_created ON auth.users;
CREATE TRIGGER on_auth_guardian_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_guardian_user();