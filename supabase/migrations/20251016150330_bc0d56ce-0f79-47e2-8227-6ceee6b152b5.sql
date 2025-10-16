-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Authenticated users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Créer une politique pour permettre aux utilisateurs authentifiés d'uploader leurs propres fichiers
CREATE POLICY "Authenticated users can upload their own files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'dog-documents' AND 
  (storage.foldername(name))[1] = 'avatars' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Créer une politique pour permettre aux utilisateurs authentifiés de mettre à jour leurs propres fichiers
CREATE POLICY "Authenticated users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'dog-documents' AND 
  (storage.foldername(name))[1] = 'avatars' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Créer une politique pour permettre à tout le monde de voir les avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'dog-documents' AND 
  (storage.foldername(name))[1] = 'avatars'
);