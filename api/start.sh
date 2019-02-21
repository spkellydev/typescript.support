#/bin/sh
docker rm ts-api
docker run -p 8080:8080 -d --name ts-api typescript-support