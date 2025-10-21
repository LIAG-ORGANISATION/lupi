-- Rendre le bucket dog-documents public pour permettre l'affichage des photos
UPDATE storage.buckets 
SET public = true 
WHERE id = 'dog-documents';