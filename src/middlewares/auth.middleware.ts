// src/middlewares/auth.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import { verifyAuthToken } from "../utils/auth.helper";
import { requestContextStorage } from "../utils/request-context";

/**
 * JWT 身分驗證 Middleware
 */
export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    // 1. 檢查是否有 Authorization
    if (!authHeader) {
      throw new AppError(ErrorCode.UNAUTH);
    }

    // 2. 取得 Token
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    // 3. 驗證 Token 並取得目前登入者
    const currentUser = await verifyAuthToken(token);

    // 4. 將目前登入者放進這次 Request 的 Context
    requestContextStorage.run(currentUser, () => {
      next();
    });
  } catch (error) {
    next(error);
  }
};
