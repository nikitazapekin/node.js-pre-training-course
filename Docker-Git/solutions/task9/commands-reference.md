# Docker Commands Reference

## Image Management

| Command | Description |
|---------|-------------|
| `docker pull nginx:alpine` | Pull nginx alpine image |
| `docker images` | List all local images |
| `docker inspect nginx:alpine` | Show image metadata |
| `docker history nginx:alpine` | Show image layers |
| `docker tag nginx:alpine my-nginx:v1` | Tag image with custom name |
| `docker save nginx:alpine -o image.tar` | Export image to tar file |
| `docker load -i image.tar` | Import image from tar file |
| `docker rmi nginx:alpine` | Remove image |
| `docker image prune -f` | Remove dangling images |

## Container Lifecycle

| Command | Description |
|---------|-------------|
| `docker run -d -p 8080:80 --name my-nginx nginx:alpine` | Run container in background |
| `docker run -d --name my-redis --restart unless-stopped redis:7-alpine` | Run with restart policy |
| `docker create --name my-node node:24-alpine sleep 3600` | Create without starting |
| `docker start my-node` | Start created container |
| `docker ps` | List running containers |
| `docker ps -a` | List all containers |
| `docker stop my-nginx` | Stop container |
| `docker rm my-nginx` | Remove stopped container |
| `docker rm -f my-nginx` | Force remove container |

## Exec and Copy

| Command | Description |
|---------|-------------|
| `docker exec -it my-nginx sh` | Execute shell in container |
| `docker exec my-redis redis-cli ping` | Run command in container |
| `docker cp file.txt my-node:/app/` | Copy file to container |
| `docker cp my-node:/app/file.txt ./` | Copy file from container |

## Monitoring

| Command | Description |
|---------|-------------|
| `docker stats` | Real-time resource usage |
| `docker stats --no-stream` | Single snapshot of stats |
| `docker logs my-nginx` | View container logs |
| `docker logs -f my-nginx` | Follow logs in real-time |
| `docker logs -t --tail 100 my-nginx` | Logs with timestamps |
| `docker inspect my-nginx` | Full container inspection |

## Volumes

| Command | Description |
|---------|-------------|
| `docker volume create my-volume` | Create named volume |
| `docker volume ls` | List volumes |
| `docker volume inspect my-volume` | Inspect volume |
| `docker volume rm my-volume` | Remove volume |
| `docker volume prune -f` | Remove unused volumes |
| `docker run -v my-volume:/data nginx` | Mount volume to container |

## Networks

| Command | Description |
|---------|-------------|
| `docker network ls` | List networks |
| `docker network create app-network` | Create network |
| `docker network inspect app-network` | Inspect network |
| `docker network rm app-network` | Remove network |
| `docker run --network app-network nginx` | Run container on network |
| `docker network connect app-network my-container` | Connect container to network |

## Cleanup

| Command | Description |
|---------|-------------|
| `docker system df` | Show disk usage |
| `docker system prune` | Remove unused data |
| `docker system prune -a` | Remove all unused images |
| `docker system prune --volumes` | Include volumes in prune |
| `docker container prune -f` | Remove stopped containers |
| `docker image prune -a -f` | Remove all unused images |

## Most Useful Commands

```bash
# Check what's running
docker ps

# View application logs
docker logs -f <container>

# Access running container
docker exec -it <container> sh

# Check resource usage
docker stats

# Clean up disk space
docker system prune -f

# Inspect container details
docker inspect <container>
```
