#!/bin/bash
# Task 10: Advanced Docker Networking and Data Persistence
# Part 3: Volume Types and Data Persistence

set -e

echo "=============================================="
echo "Part 3: Volume Types and Data Persistence"
echo "=============================================="
  
docker rm -f db-with-volume db-new 2>/dev/null || true
docker volume rm db-data 2>/dev/null || true

 
echo "   Creating named volume 'db-data'..."
docker volume create db-data
 
echo "   Inspecting volume:"
docker volume inspect db-data --format='   Name: {{.Name}}, Driver: {{.Driver}}, Mountpoint: {{.Mountpoint}}'


docker run -d \
  --name db-with-volume \
  -v db-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  mysql:8
 
sleep 20

echo "   Creating test table..."
docker exec db-with-volume mysql -uroot -proot -e "CREATE TABLE test_table (id INT PRIMARY KEY, name VARCHAR(50)); INSERT INTO test_table VALUES (1, 'test data');"

 
echo "   Verifying data:"
docker exec db-with-volume mysql -uroot -proot -e "SELECT * FROM test_table;"

 
echo "   Stopping and removing container (volume persists)..."
docker stop db-with-volume
docker rm db-with-volume
 
echo "   Starting new container with same volume..."
docker run -d \
  --name db-new \
  -v db-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  mysql:8

sleep 10
 
echo "   Verifying data persisted:"
docker exec db-new mysql -uroot -proot -e "SELECT * FROM test_table;"

echo "Named volume data persisted successfully!"
 
docker stop db-new
docker rm db-new


echo ""
echo "2. Bind Mount for Code Sharing (Development)"
echo "----------------------------------------------"
 
docker rm -f dev-container 2>/dev/null || true

BIND_MOUNT_DIR="/tmp/docker-bind-mount-test"
mkdir -p "$BIND_MOUNT_DIR"
echo "console.log('Hello from bind mount!');" > "$BIND_MOUNT_DIR/app.js"
echo "Initial file content: $(cat $BIND_MOUNT_DIR/app.js)"

echo "   Starting container with bind mount..."
docker run -d \
  --name dev-container \
  -v "$BIND_MOUNT_DIR:/app" \
  -w /app \
  alpine \
  sh -c "while true; do echo '--- Reading app.js ---'; cat app.js; sleep 3; done"

sleep 2
 
echo "   Initial content in container:"
docker logs dev-container | tail -4

echo ""
echo "   Modifying file on host..."
echo "console.log('Updated code from host!');" >> "$BIND_MOUNT_DIR/app.js"

sleep 4

echo "   Content in container after host modification:"
docker logs dev-container | tail -4

echo "Bind mount allows real-time code sharing!"

docker rm -f dev-container
rm -rf "$BIND_MOUNT_DIR"

echo ""
echo "3. Tmpfs Mount for Temporary Data"
echo "----------------------------------------------"
 
docker rm -f tmpfs-test tmpfs-new 2>/dev/null || true
 
echo "   Starting container with tmpfs mount..."
docker run -d \
  --name tmpfs-test \
  --tmpfs /tmp:size=100m \
  alpine/socat \
  sh -c "echo 'temporary data in RAM' > /tmp/test.txt && cat /tmp/test.txt && sleep 3600"

sleep 2

echo "   Verifying tmpfs mount:"
docker exec tmpfs-test mount | grep tmpfs | head -1

echo "   Data in tmpfs:"
docker exec tmpfs-test cat /tmp/test.txt


docker stop tmpfs-test
docker rm tmpfs-test


docker run -d \
  --name tmpfs-new \
  --tmpfs /tmp:size=100m \
  alpine/socat sleep 3600


echo "Checking for data in new container:"
if docker exec tmpfs-new cat /tmp/test.txt 2>/dev/null; then
    echo "Data persisted (unexpected)"
else
    echo "File not found - tmpfs data is ephemeral (as expected)"
fi
 
docker rm -f tmpfs-new
 
echo ""
echo "4. Test Data Persistence with Named Volume"
echo "----------------------------------------------"
 
docker rm -f persist-test 2>/dev/null || true
docker volume rm persist-volume 2>/dev/null || true

echo "   Creating container with named volume..."
docker run -d \
  --name persist-test \
  -v persist-volume:/data \
  alpine \
  sh -c "echo 'persistent data' > /data/file.txt && sleep 3600"

sleep 2

echo "   Initial data:"
docker exec persist-test cat /data/file.txt


echo "   Stopping container..."
docker stop persist-test


echo "   Starting container again..."
docker start persist-test
sleep 2


echo "   Data after stop/start:"
docker exec persist-test cat /data/file.txt
 
echo "   Removing container (volume persists)..."
docker rm persist-test
 
echo "   Creating new container with same volume..."
docker run --rm -v persist-volume:/data alpine cat /data/file.txt

echo "Data persisted across container lifecycle!"
 
docker volume rm persist-volume
 