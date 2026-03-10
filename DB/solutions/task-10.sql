-- Task 10: Caching the User's Todo List with Redis
-- File: DB/solutions/task-10.sql

-- ============================================================================
-- Solution Documentation
-- ============================================================================
-- 
-- Implementation Location: DB/task-10/
-- Files Created:
--   - index.js          : Main application with Redis caching logic
--   - package.json      : Dependencies (express, ioredis)
--   - README.md         : Usage documentation
--   - .env.example      : Environment variables template
--
-- ============================================================================
-- Implementation Summary
-- ============================================================================

-- 1. REDIS SETUP
--    - Used ioredis library for Redis connection
--    - Configurable via environment variables (REDIS_HOST, REDIS_PORT, REDIS_PASSWORD)
--    - Cache key pattern: todos:user:{userId}

-- 2. CACHING STRATEGY (Cache-First / Read-Through)
--    - On GET /todos/:userId:
--      a) Check Redis for cached data
--      b) Cache HIT: Return cached data immediately
--      c) Cache MISS: Fetch from database, cache with TTL (300s), return data

-- 3. CACHE INVALIDATION
--    Cache is automatically invalidated on:
--      - POST /todos       (create new todo)
--      - PUT /todos/:id    (update existing todo)
--      - DELETE /todos/:id (delete todo)
--    Uses redis.del() to remove the user's cache key

-- 4. TTL DEMONSTRATION
--    - Default TTL: 300 seconds (5 minutes)
--    - Uses redis.setex() for setting key with expiration
--    - After TTL expires, next request results in cache miss

-- ============================================================================
-- API Endpoints
-- ============================================================================

-- GET /todos/:userId
--   Returns user's todos with caching
--   Response: { "source": "cache|database", "data": [...] }

-- POST /todos
--   Creates new todo, invalidates user cache
--   Body: { "userId": number, "title": string, "completed": boolean }

-- PUT /todos/:id
--   Updates todo, invalidates user cache
--   Body: { "title": string, "completed": boolean }

-- DELETE /todos/:id
--   Deletes todo, invalidates user cache

-- GET /cache/stats
--   Shows all cached entries with TTL (for demonstration)

-- DELETE /cache/:userId
--   Manually invalidate user cache

-- GET /health
--   Health check with Redis connectivity status

-- ============================================================================
-- Usage Instructions
-- ============================================================================

-- 1. Start Redis server:
--    $ redis-server
--    or
--    $ brew services start redis  (macOS)
--    $ sudo systemctl start redis-server  (Linux)

-- 2. Install dependencies:
--    $ cd DB/task-10
--    $ npm install

-- 3. Configure environment (optional):
--    $ cp .env.example .env
--    # Edit .env with your Redis settings

-- 4. Start the application:
--    $ npm start

-- 5. Test caching:
--    # First request (cache miss)
--    $ curl http://localhost:3000/todos/1
--    
--    # Second request (cache hit)
--    $ curl http://localhost:3000/todos/1
--    
--    # View cache stats
--    $ curl http://localhost:3000/cache/stats

-- ============================================================================
-- Issues Encountered
-- ============================================================================

-- None. The implementation uses ioredis which provides a clean API for
-- Redis operations. The cache-aside pattern is straightforward to implement
-- and works well for read-heavy workloads like fetching user todo lists.

-- ============================================================================
-- Key Learnings
-- ============================================================================

-- 1. Redis is an excellent choice for caching frequently accessed data
-- 2. Cache invalidation is critical for data consistency
-- 3. TTL provides automatic cache cleanup, preventing stale data indefinitely
-- 4. The cache-aside pattern is simple yet effective for many use cases
