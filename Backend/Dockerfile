FROM node:20

COPY . .

RUN npm install

# generate .env file from build args
ARG NODE_ENV
ARG JWT_SECRET
ARG MONGODB_DATABASE_URL
ARG FRONTEND_URL
RUN echo "JWT_SECRET=$JWT_SECRET" >> .env \
 && echo "MONGODB_DATABASE_URL=$MONGODB_DATABASE_URL" >> .env \
 && echo "FRONTEND_URL=$FRONTEND_URL" >> .env

CMD ["node", "src/index.js"]