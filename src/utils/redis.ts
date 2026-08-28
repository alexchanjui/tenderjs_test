// src/utils/redis.ts
import Redis from "ioredis";
import logger from "./logger";

export class RedisService {
  public readonly client: Redis;

  constructor() {
    const host = process.env.REDIS_HOST ?? "localhost";
    const port = Number(process.env.REDIS_PORT ?? 6380);
    const password = process.env.REDIS_PASSWORD || undefined;
    const db = Number(process.env.REDIS_DB ?? 0);

    /**
     * 建立 Redis Client
     */
    this.client = new Redis({
      host,
      port,
      password,
      db,
      lazyConnect: true,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    /**
     * Redis 執行期間錯誤事件
     */
    this.client.on("error", (error) => {
      logger.error("❌ Redis Runtime Error", {
        error: error.message,
      });
    });
  }

  /**
   * 建立 Redis 連線
   */
  public async connect(): Promise<void> {
    const TIMEOUT_MS = 5000;

    if (this.client.status === "ready") {
      return;
    }

    logger.info("⏳ 正在等待 Redis 連線...");

    let timeoutId: NodeJS.Timeout | undefined;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(
          new Error(
            `Redis 連線逾時 (${TIMEOUT_MS}ms) - 請檢查 Redis 是否已啟動`,
          ),
        );
      }, TIMEOUT_MS);
    });

    try {
      await Promise.race([this.client.connect(), timeoutPromise]);

      const response = await this.client.ping();

      if (response !== "PONG") {
        throw new Error(`Redis 回應異常：${response}`);
      }

      logger.info("✅ Redis 連線檢查通過 (Ready)");
    } catch (error) {
      logger.error("❌ Redis 啟動連線失敗", error);
      throw error;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  /**
   * 關閉 Redis 連線
   */
  public async disconnect(): Promise<void> {
    if (this.client.status === "end") {
      return;
    }

    await this.client.quit();

    logger.info("Redis 已斷線");
  }
}

const redisInstance = new RedisService();
export default redisInstance;
