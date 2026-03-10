#!/bin/bash
# Task 09 - Step 4: Cleanup and Maintenance
# This script demonstrates Docker cleanup operations

echo "=== Task 09: Cleanup and Maintenance ==="
echo ""

 
echo ">>> Docker disk usage BEFORE cleanup:"
docker system df
echo ""

echo ">>> Verbose disk usage BEFORE cleanup:"
docker system df -v | head -50
echo ""
 
echo ">>> Stopping all running containers..."
docker stop $(docker ps -q) 2>/dev/null || echo "No running containers"
echo ""
 
echo ">>> All containers (stopped):"
docker ps -a
echo ""
 
echo ">>> Removing containers..."
docker rm my-nginx 2>/dev/null || true
docker rm my-redis 2>/dev/null || true
docker rm my-node 2>/dev/null || true
docker rm volume-container 2>/dev/null || true
docker rm web-app 2>/dev/null || true
docker rm api-app 2>/dev/null || true
echo ""
 
echo ">>> Removing my-data-volume..."
docker volume rm my-data-volume 2>/dev/null || true
echo ""
 
echo ">>> Removing app-network..."
docker network rm app-network 2>/dev/null || true
echo ""
 
echo ">>> Removing custom tagged images..."
docker rmi my-nginx:custom 2>/dev/null || true
echo ""
 
echo ">>> Cleaning up tar file..."
rm -f nginx-alpine.tar test-file.txt test-file-from-container.txt
echo ""
 
echo ">>> Docker disk usage AFTER cleanup:"
docker system df
echo ""
 
echo ">>> To clean up all unused resources, run:"
echo "    docker system prune -a --volumes"
echo ""
 
echo ">>> Final container status:"
docker ps -a
echo ""

echo ">>> Final image list:"
docker images
echo ""

echo "=== Cleanup and Maintenance Complete ==="
