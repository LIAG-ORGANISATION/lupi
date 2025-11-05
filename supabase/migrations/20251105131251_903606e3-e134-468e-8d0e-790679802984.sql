-- Table pour les alertes saisonnières
CREATE TABLE public.seasonal_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  alert_type TEXT NOT NULL, -- 'processionary', 'ticks', 'heat', 'allergies', 'other'
  icon TEXT NOT NULL DEFAULT 'alert-triangle',
  severity TEXT NOT NULL DEFAULT 'warning', -- 'info', 'warning', 'danger'
  active BOOLEAN NOT NULL DEFAULT true,
  start_month INTEGER, -- 1-12, mois de début d'activité
  end_month INTEGER, -- 1-12, mois de fin d'activité
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seasonal_alerts ENABLE ROW LEVEL SECURITY;

-- Politique: Tout le monde peut lire les alertes actives
CREATE POLICY "Anyone can view active seasonal alerts"
  ON public.seasonal_alerts
  FOR SELECT
  USING (active = true);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_seasonal_alerts_updated_at
  BEFORE UPDATE ON public.seasonal_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insertion des alertes par défaut
INSERT INTO public.seasonal_alerts (title, content, alert_type, icon, severity, active, start_month, end_month) VALUES
(
  'Alerte aux chenilles processionnaires !',
  'Leur retour marque un vrai danger pour nos chiens : les poils urticants de ces chenilles peuvent provoquer de graves brûlures sur la langue, la gueule ou les pattes, voire des complications vitales.

Les bons réflexes :
• Ne laissez pas votre chien renifler ou toucher les zones où elles passent (pins, chênes, sols forestiers).
• Si vous voyez des chenilles alignées ou des cocons blancs dans les arbres, évitez le secteur.

En cas de contact : rincez immédiatement à l''eau claire sans frotter et filez chez le vétérinaire en urgence.

🪶 Mieux vaut une balade ailleurs qu''une visite aux urgences vétérinaires !',
  'processionary',
  'alert-triangle',
  'danger',
  true,
  2, -- Février
  5  -- Mai
),
(
  'Attention aux tiques !',
  'Les tiques sont particulièrement actives au printemps et en automne. Elles peuvent transmettre des maladies graves comme la piroplasmose ou la maladie de Lyme.

Les bons réflexes :
• Inspectez votre chien après chaque balade en forêt ou dans les herbes hautes.
• Retirez immédiatement les tiques avec un tire-tique en tournant.
• Consultez votre vétérinaire pour un traitement préventif adapté.

⚠️ Une tique repérée et retirée rapidement limite les risques de transmission.',
  'ticks',
  'bug',
  'warning',
  true,
  3, -- Mars
  11 -- Novembre
),
(
  'Canicule : protégez votre chien !',
  'Les fortes chaleurs peuvent être dangereuses pour nos compagnons. Les chiens régulent mal leur température et risquent le coup de chaleur.

Les bons réflexes :
• Promenez-le tôt le matin ou tard le soir.
• Laissez de l''eau fraîche en permanence.
• Ne le laissez JAMAIS dans une voiture, même à l''ombre.
• Mouillez-lui régulièrement les pattes et la tête.

☀️ En cas de halètement excessif, gencives rouges ou vomissements : urgence vétérinaire immédiate !',
  'heat',
  'thermometer',
  'danger',
  true,
  6, -- Juin
  8  -- Août
),
(
  'Allergies saisonnières',
  'Le printemps peut déclencher des allergies chez certains chiens : démangeaisons, léchage excessif des pattes, yeux rouges...

Les bons réflexes :
• Rincez les pattes après les balades pour retirer les pollens.
• Nettoyez régulièrement les yeux avec du sérum physiologique.
• Surveillez les zones de grattage excessif.

🌸 Si les symptômes persistent, consultez votre vétérinaire pour un traitement adapté.',
  'allergies',
  'flower',
  'info',
  true,
  4, -- Avril
  6  -- Juin
);