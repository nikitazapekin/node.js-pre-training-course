# Task 10: Redis Caching for User Todo List

This application demonstrates Redis caching for a todo list application.

## Features

- **Cache-First Strategy**: Checks Redis before querying the database
- **Automatic Caching**: Cache miss results are automatically stored in Redis
- **TTL (Time-To-Live)**: Cache expires after 5 minutes (configurable)
- **Cache Invalidation**: Cache is invalidated on create, update, and delete operations
- **Cache Stats Endpoint**: View current cache entries and their TTL

## Prerequisites

- Node.js 16+
- Redis server running locally or accessible via network

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Redis connection details
   ```

3. Start Redis server (if running locally):
   ```bash
   # On macOS with Homebrew
   brew services start redis
   
   # On Linux
   sudo systemctl start redis-server
   
   # Or run directly
   redis-server
   ```

## Usage

Start the server:
```bash
npm start
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos/:userId` | Get todos for a user (with caching) |
| POST | `/todos` | Create a new todo (invalidates cache) |
| PUT | `/todos/:id` | Update a todo (invalidates cache) |
| DELETE | `/todos/:id` | Delete a todo (invalidates cache) |
| GET | `/cache/stats` | View cache entries and TTL |
| DELETE | `/cache/:userId` | Manually invalidate user cache |
| GET | `/health` | Health check endpoint |

### Example Requests

**Get todos (first request - cache miss):**
```bash
curl http://localhost:3000/todos/1
```

Response:
```json
{
  "source": "database",
  "data": [
    { "id": 1, "userId": 1, "title": "Learn Redis", "completed": false },
    { "id": 2, "userId": 1, "title": "Build caching layer", "completed": true }
  ]
}
```

**Get todos (second request - cache hit):**
```bash
curl http://localhost:3000/todos/1
```

Response:
```json
{
  "source": "cache",
  "data": [
    { "id": 1, "userId": 1, "title": "Learn Redis", "completed": false },
    { "id": 2, "userId": 1, "title": "Build caching layer", "completed": true }
  ]
}
```

**Check cache stats:**
```bash
curl http://localhost:3000/cache/stats
```

**Create a new todo (invalidates cache):**
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "title": "New task", "completed": false}'
```

## Demonstrating TTL

1. Make a request to get todos for a user
2. Check cache stats to see the cached entry
3. Wait for 5 minutes (300 seconds)
4. Make another request - you'll see a cache miss and fresh data from database

## Cache Invalidation

The cache is automatically invalidated when:
- A new todo is created for a user
- An existing todo is updated
- A todo is deleted

This ensures users always see up-to-date data after modifications.
