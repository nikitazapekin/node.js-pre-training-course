-- ============================================================================
-- Task 01: Setting Up and Creating the "users" and "todos" Tables with Raw SQL
-- ============================================================================

-- ============================================================================
-- STEP 1: Install a Relational Database
-- ============================================================================
-- Terminal commands to install PostgreSQL (Ubuntu/Debian):
-- sudo apt update
-- sudo apt install postgresql postgresql-contrib
--
-- For macOS (using Homebrew):
-- brew install postgresql
--
-- For MySQL (Ubuntu/Debian):
-- sudo apt update
-- sudo apt install mysql-server
--
-- For macOS (using Homebrew):
-- brew install mysql

-- ============================================================================
-- STEP 2: Install a Database GUI Tool (Optional)
-- ============================================================================
-- DBeaver: https://dbeaver.io/download/
-- TablePlus: https://tableplus.com/
-- pgAdmin (PostgreSQL): https://www.pgadmin.org/download/

-- ============================================================================
-- STEP 3: Create a New Database
-- ============================================================================
-- Connect to PostgreSQL:
-- psql -U postgres
--
-- Create the database:
CREATE DATABASE todo_app;

-- Connect to the new database:
-- todo_app;

-- ============================================================================
-- STEP 4: Create the Tables
-- ============================================================================

-- Connect to todo_app database first
-- todo_app;

-- Create the "users" table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the "todos" table
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL CHECK (title <> ''),
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
 