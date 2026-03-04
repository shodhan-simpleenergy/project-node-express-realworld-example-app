FROM node:18-slim

WORKDIR /app

# Install system deps Prisma needs
RUN apt-get update && apt-get install -y openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY project.json ./

RUN npm install

COPY . .

RUN npx prisma generate --schema=src/prisma/schema.prisma

EXPOSE 3000

CMD ["npm", "start"]

