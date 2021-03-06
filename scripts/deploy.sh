#!/bin/bash
export DOCKER_IMAGE=lunchboxlambda/lunchbox:$TRAVIS_TAG
docker run --rm --privileged multiarch/qemu-user-static:register --reset
docker build --build-arg BUILD_VERSION=$TRAVIS_TAG -t $DOCKER_IMAGE .
echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
docker push $DOCKER_IMAGE
