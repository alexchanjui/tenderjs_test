// src/middlewares/auth.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose";

import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { CurrentUser } from "../types/service.context";
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

    // 3. 取得 JWT Secret
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "dev_secret_key",
    );

    // 4. 驗證 Token
    const { payload } = await jwtVerify(token, secret);

    // 5. 檢查必要資料
    if (!payload.id) {
      throw new AppError(ErrorCode.UNAUTH);
    }

    // 6. 組成目前登入者資料
    const currentUser: CurrentUser = {
      id: payload.id as string,
    };

    // 7. 將目前登入者放進這次 Request 的 Context
    requestContextStorage.run(currentUser, () => {
      next();
    });
  } catch (error) {
    next(error);
  }
};
