#!/bin/bash
# Task 09 - Main Runner Script
# Runs all Docker task scripts in sequence

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=============================================="
echo "  Task 09: Docker Commands Master Exercise   "
echo "=============================================="
echo ""

cd "$SCRIPT_DIR"
 
chmod +x *.sh
 
echo "Step 1: Image Management"
echo "=============================================="
./01-image-management.sh

echo ""
echo "Step 2: Container Lifecycle Management"
echo "=============================================="
./02-container-lifecycle.sh

echo ""
echo "Step 3: Monitoring and Troubleshooting"
echo "=============================================="
./03-monitoring-volumes-networks.sh

echo ""
echo "Step 4: Cleanup and Maintenance"
echo "=============================================="
./04-cleanup.sh

echo ""
echo "=============================================="
echo "  Task 09 Complete!                          "
echo "=============================================="
