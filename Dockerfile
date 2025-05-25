ARG NODE_VERSION=23
ARG NPM_TOKEN
ARG CI_SERVER_HOST
ARG CI_PROJECT_ID

FROM node:${NODE_VERSION}-alpine

RUN npm config set -- //gitlab.com/api/v4/projects/66637031/packages/npm/:_authToken="${NPM_TOKEN}"
RUN echo "@fullrestore:registry=https://${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/" > .npmrc

WORKDIR /

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

WORKDIR /usr/src/

COPY package*.json ./
RUN npm install -y

RUN npm config delete //gitlab.com/api/v4/projects/66637031/packages/npm/:_authToken
RUN rm -f .npmrc

EXPOSE 5173

CMD ["npx", "vite", "--host"]