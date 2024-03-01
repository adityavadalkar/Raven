FROM node:18-alpine

EXPOSE 8080

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ENV PORT 8080

RUN mkdir /app
WORKDIR /app
ADD package.json yarn.lock /app/
RUN yarn --pure-lockfile
ADD . /app

CMD ["yarn", "docker:start"]
