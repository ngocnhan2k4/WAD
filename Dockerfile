FROM node:20.18

WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package.json /app
COPY package-lock.json /app
RUN npm install --build-from-source bcrypt

COPY .env /app/.env
COPY prisma /app/prisma

RUN npx prisma generate

COPY . /app

EXPOSE 4000

CMD ["npm", "start"]