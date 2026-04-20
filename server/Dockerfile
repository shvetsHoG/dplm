FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma/

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

RUN npx prisma generate

COPY . .

EXPOSE 3000