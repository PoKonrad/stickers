#!/bin/sh
docker build -t sticker-downloader .
docker run -v $PWD/stickers:/app/stickers --rm sticker-downloader "$@"
