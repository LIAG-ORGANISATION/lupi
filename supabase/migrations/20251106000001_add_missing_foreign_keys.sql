-- Migration: Add missing foreign key constraints
-- Purpose: Ensure data integrity and proper cascade delete behavior
-- Risk: Low - only adds constraints, verifies existing data first

-- Step 1: Verify data integrity before adding constraints
DO $$
DECLARE
  orphaned_count INTEGER;
BEGIN
  -- Check conversations.owner_id
  SELECT COUNT(*) INTO orphaned_count
  FROM conversations c
  LEFT JOIN owners o ON c.owner_id = o.user_id
  WHERE o.user_id IS NULL;

  IF orphaned_count > 0 THEN
    RAISE WARNING 'Found % orphaned conversations.owner_id records', orphaned_count;
  END IF;

  -- Check conversations.professional_id
  SELECT COUNT(*) INTO orphaned_count
  FROM conversations c
  LEFT JOIN professionals p ON c.professional_id = p.user_id
  WHERE p.user_id IS NULL;

  IF orphaned_count > 0 THEN
    RAISE WARNING 'Found % orphaned conversations.professional_id records', orphaned_count;
  END IF;

  -- Check conversations.dog_id (nullable, so only check non-null values)
  SELECT COUNT(*) INTO orphaned_count
  FROM conversations c
  LEFT JOIN dogs d ON c.dog_id = d.id
  WHERE c.dog_id IS NOT NULL AND d.id IS NULL;

  IF orphaned_count > 0 THEN
    RAISE WARNING 'Found % orphaned conversations.dog_id records', orphaned_count;
  END IF;

  -- Check dog_calendar_events.dog_id
  SELECT COUNT(*) INTO orphaned_count
  FROM dog_calendar_events e
  LEFT JOIN dogs d ON e.dog_id = d.id
  WHERE d.id IS NULL;

  IF orphaned_count > 0 THEN
    RAISE WARNING 'Found % orphaned dog_calendar_events.dog_id records', orphaned_count;
  END IF;

  -- Check dog_calendar_events.owner_id
  SELECT COUNT(*) INTO orphaned_count
  FROM dog_calendar_events e
  LEFT JOIN owners o ON e.owner_id = o.user_id
  WHERE o.user_id IS NULL;

  IF orphaned_count > 0 THEN
    RAISE WARNING 'Found % orphaned dog_calendar_events.owner_id records', orphaned_count;
  END IF;

  -- Check dog_calendar_events.professional_id (nullable)
  SELECT COUNT(*) INTO orphaned_count
  FROM dog_calendar_events e
  LEFT JOIN professionals p ON e.professional_id = p.user_id
  WHERE e.professional_id IS NOT NULL AND p.user_id IS NULL;

  IF orphaned_count > 0 THEN
    RAISE WARNING 'Found % orphaned dog_calendar_events.professional_id records', orphaned_count;
  END IF;

  -- Check dog_vaccinations.owner_id
  SELECT COUNT(*) INTO orphaned_count
  FROM dog_vaccinations v
  LEFT JOIN owners o ON v.owner_id = o.user_id
  WHERE o.user_id IS NULL;

  IF orphaned_count > 0 THEN
    RAISE WARNING 'Found % orphaned dog_vaccinations.owner_id records', orphaned_count;
  END IF;

  -- Check dog_questionnaires.owner_id
  SELECT COUNT(*) INTO orphaned_count
  FROM dog_questionnaires q
  LEFT JOIN owners o ON q.owner_id = o.user_id
  WHERE o.user_id IS NULL;

  IF orphaned_count > 0 THEN
    RAISE WARNING 'Found % orphaned dog_questionnaires.owner_id records', orphaned_count;
  END IF;
END $$;

-- Step 2: Add foreign key constraints

-- conversations table
ALTER TABLE public.conversations
  ADD CONSTRAINT fk_conversations_owner
    FOREIGN KEY (owner_id)
    REFERENCES public.owners(user_id)
    ON DELETE CASCADE,
  ADD CONSTRAINT fk_conversations_professional
    FOREIGN KEY (professional_id)
    REFERENCES public.professionals(user_id)
    ON DELETE CASCADE,
  ADD CONSTRAINT fk_conversations_dog
    FOREIGN KEY (dog_id)
    REFERENCES public.dogs(id)
    ON DELETE CASCADE;

-- dog_calendar_events table
ALTER TABLE public.dog_calendar_events
  ADD CONSTRAINT fk_calendar_events_dog
    FOREIGN KEY (dog_id)
    REFERENCES public.dogs(id)
    ON DELETE CASCADE,
  ADD CONSTRAINT fk_calendar_events_owner
    FOREIGN KEY (owner_id)
    REFERENCES public.owners(user_id)
    ON DELETE CASCADE,
  ADD CONSTRAINT fk_calendar_events_professional
    FOREIGN KEY (professional_id)
    REFERENCES public.professionals(user_id)
    ON DELETE SET NULL;  -- Set to NULL instead of CASCADE to preserve events

-- dog_vaccinations table
ALTER TABLE public.dog_vaccinations
  ADD CONSTRAINT fk_vaccinations_owner
    FOREIGN KEY (owner_id)
    REFERENCES public.owners(user_id)
    ON DELETE CASCADE;

-- dog_questionnaires table
ALTER TABLE public.dog_questionnaires
  ADD CONSTRAINT fk_questionnaires_owner
    FOREIGN KEY (owner_id)
    REFERENCES public.owners(user_id)
    ON DELETE CASCADE;

-- Step 3: Verify constraints were added successfully
DO $$
DECLARE
  constraint_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO constraint_count
  FROM information_schema.table_constraints
  WHERE constraint_type = 'FOREIGN KEY'
    AND table_schema = 'public'
    AND constraint_name IN (
      'fk_conversations_owner',
      'fk_conversations_professional',
      'fk_conversations_dog',
      'fk_calendar_events_dog',
      'fk_calendar_events_owner',
      'fk_calendar_events_professional',
      'fk_vaccinations_owner',
      'fk_questionnaires_owner'
    );

  IF constraint_count = 8 THEN
    RAISE NOTICE 'SUCCESS: All 8 foreign key constraints added successfully';
  ELSE
    RAISE WARNING 'Expected 8 constraints but found %', constraint_count;
  END IF;
END $$;

