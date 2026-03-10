const express = require('express');
const Redis = require('ioredis');

const app = express();
app.use(express.json());
 
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});
 
redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});
 
const CACHE_TTL = 300; 
const CACHE_KEY_PREFIX = 'todos:user:';
 
const todosDB = {
  1: [
    { id: 1, userId: 1, title: 'Learn Redis', completed: false },
    { id: 2, userId: 1, title: 'Build caching layer', completed: true },
  ],
  2: [
    { id: 3, userId: 2, title: 'Study Node.js', completed: false },
  ],
};
 
function getCacheKey(userId) {
  return `${CACHE_KEY_PREFIX}${userId}`;
} 
async function invalidateUserCache(userId) {
  const cacheKey = getCacheKey(userId);
  await redis.del(cacheKey);
  console.log(`Cache invalidated for user ${userId}`);
}
 
app.get('/todos/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const cacheKey = getCacheKey(userId);

  try {
   
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
     
      console.log(`Cache HIT for user ${userId}`);
      const todos = JSON.parse(cachedData);
      return res.json({ source: 'cache', data: todos });
    }

    
    console.log(`Cache MISS for user ${userId}`);
     
    const todos = todosDB[userId] || [];
 
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(todos));
    console.log(`Cached todos for user ${userId} with TTL: ${CACHE_TTL}s`);

    res.json({ source: 'database', data: todos });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});
 
app.post('/todos', async (req, res) => {
  const { userId, title, completed = false } = req.body;

  try {
    
    const newId = Date.now();
    const newTodo = { id: newId, userId, title, completed };
    
    if (!todosDB[userId]) {
      todosDB[userId] = [];
    }
    todosDB[userId].push(newTodo);
 
    await invalidateUserCache(userId);

    res.status(201).json({ source: 'database', data: newTodo });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});
 
app.put('/todos/:id', async (req, res) => {
  const todoId = parseInt(req.params.id, 10);
  const { title, completed } = req.body;

  try {
   
    let updatedTodo = null;
    for (const userId in todosDB) {
      const todoIndex = todosDB[userId].findIndex(t => t.id === todoId);
      if (todoIndex !== -1) {
        if (title !== undefined) todosDB[userId][todoIndex].title = title;
        if (completed !== undefined) todosDB[userId][todoIndex].completed = completed;
        updatedTodo = todosDB[userId][todoIndex];
         
        await invalidateUserCache(userId);
        break;
      }
    }

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ source: 'database', data: updatedTodo });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});
 
app.delete('/todos/:id', async (req, res) => {
  const todoId = parseInt(req.params.id, 10);

  try {
   
    let deleted = false;
    for (const userId in todosDB) {
      const todoIndex = todosDB[userId].findIndex(t => t.id === todoId);
      if (todoIndex !== -1) {
        todosDB[userId].splice(todoIndex, 1);
         
        await invalidateUserCache(userId);
        
        deleted = true;
        break;
      }
    }

    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});
 
app.get('/cache/stats', async (req, res) => {
  try {
    const keys = await redis.keys(`${CACHE_KEY_PREFIX}*`);
    const stats = [];

    for (const key of keys) {
      const ttl = await redis.ttl(key);
      const value = await redis.get(key);
      stats.push({
        key,
        ttl,
        data: JSON.parse(value),
      });
    }

    res.json({ cacheEntries: stats });
  } catch (error) {
    console.error('Error getting cache stats:', error);
    res.status(500).json({ error: 'Failed to get cache stats' });
  }
});
 
app.delete('/cache/:userId', async (req, res) => {
  const userId = req.params.userId;
  
  try {
    await invalidateUserCache(userId);
    res.json({ message: `Cache invalidated for user ${userId}` });
  } catch (error) {
    console.error('Error invalidating cache:', error);
    res.status(500).json({ error: 'Failed to invalidate cache' });
  }
});
 
app.get('/health', async (req, res) => {
  try {
    await redis.ping();
    res.json({ status: 'healthy', redis: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', redis: 'disconnected', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Redis caching enabled with TTL: ${CACHE_TTL}s`);
});
