-- Create public bucket for professional avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('professional-avatars', 'professional-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for professional-avatars bucket
CREATE POLICY "Professionals can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'professional-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Professionals can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'professional-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Professionals can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'professional-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view professional avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'professional-avatars');