-- ============================================================================
-- Task 02: Basic CRUD Operations on the "todos" Table with Raw SQL
-- ============================================================================

-- ============================================================================
-- CREATE: Insert a new todo
-- ============================================================================

-- Insert a single todo with title, description, and status
INSERT INTO todos (title, description, status, user_id)
VALUES ('Complete project setup', 'Set up the initial project structure and dependencies', 'active', 1);

-- Insert multiple todos at once
INSERT INTO todos (title, description, status, user_id)
VALUES 
    ('Learn SQL basics', 'Study SELECT, INSERT, UPDATE, DELETE statements', 'active', 1),
    ('Build REST API', 'Create endpoints for todo management', 'active', 1),
    ('Write tests', 'Add unit and integration tests', 'active', 1);

-- Verify the inserts
SELECT * FROM todos;

-- ============================================================================
-- READ: Select todos
-- ============================================================================

-- Select all columns from todos
SELECT * FROM todos;

-- Select specific columns
SELECT id, title, status FROM todos;

-- Select todos with a specific status
SELECT * FROM todos WHERE status = 'active';

-- Select todos ordered by creation date (newest first)
SELECT * FROM todos ORDER BY created_at DESC;

-- Select todos with a title containing a specific word
SELECT * FROM todos WHERE title LIKE '%project%';

-- Count total todos
SELECT COUNT(*) AS total_todos FROM todos;

-- ============================================================================
-- UPDATE: Change the status of a todo
-- ============================================================================

-- Update the status of a specific todo by id
UPDATE todos
SET status = 'completed'
WHERE id = 1;

-- Update multiple columns (status and description)
UPDATE todos
SET status = 'completed', description = 'Project setup is now complete'
WHERE id = 1;

-- Update all active todos to completed
UPDATE todos
SET status = 'completed'
WHERE status = 'active';

-- Verify the update
SELECT * FROM todos WHERE id = 1;

-- ============================================================================
-- DELETE: Remove a todo
-- ============================================================================

-- Delete a specific todo by id
DELETE FROM todos
WHERE id = 4;

-- Delete multiple todos by condition
DELETE FROM todos
WHERE status = 'completed';

-- Delete all todos (use with caution!)
-- DELETE FROM todos;

-- Verify the deletion
SELECT * FROM todos;

-- ============================================================================
-- COMPLETE EXAMPLE SESSION
-- ============================================================================

-- 1. Create: Insert a new todo
INSERT INTO todos (title, description, status, user_id)
VALUES ('Test CRUD operations', 'Verify all CRUD operations work correctly', 'active', 1);

-- 2. Read: Select the newly created todo
SELECT * FROM todos WHERE title = 'Test CRUD operations';

-- 3. Update: Change its status to completed
UPDATE todos
SET status = 'completed'
WHERE title = 'Test CRUD operations';

-- 4. Read: Verify the update
SELECT * FROM todos WHERE title = 'Test CRUD operations';

-- 5. Delete: Remove the todo
DELETE FROM todos
WHERE title = 'Test CRUD operations';

-- 6. Read: Verify the deletion (should return no rows)
SELECT * FROM todos WHERE title = 'Test CRUD operations';
 