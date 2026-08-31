# Node.js 22 執行環境
FROM node:22-alpine

# 工作目錄
WORKDIR /app

# 安裝套件
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

# 複製並編譯專案
COPY . .
RUN npm run build

# 編譯 Seed
RUN npm run build:seed

# API Port
EXPOSE 3001

# Migration → Seed → 啟動 API
CMD ["sh", "-c", "\
  echo '⏳ Waiting for DB & running migrations...'; \
  until npx prisma migrate deploy; do sleep 5; done && \
  echo '🌱 Seeding data...'; \
  node dist/prisma/seed.js && \
  echo '🚀 Starting app...'; \
  npm start \
"]