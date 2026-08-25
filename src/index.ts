// src/index.ts
import "reflect-metadata";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { auditLogMiddleware } from "./middlewares/audit.middleware";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./configs/swagger.config";
import { loggerConfigService } from "./configs/logger.config";
import { errorMiddleware } from "./middlewares/error.middleware";
import { registerRoutes } from "./routes";
import { reloadRules } from "./services/permission.cache";
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
 * 設定 Middleware
 */
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

/**
 * API 稽核日誌
 */

app.use(auditLogMiddleware);

/**
 * 設定 Swagger UI
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
     * 建立資料庫連線
     */
    await prisma.connect();

    logger.info("✅ 資料庫連線成功");

    /**
     * 建立 Redis 連線
     */
    await redis.connect();

    /**
     * 載入 API 權限規則
     */
    const permissions = await prisma.client.permission.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
    });

    reloadRules(permissions);

    /**
     * 註冊 API Routes
     */
    registerRoutes(app);

    /**
     * 全域錯誤處理
     */
    app.use(errorMiddleware);

    /**
     * 啟動 Server
     */
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
