-- Create table for dog medications
CREATE TABLE dog_medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dog_id UUID NOT NULL,
  owner_id UUID NOT NULL,
  medication_name TEXT NOT NULL,
  dosage_detail TEXT NOT NULL,
  frequency TEXT NOT NULL, -- Ex: "2 fois par jour", "Toutes les 8h"
  duration_days INTEGER, -- Durée en jours
  start_date DATE NOT NULL,
  end_date DATE, -- Calculé ou manuel
  notes TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE dog_medications ENABLE ROW LEVEL SECURITY;

-- RLS policies for dog medications
CREATE POLICY "owners_manage_own_dog_medications"
ON dog_medications
FOR ALL
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "pros_read_shared_dog_medications"
ON dog_medications
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM dog_shares
    WHERE dog_shares.dog_id = dog_medications.dog_id
      AND dog_shares.professional_id = auth.uid()
      AND dog_shares.status = 'accepted'
      AND (dog_shares.expires_at IS NULL OR dog_shares.expires_at > now())
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_dog_medications_updated_at
BEFORE UPDATE ON dog_medications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Remove medication columns from dog_calendar_events
ALTER TABLE dog_calendar_events
DROP COLUMN IF EXISTS medication_name,
DROP COLUMN IF EXISTS medication_dosage;