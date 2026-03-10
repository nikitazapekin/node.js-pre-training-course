-- Task 08: Implementing CRUD Operations with Prisma ORM
-- File: prisma/crud-operations.ts

-- Run the CRUD operations demo:
-- npx ts-node -r dotenv/config prisma/crud-operations.ts

-- Description:
-- Implemented all CRUD operations for the `todos` table using Prisma ORM:

-- CREATE:
-- createTodo(title, description, userId, status) - Creates a new todo item

-- READ:
-- getAllTodos() - Retrieves all todos
-- getTodosByStatus(status) - Filters todos by status
-- getTodosByUserId(userId) - Filters todos by user ID
-- getTodoById(id) - Retrieves a single todo by ID

-- UPDATE:
-- updateTodoStatus(id, newStatus) - Updates todo status
-- updateTodo(id, data) - Updates title and/or description

-- DELETE:
-- deleteTodo(id) - Deletes a todo by ID

-- Issues Encountered:
-- No issues encountered. All CRUD operations executed successfully.
