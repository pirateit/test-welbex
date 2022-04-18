FROM node:16-alpine as build-stage

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

FROM node:16-alpine as run-stage

WORKDIR /usr/src/app

RUN chown node:node ./
COPY --chown=node:node --from=build-stage /usr/src/app .

USER node

CMD [ "node", "./server.js" ]
