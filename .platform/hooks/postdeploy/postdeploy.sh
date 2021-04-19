#!/bin/bash
# pull latest image from docker hub
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker pull jackson162/oasis-prod:latest