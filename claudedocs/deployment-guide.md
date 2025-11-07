# Database Migration Deployment Guide

Step-by-step guide for deploying database improvements to production.

## Pre-Deployment Checklist

- [ ] Review all migration files
- [ ] Test migrations in development environment
- [ ] Create database backup
- [ ] Schedule deployment during low-traffic window
- [ ] Notify stakeholders of maintenance window
- [ ] Have rollback plan ready

## Deployment Steps

### Step 1: Backup Current Database

**Via Supabase Dashboard**:
1. Navigate to Project Settings → Database → Backups
2. Click "Create Backup"
3. Note the backup timestamp for potential rollback

**Via CLI** (alternative):
```bash
# Export database schema and data
pg_dump -h db.YOUR_PROJECT_REF.supabase.co \
        -U postgres \
        -d postgres \
        > backup_$(date +%Y%m%d_%H%M%S).sql

# Store backup securely
```

### Step 2: Run Pre-Migration Validation

Execute the validation script to check for orphaned records:

```bash
# Via Supabase SQL Editor
# Copy and paste contents of supabase/scripts/pre-migration-validation.sql
```

**Expected Output**:
```
✅ MIGRATION SAFE - No orphaned records found
```

**If orphans found**:
- STOP deployment
- Investigate orphaned records
- Clean up or create placeholder users
- Re-run validation until clean

### Step 3: Apply Migrations

#### Option A: Via Supabase CLI (Recommended)

```bash
# Verify Supabase CLI is installed and authenticated
supabase --version
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations to production
supabase db push

# Migrations will be applied in order:
# 1. 20251028000001_add_missing_foreign_keys.sql
# 2. 20251028000002_fix_message_read_policy.sql
# 3. 20251028000003_standardize_questionnaire_rls.sql
```

#### Option B: Via Supabase Dashboard

1. Navigate to SQL Editor
2. Create new query for each migration
3. Execute migrations in order:
   - Migration 1: Add missing foreign keys
   - Migration 2: Fix message read policy
   - Migration 3: Standardize RLS pattern

**Migration 1**: [Add Missing Foreign Keys](../supabase/migrations/20251028000001_add_missing_foreign_keys.sql)
- Copy entire contents
- Paste into SQL Editor
- Click "Run"
- Verify output: "SUCCESS: All 8 foreign key constraints added successfully"

**Migration 2**: [Fix Message Read Policy](../supabase/migrations/20251028000002_fix_message_read_policy.sql)
- Copy entire contents
- Paste into SQL Editor
- Click "Run"
- Verify output: "SUCCESS: Message recipient update policy created"

**Migration 3**: [Standardize RLS Pattern](../supabase/migrations/20251028000003_standardize_questionnaire_rls.sql)
- Copy entire contents
- Paste into SQL Editor
- Click "Run"
- Verify output: "SUCCESS: Policy now uses professional_has_dog_access() function"

### Step 4: Run Post-Migration Validation

Execute the validation script to verify all changes:

```bash
# Via Supabase SQL Editor
# Copy and paste contents of supabase/scripts/post-migration-validation.sql
```

**Expected Output**:
```
✅ Foreign Keys: 8/8 constraints present
✅ Message Policy: Recipient read policy present
✅ RLS Consistency: Questionnaire policy standardized

✅✅✅ ALL MIGRATIONS SUCCESSFUL ✅✅✅
Security Grade: A- (92%)
```

### Step 5: Deploy Application Code Changes

```bash
# Deploy updated application code
git add .
git commit -m "fix: Update database query to use 'owners' table

- Fix ProfessionalClients.tsx to use 'owners' instead of 'dog_owner_profiles'
- Add foreign key constraint error handling
- Update database migrations for improved data integrity"

git push origin main

# Deploy to production (adjust based on your hosting platform)
# Example for Vercel:
vercel --prod

# Example for Netlify:
netlify deploy --prod
```

### Step 6: Run Integration Tests

Execute the comprehensive test script:

```bash
# Via Supabase SQL Editor
# Copy and paste contents of supabase/scripts/test-migrations.sql
```

**This will test**:
- Foreign key constraint enforcement
- Cascade delete behavior
- SET NULL behavior for professional_id
- Message read policy functionality
- RLS pattern consistency

**Expected Output**:
```
✅ PASS - Correctly rejected invalid owner_id
✅ PASS - Correctly rejected invalid professional_id
✅ PASS - Correctly rejected invalid dog_id
✅ PASS - Cascade delete worked correctly
✅ PASS - Professional deletion correctly set event.professional_id to NULL
✅ PASS - Message recipient policy exists
✅ PASS - Questionnaire policy uses standard function
✅ PASS - All professional access policies use consistent pattern

✅✅✅ ALL TESTS PASSED ✅✅✅
```

### Step 7: Manual User Testing

Test critical user flows:

#### Guardian Flow
1. Login as guardian
2. Send message to professional
3. Verify message sent successfully
4. Professional should receive message

#### Professional Flow
1. Login as professional
2. View message from guardian
3. **Critical Test**: Mark message as read
4. Verify message status updates to "read"
5. Verify notification count decreases
6. Reply to guardian
7. Guardian should receive reply

#### Cascade Delete Test
1. Create test guardian account
2. Add test dog
3. Create conversation with professional
4. Delete test guardian account
5. Verify:
   - Dog deleted
   - Conversation deleted
   - Messages deleted
   - No orphaned records

### Step 8: Monitor Production

#### Immediate Monitoring (First Hour)

Check for errors in real-time:

```sql
-- Check for foreign key violations
SELECT
  schemaname,
  tablename,
  COUNT(*) as error_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
  AND (n_tup_ins > 0 OR n_tup_upd > 0)
GROUP BY schemaname, tablename
ORDER BY error_count DESC;
```

Monitor application logs for:
- Foreign key constraint errors (code 23503)
- RLS policy violations
- Message read functionality errors

#### Daily Monitoring (First Week)

```sql
-- Daily orphan check (should always return 0)
SELECT
  'conversations.owner_id' as check_type,
  COUNT(*) as orphan_count
FROM conversations c
LEFT JOIN owners o ON c.owner_id = o.user_id
WHERE o.user_id IS NULL

UNION ALL

SELECT
  'conversations.professional_id',
  COUNT(*)
FROM conversations c
LEFT JOIN professionals p ON c.professional_id = p.user_id
WHERE p.user_id IS NULL

UNION ALL

SELECT
  'dog_calendar_events.dog_id',
  COUNT(*)
FROM dog_calendar_events e
LEFT JOIN dogs d ON e.dog_id = d.id
WHERE d.id IS NULL;

-- Expected: All counts = 0
```

```sql
-- Monitor message read functionality
SELECT
  COUNT(*) as total_messages,
  COUNT(CASE WHEN read = true THEN 1 END) as read_messages,
  COUNT(CASE WHEN read = false THEN 1 END) as unread_messages,
  ROUND(100.0 * COUNT(CASE WHEN read = true THEN 1 END) / COUNT(*), 2) as read_percentage
FROM messages
WHERE created_at > NOW() - INTERVAL '24 hours';
```

### Step 9: Verify Security Grade

Run the security assessment:

```sql
-- Check constraint coverage
SELECT
  t.table_name,
  COUNT(DISTINCT c.column_name) as total_id_columns,
  COUNT(DISTINCT fk.column_name) as columns_with_fk,
  ROUND(100.0 * COUNT(DISTINCT fk.column_name) / NULLIF(COUNT(DISTINCT c.column_name), 0), 2) as fk_coverage_pct
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
LEFT JOIN (
  SELECT
    tc.table_name,
    kcu.column_name
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
  WHERE tc.constraint_type = 'FOREIGN KEY'
) fk ON t.table_name = fk.table_name AND c.column_name = fk.column_name
WHERE t.table_schema = 'public'
  AND c.column_name LIKE '%_id'
  AND c.column_name != 'id'
GROUP BY t.table_name
ORDER BY fk_coverage_pct ASC;

-- Expected: All critical tables at 100% coverage
```

**Target Security Metrics**:
- Foreign Key Coverage: 100% on critical tables
- RLS Enabled: 100% of tables
- Security Grade: A- (92%)

## Rollback Procedure

If critical issues arise, follow these steps:

### 1. Assess Impact

Determine which migration is causing issues:
- Migration 1 (Foreign Keys): Data integrity errors
- Migration 2 (Message Read): Notification system broken
- Migration 3 (RLS Standardization): Professional access issues

### 2. Restore from Backup (Nuclear Option)

**Only if all migrations must be reverted**:

```bash
# Via Supabase Dashboard
# Navigate to: Project Settings → Database → Backups
# Select backup created in Step 1
# Click "Restore"

# Via CLI
psql -h db.YOUR_PROJECT_REF.supabase.co \
     -U postgres \
     -d postgres \
     < backup_TIMESTAMP.sql
```

### 3. Selective Rollback (Preferred)

**Rollback Migration 3 Only**:
```sql
DROP POLICY IF EXISTS "pros_read_shared_dog_questionnaires" ON dog_questionnaires;

-- Recreate old policy with raw subquery
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

**Rollback Migration 2 Only**:
```sql
DROP POLICY IF EXISTS "message_recipient_mark_as_read" ON messages;
```

**Rollback Migration 1 Only**:
```sql
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

### 4. Revert Application Code

```bash
git revert <commit-hash>
git push origin main

# Redeploy
vercel --prod  # or your deployment command
```

### 5. Notify Stakeholders

Communicate rollback to team and users:
- What was rolled back
- Why it was necessary
- Impact on users
- Timeline for fix and re-deployment

## Post-Deployment Report

### Success Metrics

After deployment, document:

✅ **Migration Status**:
- [ ] All 3 migrations applied successfully
- [ ] No errors during deployment
- [ ] All validation tests passed

✅ **Data Integrity**:
- [ ] Zero orphaned records
- [ ] Foreign keys enforcing constraints
- [ ] Cascade deletes working correctly

✅ **Functionality**:
- [ ] Message read status updates working
- [ ] Notifications accurate
- [ ] Professional access functioning

✅ **Performance**:
- [ ] No query performance degradation
- [ ] Foreign key indexes working
- [ ] professional_has_dog_access() function performant

✅ **Security**:
- [ ] Security grade improved to A- (92%)
- [ ] RLS policies consistent
- [ ] Data access properly controlled

### Timeline

| Phase | Estimated Duration | Actual Duration |
|-------|-------------------|-----------------|
| Backup | 5 minutes | |
| Pre-validation | 5 minutes | |
| Migration 1 | 5 minutes | |
| Migration 2 | 2 minutes | |
| Migration 3 | 2 minutes | |
| Post-validation | 5 minutes | |
| Testing | 15 minutes | |
| Monitoring | 30 minutes | |
| **Total** | **~70 minutes** | |

### Lessons Learned

Document for future migrations:
- What went well
- What could be improved
- Unexpected issues encountered
- Team communication effectiveness
- Rollback readiness assessment

## Next Steps

After successful deployment:

1. **Monitor for 1 week**:
   - Daily orphan checks
   - Error log review
   - User feedback collection

2. **Update documentation**:
   - Mark migrations as deployed
   - Update architecture diagrams
   - Document any workarounds

3. **Plan P2 improvements** (Optional):
   - Soft deletes implementation (4 hours)
   - Database audit logging (8 hours)
   - Row-level encryption (6 hours)

4. **Team knowledge transfer**:
   - Share deployment experience
   - Update runbooks
   - Train on new error handling

---

**Deployment Prepared By**: Claude Code
**Date Created**: 2025-10-28
**Last Updated**: 2025-10-28
**Version**: 1.0
