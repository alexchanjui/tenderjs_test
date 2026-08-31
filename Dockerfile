# Node.js 22 執行環境
FROM node:22-alpine

# Container 工作目錄
WORKDIR /app

# 複製套件設定
COPY package*.json ./

# Prisma generate 需要的檔案
COPY prisma ./prisma
COPY prisma.config.ts ./

# 安裝套件，postinstall 會執行 prisma generate
RUN npm ci

# 複製專案程式
COPY . .

# 編譯 TypeScript
RUN npm run build

# API Port
EXPOSE 3001

# 啟動 API
CMD ["sh", "-c", "\
  echo '⏳ Waiting for DB & running migrations...'; \
  until npx prisma migrate deploy; do sleep 5; done && \
  echo '🚀 Starting app...'; \
  npm start \
"]