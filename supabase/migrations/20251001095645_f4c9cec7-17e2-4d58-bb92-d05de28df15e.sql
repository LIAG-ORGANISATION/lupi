-- Politique pour permettre aux professionnels d'uploader leurs propres avatars
CREATE POLICY "Professionals can upload their own avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'dog-documents' 
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Politique pour permettre aux professionnels de mettre à jour leurs propres avatars
CREATE POLICY "Professionals can update their own avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'dog-documents' 
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Politique pour permettre aux professionnels de supprimer leurs propres avatars
CREATE POLICY "Professionals can delete their own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'dog-documents' 
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text
);