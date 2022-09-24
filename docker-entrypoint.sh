#!/bin/sh

cp -r /app/* .

npm install --cache /tmp/npm-cache
ng build --output-path /app/dist

