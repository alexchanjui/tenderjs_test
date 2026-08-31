// src/middlewares/error.middleware.ts
import { Prisma } from "@prisma/client";
import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import logger from "../utils/logger";
import * as R from "../utils/response";

/**
 * 統一錯誤處理 Middleware
 */
export const errorMiddleware: ErrorRequestHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  /**
   * AppError
   *
   * 業務錯誤回傳 HTTP 200，
   * 系統錯誤回傳 HTTP 500。
   */
  if (error instanceof AppError) {
    if (error.statusCode === 500) {
      logger.error(`[System Error] ${req.method} ${req.originalUrl}`, error);
    } else {
      logger.warn(
        `[Business Error] ${req.method} ${req.originalUrl} - ` +
          `${error.message} (${error.bizCode})`,
      );
    }

    if (error.statusCode === 500) {
      R.error(res, error.bizCode, error.message, error.details ?? null);

      return;
    }

    R.failed(res, error.bizCode, error.message, error.details ?? null);

    return;
  }

  /**
   * Prisma 已知資料庫錯誤
   */
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logger.warn(`[Prisma Error] ${error.code}`, {
      message: error.message,
      meta: error.meta,
    });

    switch (error.code) {
      /**
       * 唯一值重複
       *
       * 例如 username 或 email 已存在。
       */
      case "P2002":
        R.failed(res, ErrorCode.DUPLICATE, "資料已存在，請勿重複建立", error.meta ?? null);
        return;

      /**
       * 找不到要更新或刪除的資料
       */
      case "P2025":
        R.failed(res, ErrorCode.DATA_NOT_FOUND, "找不到指定資料");
        return;

      /**
       * 外鍵關聯錯誤
       */
      case "P2003":
        R.failed(res, ErrorCode.REQUEST_DATA, "關聯資料不存在或格式錯誤", error.meta ?? null);
        return;

      /**
       * 欄位內容超過資料庫限制
       */
      case "P2000":
        R.failed(res, ErrorCode.STRING_LIMIT, "輸入資料長度超過限制", error.meta ?? null);
        return;

      /**
       * 其他 Prisma 已知錯誤視為系統錯誤
       */
      default:
        logger.error("[Prisma System Error]", error);

        R.error(res, ErrorCode.DATABASE_ERROR, `資料庫內部錯誤 (${error.code})`);
        return;
    }
  }

  /**
   * Prisma 連線或初始化失敗
   */
  if (error instanceof Prisma.PrismaClientInitializationError) {
    logger.error("[Prisma Initialization Error]", error);

    R.error(res, ErrorCode.DATABASE_ERROR, "資料庫連線失敗，請稍後再試");

    return;
  }

  /**
   * Prisma 查詢參數格式錯誤
   */
  if (error instanceof Prisma.PrismaClientValidationError) {
    logger.warn("[Prisma Validation Error]", {
      message: error.message,
    });

    R.failed(res, ErrorCode.REQUEST_DATA, "資料庫查詢參數格式錯誤");

    return;
  }

  /**
   * 未預期錯誤
   */
  logger.error("[Unhandled Error]", error);

  const isDevelopment = process.env.NODE_ENV !== "production";

  const message = isDevelopment && error instanceof Error ? error.message : "伺服器內部錯誤";

  R.error(res, ErrorCode.LOCAL_ERROR, message);
};
