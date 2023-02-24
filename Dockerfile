FROM node:14.21.2 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production

FROM node:14.21.2-slim
COPY --from=build /usr/src/app /usr/src/app/
WORKDIR /usr/src/app
COPY . .

CMD [ "node", "src/index.js" ]