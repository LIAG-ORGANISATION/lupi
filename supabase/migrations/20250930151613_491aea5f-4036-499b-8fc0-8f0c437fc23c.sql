-- Create professions table
CREATE TABLE public.professions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create specialisations table
CREATE TABLE public.specialisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profession_specialisation junction table
CREATE TABLE public.profession_specialisation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profession_id UUID REFERENCES public.professions(id) ON DELETE CASCADE NOT NULL,
  specialisation_id UUID REFERENCES public.specialisations(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(profession_id, specialisation_id)
);

-- Enable RLS
ALTER TABLE public.professions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profession_specialisation ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (needed for dropdowns)
CREATE POLICY "Anyone can view professions" ON public.professions FOR SELECT USING (true);
CREATE POLICY "Anyone can view specialisations" ON public.specialisations FOR SELECT USING (true);
CREATE POLICY "Anyone can view profession_specialisation" ON public.profession_specialisation FOR SELECT USING (true);

-- Insert professions
INSERT INTO public.professions (label) VALUES
  ('Vétérinaire'),
  ('Comportementaliste canin'),
  ('Éducateur canin / dresseur'),
  ('Toiletteur'),
  ('Pet sitter (garde d''animaux)'),
  ('Promeneur de chiens'),
  ('Nutritionniste animalier'),
  ('Ostéopathe animalier'),
  ('Kinésithérapeute canin'),
  ('Responsable refuge / association');

-- Insert specialisations
INSERT INTO public.specialisations (label) VALUES
  -- Vétérinaire
  ('Médecine générale'),
  ('Chirurgie'),
  ('Dermatologie'),
  ('Ophtalmologie'),
  ('Reproduction'),
  ('Imagerie'),
  ('Anesthésie & douleur'),
  ('Nutrition clinique'),
  ('Suivi vaccinal'),
  -- Comportementaliste
  ('Réactivité en laisse'),
  ('Phobies & bruits'),
  ('Anxiété de séparation'),
  ('Gestion de l''agressivité'),
  ('Socialisation chiots'),
  -- Éducateur
  ('Obéissance de base'),
  ('Rappel'),
  ('Marche en laisse'),
  ('Sports canins / agility'),
  ('Tricks avancés'),
  -- Toiletteur
  ('Bain & brushing'),
  ('Coupe ciseaux'),
  ('Tonte'),
  ('Trimming'),
  ('Soins oreilles & griffes'),
  -- Nutritionniste
  ('BARF / cru'),
  ('Allergies & intolérances'),
  ('Rations ménagères'),
  ('Compléments alimentaires'),
  -- Ostéo/Kiné
  ('Rééducation post-op'),
  ('Mobilité & douleurs'),
  ('Récupération sportive'),
  -- Pet sitter / Promeneur
  ('Balades quotidiennes'),
  ('Socialisation en groupe'),
  ('Garde de nuit'),
  -- Refuge/Association
  ('Adoptions'),
  ('Familles d''accueil'),
  ('Sensibilisation & prévention');

-- Link specialisations to professions
INSERT INTO public.profession_specialisation (profession_id, specialisation_id)
SELECT p.id, s.id FROM public.professions p, public.specialisations s
WHERE p.label = 'Vétérinaire' AND s.label IN (
  'Médecine générale', 'Chirurgie', 'Dermatologie', 'Ophtalmologie', 
  'Reproduction', 'Imagerie', 'Anesthésie & douleur', 'Nutrition clinique', 'Suivi vaccinal'
);

INSERT INTO public.profession_specialisation (profession_id, specialisation_id)
SELECT p.id, s.id FROM public.professions p, public.specialisations s
WHERE p.label = 'Comportementaliste canin' AND s.label IN (
  'Réactivité en laisse', 'Phobies & bruits', 'Anxiété de séparation', 
  'Gestion de l''agressivité', 'Socialisation chiots'
);

INSERT INTO public.profession_specialisation (profession_id, specialisation_id)
SELECT p.id, s.id FROM public.professions p, public.specialisations s
WHERE p.label = 'Éducateur canin / dresseur' AND s.label IN (
  'Obéissance de base', 'Rappel', 'Marche en laisse', 'Sports canins / agility', 'Tricks avancés'
);

INSERT INTO public.profession_specialisation (profession_id, specialisation_id)
SELECT p.id, s.id FROM public.professions p, public.specialisations s
WHERE p.label = 'Toiletteur' AND s.label IN (
  'Bain & brushing', 'Coupe ciseaux', 'Tonte', 'Trimming', 'Soins oreilles & griffes'
);

INSERT INTO public.profession_specialisation (profession_id, specialisation_id)
SELECT p.id, s.id FROM public.professions p, public.specialisations s
WHERE p.label = 'Nutritionniste animalier' AND s.label IN (
  'BARF / cru', 'Allergies & intolérances', 'Rations ménagères', 'Compléments alimentaires'
);

INSERT INTO public.profession_specialisation (profession_id, specialisation_id)
SELECT p.id, s.id FROM public.professions p, public.specialisations s
WHERE p.label IN ('Ostéopathe animalier', 'Kinésithérapeute canin') AND s.label IN (
  'Rééducation post-op', 'Mobilité & douleurs', 'Récupération sportive'
);

INSERT INTO public.profession_specialisation (profession_id, specialisation_id)
SELECT p.id, s.id FROM public.professions p, public.specialisations s
WHERE p.label IN ('Pet sitter (garde d''animaux)', 'Promeneur de chiens') AND s.label IN (
  'Balades quotidiennes', 'Socialisation en groupe', 'Garde de nuit'
);

INSERT INTO public.profession_specialisation (profession_id, specialisation_id)
SELECT p.id, s.id FROM public.professions p, public.specialisations s
WHERE p.label = 'Responsable refuge / association' AND s.label IN (
  'Adoptions', 'Familles d''accueil', 'Sensibilisation & prévention'
);

-- Add columns to professional_profiles for the new structure
ALTER TABLE public.professional_profiles 
  ADD COLUMN IF NOT EXISTS photo_url TEXT,
  ADD COLUMN IF NOT EXISTS profession_id UUID REFERENCES public.professions(id),
  ADD COLUMN IF NOT EXISTS specialisations_ids UUID[],
  ADD COLUMN IF NOT EXISTS localisation TEXT,
  ADD COLUMN IF NOT EXISTS preferences_contact TEXT[],
  ADD COLUMN IF NOT EXISTS tarifs TEXT;