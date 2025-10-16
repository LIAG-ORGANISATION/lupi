-- Add category and professional_type columns to dog_documents table
ALTER TABLE public.dog_documents 
ADD COLUMN IF NOT EXISTS category text DEFAULT 'medical',
ADD COLUMN IF NOT EXISTS professional_type text;

-- Add a comment to explain the categories
COMMENT ON COLUMN public.dog_documents.category IS 'Document category: medical, invoice, certificate, etc.';
COMMENT ON COLUMN public.dog_documents.professional_type IS 'Type of professional associated with the document: veterinaire, educateur, comportementaliste, etc.';