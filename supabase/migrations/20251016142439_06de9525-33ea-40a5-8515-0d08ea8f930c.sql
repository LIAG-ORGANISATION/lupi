-- Make dog-documents bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'dog-documents';

-- Add storage RLS policies for dog documents

-- Owners can read their own dog documents
CREATE POLICY "owners_read_own_dog_docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'dog-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Owners can upload their own dog documents
CREATE POLICY "owners_upload_own_dog_docs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'dog-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Owners can update their own dog documents
CREATE POLICY "owners_update_own_dog_docs" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'dog-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Owners can delete their own dog documents
CREATE POLICY "owners_delete_own_dog_docs" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'dog-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Professionals can read documents for dogs shared with them
CREATE POLICY "pros_read_shared_dog_docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'dog-documents' AND
    EXISTS (
      SELECT 1 FROM public.dog_documents dd
      INNER JOIN public.dog_shares ds ON ds.dog_id = dd.dog_id
      WHERE dd.storage_path = name
        AND ds.professional_id = auth.uid()
        AND ds.status = 'accepted'
        AND (ds.expires_at IS NULL OR ds.expires_at > now())
    )
  );