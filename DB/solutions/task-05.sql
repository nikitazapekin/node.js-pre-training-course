-- ============================================================================
-- Task 05: Aggregation and Grouping in SQL (Raw SQL)
-- ============================================================================

-- Count the number of todos for each status
SELECT status, COUNT(*) AS todo_count
FROM todos
GROUP BY status;

-- Count todos by status with additional statistics
SELECT 
    status,
    COUNT(*) AS todo_count,
    COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS percentage
FROM todos
GROUP BY status;

-- Count all todos (single aggregate)
SELECT COUNT(*) AS total_todos FROM todos;

-- Count active and completed separately using conditional aggregation
SELECT 
    COUNT(*) FILTER (WHERE status = 'active') AS active_count,
    COUNT(*) FILTER (WHERE status = 'completed') AS completed_count,
    COUNT(*) AS total_count
FROM todos;
 
-- ============================================================================
-- 2. COUNT TODOS PER USER
-- ============================================================================

-- Count todos for each user (shows only users with at least one todo)
SELECT u.name, u.email, COUNT(t.id) AS todo_count
FROM users u
INNER JOIN todos t ON u.id = t.user_id
GROUP BY u.id, u.name, u.email;

-- Count todos for each user (includes users with zero todos)
SELECT u.name, u.email, COUNT(t.id) AS todo_count
FROM users u
LEFT JOIN todos t ON u.id = t.user_id
GROUP BY u.id, u.name, u.email;

-- Count todos per user ordered by count (most productive first)
SELECT u.name, u.email, COUNT(t.id) AS todo_count
FROM users u
LEFT JOIN todos t ON u.id = t.user_id
GROUP BY u.id, u.name, u.email
ORDER BY todo_count DESC;

-- Count active vs completed todos per user
SELECT 
    u.name,
    u.email,
    COUNT(t.id) AS total_todos,
    COUNT(t.id) FILTER (WHERE t.status = 'active') AS active_todos,
    COUNT(t.id) FILTER (WHERE t.status = 'completed') AS completed_todos
FROM users u
LEFT JOIN todos t ON u.id = t.user_id
GROUP BY u.id, u.name, u.email;

-- ============================================================================
-- 3. FIND USERS WITH NO TODOS
-- ============================================================================

-- Find users who do not have any todos (using LEFT JOIN and NULL check)
SELECT u.id, u.name, u.email
FROM users u
LEFT JOIN todos t ON u.id = t.user_id
WHERE t.id IS NULL;

-- Alternative: Using NOT EXISTS
SELECT u.id, u.name, u.email
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM todos t WHERE t.user_id = u.id
);

-- Alternative: Using NOT IN
SELECT u.id, u.name, u.email
FROM users u
WHERE u.id NOT IN (
    SELECT DISTINCT user_id FROM todos WHERE user_id IS NOT NULL
);
 