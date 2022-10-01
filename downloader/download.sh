#!/bin/sh
docker build -t sticker-downloader .
docker run -it -v $PWD/stickers:/app/stickers --rm sticker-downloader "$@"
