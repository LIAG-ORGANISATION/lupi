-- Create calendar events table for dogs
CREATE TABLE IF NOT EXISTS public.dog_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id UUID NOT NULL,
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  event_type TEXT NOT NULL CHECK (event_type IN ('vaccination', 'veterinary', 'grooming', 'training', 'reminder', 'other')),
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  professional_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dog_calendar_events ENABLE ROW LEVEL SECURITY;

-- Owners can manage their dog's events
CREATE POLICY "owners_manage_own_dog_events"
  ON public.dog_calendar_events
  FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Professionals can read events for shared dogs
CREATE POLICY "pros_read_shared_dog_events"
  ON public.dog_calendar_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dog_shares
      WHERE dog_shares.dog_id = dog_calendar_events.dog_id
        AND dog_shares.professional_id = auth.uid()
        AND dog_shares.status = 'accepted'
        AND (dog_shares.expires_at IS NULL OR dog_shares.expires_at > now())
    )
  );

-- Create index for better performance
CREATE INDEX idx_dog_calendar_events_dog_id ON public.dog_calendar_events(dog_id);
CREATE INDEX idx_dog_calendar_events_event_date ON public.dog_calendar_events(event_date);
CREATE INDEX idx_dog_calendar_events_owner_id ON public.dog_calendar_events(owner_id);

-- Trigger to update updated_at
CREATE TRIGGER update_dog_calendar_events_updated_at
  BEFORE UPDATE ON public.dog_calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();