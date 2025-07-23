# Build Stage
FROM node:22-slim AS build

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune

# Final Stage
FROM node:22-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY ./package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD node dist/src/index.js