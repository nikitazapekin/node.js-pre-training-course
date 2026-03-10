-- ============================================================================
-- Task 06: Indexes and Query Optimization (Raw SQL)
-- ============================================================================

-- ============================================================================
-- 1. CREATE INDEXES
-- ============================================================================

-- Create an index on the status column in the todos table
CREATE INDEX idx_todos_status ON todos(status);
 

-- Or query the index information directly
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'todos';
 
-- Index on user_id for faster JOINs and lookups by user
CREATE INDEX idx_todos_user_id ON todos(user_id);

-- Index on created_at for faster date-based sorting and filtering
CREATE INDEX idx_todos_created_at ON todos(created_at);

-- Composite index for queries that filter by status AND sort by created_at
CREATE INDEX idx_todos_status_created_at ON todos(status, created_at DESC);

-- Index on email for faster user lookups (often used in WHERE clauses)
CREATE INDEX idx_users_email ON users(email);

-- Create a unique index (prevents duplicate values)
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- ============================================================================
-- 2. ANALYZE QUERY PERFORMANCE WITH EXPLAIN
-- ============================================================================

-- Analyze a query that selects todos by status (without index)
-- Run this BEFORE creating the index to see the difference
EXPLAIN SELECT * FROM todos WHERE status = 'active';

-- EXPLAIN ANALYZE actually executes the query and shows actual timing
EXPLAIN ANALYZE SELECT * FROM todos WHERE status = 'active';

-- Analyze a query with ORDER BY
EXPLAIN ANALYZE SELECT * FROM todos WHERE status = 'active' ORDER BY created_at DESC;

-- Analyze a JOIN query
EXPLAIN ANALYZE 
SELECT t.*, u.name 
FROM todos t
JOIN users u ON t.user_id = u.id
WHERE t.status = 'active';

-- Analyze a query with multiple conditions
EXPLAIN ANALYZE 
SELECT * FROM todos 
WHERE status = 'active' 
  AND user_id = 1
ORDER BY created_at DESC;

-- ============================================================================
-- COMPARISON: Before and After Index Creation
-- ============================================================================

-- Drop indexes to test performance without them
DROP INDEX IF EXISTS idx_todos_status;
DROP INDEX IF EXISTS idx_todos_user_id;
DROP INDEX IF EXISTS idx_todos_created_at;
DROP INDEX IF EXISTS idx_todos_status_created_at;

-- Analyze query WITHOUT index (likely Seq Scan)
EXPLAIN ANALYZE SELECT * FROM todos WHERE status = 'active';

-- Recreate the index
CREATE INDEX idx_todos_status ON todos(status);

-- Analyze query WITH index (should show Index Scan or Bitmap Index Scan)
EXPLAIN ANALYZE SELECT * FROM todos WHERE status = 'active';
 
-- Update table statistics (helps query planner make better decisions)
ANALYZE todos;
ANALYZE users;

-- Analyze all tables in the database
ANALYZE;

-- Vacuum to reclaim storage and update statistics (PostgreSQL)
VACUUM ANALYZE todos;
VACUUM ANALYZE users;

-- Check index usage statistics
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
 