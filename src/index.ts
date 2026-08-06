// src/index.ts
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import logger from "./utils/logger";
import prisma from "./utils/prisma";
import redis from "./utils/redis";
import { registerRoutes } from "./routes";
import { loggerConfigService } from "./configs/logger.config";
import { errorMiddleware } from "./middlewares/error.middleware";

dotenv.config();

/**
 * 初始化 Logger
 */
const loggerConfig = loggerConfigService.getLoggerConfig();
logger.init(loggerConfig);

const app = express();
const port = Number(process.env.PORT ?? 3001);

/**
 * 設定 Middleware
 */
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

registerRoutes(app);

app.use(errorMiddleware);

/**
 * 啟動應用程式
 */
const bootstrap = async (): Promise<void> => {
  try {
    /**
     * 建立資料庫連線
     */
    await prisma.connect();

    logger.info("✅ 資料庫連線成功");

    /**
     * 建立 Redis 連線
     */
    await redis.connect();

    app.listen(port, () => {
      logger.info("=================================");
      logger.info(`🚀 CPS System Ready on Port ${port}`);
      logger.info("=================================");
    });
  } catch (error) {
    logger.fatal("❌ 系統啟動失敗", error);
  }
};

void bootstrap();
