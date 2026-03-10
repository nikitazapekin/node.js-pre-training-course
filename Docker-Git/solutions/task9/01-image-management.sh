#!/bin/bash
# Task 09 - Step 1: Image Management Commands
# This script demonstrates Docker image management operations

set -e

echo "=== Task 09: Image Management ==="
echo ""

# 1. Pull required images
echo ">>> Pulling nginx:alpine, redis:7-alpine, node:24-alpine images..."
docker pull nginx:alpine
docker pull redis:7-alpine
docker pull node:24-alpine
echo ""

# 2. List all images
echo ">>> Listing all Docker images..."
docker images
echo ""

# 3. Inspect nginx image
echo ">>> Inspecting nginx:alpine image..."
docker inspect nginx:alpine | head -50
echo ""

# 4. Show image history
echo ">>> Showing nginx:alpine image history..."
docker history nginx:alpine
echo ""

# 5. Tag nginx image with custom tag
echo ">>> Tagging nginx:alpine as my-nginx:custom..."
docker tag nginx:alpine my-nginx:custom
docker images | grep my-nginx
echo ""

# 6. Save nginx image to tar file
echo ">>> Saving nginx:alpine to nginx-alpine.tar..."
docker save nginx:alpine -o nginx-alpine.tar
ls -lh nginx-alpine.tar
echo ""

# 7. Load image from tar (after removing original to demonstrate)
echo ">>> Loading nginx image from tar file..."
docker load -i nginx-alpine.tar
echo ""

# 8. Remove custom tagged image
echo ">>> Removing my-nginx:custom image..."
docker rmi my-nginx:custom
echo ""

# 9. Clean up unused images
echo ">>> Cleaning up dangling images..."
docker image prune -f
echo ""

echo "=== Image Management Complete ==="
