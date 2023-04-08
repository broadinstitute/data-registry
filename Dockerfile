FROM node:lts-bullseye-slim
WORKDIR /app

COPY package*.json ./

RUN npm install
CMD ["npm", "run", "dev"]