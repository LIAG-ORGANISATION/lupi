-- Make dog-documents bucket public so dog avatars can be displayed
UPDATE storage.buckets
SET public = true
WHERE id = 'dog-documents';