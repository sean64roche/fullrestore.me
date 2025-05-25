ARG NODE_VERSION=23
FROM node:${NODE_VERSION}-alpine

ARG NPM_TOKEN
ARG CI_SERVER_HOST

WORKDIR /usr/src/

RUN npm config set -- //gitlab.com/api/v4/projects/69690868/packages/npm/:_authToken="${NPM_TOKEN}"
RUN echo "@fullrestore:registry=https://${CI_SERVER_HOST}/api/v4/projects/69690868/packages/npm/" > .npmrc

COPY package*.json ./
RUN npm install

RUN npm config delete //gitlab.com/api/v4/projects/69690868/packages/npm/:_authToken
RUN rm -f .npmrc

COPY . .

EXPOSE 5173

CMD ["npx", "vite", "--host"]