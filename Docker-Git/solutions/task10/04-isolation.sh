#!/bin/bash
# Task 10: Advanced Docker Networking and Data Persistence
# Part 4: Network Isolation Testing

set -e

echo "=============================================="
echo "Part 4: Network Isolation Testing"
echo "=============================================="

# Clean up
docker rm -f container-net1 container-net2 bridge-container 2>/dev/null || true
docker network rm isolated-network-1 isolated-network-2 2>/dev/null || true

# ============================================
# 1. Create Two Separate Networks
# ============================================
echo ""
echo "1. Creating Two Separate Networks"
echo "----------------------------------------------"

echo "   Creating isolated-network-1..."
docker network create isolated-network-1

echo "   Creating isolated-network-2..."
docker network create isolated-network-2

echo ""
echo "   Current networks:"
docker network ls | grep -E "NETWORK|isolated"

 
echo ""
echo "2. Running Containers on Different Networks"
echo "----------------------------------------------"

echo "   Starting container-net1 on isolated-network-1..."
docker run -d \
  --name container-net1 \
  --network isolated-network-1 \
  alpine sleep 3600

echo "   Starting container-net2 on isolated-network-2..."
docker run -d \
  --name container-net2 \
  --network isolated-network-2 \
  alpine sleep 3600

echo ""
echo "   Container network assignments:"
echo "   container-net1: $(docker inspect container-net1 --format='{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{end}}')"
echo "   container-net2: $(docker inspect container-net2 --format='{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{end}}')"
 
echo ""
echo "3. Demonstrating Network Isolation"
echo "----------------------------------------------"

echo "   Attempting to ping container-net2 from container-net1..."
if docker exec container-net1 ping -c 2 container-net2 2>&1; then
    echo "Ping succeeded (unexpected - networks may not be isolated)"
else
    echo "Ping failed - networks are isolated (as expected)"
fi

echo ""
echo "   Attempting to ping container-net1 from container-net2..."
if docker exec container-net2 ping -c 2 container-net1 2>&1; then
    echo "Ping succeeded (unexpected)"
else
    echo "Ping failed - networks are isolated (as expected)"
fi

echo ""
echo "4. Connecting Container to Multiple Networks"
echo "----------------------------------------------"

echo "   Connecting container-net1 to isolated-network-2..."
docker network connect isolated-network-2 container-net1

echo ""
echo "   container-net1 is now on networks:"
docker inspect container-net1 --format='{{range $k, $v := .NetworkSettings.Networks}}   - {{$k}}: {{println}}{{end}}'

echo "   Testing connectivity from container-net1 to container-net2..."
docker exec container-net1 ping -c 2 container-net2
echo "Ping succeeded after connecting to same network!"

echo ""
echo "   Testing connectivity from container-net2 to container-net1..."
docker exec container-net2 ping -c 2 container-net1
echo "Bidirectional communication established!"

echo ""
echo "5. Disconnecting Container from Network"
echo "----------------------------------------------"

echo "   Disconnecting container-net1 from isolated-network-1..."
docker network disconnect isolated-network-1 container-net1

echo ""
echo "   container-net1 is now only on:"
docker inspect container-net1 --format='{{range $k, $v := .NetworkSettings.Networks}}   - {{$k}}{{end}}'

echo ""
echo "   Testing connectivity from container-net2 to container-net1..."
if docker exec container-net2 ping -c 2 container-net1 2>&1; then
    echo "Ping succeeded (unexpected)"
else
    echo "Ping failed - isolation restored after disconnect"
fi
 
echo ""
echo "6. Bridge Container Demo (Multi-homed)"
echo "----------------------------------------------"

echo "   Starting bridge-container connected to both networks..."
docker run -d \
  --name bridge-container \
  alpine sleep 3600

docker network connect isolated-network-1 bridge-container
docker network connect isolated-network-2 bridge-container

echo "   bridge-container networks:"
docker inspect bridge-container --format='{{range $k, $v := .NetworkSettings.Networks}}   - {{$k}}{{println}}{{end}}'

echo "   Bridge container can ping both:"
echo "   - Pinging container-net1:"
docker exec bridge-container ping -c 1 container-net1 | head -2

echo "   - Pinging container-net2:"
docker exec bridge-container ping -c 1 container-net2 | head -2

echo ""
echo "Bridge container can communicate with both isolated networks!"

echo ""

echo ""
echo "Cleaning up..."
docker rm -f container-net1 container-net2 bridge-container
docker network rm isolated-network-1 isolated-network-2

echo ""
echo "Network Isolation Summary:"
echo "  - Containers on different networks CANNOT communicate by default"
echo "  - Use 'docker network connect' to connect container to multiple networks"
echo "  - Use 'docker network disconnect' to remove network access"
echo "  - A container connected to multiple networks acts as a bridge"
