-- Migration: Create breeds table
-- Purpose: Store dog breed information with French and English names, and FCI numbers
-- Risk: Low - new table, no existing data

-- Create breeds table
CREATE TABLE IF NOT EXISTS public.breeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fr_name TEXT NOT NULL,
  en_name TEXT NOT NULL,
  fci_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for search performance
CREATE INDEX idx_breeds_fr_name ON public.breeds(fr_name);
CREATE INDEX idx_breeds_en_name ON public.breeds(en_name);
CREATE INDEX idx_breeds_fci_number ON public.breeds(fci_number);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_breeds_updated_at
  BEFORE UPDATE ON public.breeds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.breeds ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public read-only access (no INSERT/UPDATE/DELETE)
CREATE POLICY "Public can read breeds"
ON public.breeds
FOR SELECT
TO public
USING (true);

-- Verify table creation
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'breeds'
  ) THEN
    RAISE NOTICE 'SUCCESS: breeds table created';
  ELSE
    RAISE EXCEPTION 'FAILED: breeds table not created';
  END IF;
END $$;

