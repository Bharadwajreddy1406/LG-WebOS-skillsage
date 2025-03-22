# List files in the current directory
ls

# Remove unused build cache
docker builder prune -f

# Build, tag, and push the server image
cd ./server
docker build -t pradyumna2003/server-lgtv .
docker push pradyumna2003/server-lgtv
cd ..

# Build, tag, and push the client image
cd ./client
docker build -t pradyumna2003/client-lgtv .
docker push pradyumna2003/client-lgtv
cd ..