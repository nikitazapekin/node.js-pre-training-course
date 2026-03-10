#!/bin/bash
# Task 09 - Step 3: Monitoring and Troubleshooting
# This script demonstrates Docker monitoring, volumes, and network operations

set -e

echo "=== Task 09: Monitoring and Troubleshooting ==="
echo ""
 
echo ">>> Ensuring containers are running..."
docker start my-nginx 2>/dev/null || docker run -d -p 8081:80 --name my-nginx nginx:alpine
docker start my-redis 2>/dev/null || docker run -d --name my-redis --restart unless-stopped redis:7-alpine
docker start my-node 2>/dev/null || (docker create --name my-node node:24-alpine sleep 3600 && docker start my-node)
echo ""
 
echo ">>> Real-time container stats (one snapshot)..."
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
echo ""
 
echo ">>> Nginx logs with timestamps..."
docker logs -t --tail 5 my-nginx
echo ""
 
echo ">>> Inspecting my-nginx container (key info)..."
echo "Status: $(docker inspect --format='{{.State.Status}}' my-nginx)"
echo "IP Address: $(docker inspect --format='{{.NetworkSettings.IPAddress}}' my-nginx)"
echo "Ports: $(docker inspect --format='{{range $p, $conf := .NetworkSettings.Ports}}{{$p}} -> {{(index $conf 0).HostPort}} {{end}}' my-nginx)"
echo ""
 
echo ">>> Full container inspection (first 100 lines)..."
docker inspect my-nginx | head -100
echo ""
 
echo ">>> Creating Docker volume..."
docker volume create my-data-volume
echo ""

echo ">>> Listing all volumes..."
docker volume ls
echo ""

echo ">>> Inspecting volume..."
docker volume inspect my-data-volume
echo ""
 
echo ">>> Running container with volume mount..."
docker run -d -v my-data-volume:/data --name volume-container nginx:alpine
echo ""
 
echo ">>> Writing data to volume..."
docker exec volume-container sh -c "echo 'Volume test data' > /data/test.txt"
docker exec volume-container cat /data/test.txt
echo ""
 
echo ">>> Creating custom network..."
docker network create app-network 2>/dev/null || echo "Network already exists"
echo ""

echo ">>> Listing networks..."
docker network ls
echo ""
 
echo ">>> Running containers on custom network..."
docker run -d --name web-app --network app-network nginx:alpine
docker run -d --name api-app --network app-network redis:7-alpine
echo ""
 
echo ">>> Testing network connectivity between containers..."
docker exec web-app ping -c 2 api-app || echo "Ping completed"
echo ""
 
echo ">>> Inspecting app-network..."
docker network inspect app-network | head -50
echo ""

echo "=== Monitoring and Troubleshooting Complete ==="
