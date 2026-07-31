// src/utils/logger.ts
import fs from "fs";
import path from "path";
import winston from "winston";
import "winston-daily-rotate-file";

export interface LoggerConfig {
  stdout: boolean;
  level: string;
  file: string;
  rotation: boolean;
  max_size: number;
}

/**
 * 預設 Logger
 * 在 initLogger() 執行前，先使用 Console 避免 Logger 尚未初始化時發生錯誤。
 */
let logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

/**
 * 初始化 Logger
 */
export const initLogger = (config: LoggerConfig): void => {
  const level = config.level.toLowerCase();
  const transports: winston.transport[] = [];

  /**
   * Log 格式
   * - timestamp：加入時間
   * - splat：支援 %s、%d 等格式化
   * - json：輸出 JSON 格式
   */
  const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "ISO8601" }),
    winston.format.splat(),
    winston.format.json(),
  );

  /**
   * Console 輸出
   */
  if (config.stdout) {
    transports.push(
      new winston.transports.Console({
        level,
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        ),
      }),
    );
  }

  /**
   * 檔案輸出
   */
  if (config.file) {
    const logDir = path.dirname(config.file);
    const filename = path.basename(config.file);

    /**
     * 確保 Log 資料夾存在
     */
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, {
        recursive: true,
      });
    }

    /**
     * 每日輪替 Log
     */
    if (config.rotation) {
      transports.push(
        new winston.transports.DailyRotateFile({
          filename: path.join(logDir, `%DATE%-${filename}`),
          datePattern: "YYYY-MM-DD",
          maxSize: `${config.max_size}m`,
          maxFiles: "14d",
          zippedArchive: true,
          auditFile: path.join(logDir, ".audit.json"),
          level,
          format: logFormat,
        }),
      );
    } else {
      /**
       * 單一 Log 檔
       */
      transports.push(
        new winston.transports.File({
          filename: config.file,
          level,
          format: logFormat,
        }),
      );
    }
  }

  /**
   * 建立 Logger
   */
  logger = winston.createLogger({
    level,
    transports,
    exitOnError: false,
  });
};

/**
 * Debug Log
 */
export const debug = (message: string, ...meta: unknown[]): void => {
  logger.debug(message, ...meta);
};

/**
 * Info Log
 */
export const info = (message: string, ...meta: unknown[]): void => {
  logger.info(message, ...meta);
};

/**
 * Warning Log
 */
export const warn = (message: string, ...meta: unknown[]): void => {
  logger.warn(message, ...meta);
};

/**
 * Error Log
 */
export const error = (message: string, ...meta: unknown[]): void => {
  logger.error(message, ...meta);
};

/**
 * Fatal Log
 * 記錄錯誤後，延遲 100ms 再結束程式，
 * 確保 Log 已完成寫入。
 */
export const fatal = (message: string, ...meta: unknown[]): never => {
  logger.error(`[FATAL] ${message}`, ...meta);

  setTimeout(() => {
    process.exit(1);
  }, 100);

  throw new Error(message);
};

export default {
  init: initLogger,
  debug,
  info,
  warn,
  error,
  fatal,
};
