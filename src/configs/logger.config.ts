// src/configs/logger.config.ts

/**
 * Logger 設定
 */
export interface LoggerConfig {
  stdout: boolean;
  level: string;
  file: string;
  rotation: boolean;
  max_size: number;
}

class LoggerConfigService {
  public getLoggerConfig(): LoggerConfig {
    return {
      stdout: process.env.LOG_STDOUT === "true",
      level: process.env.LOG_LEVEL?.toLowerCase() || "info",
      file: process.env.LOG_FILE || "./logs/app.log",
      rotation: process.env.LOG_ROTATION === "true",
      max_size: Number.parseInt(process.env.LOG_MAX_SIZE || "10", 10),
    };
  }
}

export const loggerConfigService = new LoggerConfigService();
