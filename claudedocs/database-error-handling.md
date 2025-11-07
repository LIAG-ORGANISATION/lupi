# Database Error Handling Guide

Post-migration error handling for foreign key constraints and RLS policies.

## Foreign Key Constraint Errors

After adding foreign key constraints, the application may encounter errors when trying to create records with invalid references.

### Error Code: 23503 (Foreign Key Violation)

**Example Error**:
```
{
  code: "23503",
  message: 'insert or update on table "conversations" violates foreign key constraint "fk_conversations_owner"'
}
```

### Handling in Application Code

```typescript
// Example: Creating a conversation
try {
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      owner_id: ownerId,
      professional_id: professionalId,
      dog_id: dogId
    });

  if (error) {
    // Check for foreign key violations
    if (error.code === '23503') {
      if (error.message.includes('fk_conversations_owner')) {
        throw new Error('Propriétaire invalide');
      }
      if (error.message.includes('fk_conversations_professional')) {
        throw new Error('Professionnel invalide');
      }
      if (error.message.includes('fk_conversations_dog')) {
        throw new Error('Chien invalide');
      }
    }
    throw error;
  }

  return data;
} catch (err) {
  console.error('Failed to create conversation:', err);
  toast({
    title: 'Erreur',
    description: err.message || 'Impossible de créer la conversation',
    variant: 'destructive'
  });
}
```

### Common FK Violation Scenarios

#### 1. conversations table
- **owner_id**: Invalid guardian user ID
- **professional_id**: Invalid professional user ID
- **dog_id**: Invalid dog ID or dog was deleted

#### 2. dog_calendar_events table
- **dog_id**: Dog doesn't exist
- **owner_id**: Guardian doesn't exist
- **professional_id**: Professional doesn't exist

#### 3. dog_vaccinations table
- **owner_id**: Guardian doesn't exist

#### 4. dog_questionnaires table
- **owner_id**: Guardian doesn't exist

### Prevention Strategies

1. **Validate IDs before insertion**:
```typescript
// Check if owner exists before creating conversation
const { data: owner, error } = await supabase
  .from('owners')
  .select('user_id')
  .eq('user_id', ownerId)
  .single();

if (error || !owner) {
  throw new Error('Propriétaire introuvable');
}
```

2. **Use transactions for multi-step operations**:
```typescript
// Supabase doesn't support explicit transactions in client,
// but operations are atomic within a single RPC call
```

3. **Handle cascade deletes gracefully**:
```typescript
// When deleting a guardian, conversations are cascade deleted
// Inform user about related data deletion
const confirmDelete = await showConfirmDialog(
  'Supprimer le compte',
  'Cela supprimera également toutes les conversations et données associées. Continuer ?'
);
```

## RLS Policy Errors

### Message Read Policy

**Before Migration**:
- Recipients couldn't mark messages as read
- Error: "new row violates row-level security policy"

**After Migration**:
- Recipients can update ONLY the `read` field
- Any attempt to modify other fields will fail

**Example - Works**:
```typescript
// Mark message as read (allowed for recipients)
const { error } = await supabase
  .from('messages')
  .update({ read: true })
  .eq('id', messageId);
```

**Example - Fails**:
```typescript
// Try to modify content (blocked by WITH CHECK)
const { error } = await supabase
  .from('messages')
  .update({
    read: true,
    content: 'hacked'  // ❌ Will fail WITH CHECK constraint
  })
  .eq('id', messageId);

// Error: "new row violates row-level security policy"
```

### Professional Access Policies

After RLS standardization, all dog-related tables use `professional_has_dog_access()`:
- dog_questionnaires
- dog_vaccinations
- dog_documents
- dogs

**Example**:
```typescript
// Professional can only access questionnaires for approved dog shares
const { data, error } = await supabase
  .from('dog_questionnaires')
  .select('*')
  .eq('dog_id', dogId);

// If professional doesn't have access, returns empty array (not error)
```

## Testing Error Handling

### Unit Tests

```typescript
describe('Foreign Key Constraints', () => {
  it('should reject conversation with invalid owner_id', async () => {
    const invalidOwnerId = '99999999-9999-9999-9999-999999999999';

    const { error } = await supabase
      .from('conversations')
      .insert({
        owner_id: invalidOwnerId,
        professional_id: validProfessionalId
      });

    expect(error).toBeDefined();
    expect(error.code).toBe('23503');
    expect(error.message).toContain('fk_conversations_owner');
  });

  it('should cascade delete conversations when owner deleted', async () => {
    // Create test owner and conversation
    const { data: owner } = await supabase
      .from('owners')
      .insert({ user_id: testUserId, full_name: 'Test', email: 'test@test.com' })
      .select()
      .single();

    const { data: conv } = await supabase
      .from('conversations')
      .insert({
        owner_id: owner.user_id,
        professional_id: validProfessionalId
      })
      .select()
      .single();

    // Delete owner
    await supabase
      .from('owners')
      .delete()
      .eq('user_id', testUserId);

    // Verify conversation was cascade deleted
    const { data: deletedConv } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conv.id)
      .single();

    expect(deletedConv).toBeNull();
  });
});
```

### Integration Tests

```typescript
describe('Message Read Functionality', () => {
  it('should allow recipient to mark message as read', async () => {
    // Guardian sends message to professional
    await guardianSendsMessage(conversationId, 'Hello');

    // Professional marks as read
    await professionalLogin();

    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .eq('read', false);

    expect(error).toBeNull();

    // Verify message is marked as read
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId);

    expect(messages.every(m => m.read === true)).toBe(true);
  });

  it('should prevent recipient from modifying message content', async () => {
    await guardianSendsMessage(conversationId, 'Original message');

    await professionalLogin();

    const { error } = await supabase
      .from('messages')
      .update({
        read: true,
        content: 'Hacked content'
      })
      .eq('conversation_id', conversationId)
      .eq('read', false);

    // Should fail WITH CHECK constraint
    expect(error).toBeDefined();
    expect(error.message).toContain('row-level security');
  });
});
```

## Monitoring & Debugging

### Check for FK Violations in Logs

```sql
-- Production monitoring query (run daily)
SELECT
  tablename,
  COUNT(*) as violation_attempts
FROM pg_stat_database_conflicts
WHERE datname = 'postgres'
  AND confl_tablespace > 0
GROUP BY tablename;
```

### Audit Trail for Failed Operations

```typescript
// Log FK violations for monitoring
supabase
  .from('audit_log')
  .insert({
    event_type: 'fk_violation',
    table_name: 'conversations',
    constraint_name: 'fk_conversations_owner',
    attempted_id: invalidOwnerId,
    user_id: currentUser.id,
    timestamp: new Date().toISOString()
  });
```

## Migration Rollback

If critical issues arise:

### Rollback Migration 2 (Message Read Policy)

```sql
DROP POLICY IF EXISTS "message_recipient_mark_as_read" ON messages;
```

### Rollback Migration 1 (Foreign Keys)

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

## Best Practices

1. **Always validate input before database operations**
2. **Use try-catch blocks for all Supabase operations**
3. **Provide user-friendly error messages**
4. **Log errors for debugging and monitoring**
5. **Test cascade delete behavior thoroughly**
6. **Document all constraint-related errors**
7. **Monitor production for unexpected FK violations**
