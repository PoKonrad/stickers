FROM node:18
ARG USERNAME=node

WORKDIR /app

RUN apt-get update && apt-get install -y \
  chromium \
  libxss1 \
  ffmpeg \
  imagemagick

COPY package*.json ./
RUN npm install --no-fund

COPY . .

ENTRYPOINT ["node", "index.mjs"]
