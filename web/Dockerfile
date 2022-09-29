FROM node:18-alpine

ARG USER

RUN npm install -g @angular/cli

WORKDIR /app-internal
RUN chown ${USER} /app-internal/

USER ${USER}

ENTRYPOINT [ "/app/docker-entrypoint.sh" ]
