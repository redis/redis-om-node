# redismod-docker-compose

This folder contains a Docker Compose file configured to use the RedisLabs redismod image; a Docker image with selected Redis Labs modules.

## Pre-requisites

- Docker: https://docs.docker.com/get-docker/
- Docker Compose: https://docs.docker.com/compose/install/

This image runs Redis on the default port 6379 which you can access as if it were a local install of Redis. Just ensure that you shut down any other Redis instances that might be on port 6379 before starting this one.

The image stores the data file under the ./data directory.

To launch Redis simply enter:

```
docker compose up
```
