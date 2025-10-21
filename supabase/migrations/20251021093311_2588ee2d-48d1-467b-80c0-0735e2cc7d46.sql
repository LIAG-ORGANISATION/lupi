-- Create public bucket for owner avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('owner-avatars', 'owner-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for owner avatars
CREATE POLICY "Owners can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'owner-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Owners can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'owner-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'owner-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Owners can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'owner-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view owner avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'owner-avatars');

-- Add symptoms column to dog_health_alerts
ALTER TABLE dog_health_alerts
ADD COLUMN IF NOT EXISTS symptoms text;

-- Add medication columns to dog_calendar_events
ALTER TABLE dog_calendar_events
ADD COLUMN IF NOT EXISTS medication_name text,
ADD COLUMN IF NOT EXISTS medication_dosage text;