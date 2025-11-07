-- Test Migrations Script
-- Purpose: Comprehensive integration testing for all migrations
-- Usage: Run this script AFTER applying all 3 migrations
-- Note: All tests run in a transaction and will be rolled back

BEGIN;

DO $$
DECLARE
  test_owner_id UUID := '00000000-0000-0000-0000-000000000001';
  test_professional_id UUID := '00000000-0000-0000-0000-000000000002';
  test_dog_id UUID := '00000000-0000-0000-0000-000000000003';
  test_conversation_id UUID := '00000000-0000-0000-0000-000000000004';
  test_event_id UUID;
  test_count INTEGER;
  test_passed BOOLEAN := true;
  questionnaire_policy_def TEXT;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'COMPREHENSIVE MIGRATION TESTS';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';

  -- Test 1: Foreign Key Constraint Enforcement
  RAISE NOTICE 'Test 1: Foreign Key Constraint Enforcement...';
  
  BEGIN
    -- Try to insert conversation with invalid owner_id
    INSERT INTO conversations (owner_id, professional_id)
    VALUES ('99999999-9999-9999-9999-999999999999', test_professional_id);
    RAISE WARNING '❌ FAIL - Should have rejected invalid owner_id';
    test_passed := false;
  EXCEPTION
    WHEN foreign_key_violation THEN
      RAISE NOTICE '✅ PASS - Correctly rejected invalid owner_id';
  END;

  BEGIN
    -- Try to insert conversation with invalid professional_id
    INSERT INTO conversations (owner_id, professional_id)
    VALUES (test_owner_id, '99999999-9999-9999-9999-999999999999');
    RAISE WARNING '❌ FAIL - Should have rejected invalid professional_id';
    test_passed := false;
  EXCEPTION
    WHEN foreign_key_violation THEN
      RAISE NOTICE '✅ PASS - Correctly rejected invalid professional_id';
  END;

  BEGIN
    -- Try to insert conversation with invalid dog_id
    INSERT INTO conversations (owner_id, professional_id, dog_id)
    VALUES (test_owner_id, test_professional_id, '99999999-9999-9999-9999-999999999999');
    RAISE WARNING '❌ FAIL - Should have rejected invalid dog_id';
    test_passed := false;
  EXCEPTION
    WHEN foreign_key_violation THEN
      RAISE NOTICE '✅ PASS - Correctly rejected invalid dog_id';
  END;

  -- Test 2: Cascade Delete Behavior
  RAISE NOTICE '';
  RAISE NOTICE 'Test 2: Cascade Delete Behavior...';
  
  -- Create test data
  INSERT INTO owners (user_id, full_name, email)
  VALUES (test_owner_id, 'Test Owner', 'test@example.com')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO professionals (user_id, full_name, email, profession, zone)
  VALUES (test_professional_id, 'Test Pro', 'pro@example.com', 'Vétérinaire', 'Paris')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO dogs (id, owner_id, name)
  VALUES (test_dog_id, test_owner_id, 'Test Dog')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO conversations (id, owner_id, professional_id, dog_id)
  VALUES (test_conversation_id, test_owner_id, test_professional_id, test_dog_id)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO dog_calendar_events (id, dog_id, owner_id, professional_id, title, event_date, event_type)
  VALUES (gen_random_uuid(), test_dog_id, test_owner_id, test_professional_id, 'Test Event', CURRENT_DATE, 'veterinary')
  RETURNING id INTO test_event_id;

  INSERT INTO dog_vaccinations (dog_id, owner_id, vaccine_name, vaccination_date)
  VALUES (test_dog_id, test_owner_id, 'Rabies', CURRENT_DATE)
  ON CONFLICT DO NOTHING;

  INSERT INTO dog_questionnaires (dog_id, owner_id, questionnaire_data)
  VALUES (test_dog_id, test_owner_id, '{"test": true}'::jsonb)
  ON CONFLICT DO NOTHING;

  -- Verify records exist
  SELECT COUNT(*) INTO test_count FROM conversations WHERE owner_id = test_owner_id;
  IF test_count > 0 THEN
    RAISE NOTICE '  Created test conversation';
  END IF;

  SELECT COUNT(*) INTO test_count FROM dog_calendar_events WHERE owner_id = test_owner_id;
  IF test_count > 0 THEN
    RAISE NOTICE '  Created test calendar event';
  END IF;

  SELECT COUNT(*) INTO test_count FROM dog_vaccinations WHERE owner_id = test_owner_id;
  IF test_count > 0 THEN
    RAISE NOTICE '  Created test vaccination';
  END IF;

  SELECT COUNT(*) INTO test_count FROM dog_questionnaires WHERE owner_id = test_owner_id;
  IF test_count > 0 THEN
    RAISE NOTICE '  Created test questionnaire';
  END IF;

  -- Delete owner (should cascade delete related records)
  DELETE FROM owners WHERE user_id = test_owner_id;

  -- Verify cascade delete worked
  SELECT COUNT(*) INTO test_count FROM conversations WHERE owner_id = test_owner_id;
  IF test_count = 0 THEN
    RAISE NOTICE '✅ PASS - Cascade delete worked correctly (conversations deleted)';
  ELSE
    RAISE WARNING '❌ FAIL - Conversations not cascade deleted (found % remaining)', test_count;
    test_passed := false;
  END IF;

  SELECT COUNT(*) INTO test_count FROM dog_calendar_events WHERE owner_id = test_owner_id;
  IF test_count = 0 THEN
    RAISE NOTICE '✅ PASS - Cascade delete worked correctly (calendar events deleted)';
  ELSE
    RAISE WARNING '❌ FAIL - Calendar events not cascade deleted (found % remaining)', test_count;
    test_passed := false;
  END IF;

  SELECT COUNT(*) INTO test_count FROM dog_vaccinations WHERE owner_id = test_owner_id;
  IF test_count = 0 THEN
    RAISE NOTICE '✅ PASS - Cascade delete worked correctly (vaccinations deleted)';
  ELSE
    RAISE WARNING '❌ FAIL - Vaccinations not cascade deleted (found % remaining)', test_count;
    test_passed := false;
  END IF;

  SELECT COUNT(*) INTO test_count FROM dog_questionnaires WHERE owner_id = test_owner_id;
  IF test_count = 0 THEN
    RAISE NOTICE '✅ PASS - Cascade delete worked correctly (questionnaires deleted)';
  ELSE
    RAISE WARNING '❌ FAIL - Questionnaires not cascade deleted (found % remaining)', test_count;
    test_passed := false;
  END IF;

  -- Test 3: SET NULL Behavior for professional_id
  RAISE NOTICE '';
  RAISE NOTICE 'Test 3: SET NULL Behavior for professional_id...';
  
  -- Recreate test data
  INSERT INTO owners (user_id, full_name, email)
  VALUES (test_owner_id, 'Test Owner', 'test@example.com')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO professionals (user_id, full_name, email, profession, zone)
  VALUES (test_professional_id, 'Test Pro', 'pro@example.com', 'Vétérinaire', 'Paris')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO dogs (id, owner_id, name)
  VALUES (test_dog_id, test_owner_id, 'Test Dog')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO dog_calendar_events (id, dog_id, owner_id, professional_id, title, event_date, event_type)
  VALUES (test_event_id, test_dog_id, test_owner_id, test_professional_id, 'Test Event', CURRENT_DATE, 'veterinary')
  ON CONFLICT (id) DO UPDATE SET professional_id = EXCLUDED.professional_id;

  -- Delete professional (should set professional_id to NULL, not delete event)
  DELETE FROM professionals WHERE user_id = test_professional_id;

  -- Verify SET NULL worked
  SELECT COUNT(*) INTO test_count 
  FROM dog_calendar_events 
  WHERE id = test_event_id AND professional_id IS NULL;
  
  IF test_count = 1 THEN
    RAISE NOTICE '✅ PASS - Professional deletion correctly set event.professional_id to NULL';
  ELSE
    RAISE WARNING '❌ FAIL - Event professional_id not set to NULL correctly';
    test_passed := false;
  END IF;

  -- Test 4: Message Read Policy
  RAISE NOTICE '';
  RAISE NOTICE 'Test 4: Message Read Policy...';
  
  SELECT COUNT(*) INTO test_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'messages'
    AND policyname = 'message_recipient_mark_as_read';

  IF test_count = 1 THEN
    RAISE NOTICE '✅ PASS - Message recipient policy exists';
  ELSE
    RAISE WARNING '❌ FAIL - Message recipient policy not found';
    test_passed := false;
  END IF;

  -- Test 5: RLS Pattern Consistency
  RAISE NOTICE '';
  RAISE NOTICE 'Test 5: RLS Pattern Consistency...';
  
  SELECT qual INTO questionnaire_policy_def
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'dog_questionnaires'
    AND policyname = 'pros_read_shared_dog_questionnaires';

  IF questionnaire_policy_def LIKE '%professional_has_dog_access%' THEN
    RAISE NOTICE '✅ PASS - Questionnaire policy uses standard function';
  ELSE
    RAISE WARNING '❌ FAIL - Questionnaire policy does not use standard function';
    test_passed := false;
  END IF;

  -- Check all professional access policies use consistent pattern
  SELECT COUNT(*) INTO test_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND (qual LIKE '%professional_has_dog_access%' OR with_check LIKE '%professional_has_dog_access%')
    AND tablename IN ('dogs', 'dog_documents', 'dog_vaccinations', 'dog_questionnaires');

  IF test_count >= 4 THEN
    RAISE NOTICE '✅ PASS - All professional access policies use consistent pattern';
  ELSE
    RAISE WARNING '❌ FAIL - Not all policies use consistent pattern (found % consistent)', test_count;
    test_passed := false;
  END IF;

  -- Final Summary
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  IF test_passed THEN
    RAISE NOTICE '✅✅✅ ALL TESTS PASSED ✅✅✅';
  ELSE
    RAISE WARNING '❌❌❌ SOME TESTS FAILED ❌❌❌';
  END IF;
  RAISE NOTICE '========================================';

END $$;

-- Rollback all test data
ROLLBACK;

