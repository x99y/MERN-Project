FROM node:20

COPY . .

RUN npm install

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

CMD ["node", "src/index.js"]