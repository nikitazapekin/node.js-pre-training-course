# Task 10: Advanced Docker Networking and Data Persistence

## Overview

This task demonstrates:
- Custom Docker network creation and management
- Multi-container communication (MongoDB stack)
- Volume types (named, bind mount, tmpfs)
- Network isolation testing

## Files

| File | Description |
|------|-------------|
| `01-networks.sh` | Custom network creation and connectivity testing |
| `02-multicontainer.sh` | MongoDB + Mongo Express + Node.js app setup |
| `03-volumes.sh` | Volume types and data persistence tests |
| `04-isolation.sh` | Network isolation demonstration |
| `run-all.sh` | Execute all scripts in sequence |

## Quick Start

### Run All Tests
```bash
cd solutions/task10
bash run-all.sh
```

### Run Individual Parts
```bash
# Part 1: Network Creation
bash 01-networks.sh

# Part 2: Multi-container Communication
bash 02-multicontainer.sh

# Part 3: Volume Types
bash 03-volumes.sh

# Part 4: Network Isolation
bash 04-isolation.sh
```

## Network Topology

```
┌─────────────────────────────────────────────────────────┐
│                      Docker Host                         │
│                                                          │
│  ┌─────────────────┐    ┌─────────────────┐             │
│  │  mongo-network  │    │ isolated-net-1  │             │
│  │  172.20.0.0/16  │    │  172.21.0.0/16  │             │
│  └────────┬────────┘    └────────┬────────┘             │
│           │                      │                       │
│     ┌─────┴─────┐          ┌─────┴─────┐               │
│  ┌──▼──┐   ┌───▼────┐  ┌──▼──┐    ┌───▼────┐          │
│  │Mongo│   │Mongo   │  │Cont │    │Cont    │          │
│  │DB   │   │Express │  │1    │    │2       │          │
│  └──────┘  └────────┘  └─────┘    └────────┘          │
│       ▲                                                 │
│       │                                                 │
│  ┌────▼────┐                                           │
│  │Node.js  │                                           │
│  │App      │                                           │
│  └─────────┘                                           │
│                                                         │
│  Volumes: mongo-data, db-data, persist-volume          │
└─────────────────────────────────────────────────────────┘
```

## Volume Types

### 1. Named Volumes
```bash
docker volume create my-volume
docker run -v my-volume:/data my-image
```
- Docker-managed storage
- Persists after container removal
- Best for: databases, persistent state

### 2. Bind Mounts
```bash
docker run -v /host/path:/container/path my-image
```
- Host filesystem mapping
- Real-time code updates
- Best for: development

### 3. Tmpfs Mounts
```bash
docker run --tmpfs /tmp:size=100m my-image
```
- In-memory storage
- Data lost on container stop
- Best for: temporary/sensitive data

## Key Commands

### Networks
```bash
docker network create my-network
docker network ls
docker network inspect my-network
docker network connect my-network container
docker network disconnect my-network container
```

### Volumes
```bash
docker volume create my-volume
docker volume ls
docker volume inspect my-volume
docker volume rm my-volume
```

## Cleanup

```bash
# Remove all containers and volumes from Task 10
docker rm -f mongodb mongo-express node-app 2>/dev/null || true
docker rm -f db-with-volume db-new 2>/dev/null || true
docker rm -f container-net1 container-net2 2>/dev/null || true
docker network rm mongo-network isolated-network-1 isolated-network-2 2>/dev/null || true
docker volume rm mongo-data db-data 2>/dev/null || true
```
