#!/bin/bash
# Task 10: Advanced Docker Networking and Data Persistence
# Part 2: Multi-container Communication

set -e

echo "=============================================="
echo "Part 2: Multi-container Communication"
echo "=============================================="
 
echo "Cleaning up existing MongoDB stack..."
docker rm -f mongodb mongo-express node-app 2>/dev/null || true
docker network rm mongo-network 2>/dev/null || true
docker volume rm mongo-data 2>/dev/null || true
 
if netstat -tuln 2>/dev/null | grep -q ":8081 " || ss -tuln 2>/dev/null | grep -q ":8081 "; then
    echo "Warning: Port 8081 is already in use."
    echo "Stopping any container using port 8081..."
    CONTAINER_ID=$(docker ps --filter "publish=8081" -q)
    if [ -n "$CONTAINER_ID" ]; then
        docker stop $CONTAINER_ID
    fi
fi

 
echo ""
echo "1. Creating mongo-network..."
docker network create mongo-network
 

 
echo ""
echo "2. Creating named volume for MongoDB data..."
docker volume create mongo-data
 
 
echo ""
echo "3. Starting MongoDB container..."
docker run -d \
  --name mongodb \
  --network mongo-network \
  -v mongo-data:/data/db \
  -p 27017:27017 \
  --restart unless-stopped \
  mongo:7
 
echo "   Waiting for MongoDB to initialize (15 seconds)..."
sleep 15
 
echo ""
echo "4. Testing MongoDB connection..."
docker exec mongodb mongosh --eval "db.version()" || echo "Note: MongoDB may need more time to start"

 
echo ""
echo "5. Starting Mongo Express (web interface)..."
docker run -d \
  --name mongo-express \
  --network mongo-network \
  -p 8081:8081 \
  -e ME_CONFIG_MONGODB_SERVER=mongodb \
  -e ME_CONFIG_MONGODB_PORT=27017 \
  -e ME_CONFIG_BASICAUTH_USERNAME=admin \
  -e ME_CONFIG_BASICAUTH_PASSWORD=password \
  --restart unless-stopped \
  mongo-express
echo "✓ Mongo Express started on port 8081"
echo "   Access at: http://localhost:8081 (admin/password)"
 
sleep 5
 
echo ""
 
 
mkdir -p /tmp/node-mongo-test
cd /tmp/node-mongo-test
 
cat > package.json << 'EOF'
{
  "name": "node-mongo-test",
  "version": "1.0.0",
  "main": "app.js",
  "dependencies": {
    "mongodb": "^6.0.0"
  }
}
EOF
 
cat > app.js << 'EOF'
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://mongodb:27017';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('✓ Connected to MongoDB!');
    
    const db = client.db('testdb');
    const collection = db.collection('test');
    
 
    const result = await collection.insertOne({ 
      name: 'Docker Task 10', 
      timestamp: new Date(),
      test: true 
    });
  
     
    const docs = await collection.find({}).toArray();
 
    docs.forEach(doc => console.log('  -', doc.name, ':', doc.timestamp));
    
 
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
EOF
 
echo ""
echo "7. Building Node.js app Docker image..."
cat > Dockerfile << 'EOF'
FROM node:24-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY app.js ./
CMD ["node", "app.js"]
EOF

docker build -t node-mongo-test .
 
echo ""
echo "8. Running Node.js app on mongo-network..."
docker run --rm \
  --name node-app \
  --network mongo-network \
  -e MONGODB_URI=mongodb://mongodb:27017 \
  node-mongo-test
 
echo ""
echo "9. Verifying network topology..."
echo "   Containers on mongo-network:"
docker network inspect mongo-network --format='{{range .Containers}}{{.Name}}: {{.IPv4Address}}{{"\n"}}{{end}}'
 
echo ""
echo "10. Testing connectivity between containers..."
docker exec mongo-express ping -c 2 mongodb

echo ""
echo "=============================================="
echo "Part 2 Complete: Multi-container communication established"
echo "=============================================="
echo ""
echo "Services running:"
echo "  - MongoDB:    localhost:27017"
echo "  - Mongo Express: http://localhost:8081 (admin/password)"
echo ""
echo "To clean up, run: docker rm -f mongodb mongo-express && docker volume rm mongo-data"
