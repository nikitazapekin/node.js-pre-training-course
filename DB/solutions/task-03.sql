-- ============================================================================
-- Task 03: Filtering and Sorting Todos with Raw SQL
-- ============================================================================

-- ============================================================================
-- 1. FILTER BY STATUS
-- ============================================================================

-- Select all active todos
SELECT * FROM todos
WHERE status = 'active';

-- Select all completed todos
SELECT * FROM todos
WHERE status = 'completed';

-- Count todos by status
SELECT status, COUNT(*) AS count
FROM todos
GROUP BY status;

-- Select active todos with their owner information
SELECT t.id, t.title, t.status, u.username
FROM todos t
JOIN users u ON t.user_id = u.id
WHERE t.status = 'active';

-- ============================================================================
-- 2. SORT BY CREATION DATE
-- ============================================================================

-- Select all todos sorted by created_at in ascending order (oldest first)
SELECT * FROM todos
ORDER BY created_at ASC;

-- Select all todos sorted by created_at in descending order (newest first)
SELECT * FROM todos
ORDER BY created_at DESC;

-- Select todos with status and sort by newest first
SELECT id, title, status, created_at
FROM todos
WHERE status = 'active'
ORDER BY created_at DESC;

-- Sort by multiple columns (status first, then by created_at)
SELECT id, title, status, created_at
FROM todos
ORDER BY status ASC, created_at DESC;

-- ============================================================================
-- 3. SEARCH BY KEYWORD
-- ============================================================================

-- Search by keyword in title (case-insensitive in PostgreSQL with ILIKE)
SELECT * FROM todos
WHERE title ILIKE '%meeting%';

-- Search by keyword in description
SELECT * FROM todos
WHERE description ILIKE '%meeting%';

-- Search by keyword in title OR description
SELECT * FROM todos
WHERE title ILIKE '%meeting%'
   OR description ILIKE '%meeting%';

-- Search with multiple keywords (find todos containing 'project' OR 'setup')
SELECT * FROM todos
WHERE title ILIKE '%project%'
   OR title ILIKE '%setup%'
   OR description ILIKE '%project%'
   OR description ILIKE '%setup%';

-- Combine search with status filter
SELECT * FROM todos
WHERE (title ILIKE '%project%' OR description ILIKE '%project%')
  AND status = 'active';

-- ============================================================================
-- COMBINED EXAMPLES: Real-world Query Scenarios
-- ============================================================================

-- Get all active todos for a specific user, sorted by newest first
SELECT t.id, t.title, t.description, t.status, t.created_at, u.username
FROM todos t
JOIN users u ON t.user_id = u.id
WHERE t.status = 'active' AND u.id = 1
ORDER BY t.created_at DESC;

-- Get completed todos that contain a specific keyword, sorted by title
SELECT id, title, description, created_at
FROM todos
WHERE status = 'completed'
  AND (title ILIKE '%test%' OR description ILIKE '%test%')
ORDER BY title ASC;

-- Get todos created in the last 7 days (PostgreSQL syntax)
SELECT * FROM todos
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- Get todos with LIMIT and OFFSET (pagination)
SELECT * FROM todos
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;

-- ============================================================================
-- NOTES
-- ============================================================================
-- - ILIKE is PostgreSQL-specific for case-insensitive matching
-- - For MySQL, use LIKE with LOWER() function: WHERE LOWER(title) LIKE '%meeting%'
-- - ORDER BY ASC = ascending (oldest/smallest first)
-- - ORDER BY DESC = descending (newest/largest first)
-- - LIKE patterns:
--   - '%word%' - contains 'word'
--   - 'word%' - starts with 'word'
--   - '%word' - ends with 'word'
--   - '_ord' - matches any single character followed by 'ord'
-- - Use indexes on frequently filtered/sorted columns for better performance
-- - Combine WHERE, ORDER BY, LIMIT for efficient pagination and filtering
