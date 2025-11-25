-- Migration: Create recipes table
-- Purpose: Store seasonal recipes (hiver/printemps) with pagination support
-- Risk: Low - new table, no existing data

-- Create enum for recipe period
CREATE TYPE recipe_period AS ENUM ('hiver', 'printemps');

-- Create recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  total_time TEXT NOT NULL,
  portions TEXT NOT NULL,
  benefits TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  preparation TEXT NOT NULL,
  period recipe_period NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_recipes_period ON public.recipes(period);
CREATE INDEX idx_recipes_created_at ON public.recipes(created_at);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public read-only access (no INSERT/UPDATE/DELETE for users)
CREATE POLICY "Public can read recipes"
ON public.recipes
FOR SELECT
TO public
USING (true);

-- Verify table creation
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'recipes'
  ) THEN
    RAISE NOTICE 'SUCCESS: recipes table created';
  ELSE
    RAISE EXCEPTION 'FAILED: recipes table not created';
  END IF;
END $$;

