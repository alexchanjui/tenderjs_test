// src/utils/logger.ts
import fs from "fs";
import path from "path";
import winston from "winston";
import "winston-daily-rotate-file";
import type { LoggerConfig } from "../configs/logger.config";

export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    /**
     * 預設使用 Console Logger，
     * 避免尚未執行 init() 前使用 Logger 發生錯誤。
     */
    this.logger = winston.createLogger({
      transports: [new winston.transports.Console()],
    });
  }

  /**
   * 初始化 Logger
   */
  public init(config: LoggerConfig): void {
    const level = config.level.toLowerCase();
    const transports: winston.transport[] = [];

    /**
     * Log 格式
     * - timestamp：加入時間
     * - splat：支援 %s、%d 等格式化
     * - json：輸出 JSON 格式
     */
    const logFormat = winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
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
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
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
    this.logger = winston.createLogger({
      level,
      transports,
      exitOnError: false,
    });
  }

  /**
   * Debug Log
   */
  public debug(message: string, ...meta: unknown[]): void {
    this.logger.debug(message, ...meta);
  }

  /**
   * Info Log
   */
  public info(message: string, ...meta: unknown[]): void {
    this.logger.info(message, ...meta);
  }

  /**
   * Warning Log
   */
  public warn(message: string, ...meta: unknown[]): void {
    this.logger.warn(message, ...meta);
  }

  /**
   * Error Log
   */
  public error(message: string, ...meta: unknown[]): void {
    this.logger.error(message, ...meta);
  }

  /**
   * Fatal Log
   * 記錄錯誤後延遲結束程式，
   * 確保 Log 有時間完成寫入。
   */
  public fatal(message: string, ...meta: unknown[]): never {
    this.logger.error(`[FATAL] ${message}`, ...meta);

    setTimeout(() => {
      process.exit(1);
    }, 100);

    throw new Error(message);
  }
}

const loggerInstance = new LoggerService();
export default loggerInstance;
