// src/utils/prisma.ts
import { PrismaClient } from "@prisma/client";

/**
 * 建立 Prisma Client
 * 全專案共用同一個資料庫連線實例。
 */
const client = new PrismaClient();

/**
 * 建立資料庫連線
 */
const connect = async (): Promise<void> => {
  await client.$connect();
};

/**
 * 關閉資料庫連線
 */
const disconnect = async (): Promise<void> => {
  await client.$disconnect();
};

export default {
  client,
  connect,
  disconnect,
};
