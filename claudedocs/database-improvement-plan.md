# Supabase Database Improvement Plan

**Project**: Lupi MVP - Dog Health Management PWA
**Current Security Grade**: B+ (85.5%)
**Target Security Grade**: A- (92%)
**Estimated Time**: 5 hours for P0 and P1 fixes
**Created**: 2025-10-28

---

## Executive Summary

This plan addresses critical database integrity issues identified in the Supabase database analysis:
- **7 missing foreign key constraints** across 4 tables (data integrity risk)
- **Broken message read functionality** (notification system non-functional)
- **Inconsistent RLS pattern** (maintainability concern)

All P0 and P1 fixes have pre-written migration scripts ready for execution.

---

## Implementation Phases

### Phase 1: Preparation & Safety Validation (30 minutes)

#### 1.1 Environment Setup ✅
```bash
# Verify Supabase CLI is installed and authenticated
supabase --version
supabase login

# Verify project connection
supabase db remote list
```

#### 1.2 Database Backup 🔴 CRITICAL
```bash
# Create full database backup before any changes
pg_dump -h <supabase-host> -U postgres -d postgres > backup_$(date +%Y%m%d_%H%M%S).sql

# Alternative: Use Supabase dashboard to create point-in-time backup
# Navigate to: Project Settings → Database → Backups → Create Backup
```

#### 1.3 Orphan Record Detection
```sql
-- Run orphan detection script (included in Migration 1)
-- This will show warnings if orphaned records exist
-- Review output carefully before proceeding

-- Check conversations.owner_id
SELECT COUNT(*) as orphaned_conversations_owner
FROM conversations c
LEFT JOIN owners o ON c.owner_id = o.user_id
WHERE o.user_id IS NULL;

-- Check conversations.professional_id
SELECT COUNT(*) as orphaned_conversations_professional
FROM conversations c
LEFT JOIN professionals p ON c.professional_id = p.user_id
WHERE p.user_id IS NULL;

-- Check conversations.dog_id (nullable field)
SELECT COUNT(*) as orphaned_conversations_dog
FROM conversations c
LEFT JOIN dogs d ON c.dog_id = d.id
WHERE c.dog_id IS NOT NULL AND d.id IS NULL;

-- Check dog_calendar_events
SELECT COUNT(*) as orphaned_events
FROM dog_calendar_events e
LEFT JOIN dogs d ON e.dog_id = d.id
WHERE d.id IS NULL;

-- Check dog_vaccinations
SELECT COUNT(*) as orphaned_vaccinations
FROM dog_vaccinations v
LEFT JOIN owners o ON v.owner_id = o.user_id
WHERE o.user_id IS NULL;

-- Check dog_questionnaires
SELECT COUNT(*) as orphaned_questionnaires
FROM dog_questionnaires q
LEFT JOIN owners o ON q.owner_id = o.user_id
WHERE o.user_id IS NULL;
```

**Action**: If orphans are found:
- Document the orphaned record IDs
- Investigate why they exist (data entry bug? deleted users?)
- Decision: Clean up orphans OR create placeholder users
- **DO NOT PROCEED** with foreign key migration until resolved

#### 1.4 Development Environment Testing
```bash
# Create a local Supabase instance for testing migrations
supabase init
supabase start

# Copy production data to local (anonymized if needed)
# Test migrations on local instance first
```

---

### Phase 2: Critical Fixes - P0 (30 minutes)

#### 2.1 Migration 1: Add Missing Foreign Keys 🔴 CRITICAL

**File**: `supabase/migrations/20251020_add_missing_foreign_keys.sql`

**What it does**:
- Adds 8 foreign key constraints across 4 tables
- Enforces referential integrity at database level
- Enables proper cascade delete behavior
- Prevents orphaned records

**Affected Tables**:
1. `conversations` - 3 FKs (owner_id, professional_id, dog_id)
2. `dog_calendar_events` - 3 FKs (dog_id, owner_id, professional_id)
3. `dog_vaccinations` - 1 FK (owner_id)
4. `dog_questionnaires` - 1 FK (owner_id)

**Execution**:
```bash
# Test on local Supabase first
supabase migration new add_missing_foreign_keys
# Copy content from analysis report Migration 1 script
supabase db reset  # Test on local

# Apply to production
supabase db push --include-seed=false

# Alternative: Manual execution via Supabase SQL Editor
# Copy and paste the migration script from the analysis report
```

**Expected Output**:
```
✓ All orphan checks passed (or warnings shown)
✓ 8 foreign key constraints added
✓ SUCCESS: All 8 foreign key constraints added successfully
```

**Validation**:
```sql
-- Verify all 8 constraints were created
SELECT
  tc.table_name,
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('conversations', 'dog_calendar_events', 'dog_vaccinations', 'dog_questionnaires')
ORDER BY tc.table_name, tc.constraint_name;

-- Expected: 8 rows returned with constraint names:
-- fk_conversations_owner
-- fk_conversations_professional
-- fk_conversations_dog
-- fk_calendar_events_dog
-- fk_calendar_events_owner
-- fk_calendar_events_professional
-- fk_vaccinations_owner
-- fk_questionnaires_owner
```

**Rollback** (if needed):
```sql
-- Use rollback script from analysis report
ALTER TABLE conversations
  DROP CONSTRAINT IF EXISTS fk_conversations_owner,
  DROP CONSTRAINT IF EXISTS fk_conversations_professional,
  DROP CONSTRAINT IF EXISTS fk_conversations_dog;

ALTER TABLE dog_calendar_events
  DROP CONSTRAINT IF EXISTS fk_calendar_events_dog,
  DROP CONSTRAINT IF EXISTS fk_calendar_events_owner,
  DROP CONSTRAINT IF EXISTS fk_calendar_events_professional;

ALTER TABLE dog_vaccinations
  DROP CONSTRAINT IF EXISTS fk_vaccinations_owner;

ALTER TABLE dog_questionnaires
  DROP CONSTRAINT IF EXISTS fk_questionnaires_owner;
```

#### 2.2 Test Cascade Delete Behavior

**Critical Test**: Verify cascade deletes work correctly
```sql
BEGIN;
  -- Create test owner
  INSERT INTO owners (user_id, full_name, email)
  VALUES ('00000000-0000-0000-0000-000000000001', 'Test Owner', 'test@example.com');

  -- Create test professional
  INSERT INTO professionals (user_id, full_name, email, profession, zone)
  VALUES ('00000000-0000-0000-0000-000000000002', 'Test Pro', 'pro@example.com', 'Vétérinaire', 'Paris');

  -- Create test dog
  INSERT INTO dogs (id, owner_id, name)
  VALUES ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Test Dog');

  -- Create test conversation
  INSERT INTO conversations (id, owner_id, professional_id, dog_id)
  VALUES ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003');

  -- Create test calendar event
  INSERT INTO dog_calendar_events (dog_id, owner_id, professional_id, title, event_date, event_type)
  VALUES ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Test Event', CURRENT_DATE, 'veterinary');

  -- Verify records exist
  SELECT COUNT(*) as conversations FROM conversations WHERE owner_id = '00000000-0000-0000-0000-000000000001';
  SELECT COUNT(*) as events FROM dog_calendar_events WHERE owner_id = '00000000-0000-0000-0000-000000000001';

  -- Delete owner (should cascade delete conversation and event)
  DELETE FROM owners WHERE user_id = '00000000-0000-0000-0000-000000000001';

  -- Verify cascade deleted
  SELECT COUNT(*) as conversations_after FROM conversations WHERE owner_id = '00000000-0000-0000-0000-000000000001';
  -- Expected: 0
  SELECT COUNT(*) as events_after FROM dog_calendar_events WHERE owner_id = '00000000-0000-0000-0000-000000000001';
  -- Expected: 0

ROLLBACK;  -- Don't keep test data
```

#### 2.3 Migration 2: Fix Message Read Policy 🔴 CRITICAL

**File**: `supabase/migrations/20251020_fix_message_read_policy.sql`

**What it does**:
- Adds RLS policy allowing recipients to mark messages as read
- Fixes broken notification system
- Restricts updates to only the `read` field (security maintained)

**Current Problem**:
```sql
-- Current policy only allows sender to update
CREATE POLICY "message_sender_update_own_messages"
ON public.messages FOR UPDATE
USING (sender_id = auth.uid());

-- Result: Recipients can't mark messages as read ❌
```

**Solution**:
```sql
-- New policy allows recipient to update read status
CREATE POLICY "message_recipient_mark_as_read"
ON public.messages FOR UPDATE
TO authenticated
USING (
  -- Recipient can update if they're in the conversation but NOT the sender
  EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = messages.conversation_id
    AND (
      (c.owner_id = auth.uid() AND messages.sender_type = 'professional')
      OR
      (c.professional_id = auth.uid() AND messages.sender_type = 'owner')
    )
  )
)
WITH CHECK (
  -- Can ONLY update the read field, all others must stay unchanged
  sender_id = (SELECT sender_id FROM messages WHERE id = messages.id)
  AND sender_type = (SELECT sender_type FROM messages WHERE id = messages.id)
  AND content = (SELECT content FROM messages WHERE id = messages.id)
  AND conversation_id = (SELECT conversation_id FROM messages WHERE id = messages.id)
  AND created_at = (SELECT created_at FROM messages WHERE id = messages.id)
);
```

**Execution**:
```bash
# Apply migration
supabase migration new fix_message_read_policy
# Copy content from analysis report Migration 2 script
supabase db push --include-seed=false
```

**Expected Output**:
```
✓ Policy created successfully
✓ SUCCESS: Message recipient update policy created
```

**Validation**:
```sql
-- Verify policy exists
SELECT policyname, cmd, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'messages'
  AND policyname = 'message_recipient_mark_as_read';
-- Expected: 1 row

-- Count total message policies
SELECT COUNT(*) as message_policies
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'messages';
-- Expected: 4 policies (3 existing + 1 new)
```

**Application Testing** (manual):
1. Guardian sends message to professional
2. Professional logs in and views message
3. Professional updates message: `UPDATE messages SET read = true WHERE id = '...'`
4. Verify update succeeds (previously would fail)
5. Professional attempts to modify content: `UPDATE messages SET content = 'hacked'`
6. Verify update fails (WITH CHECK constraint prevents this)

---

### Phase 3: Consistency Improvements - P1 (10 minutes)

#### 3.1 Migration 3: Standardize RLS Pattern

**File**: `supabase/migrations/20251020_standardize_questionnaire_rls.sql`

**What it does**:
- Replaces raw subquery with `professional_has_dog_access()` function
- Matches pattern used in other tables (dogs, dog_documents, dog_vaccinations)
- Improves maintainability and consistency

**Current Inconsistency**:
```sql
-- dog_vaccinations (GOOD - uses function)
CREATE POLICY "pros_read_shared_dog_vaccinations"
ON dog_vaccinations FOR SELECT
USING (professional_has_dog_access(dog_id, auth.uid()));

-- dog_questionnaires (BAD - uses raw subquery)
CREATE POLICY "pros_read_shared_dog_questionnaires"
ON dog_questionnaires FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM dog_shares
    WHERE dog_shares.dog_id = dog_questionnaires.dog_id
      AND dog_shares.professional_id = auth.uid()
      AND dog_shares.status = 'accepted'
      AND (dog_shares.expires_at IS NULL OR dog_shares.expires_at > now())
  )
);
```

**Execution**:
```bash
supabase migration new standardize_questionnaire_rls
# Copy content from analysis report Migration 3 script
supabase db push --include-seed=false
```

**Expected Output**:
```
✓ Policy replaced successfully
✓ SUCCESS: Policy now uses professional_has_dog_access() function
```

**Validation**:
```sql
-- Verify policy uses function
SELECT definition
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'dog_questionnaires'
  AND policyname = 'pros_read_shared_dog_questionnaires';
-- Expected: Contains 'professional_has_dog_access'
```

---

### Phase 4: Application Code Audit - P1 (2 hours)

#### 4.1 Verify TypeScript Types

**File**: [src/types/database.ts](../src/types/database.ts)

**Checks**:
- [ ] `owners` table type exists (not `dog_owner_profiles`)
- [ ] `professionals` table type exists (not `professional_profiles`)
- [ ] Primary keys use `user_id` (not `id`)
- [ ] All foreign key relationships are correctly typed

**Commands**:
```bash
# Search for old table names
grep -r "dog_owner_profiles" src/
grep -r "professional_profiles" src/

# Search for potential issues with .id vs .user_id
grep -r "owners\\.id" src/
grep -r "professionals\\.id" src/
```

#### 4.2 Check Query Code

**Locations to review**:
- `src/integrations/supabase/`
- `src/hooks/`
- Any files with Supabase queries

**Specific checks**:
- [ ] Message update queries include read status updates
- [ ] Error handling for foreign key violations on record creation
- [ ] Cascade delete expectations match actual behavior
- [ ] No code assumes orphaned records can exist

**Example fix needed** (likely in message handling):
```typescript
// Before (doesn't allow recipient to mark as read)
const updateMessage = async (messageId: string, updates: Partial<Message>) => {
  return supabase
    .from('messages')
    .update(updates)
    .eq('id', messageId)
    .eq('sender_id', userId);  // ❌ Only sender can update
};

// After (allows recipient to mark as read)
const markMessageAsRead = async (messageId: string) => {
  return supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId);
    // RLS policy handles authorization ✅
};
```

#### 4.3 Update Error Handling

Add error handling for new foreign key constraints:

```typescript
// Example: Creating a conversation
const createConversation = async (ownerId: string, professionalId: string, dogId?: string) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert({ owner_id: ownerId, professional_id: professionalId, dog_id: dogId })
      .select()
      .single();

    if (error) {
      // Handle foreign key violations specifically
      if (error.code === '23503') {  // Foreign key violation
        if (error.message.includes('fk_conversations_owner')) {
          throw new Error('Invalid owner ID');
        }
        if (error.message.includes('fk_conversations_professional')) {
          throw new Error('Invalid professional ID');
        }
        if (error.message.includes('fk_conversations_dog')) {
          throw new Error('Invalid dog ID');
        }
      }
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Failed to create conversation:', err);
    throw err;
  }
};
```

---

### Phase 5: Testing & Validation (2 hours)

#### 5.1 Database Constraint Tests

```sql
-- Test 1: Cannot insert conversation with invalid owner
BEGIN;
  INSERT INTO conversations (owner_id, professional_id)
  VALUES ('99999999-9999-9999-9999-999999999999', (SELECT user_id FROM professionals LIMIT 1));
  -- Expected: ERROR - foreign key violation
ROLLBACK;

-- Test 2: Cannot insert conversation with invalid professional
BEGIN;
  INSERT INTO conversations (owner_id, professional_id)
  VALUES ((SELECT user_id FROM owners LIMIT 1), '99999999-9999-9999-9999-999999999999');
  -- Expected: ERROR - foreign key violation
ROLLBACK;

-- Test 3: Cascade delete works
BEGIN;
  -- Create test data
  INSERT INTO owners (user_id, full_name, email) VALUES ('test-owner-1', 'Test', 'test@test.com');
  INSERT INTO dogs (id, owner_id, name) VALUES ('test-dog-1', 'test-owner-1', 'Buddy');
  INSERT INTO dog_vaccinations (dog_id, owner_id, vaccine_name, vaccination_date)
  VALUES ('test-dog-1', 'test-owner-1', 'Rabies', CURRENT_DATE);

  -- Delete owner
  DELETE FROM owners WHERE user_id = 'test-owner-1';

  -- Verify cascade
  SELECT COUNT(*) FROM dogs WHERE id = 'test-dog-1';  -- Expected: 0
  SELECT COUNT(*) FROM dog_vaccinations WHERE dog_id = 'test-dog-1';  -- Expected: 0
ROLLBACK;
```

#### 5.2 Message Read Functionality Tests

**Manual Test Flow**:
1. Guardian logs in and sends message to professional
2. Professional logs in
3. Professional views message (read status shows false)
4. Professional marks message as read via UI
5. Verify message read status updates to true
6. Verify notification count decreases
7. Guardian sends another message
8. Professional views but doesn't mark as read
9. Professional logs out and back in
10. Verify unread count persists correctly

**Automated Test** (if using Playwright):
```typescript
test('professional can mark guardian message as read', async ({ page }) => {
  // Setup: Guardian sends message
  await guardianSendMessage('Hello doctor');

  // Professional logs in
  await professionalLogin();

  // Navigate to messages
  await page.goto('/professional/messages');

  // Verify unread badge shows
  const unreadCount = await page.locator('[data-testid="unread-count"]').textContent();
  expect(unreadCount).toBe('1');

  // Open conversation and mark as read
  await page.locator('[data-testid="conversation-item"]').first().click();
  await page.locator('[data-testid="mark-as-read"]').click();

  // Verify read status updated
  const readStatus = await page.locator('[data-testid="message-read-status"]').textContent();
  expect(readStatus).toContain('Read');

  // Verify unread count decreased
  const newUnreadCount = await page.locator('[data-testid="unread-count"]').textContent();
  expect(newUnreadCount).toBe('0');
});
```

#### 5.3 RLS Policy Consistency Tests

```sql
-- Test: Verify all tables using professional access use same function
SELECT
  schemaname,
  tablename,
  policyname,
  definition
FROM pg_policies
WHERE schemaname = 'public'
  AND definition LIKE '%professional_has_dog_access%'
ORDER BY tablename;

-- Expected tables: dogs, dog_documents, dog_vaccinations, dog_questionnaires
-- All should use professional_has_dog_access(dog_id, auth.uid())
```

#### 5.4 Integration Tests

**User Journey 1: Guardian Account Deletion**
1. Create test guardian with complete profile
2. Add dogs, vaccinations, questionnaires, calendar events
3. Share dog with professional
4. Create conversation and messages
5. Delete guardian account
6. Verify all related data was cascade deleted:
   - Dogs deleted
   - Vaccinations deleted
   - Questionnaires deleted
   - Calendar events deleted
   - Conversations deleted
   - Messages deleted (via conversation cascade)
   - Dog shares deleted (via dog cascade)

**User Journey 2: Professional Account Deletion**
1. Create test professional
2. Accept dog share from guardian
3. Create calendar events
4. Create conversations and messages
5. Delete professional account
6. Verify:
   - Dog shares deleted
   - Conversations deleted
   - Messages deleted
   - Calendar events: professional_id set to NULL (not cascade deleted)
   - Guardian data remains intact

---

### Phase 6: Monitoring & Rollback Plan (Ongoing)

#### 6.1 Post-Migration Monitoring

**Week 1 Checks**:
- [ ] Monitor error logs for foreign key violations
- [ ] Check message read functionality reports
- [ ] Verify no orphaned records appearing
- [ ] Monitor query performance (foreign keys add overhead)
- [ ] Check cascade delete operations are working

**Monitoring Queries**:
```sql
-- Daily orphan check (should always return 0)
SELECT
  'conversations_owner' as issue,
  COUNT(*) as count
FROM conversations c
LEFT JOIN owners o ON c.owner_id = o.user_id
WHERE o.user_id IS NULL

UNION ALL

SELECT
  'conversations_professional',
  COUNT(*)
FROM conversations c
LEFT JOIN professionals p ON c.professional_id = p.user_id
WHERE p.user_id IS NULL

UNION ALL

SELECT
  'calendar_events_dog',
  COUNT(*)
FROM dog_calendar_events e
LEFT JOIN dogs d ON e.dog_id = d.id
WHERE d.id IS NULL;

-- Check message read policy is being used
SELECT
  COUNT(*) as messages_marked_read_by_recipients
FROM messages m
WHERE m.read = true
  AND EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = m.conversation_id
    AND (
      (c.owner_id != m.sender_id AND m.sender_type = 'professional')
      OR
      (c.professional_id != m.sender_id AND m.sender_type = 'owner')
    )
  );
-- Should show increasing count as recipients mark messages read
```

#### 6.2 Performance Monitoring

```sql
-- Check query performance with new foreign keys
EXPLAIN ANALYZE
SELECT c.*, o.full_name as owner_name, p.full_name as professional_name
FROM conversations c
JOIN owners o ON c.owner_id = o.user_id
JOIN professionals p ON c.professional_id = p.user_id
WHERE c.owner_id = '<some-uuid>'
ORDER BY c.last_message_at DESC;

-- Verify indexes are being used
-- Should show "Index Scan" not "Seq Scan"
```

#### 6.3 Complete Rollback Plan

If critical issues arise and full rollback is needed:

**Step 1: Database Rollback**
```bash
# Restore from backup taken in Phase 1
pg_restore -h <supabase-host> -U postgres -d postgres backup_YYYYMMDD_HHMMSS.sql

# Alternative: Use Supabase dashboard point-in-time recovery
# Navigate to: Project Settings → Database → Backups → Restore
```

**Step 2: Remove Migrations**
```bash
# Delete migration files
rm supabase/migrations/20251020_add_missing_foreign_keys.sql
rm supabase/migrations/20251020_fix_message_read_policy.sql
rm supabase/migrations/20251020_standardize_questionnaire_rls.sql

# Reset migrations
supabase db reset
```

**Step 3: Revert Application Code**
```bash
git revert <commit-hash>  # Revert code changes related to FK handling
```

**Partial Rollback** (individual migrations):
```sql
-- Rollback Migration 3 only
DROP POLICY IF EXISTS "pros_read_shared_dog_questionnaires" ON dog_questionnaires;
-- Recreate old policy with raw subquery (from analysis report)

-- Rollback Migration 2 only
DROP POLICY IF EXISTS "message_recipient_mark_as_read" ON messages;

-- Rollback Migration 1 only
-- Use complete rollback script from analysis report (removes all 8 FKs)
```

---

## Success Metrics

### Database Integrity
- ✅ All 8 foreign key constraints active and enforced
- ✅ Zero orphaned records in system
- ✅ Cascade deletes working correctly
- ✅ RLS policies consistent across all tables

### Functionality
- ✅ Message read status works for both guardians and professionals
- ✅ Notification counts accurate
- ✅ No application errors from new constraints
- ✅ User experience unchanged or improved

### Security
- ✅ Security grade improved from B+ (85.5%) to A- (92%)
- ✅ Data integrity enforced at database level
- ✅ RLS policies maintain least privilege access
- ✅ No data exposure from changes

### Performance
- ✅ Query performance maintained or improved
- ✅ No N+1 query issues introduced
- ✅ Indexes supporting foreign keys effectively
- ✅ professional_has_dog_access() function performs well

---

## Timeline & Responsibilities

| Phase | Duration | Owner | Blockers |
|-------|----------|-------|----------|
| 1. Preparation | 30 min | DevOps/DBA | Backup access, Supabase credentials |
| 2. P0 Migrations | 30 min | Backend Dev | Phase 1 complete, no orphans |
| 3. P1 Standardization | 10 min | Backend Dev | Phase 2 complete |
| 4. Code Audit | 2 hours | Full Stack Dev | Migration scripts tested |
| 5. Testing | 2 hours | QA + Dev | Code changes deployed |
| 6. Monitoring | Ongoing | DevOps | Dashboards configured |

**Total Estimated Time**: 5 hours 10 minutes for P0 and P1 fixes

---

## Risk Assessment

### Low Risk ✅
- RLS standardization (same logic, different implementation)
- Migration scripts include orphan detection
- All changes are additive (no functionality removed)
- Migrations are reversible

### Medium Risk ⚠️
- Foreign key constraints may reveal hidden application bugs
- Cascade deletes may surprise users (needs testing)
- Performance impact from foreign key checks (should be minimal)

### High Risk 🚨
- Orphaned records exist and block migration (mitigated by detection script)
- Application code incompatible with changes (mitigated by thorough audit)
- Production data loss (mitigated by comprehensive backup)

**Mitigation Strategy**:
1. Test on staging environment first ✅
2. Complete backup before production deployment ✅
3. Schedule during low-traffic window ✅
4. Have rollback plan ready ✅
5. Monitor closely post-deployment ✅

---

## Next Steps (P2 - Optional Future Improvements)

### Soft Deletes (4 hours)
- Add `deleted_at` columns to owners, professionals, dogs
- Update RLS policies to filter deleted records
- Implement "undo delete" functionality
- Benefits: Better audit trail, user error recovery

### Database Audit Logging (8 hours)
- Create audit_log table
- Implement trigger functions for INSERT/UPDATE/DELETE
- Track who changed what and when
- Benefits: Compliance, security, debugging

### Row-Level Encryption (6 hours)
- Enable pgcrypto extension
- Encrypt medical_notes and questionnaire_data
- Implement encryption/decryption functions
- Benefits: GDPR compliance, enhanced security

**Total P2 Estimate**: 18 hours for all optional improvements

---

## Appendix

### Useful Queries

**Check Foreign Key Coverage**:
```sql
SELECT
  t.table_name,
  c.column_name,
  fk.constraint_name,
  CASE WHEN fk.constraint_name IS NULL THEN '❌ Missing' ELSE '✅ Present' END as status
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
LEFT JOIN (
  SELECT
    tc.table_name,
    kcu.column_name,
    tc.constraint_name
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
  WHERE tc.constraint_type = 'FOREIGN KEY'
) fk ON t.table_name = fk.table_name AND c.column_name = fk.column_name
WHERE t.table_schema = 'public'
  AND c.column_name LIKE '%_id'
  AND c.column_name != 'id'
ORDER BY t.table_name, c.column_name;
```

**Check RLS Policy Consistency**:
```sql
SELECT
  tablename,
  COUNT(*) as policy_count,
  STRING_AGG(policyname, ', ') as policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
```

### Reference Documentation
- [Analysis Report](./supabase-database-analysis.md)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Foreign Keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK)
- [Supabase Migrations Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)

---

**Plan Status**: Ready for execution
**Last Updated**: 2025-10-28
**Next Review**: After Phase 2 completion
