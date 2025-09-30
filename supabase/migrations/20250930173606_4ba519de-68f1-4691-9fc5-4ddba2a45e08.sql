-- Create table for behavioral questionnaires
CREATE TABLE IF NOT EXISTS public.dog_questionnaires (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dog_id UUID NOT NULL REFERENCES public.dogs(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  questionnaire_data JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dog_questionnaires ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "owners_manage_own_dog_questionnaires" 
ON public.dog_questionnaires 
FOR ALL 
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "pros_read_shared_dog_questionnaires" 
ON public.dog_questionnaires 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1
    FROM dog_shares
    WHERE dog_shares.dog_id = dog_questionnaires.dog_id
      AND dog_shares.professional_id = auth.uid()
      AND dog_shares.status = 'accepted'
      AND (dog_shares.expires_at IS NULL OR dog_shares.expires_at > now())
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_dog_questionnaires_updated_at
BEFORE UPDATE ON public.dog_questionnaires
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();