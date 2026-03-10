#!/bin/bash
# Task 10: Advanced Docker Networking and Data Persistence
# Part 1: Custom Network Creation and Management

set -e

echo "=============================================="
echo "Part 1: Custom Network Creation and Management"
echo "=============================================="

 
echo "Cleaning up existing networks..."
 
for net in app-network custom-network; do
  
    containers=$(docker network inspect -f '{{range .Containers}}{{.Name}} {{end}}' "$net" 2>/dev/null || true)
    for container in $containers; do
        docker network disconnect -f "$net" "$container" 2>/dev/null || true
    done
    docker network rm "$net" 2>/dev/null || true
done
sleep 1
 
echo ""
echo "1. Creating custom bridge network 'app-network'..."
docker network create app-network
echo "Created app-network"
 
echo ""
echo "2. Creating custom network with subnet configuration..."
docker network create \
  --driver bridge \
  --subnet 172.20.0.0/16 \
  --gateway 172.20.0.1 \
  --ip-range 172.20.0.0/24 \
  custom-network
echo "✓ Created custom-network with subnet 172.20.0.0/16"
 
echo ""
echo "3. Listing all networks:"
docker network ls
 
echo ""
echo "4. Inspecting app-network:"
docker network inspect app-network --format='{{.Name}} - Driver: {{.Driver}}, Subnet: {{range .IPAM.Config}}{{.Subnet}}{{end}}'

echo ""
echo "5. Inspecting custom-network:"
docker network inspect custom-network --format='{{.Name}} - Driver: {{.Driver}}, Subnet: {{range .IPAM.Config}}{{.Subnet}}{{end}}'
 
echo ""
echo "6. Testing connectivity between containers..."
 
docker rm -f test-container-1 test-container-2 2>/dev/null || true

 
echo "   Starting test containers on app-network..."
docker run -d --name test-container-1 --network app-network alpine sleep 3600
docker run -d --name test-container-2 --network app-network alpine sleep 3600
 
sleep 2
 
echo "   Testing ping from test-container-1 to test-container-2..."
docker exec test-container-1 ping -c 3 test-container-2

echo ""
echo "✓ Connectivity test passed!"
 
docker rm -f test-container-1 test-container-2

echo ""
 