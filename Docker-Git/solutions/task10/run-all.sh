#!/bin/bash
# Task 10: Run All Scripts

set -e

echo "=============================================="
echo "Task 10: Advanced Docker Networking & Volumes"
echo "=============================================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
 
echo "Running Part 1: Network Creation..."
bash "$SCRIPT_DIR/01-networks.sh"

echo ""
echo "Running Part 2: Multi-container Communication..."
bash "$SCRIPT_DIR/02-multicontainer.sh"

echo ""
echo "Running Part 3: Volume Types..."
bash "$SCRIPT_DIR/03-volumes.sh"

echo ""
echo "Running Part 4: Network Isolation..."
bash "$SCRIPT_DIR/04-isolation.sh"

echo ""
 
