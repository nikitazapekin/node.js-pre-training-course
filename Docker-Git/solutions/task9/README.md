# Task 09: Mastering Docker Commands and Image Management

## Solution Directory Structure

```
task9/
├── README.md                           # This file
├── run-all.sh                          # Main runner script
├── 01-image-management.sh              # Image management commands
├── 02-container-lifecycle.sh           # Container lifecycle commands
├── 03-monitoring-volumes-networks.sh   # Monitoring, volumes, networks
├── 04-cleanup.sh                       # Cleanup and maintenance
└── commands-reference.md               # Detailed command reference
```

## Quick Start

### Run All Tasks Sequentially

```bash
cd Docker-Git/solutions/task9
chmod +x *.sh
./run-all.sh
```

### Run Individual Steps

```bash
# Step 1: Image Management
./01-image-management.sh

# Step 2: Container Lifecycle
./02-container-lifecycle.sh

# Step 3: Monitoring and Troubleshooting
./03-monitoring-volumes-networks.sh

# Step 4: Cleanup
./04-cleanup.sh
```

## Prerequisites

- Docker installed and running
- Sufficient disk space (~200MB for images)
- Ports 8080 available for nginx

## What Each Script Does

### 01-image-management.sh
- Pulls `nginx:alpine`, `redis:7-alpine`, `node:24-alpine`
- Lists and inspects images
- Tags nginx with custom tag
- Saves/loads image to tar file
- Removes images and cleans up

### 02-container-lifecycle.sh
- Runs nginx with port mapping (8080:80)
- Runs redis with restart policy
- Creates and starts node container
- Executes commands inside containers
- Copies files between host and containers

### 03-monitoring-volumes-networks.sh
- Shows container stats
- Views logs with timestamps
- Inspects container configuration
- Creates and manages volumes
- Creates custom network
- Tests inter-container connectivity

### 04-cleanup.sh
- Shows disk usage before/after
- Stops all containers
- Removes containers, volumes, networks
- Cleans up temporary files

## Manual Commands Reference

See `commands-reference.md` for detailed command documentation.

## Expected Output

After running all scripts:
- All containers stopped and removed
- Custom volumes removed
- Temporary files cleaned up
- Base images remain for future use

## Troubleshooting

### Permission Denied
```bash
sudo chmod +x *.sh
```

### Docker Not Running
```bash
sudo systemctl start docker
```

### Port Already in Use
Edit `02-container-lifecycle.sh` and change port mapping:
```bash
docker run -d -p 8081:80 --name my-nginx nginx:alpine
```
