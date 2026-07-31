// src/utils/redis.ts
import { createClient } from "redis";
import logger from "./logger";

/**
 * 建立 Redis Client
 * 全專案共用同一個 Redis 連線實例。
 */
const client = createClient({
  url: process.env.REDIS_URL,
});

/**
 * Redis 錯誤事件
 */
client.on("error", (error) => {
  logger.error("❌ Redis Runtime Error", {
    error: error.message,
  });
});

/**
 * 建立 Redis 連線
 */
const connect = async (): Promise<void> => {
  const TIMEOUT_MS = 5000;

  if (client.isOpen) {
    return;
  }

  logger.info("⏳ 正在等待 Redis 連線...");

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(`Redis 連線逾時 (${TIMEOUT_MS}ms) - 請檢查 Redis 是否已啟動`),
      );
    }, TIMEOUT_MS);
  });

  try {
    await Promise.race([client.connect(), timeoutPromise]);

    const response = await client.ping();

    if (response !== "PONG") {
      throw new Error(`Redis 回應異常：${response}`);
    }

    logger.info("✅ Redis 連線檢查通過 (Ready)");
  } catch (error) {
    logger.fatal("❌ Redis 啟動連線失敗，服務將終止", error);
  }
};

/**
 * 關閉 Redis 連線
 */
const disconnect = async (): Promise<void> => {
  if (!client.isOpen) {
    return;
  }

  await client.disconnect();

  logger.info("Redis 已斷線");
};

export default {
  client,
  connect,
  disconnect,
};
