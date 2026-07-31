// src/config/logger.ts
import type { LoggerConfig } from "../utils/logger";

/**
 * 取得 Logger 設定
 */
export const getLoggerConfig = (): LoggerConfig => ({
  stdout: process.env.LOG_STDOUT === "true",
  level: process.env.LOG_LEVEL?.toLowerCase() || "info",
  file: process.env.LOG_FILE || "./logs/app.log",
  rotation: process.env.LOG_ROTATION === "true",
  max_size: Number.parseInt(process.env.LOG_MAX_SIZE || "10", 10),
});
