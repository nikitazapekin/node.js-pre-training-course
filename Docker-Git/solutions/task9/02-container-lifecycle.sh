#!/bin/bash
# Task 09 - Step 2: Container Lifecycle Management
# This script demonstrates Docker container lifecycle operations

set -e

echo "=== Task 09: Container Lifecycle Management ==="
echo ""

# Cleanup any existing containers from previous runs
echo ">>> Cleaning up existing containers from previous runs..."
docker stop my-nginx my-redis my-node 2>/dev/null || true
docker rm my-nginx my-redis my-node 2>/dev/null || true
echo ""

# 1. Run nginx in detached mode with port mapping (using 8081 to avoid conflict with pgadmin on 8080)
echo ">>> Running nginx container in detached mode with port 8081:80..."
docker run -d -p 8081:80 --name my-nginx nginx:alpine
echo ""

# 2. Run redis with custom name and restart policy
echo ">>> Running redis container with restart policy 'unless-stopped'..."
docker run -d --name my-redis --restart unless-stopped redis:7-alpine
echo ""

# 3. Create Node.js container without starting
echo ">>> Creating node container without starting..."
docker create --name my-node node:24-alpine sleep 3600
echo ""

# 4. List all containers (including not started)
echo ">>> Listing all containers..."
docker ps -a
echo ""

# 5. Start the created node container
echo ">>> Starting my-node container..."
docker start my-node
echo ""

# 6. Verify containers are running
echo ">>> Listing running containers..."
docker ps
echo ""

# 7. Execute commands inside containers
echo ">>> Executing 'redis-cli ping' in my-redis..."
docker exec my-redis redis-cli ping
echo ""

echo ">>> Executing 'sh -c \"echo Hello from nginx\"' in my-nginx..."
docker exec my-nginx sh -c "echo Hello from nginx"
echo ""

echo ">>> Executing 'whoami' in my-node..."
docker exec my-node whoami
echo ""

# 8. Create a test file on host and copy to container
echo ">>> Creating test file and copying to container..."
echo "Hello from host!" > test-file.txt
docker cp test-file.txt my-node:/root/test-file.txt
echo ""

# 9. Copy file from container back to host
echo ">>> Copying file from container back to host..."
docker cp my-node:/root/test-file.txt test-file-from-container.txt
cat test-file-from-container.txt
echo ""

# 10. View container logs
echo ">>> Viewing nginx container logs..."
docker logs --tail 10 my-nginx
echo ""

# 11. Monitor container stats (once)
echo ">>> Getting container stats..."
docker stats --no-stream
echo ""

echo "=== Container Lifecycle Management Complete ==="
echo ""
echo "Containers are still running for further inspection."
echo "Run 03-cleanup.sh to stop and remove them."
