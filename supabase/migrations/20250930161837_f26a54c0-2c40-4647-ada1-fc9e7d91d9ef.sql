-- Corriger le trigger handle_new_user pour créer correctement les profils

-- D'abord, vérifier et corriger la fonction handle_new_user
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
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'profession', 'Non spécifié'),
      COALESCE(NEW.raw_user_meta_data->>'zone', 'Non spécifié')
    );
  -- Handle owner/guardian role - par défaut si pas de rôle spécifié
  ELSE
    INSERT INTO public.owners (user_id, full_name, email)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      NEW.email
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Créer les profils manquants pour les utilisateurs déjà inscrits
-- On récupère tous les users auth qui n'ont pas de profil
INSERT INTO public.owners (user_id, full_name, email)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', u.email::text),
  u.email
FROM auth.users u
LEFT JOIN public.owners o ON o.user_id = u.id
LEFT JOIN public.professionals p ON p.user_id = u.id
WHERE o.user_id IS NULL AND p.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;