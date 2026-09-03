// src/middlewares/request-logger.middleware.ts
import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

/**
 * API 請求紀錄 Middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info(`[API] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};
