-- Pre-Migration Validation Script
-- Purpose: Check for orphaned records before adding foreign key constraints
-- Usage: Run this script BEFORE applying migration 20251106000001_add_missing_foreign_keys.sql
-- Expected: All counts should be 0. If any count > 0, DO NOT PROCEED with migration.

DO $$
DECLARE
  orphaned_conversations_owner INTEGER;
  orphaned_conversations_professional INTEGER;
  orphaned_conversations_dog INTEGER;
  orphaned_calendar_events_dog INTEGER;
  orphaned_calendar_events_owner INTEGER;
  orphaned_calendar_events_professional INTEGER;
  orphaned_vaccinations INTEGER;
  orphaned_questionnaires INTEGER;
  total_orphans INTEGER;
BEGIN
  -- Check conversations.owner_id
  SELECT COUNT(*) INTO orphaned_conversations_owner
  FROM conversations c
  LEFT JOIN owners o ON c.owner_id = o.user_id
  WHERE o.user_id IS NULL;

  -- Check conversations.professional_id
  SELECT COUNT(*) INTO orphaned_conversations_professional
  FROM conversations c
  LEFT JOIN professionals p ON c.professional_id = p.user_id
  WHERE p.user_id IS NULL;

  -- Check conversations.dog_id (nullable field)
  SELECT COUNT(*) INTO orphaned_conversations_dog
  FROM conversations c
  LEFT JOIN dogs d ON c.dog_id = d.id
  WHERE c.dog_id IS NOT NULL AND d.id IS NULL;

  -- Check dog_calendar_events.dog_id
  SELECT COUNT(*) INTO orphaned_calendar_events_dog
  FROM dog_calendar_events e
  LEFT JOIN dogs d ON e.dog_id = d.id
  WHERE d.id IS NULL;

  -- Check dog_calendar_events.owner_id
  SELECT COUNT(*) INTO orphaned_calendar_events_owner
  FROM dog_calendar_events e
  LEFT JOIN owners o ON e.owner_id = o.user_id
  WHERE o.user_id IS NULL;

  -- Check dog_calendar_events.professional_id (nullable)
  SELECT COUNT(*) INTO orphaned_calendar_events_professional
  FROM dog_calendar_events e
  LEFT JOIN professionals p ON e.professional_id = p.user_id
  WHERE e.professional_id IS NOT NULL AND p.user_id IS NULL;

  -- Check dog_vaccinations.owner_id
  SELECT COUNT(*) INTO orphaned_vaccinations
  FROM dog_vaccinations v
  LEFT JOIN owners o ON v.owner_id = o.user_id
  WHERE o.user_id IS NULL;

  -- Check dog_questionnaires.owner_id
  SELECT COUNT(*) INTO orphaned_questionnaires
  FROM dog_questionnaires q
  LEFT JOIN owners o ON q.owner_id = o.user_id
  WHERE o.user_id IS NULL;

  -- Calculate total orphans
  total_orphans := orphaned_conversations_owner 
    + orphaned_conversations_professional 
    + orphaned_conversations_dog
    + orphaned_calendar_events_dog
    + orphaned_calendar_events_owner
    + orphaned_calendar_events_professional
    + orphaned_vaccinations
    + orphaned_questionnaires;

  -- Display results
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PRE-MIGRATION VALIDATION RESULTS';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'conversations.owner_id: % orphaned records', orphaned_conversations_owner;
  RAISE NOTICE 'conversations.professional_id: % orphaned records', orphaned_conversations_professional;
  RAISE NOTICE 'conversations.dog_id: % orphaned records', orphaned_conversations_dog;
  RAISE NOTICE 'dog_calendar_events.dog_id: % orphaned records', orphaned_calendar_events_dog;
  RAISE NOTICE 'dog_calendar_events.owner_id: % orphaned records', orphaned_calendar_events_owner;
  RAISE NOTICE 'dog_calendar_events.professional_id: % orphaned records', orphaned_calendar_events_professional;
  RAISE NOTICE 'dog_vaccinations.owner_id: % orphaned records', orphaned_vaccinations;
  RAISE NOTICE 'dog_questionnaires.owner_id: % orphaned records', orphaned_questionnaires;
  RAISE NOTICE '----------------------------------------';
  RAISE NOTICE 'TOTAL ORPHANED RECORDS: %', total_orphans;
  RAISE NOTICE '========================================';

  -- Final verdict
  IF total_orphans = 0 THEN
    RAISE NOTICE '✅ MIGRATION SAFE - No orphaned records found';
    RAISE NOTICE 'You can proceed with migration 20251106000001_add_missing_foreign_keys.sql';
  ELSE
    RAISE WARNING '❌ MIGRATION BLOCKED - Found % orphaned records', total_orphans;
    RAISE WARNING 'DO NOT PROCEED with migration until orphaned records are resolved.';
    RAISE WARNING 'Action required:';
    RAISE WARNING '  1. Document the orphaned record IDs';
    RAISE WARNING '  2. Investigate why they exist (data entry bug? deleted users?)';
    RAISE WARNING '  3. Clean up orphans OR create placeholder users';
    RAISE WARNING '  4. Re-run this validation script until all counts are 0';
  END IF;
END $$;

