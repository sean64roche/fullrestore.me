ARG NODE_VERSION=23
FROM node:${NODE_VERSION}-alpine

ARG NPM_TOKEN
ARG CI_SERVER_HOST

WORKDIR /usr/src/

RUN npm config set -- //gitlab.com/api/v4/projects/69690868/packages/npm/:_authToken="${NPM_TOKEN}"
RUN echo "@fullrestore:registry=https://${CI_SERVER_HOST}/api/v4/projects/69690868/packages/npm/" > .npmrc

COPY package*.json ./
COPY svelte.config.js ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY . .

RUN npm ci

RUN npm config delete //gitlab.com/api/v4/projects/69690868/packages/npm/:_authToken
RUN rm -f .npmrc

ENV BASE_URL=""
ENV API_FORMATS_ENDPOINT=""
ENV API_PLAYERS_ENDPOINT=""
ENV API_PLAYER_ALIASES_ENDPOINT=""
ENV API_TOURNAMENTS_ENDPOINT=""
ENV API_ROUNDS_ENDPOINT=""
ENV API_ROUND_BYES_ENDPOINT=""
ENV API_ENTRANT_PLAYERS_ENDPOINT=""
ENV API_PAIRINGS_ENDPOINT=""
ENV API_REPLAYS_ENDPOINT=""
ENV API_KEY=""

RUN npm run build

EXPOSE 5173

CMD ["PORT=5173", "node", "build"]