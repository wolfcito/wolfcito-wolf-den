# Event Feedback Ops - Database Migration

## Prerequisites
- Supabase project with admin access
- SQL Editor access in Supabase Dashboard

## Steps

1. Navigate to Supabase Dashboard → SQL Editor
2. Create new query
3. Copy contents of `001_event_feedback_ops.sql`
4. Execute query
5. Verify tables created: `event_labs`, `feedback_items`, `event_tracking`, `lab_sessions`

## Verification

After running the migration, verify the tables exist:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('event_labs', 'feedback_items', 'event_tracking', 'lab_sessions');
```

You should see all 4 tables listed.

## Rollback

If you need to rollback this migration:

```sql
DROP TABLE IF EXISTS lab_sessions CASCADE;
DROP TABLE IF EXISTS event_tracking CASCADE;
DROP TABLE IF EXISTS feedback_items CASCADE;
DROP TABLE IF EXISTS event_labs CASCADE;
```

**WARNING:** This will delete all data in these tables. Only use in development.

## Schema Overview

### `event_labs`
Core lab configuration with slug-based routing.

### `feedback_items`
User feedback submissions with trust scoring and triage fields.

### `event_tracking`
Interaction events (page views, clicks, errors) for lab sessions.

### `lab_sessions`
Session tracking with aggregated stats (event_count, feedback_count).

## Row Level Security (RLS) for Production

**For Development:** RLS is disabled by default. All tables are UNRESTRICTED.

**For Production:** Enable RLS to secure your data.

### When to Enable RLS

- ✅ **Before deploying to production**
- ✅ **When handling real user data**
- ❌ **Not needed for local development**

### How to Enable RLS

1. **Run the base migration first** (`001_event_feedback_ops.sql`)
2. **Then run the RLS migration** (`002_event_feedback_ops_rls.sql`)

```bash
# In Supabase SQL Editor:
# 1. Copy contents of 002_event_feedback_ops_rls.sql
# 2. Execute query
# 3. Verify policies with: SELECT * FROM pg_policies WHERE tablename LIKE '%event%';
```

### RLS Policy Summary

**Hybrid Visibility Model:**

| User Type | Event Labs | Feedback | Events | Sessions |
|-----------|------------|----------|--------|----------|
| **Anonymous** | View active labs | Submit + view top P0/P1 | Track events (write-only) | Create sessions |
| **Participants** | View active labs | View own + top P0/P1 | Track events | View own sessions |
| **Creators** | Full access to own labs | View ALL feedback | View all events | View all sessions |

**Key Policies:**
- Lab creators see everything for their labs
- Participants see their own feedback + high-priority issues (P0/P1)
- Anonymous users can participate and view top issues only
- All event tracking is write-only for privacy

### Testing RLS Policies

```sql
-- Test as anonymous user
SET ROLE anon;
SELECT * FROM event_labs; -- Should only see active labs

-- Test as authenticated user
SET LOCAL "request.jwt.claims" = '{"sub": "user-uuid-here"}';
SELECT * FROM feedback_items WHERE lab_id = 'lab-uuid-here';
-- Should see: own feedback + P0/P1 issues

-- Reset
RESET ROLE;
```

### Disabling RLS (Development Only)

If you need to disable RLS temporarily for debugging:

```sql
ALTER TABLE event_labs DISABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE lab_sessions DISABLE ROW LEVEL SECURITY;
```

**⚠️ WARNING:** Never disable RLS in production!

## Next Steps

After running the migration:
1. Verify tables and indexes exist
2. Test CRUD operations via Supabase dashboard
3. **For Production:** Run RLS migration (`002_event_feedback_ops_rls.sql`)
4. Test RLS policies with different user roles
5. Start the Next.js development server
