# Stage 1: Base
FROM node:18 AS builder

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main.js"]
