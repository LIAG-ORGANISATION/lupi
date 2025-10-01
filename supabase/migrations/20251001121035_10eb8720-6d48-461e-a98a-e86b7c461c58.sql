-- Drop the duplicate trigger
DROP TRIGGER IF EXISTS on_auth_guardian_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_guardian_user();

-- Attach the existing handle_new_user function to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();