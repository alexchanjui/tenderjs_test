// src/index.ts
import "reflect-metadata";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./configs/swagger.config";
import { loggerConfigService } from "./configs/logger.config";
import { auditLogMiddleware } from "./middlewares/audit.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { registerRoutes } from "./routes";
import cacheInitService from "./services/cache-init.service";
import logger from "./utils/logger";
import prisma from "./utils/prisma";
import redis from "./utils/redis";

dotenv.config();

/**
 * 初始化 Logger
 */
const loggerConfig = loggerConfigService.getLoggerConfig();
logger.init(loggerConfig);

const app = express();
const port = Number(process.env.PORT ?? 3001);

/**
 * 基礎 Middleware
 */
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

/**
 * Swagger UI
 */
if (process.env.ENABLE_SWAGGER === "true") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  logger.info("✅ Swagger UI 已啟用: /api-docs");
}

/**
 * 啟動應用程式
 */
const bootstrap = async (): Promise<void> => {
  try {
    /**
     * 1. 建立資料庫連線
     */
    await prisma.connect();

    logger.info("✅ 資料庫連線成功");

    /**
     * 2. 建立 Redis 連線
     */
    await redis.connect();

    logger.info("✅ Redis 連線成功");

    /**
     * 3. 初始化系統快取
     */
    await cacheInitService.initialize();

    /**
     * 4. API 稽核日誌
     */
    app.use(auditLogMiddleware);

    /**
     * 5. 註冊 API Routes
     */
    registerRoutes(app);

    /**
     * 6. 全域錯誤處理
     */
    app.use(errorMiddleware);

    /**
     * 7. 啟動 Server
     */
    app.listen(port, () => {
      logger.info("=================================");
      logger.info(`🚀 CPS System Ready on Port ${port}`);
      logger.info("=================================");
    });
  } catch (error) {
    logger.fatal("❌ 系統啟動失敗", error);
    process.exit(1);
  }
};

void bootstrap();
