-- Create dog_vaccinations table for tracking vaccinations and reminders
CREATE TABLE public.dog_vaccinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dog_id UUID NOT NULL REFERENCES public.dogs(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  vaccine_name TEXT NOT NULL,
  vaccination_date DATE NOT NULL,
  reminders TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dog_vaccinations ENABLE ROW LEVEL SECURITY;

-- Owners can manage vaccinations for their own dogs
CREATE POLICY "owners_manage_own_dog_vaccinations"
ON public.dog_vaccinations
FOR ALL
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Professionals can read vaccinations for dogs they have access to
CREATE POLICY "pros_read_shared_dog_vaccinations"
ON public.dog_vaccinations
FOR SELECT
USING (professional_has_dog_access(dog_id, auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_dog_vaccinations_updated_at
BEFORE UPDATE ON public.dog_vaccinations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();