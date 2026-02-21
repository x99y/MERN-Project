FROM node:20

# Only way I could get it to work
WORKDIR /app

COPY . .

RUN npm install

# not required but useful for dev
EXPOSE 5173


CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
