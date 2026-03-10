-- ============================================================================
-- Task 04: Creating a Users Table and Linking Todos to Users with a Foreign Key
-- ============================================================================
 
-- ============================================================================
-- 1. CREATE THE USERS TABLE
-- ============================================================================

-- Create the users table with id, name, email, and created_at
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL CHECK (name <> ''),
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 

-- ============================================================================
-- 2. ALTER THE TODOS TABLE (if it exists without user_id)
-- ============================================================================

-- Add user_id column to the todos table
ALTER TABLE todos
ADD COLUMN user_id INTEGER;

-- Add foreign key constraint on user_id referencing users(id)
ALTER TABLE todos
ADD CONSTRAINT fk_todos_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
 
-- Create the todos table with user_id foreign key
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL CHECK (title <> ''),
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================================
-- INSERT SAMPLE DATA
-- ============================================================================

-- Insert sample users
INSERT INTO users (name, email)
VALUES 
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com'),
    ('Bob Wilson', 'bob@example.com');

-- Verify users were inserted
SELECT * FROM users;

-- Insert todos linked to users
INSERT INTO todos (title, description, status, user_id)
VALUES 
    ('Complete project setup', 'Set up the initial project structure', 'active', 1),
    ('Learn SQL basics', 'Study SELECT, INSERT, UPDATE, DELETE', 'active', 1),
    ('Build REST API', 'Create endpoints for todo management', 'completed', 2),
    ('Write documentation', 'Document all API endpoints', 'active', 2),
    ('Code review', 'Review pull requests', 'active', 3);

-- Verify todos were inserted with user information
SELECT * FROM todos;

-- ============================================================================
-- QUERYING RELATED DATA (JOIN OPERATIONS)
-- ============================================================================

-- Get all todos with their owner's name
SELECT t.id, t.title, t.status, u.name AS owner_name
FROM todos t
JOIN users u ON t.user_id = u.id;

-- Get all todos for a specific user
SELECT t.*
FROM todos t
JOIN users u ON t.user_id = u.id
WHERE u.email = 'john@example.com';

-- Get user with their todo count
SELECT u.name, u.email, COUNT(t.id) AS todo_count
FROM users u
LEFT JOIN todos t ON u.id = t.user_id
GROUP BY u.id, u.name, u.email;

-- Get only active todos with owner information
SELECT t.id, t.title, t.description, t.status, u.name AS owner_name, t.created_at
FROM todos t
JOIN users u ON t.user_id = u.id
WHERE t.status = 'active'
ORDER BY t.created_at DESC;

-- ============================================================================
-- TESTING CASCADE DELETE
-- ============================================================================

-- Insert a test user and todo
INSERT INTO users (name, email) VALUES ('Test User', 'test@example.com');
INSERT INTO todos (title, user_id) VALUES ('Test todo for cascade', 4);

-- Verify the todo exists
SELECT * FROM todos WHERE user_id = 4;

-- Delete the user (this will also delete their todos due to ON DELETE CASCADE)
DELETE FROM users WHERE email = 'test@example.com';

-- Verify the todo was also deleted (should return no rows)
SELECT * FROM todos WHERE user_id = 4;
 