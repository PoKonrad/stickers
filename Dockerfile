FROM node:18.6.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @angular/cli

RUN npm install

COPY . .

ENTRYPOINT [ "/bin/sh", "-c", "ng build" ]

