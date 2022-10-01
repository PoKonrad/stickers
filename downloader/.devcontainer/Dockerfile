FROM node:18
ARG USERNAME=node

ENV GIT_SSH_COMMAND='ssh -o StrictHostKeyChecking=no'

# https://code.visualstudio.com/remote/advancedcontainers/avoid-extension-reinstalls
RUN mkdir -p /home/$USERNAME/.vscode-server/extensions \
        /home/$USERNAME/.vscode-server-insiders/extensions \
    && chown -R $USERNAME \
        /home/$USERNAME/.vscode-server \
        /home/$USERNAME/.vscode-server-insiders

RUN apt-get update
RUN apt-get install -y chromium libxss1 ffmpeg imagemagick
