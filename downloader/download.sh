#!/bin/sh

docker run --rm $(docker build -q .) "$@"
